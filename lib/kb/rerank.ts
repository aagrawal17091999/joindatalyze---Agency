// Cross-encoder reranking.
//
// This is the component that makes the refusal gate possible. Measured on this
// corpus, fused RRF scores do not separate at all:
//
//   "How do I create an event tracking plan?"  fused top = 0.0318
//   "Who won the 2022 World Cup?"              fused top = 0.0323   ← higher
//
// RRF assigns 1/(60+rank), so the score encodes rank position, not match
// quality - the best-ranked result scores the same whether it answers the
// question or is merely the least irrelevant thing present. Cosine similarity
// is only marginally better: it is a similarity measure pressed into service as
// a relevance measure, and its values bunch into a narrow band.
//
// A cross-encoder reads the query and the passage TOGETHER and scores
// relevance directly, which is the quantity τ needs. Its scores spread across
// the range and mean something close to "is this passage responsive to this
// question".

const API_BASE = 'https://api.voyageai.com/v1';

export const RERANK_MODEL = process.env.KB_RERANK_MODEL ?? 'rerank-2.5-lite';

export function hasRerankKey(): boolean {
  return Boolean(process.env.VOYAGE_API_KEY);
}

type RerankResponse = {
  data: Array<{ index: number; relevance_score: number }>;
};

export type RerankHit = { index: number; score: number };

/**
 * Score `documents` against `query`. Returns one hit per input document, in
 * input order, so callers can zip results back onto their own objects.
 *
 * Reranks CHUNK text rather than whole parent documents: a cross-encoder over a
 * 2,000-word post dilutes the signal across everything the post discusses,
 * which is the same blurring that makes one-vector-per-post bad for retrieval.
 * Parent expansion happens after ranking, not before.
 */
export async function rerank(
  query: string,
  documents: string[],
  options: { topK?: number } = {},
): Promise<RerankHit[]> {
  const key = process.env.VOYAGE_API_KEY;
  if (!key) {
    throw new Error(
      'VOYAGE_API_KEY is not set - reranking is required for the refusal gate ' +
        'to function. See lib/kb/gate.ts.',
    );
  }
  if (!documents.length) return [];

  const res = await fetch(`${API_BASE}/rerank`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      query,
      documents,
      model: RERANK_MODEL,
      // Ask for every candidate back: the gate needs the score distribution,
      // not just the winners. The gap check is meaningless without the tail.
      top_k: options.topK ?? documents.length,
      truncation: true,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Voyage /rerank ${res.status}: ${text.slice(0, 300)}`);
  }

  const body = (await res.json()) as RerankResponse;
  return body.data
    .map((d) => ({ index: d.index, score: d.relevance_score }))
    .sort((a, b) => b.score - a.score);
}
