import type { ScoredDocument } from './retrieve';
import { ungroundedCurrencyFigures } from './text';

// The refusal gate.
//
// The product's premise is that a confidently wrong answer with Ansh's name on
// it is worse than no answer. Everything here fails CLOSED: any check that
// cannot be evaluated refuses rather than passes.
//
// Three mechanisms, in order of how much work they do:
//   1. Score threshold + score GAP, before generation      (retrieval quality)
//   2. Deterministic citation validation, after generation (hallucinated sources)
//   3. Grounded-figure check, after generation             (invented numbers)
//
// Deliberately NOT here: an LLM verification pass. It doubles latency and cost
// and is the weakest of the checks - a model grading another model's grounding
// on the same evidence. Add it only if the query log shows extrapolation is
// what actually leaks. See plan §2.4.

export type RefusalReason =
  | 'below_threshold'
  | 'flat_gap'
  | 'no_results'
  | 'not_calibrated'
  | 'insufficient_context'
  | 'bad_citation'
  | 'ungrounded_figure'
  | 'pricing_blocked'
  | 'quota_exhausted';

/**
 * Which score the gate is reading.
 *
 * This distinction is load-bearing, and there is measured evidence for it.
 * Running the probe set against fused (RRF) scores gives:
 *
 *   "How do I set up Mixpanel the right way?"  top = 0.0164
 *   "What is a good recipe for carbonara?"     top = 0.0164
 *
 * Identical. RRF assigns 1/(60+rank), so the top result scores ~0.0164 whether
 * it is a perfect match or the least-irrelevant thing in the corpus. The fused
 * score encodes rank position, not match quality, and is therefore USELESS as a
 * threshold signal.
 *
 * That is why reranking is not a quality upgrade for this product - it is the
 * component that makes the refusal gate possible at all. A cross-encoder score
 * means "is this passage actually responsive to this question", which is the
 * quantity τ needs to threshold.
 */
export type ScoreKind = 'rerank' | 'fused';

/**
 * Calibrated thresholds.
 *
 * PROVISIONAL - these are placeholders, not calibrated values. They must be set
 * by the sweep in plan §2.4 (generate 25 answerable + 25 unanswerable questions,
 * pick the point where zero unanswerable questions get through, then step up
 * once for margin) before anything ships publicly.
 *
 * These become INVALID whenever the embedding model, the reranker, or the
 * chunking changes - each of those moves the score distribution. Recalibrate,
 * don't adjust by feel.
 */
export type GateConfig = {
  /** Minimum tier-weighted top score. */
  tau: number;
  /** Minimum gap between the top score and the mean of the next few. */
  delta: number;
  /** How many following results the gap is measured against. */
  gapWindow: number;
  /** Below this, don't even offer a "closest thing I've written". */
  nearestFloor: number;
  calibratedAt: string | null;
};

export const GATE_CONFIG: GateConfig = {
  // Calibrated 2026-08-11 against index_version 20260811-061248
  // (voyage-context-4 + rerank-2.5-lite) on a generated set of
  // 25 answerable / 12 adjacent-absent /
  // 5 off-topic questions. Full record: docs/kb-calibration.json.
  //
  // The distributions separated completely - the lowest answerable score (0.578)
  // sits ABOVE the highest non-answerable score (0.508) - so tau was chosen at
  // the first zero-leak point plus one notch for margin.
  //   leaks    0/17
  //   coverage 96% of answerable questions
  tau: 0.6406,
  delta: 0.0146,
  gapWindow: 4,
  // Above the off-topic band's ceiling (max 0.3965 on the calibration set), so
  // "here's the closest thing I've written" appears for adjacent-domain
  // questions and stays silent for genuinely unrelated ones. Offering a
  // half-relevant analytics post to someone asking for a pasta recipe reads as
  // broken, not helpful - when in doubt, show nothing.
  nearestFloor: 0.45,
  calibratedAt: '2026-08-11T06:28:45.474Z',
};

export type GateDecision =
  | {
      answer: true;
      documents: ScoredDocument[];
      topScore: number;
      scoreGap: number;
      scoresTop5: number[];
    }
  | {
      answer: false;
      reason: RefusalReason;
      /** Best below-threshold match, for "closest thing I've written". */
      nearest: ScoredDocument | null;
      topScore: number;
      scoreGap: number;
      scoresTop5: number[];
    };

/**
 * Decide whether the retrieved set is good enough to answer from.
 *
 * The GAP check is the one people leave out, and it catches the case that hurts
 * most: an adjacent-but-absent question. "How do I set up Snowflake row-level
 * security" is analytics-shaped, so several chunks score respectably and the
 * top score alone looks fine. But the distribution is FLAT - five results all
 * vaguely about data, none about the question. A genuinely answerable question
 * produces one or two results clearly ahead of the rest. Flatness is the
 * signature of "not in the knowledge base".
 */
