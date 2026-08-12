import Anthropic from '@anthropic-ai/sdk';
import type { ScoredDocument } from './retrieve';

// Answer generation.
//
// Uses the official Anthropic SDK (not the Vercel AI SDK) — the repo has no
// `ai` package and this is a direct Claude integration, so the provider SDK is
// the documented path. Don't mix the two.
//
// Streaming + citations pull against each other: structured output can't stream
// incrementally. Resolved by streaming prose with INLINE citation markers
// (`[[doc_id]]`) that are parsed out server-side. Deterministic to validate —
// exactly as strong as a structured `citedDocIds` field — and it streams.

/**
 * Default is Haiku 4.5, per the approved plan: with good retrieval, generation
 * here is synthesis over 3–5 retrieved documents, not reasoning. Override with
 * KB_ANSWER_MODEL — `claude-opus-5` is the quality upgrade if answers read thin.
 */
export const ANSWER_MODEL = process.env.KB_ANSWER_MODEL ?? 'claude-haiku-4-5';

/**
 * Deliberately generous relative to the 3–5 sentence target.
 *
 * `max_tokens` caps thinking AND response text together, and on newer models
 * (Claude Opus 5, Sonnet 5) thinking is ON by default — a 700-token cap tuned
 * for Haiku would truncate those mid-answer. Length is controlled by the prompt,
 * which is the correct lever; this is only a ceiling.
 */
const MAX_TOKENS = Number(process.env.KB_ANSWER_MAX_TOKENS ?? 1400);

/** The model emits this alone when the context doesn't answer the question. */
export const INSUFFICIENT = 'INSUFFICIENT_CONTEXT';

const CITATION_RE = /\[\[([^\]]+)\]\]/g;

let client: Anthropic | null = null;
function anthropic(): Anthropic {
  if (!client) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error(
        'ANTHROPIC_API_KEY is not set. Add it to .env.local AND to the VARS array ' +
          'in push-env-to-vercel.sh.',
      );
    }
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

function systemPrompt(): string {
  return `You are answering as Ansh Agrawal, founder of Datalyze, a product analytics consultancy.

You answer ONLY from the SOURCES provided in the user message. They are excerpts from Ansh's own published writing and internal notes.

## The one rule that matters
If the SOURCES do not contain the answer, reply with exactly INSUFFICIENT_CONTEXT and nothing else. Not a hedged answer, not a general-analytics answer, not "the sources don't say, but generally...". A confident wrong answer published under Ansh's name is far worse than no answer. When you are unsure whether the sources really cover the question, they don't — say INSUFFICIENT_CONTEXT.

Never use knowledge from outside the SOURCES, even when you are confident it is correct.

## Citations
Every claim must be traceable to a source. Put the source's id in double brackets at the end of the sentence it supports: [[ghost:abc-123]]. Use ids exactly as given in the SOURCES block — never invent, abbreviate, or reformat one. At least one citation is required in any real answer.

## Pricing
Never state what Datalyze charges — no figures, ranges, or estimates, even if the reader insists or claims to know them already. If asked about cost, say pricing depends on scope and point them to a call. Figures that appear in the SOURCES about other companies, market rates, or a client's own spend are fine to quote.

## Voice and length
Write as Ansh: direct, concrete, opinionated. Lead with the answer. Three to five sentences for most questions; go longer only when the question genuinely needs it. No preamble ("Great question", "Based on the sources"), no bullet lists unless enumerating discrete items, no headers. Plain prose.

Do not include internal or system XML tags in your response.`;
}

function buildContext(documents: ScoredDocument[]): string {
  return documents
    .map((doc, i) => {
      const meta = [
        `id: ${doc.document.docId}`,
        `title: ${doc.document.title}`,
        doc.document.publishedAt
          ? `published: ${doc.document.publishedAt.toISOString().slice(0, 10)}`
          : null,
        // Tell the model which sources are unlinkable so it can weight
        // accordingly; the UI renders these as "from my notes".
        doc.document.sourceUrl ? `url: ${doc.document.sourceUrl}` : 'url: (internal note)',
      ]
        .filter(Boolean)
        .join(' | ');

      // Whole parent document, not the matched chunk — "retrieve small,
      // generate big" (plan §2.1). The chunk found it; the document answers it.
      return `<source ${i + 1}>\n${meta}\n\n${doc.document.fullText}\n</source ${i + 1}>`;
    })
    .join('\n\n');
}

