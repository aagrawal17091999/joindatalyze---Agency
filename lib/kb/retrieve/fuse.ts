import type { SourceTier } from '../types';

/**
 * Reciprocal Rank Fusion.
 *
 * Chosen over weighted score averaging because BM25 scores and cosine
 * similarities live on incomparable scales — BM25 is unbounded and corpus
 * dependent, cosine is [-1,1] and bunched near the top. Normalising them into
 * agreement requires tuning that drifts every time the corpus changes. RRF
 * ignores magnitudes and reads only rank order, has one parameter that
 * essentially never needs tuning, and is what most production hybrid systems
 * converged on.
 *
 * K=60 is the standard constant from the original paper; Upstash Vector's
 * built-in hybrid fusion uses the same value, so local and server-side
 * retrieval rank consistently.
 */
export const RRF_K = 60;

export type RankedList = { id: string; score: number }[];

export function reciprocalRankFusion(
  lists: RankedList[],
  k: number = RRF_K,
): Map<string, number> {
  const fused = new Map<string, number>();

  for (const list of lists) {
    list.forEach((hit, index) => {
      const rank = index + 1;
      fused.set(hit.id, (fused.get(hit.id) ?? 0) + 1 / (k + rank));
    });
  }

  return fused;
}

/**
 * Confidence-tier multipliers, applied to the RERANK score after retrieval —
 * never to the embedding, and never during search. Retrieval should find the
 * best match on merit; ranking is where editorial policy belongs. Keeping it a
 * post-hoc multiplier means it's a number in a config file, changeable without
 * touching the index.
 */
export const TIER_MULTIPLIER: Record<SourceTier, number> = {
  published: 1.0,
  // The 28-part [Week N] Learning Mixpanel series is a third of the blog and
  // denser than average. Left at 1.0 it dominates anything Mixpanel-adjacent,
  // and "how do I do X in Mixpanel" overlaps heavily with "how should I think
  // about X" — so strategy questions kept returning how-tos. 0.95 is
  // deliberately gentle: it only breaks ties, because a 5% haircut can't
  // overcome a real relevance gap on a genuine how-to question.
  tutorial: 0.95,
  internal: 0.85,
  // Excluded from serving by default; the multiplier only matters if that
  // exclusion is ever lifted.
  draft: 0.7,
};

export function applyTierMultiplier(score: number, tier: SourceTier): number {
  return score * (TIER_MULTIPLIER[tier] ?? 1);
}