export function evaluateGate(
  results: ScoredDocument[],
  config: GateConfig = GATE_CONFIG,
  scoreKind: ScoreKind = 'fused',
): GateDecision {
  const scores = results.map((r) => r.score);
  const scoresTop5 = scores.slice(0, 5);
  const topScore = scores[0] ?? 0;

  const window = scores.slice(1, 1 + config.gapWindow);
  const following = window.length
    ? window.reduce((sum, s) => sum + s, 0) / window.length
    : 0;
  const scoreGap = topScore - following;

  const nearest =
    results[0] && results[0].score >= config.nearestFloor ? results[0] : null;

  if (!results.length) {
    return { answer: false, reason: 'no_results', nearest: null, topScore, scoreGap, scoresTop5 };
  }

  // FAIL CLOSED. Two preconditions must hold before any answer is permitted,
  // and neither is satisfiable by accident:
  //
  //   1. The score must come from a reranker. Fused RRF scores are rank
  //      artefacts - carbonara and Mixpanel both score 0.0164 - so thresholding
  //      them would pass everything or nothing, with no relation to quality.
  //   2. τ must have been calibrated against a question set. An uncalibrated
  //      threshold on a product whose entire premise is refusal correctness is
  //      the failure mode this exists to prevent.
  //
  // Until both hold the gate refuses everything. That makes the missing
  // reranker impossible to ship past, rather than a silent quality regression.
  if (scoreKind !== 'rerank' || config.calibratedAt === null) {
    return { answer: false, reason: 'not_calibrated', nearest, topScore, scoreGap, scoresTop5 };
  }

  if (topScore < config.tau) {
    return { answer: false, reason: 'below_threshold', nearest, topScore, scoreGap, scoresTop5 };
  }
  // A single result can't be flat - there's nothing to be flat against.
  if (results.length > 1 && scoreGap < config.delta) {
    return { answer: false, reason: 'flat_gap', nearest, topScore, scoreGap, scoresTop5 };
  }

  return { answer: true, documents: results, topScore, scoreGap, scoresTop5 };
}

export type ModelAnswer = {
  /** Null / INSUFFICIENT_CONTEXT means the model declined. */
  answer: string | null;
  citedDocIds: string[];
  insufficientContext?: boolean;
};

export type ValidationResult =
  | { valid: true; answer: string; citedDocIds: string[] }
  | { valid: false; reason: RefusalReason; detail: string };

/**
 * Validate a generated answer against the context it was given.
 *
 * All deterministic - no model call, no latency, no cost. Cheap enough that
 * there's no argument for skipping it.
 */
export function validateAnswer(
  model: ModelAnswer,
  retrieved: ScoredDocument[],
): ValidationResult {
  if (model.insufficientContext || !model.answer?.trim()) {
    return {
      valid: false,
      reason: 'insufficient_context',
      detail: 'Model declined to answer from the supplied context.',
    };
  }

  // 1. Citations must exist. Don't ASK the model to cite honestly - check it.
  //    Inventing a plausible source ID is the most common hallucination in a
  //    citing system, and it's free to catch.
  const allowed = new Set(retrieved.map((r) => r.document.docId));
  const fabricated = model.citedDocIds.filter((id) => !allowed.has(id));
  if (fabricated.length) {
    return {
      valid: false,
      reason: 'bad_citation',
      detail: `Cited documents not in the retrieved set: ${fabricated.join(', ')}`,
    };
  }

  // 2. An answer with no citation at all is ungrounded by definition.
  if (!model.citedDocIds.length) {
    return {
      valid: false,
      reason: 'bad_citation',
      detail: 'Answer carried no citations.',
    };
  }

  // 3. Every currency figure must be quoted from the context, not invented.
  //    This is the real pricing guarantee (layer 3, plan §2.6). Datalyze's own
  //    rates are already redacted at ingest and never retrieved, so anything
  //    the model produces that isn't in context is fabricated - including a
  //    number it "inferred" from surrounding text.
  const context = retrieved.map((r) => r.document.fullText).join('\n');
  const ungrounded = ungroundedCurrencyFigures(model.answer, context);
  if (ungrounded.length) {
    return {
      valid: false,
      reason: 'ungrounded_figure',
      detail: `Figures not present in retrieved context: ${ungrounded.join(', ')}`,
    };
  }

  return { valid: true, answer: model.answer, citedDocIds: model.citedDocIds };
}

/**
 * Pricing questions are high-intent, so they get their own path rather than a
 * generic refusal. This is the best booking prompt in the product - someone
 * asking what it costs is further down the funnel than someone asking how
 * attribution works.
 */
const PRICING_QUESTION =
  /\b(?:how much|what.{0,12}(?:cost|charge|price|pricing|rate)|pricing|quote|budget|retainer|expensive|afford|fees?)\b/i;

export function isPricingQuestion(question: string): boolean {
  return PRICING_QUESTION.test(question);
}