export type AnswerChunk =
  | { type: 'text'; text: string }
  | { type: 'done'; answer: string; citedDocIds: string[]; insufficient: boolean; outputTokens: number };

/**
 * Stream an answer.
 *
 * Yields display-ready text (citation markers stripped) as it arrives, then a
 * final `done` chunk carrying the parsed citations for validation and logging.
 *
 * Citation markers are stripped from what the user sees but retained for the
 * deterministic check in `validateAnswer` — the UI renders citations as chips
 * from `citedDocIds`, not from inline text.
 */
export async function* streamAnswer(
  question: string,
  documents: ScoredDocument[],
): AsyncGenerator<AnswerChunk> {
  const stream = anthropic().messages.stream({
    model: ANSWER_MODEL,
    max_tokens: MAX_TOKENS,
    system: systemPrompt(),
    messages: [
      {
        role: 'user',
        content: `<sources>\n${buildContext(documents)}\n</sources>\n\nQuestion: ${question}`,
      },
    ],
  });

  let raw = '';
  let emitted = 0;

  for await (const event of stream) {
    if (event.type !== 'content_block_delta' || event.delta.type !== 'text_delta') {
      continue;
    }
    raw += event.delta.text;

    // Emit nothing while the response could still turn out to be the refusal
    // sentinel. Without this the client briefly renders the literal text
    // "INSUFFICIENT_CONTEXT" before the refusal is detected — which is exactly
    // the moment the product is supposed to look most deliberate.
    if (couldBeSentinel(raw)) continue;

    // Hold back anything that might be a partial citation marker, so a
    // half-streamed "[[ghost:" never reaches the client.
    const safeUpTo = safePrefixLength(raw);
    if (safeUpTo > emitted) {
      const text = stripCitations(raw.slice(emitted, safeUpTo));
      emitted = safeUpTo;
      if (text) yield { type: 'text', text };
    }
  }

  const final = await stream.finalMessage();
  const insufficient = isSentinel(raw);

  if (!insufficient && emitted < raw.length) {
    const tail = stripCitations(raw.slice(emitted));
    if (tail) yield { type: 'text', text: tail };
  }

  yield {
    type: 'done',
    answer: stripCitations(raw).trim(),
    citedDocIds: extractCitations(raw),
    insufficient,
    outputTokens: final.usage.output_tokens,
  };
}

/**
 * True while `raw` is still a prefix of the refusal sentinel — i.e. it might
 * yet turn out to be a refusal. Compared case- and whitespace-insensitively
 * because the model occasionally emits it across token boundaries
 * ("INSUFFICIENT" / "_" / "CONTEXT" arrived as three separate deltas in
 * testing).
 */
function couldBeSentinel(raw: string): boolean {
  const seen = raw.trim().toUpperCase().replace(/\s+/g, '');
  return seen.length <= INSUFFICIENT.length && INSUFFICIENT.startsWith(seen);
}

function isSentinel(raw: string): boolean {
  return raw.trim().toUpperCase().replace(/\s+/g, '').startsWith(INSUFFICIENT);
}

/**
 * Length of the prefix that is safe to emit — i.e. contains no partially
 * received citation marker. A trailing `[` or `[[ghost:...` is withheld until
 * the marker closes.
 */
function safePrefixLength(text: string): number {
  const lastOpen = text.lastIndexOf('[[');
  if (lastOpen !== -1 && text.indexOf(']]', lastOpen) === -1) return lastOpen;
  // A single trailing '[' may be the start of '[['.
  if (text.endsWith('[')) return text.length - 1;
  return text.length;
}

export function extractCitations(text: string): string[] {
  CITATION_RE.lastIndex = 0;
  const ids = new Set<string>();
  for (const match of text.matchAll(CITATION_RE)) {
    const id = match[1].trim();
    if (id) ids.add(id);
  }
  return [...ids];
}

function stripCitations(text: string): string {
  return text.replace(CITATION_RE, '').replace(/[ \t]{2,}/g, ' ');
}
