import type { EmbeddedChunk, KbChunk } from './types';

// Voyage embeddings.
//
// The old index used `voyage-3` (1024-dim, 825 chunks). That model is now
// legacy; since the corpus is being rebuilt from scratch there's no migration
// cost to moving up, so we don't inherit the old choice.
//
// `voyage-context-4` over plain `voyage-4` because of how we chunk: it embeds
// each chunk IN THE CONTEXT of the other chunks from the same document, which
// is the model-level version of the heading-breadcrumb trick. A section titled
// "Event properties" gets embedded knowing it sits inside the Mixpanel setup
// guide rather than floating free.
//
// Cost is a non-issue and stays one: Voyage grants 200M free tokens, and the
// whole corpus is ~150k. Re-embedding everything weekly would take 25+ years to
// reach the paid tier. Nothing in this pipeline should be optimised to avoid
// re-embedding — only to avoid churn and staleness.

const API_BASE = 'https://api.voyageai.com/v1';

export const EMBEDDING_MODEL = process.env.KB_EMBEDDING_MODEL ?? 'voyage-context-4';
export const EMBEDDING_DIMENSION = Number(process.env.KB_EMBEDDING_DIM ?? 1024);

/** Contextualised models take chunks grouped by document; the rest don't. */
function isContextualModel(model: string): boolean {
  return model.includes('context');
}

export function hasVoyageKey(): boolean {
  return Boolean(process.env.VOYAGE_API_KEY);
}

function requireKey(): string {
  const key = process.env.VOYAGE_API_KEY;
  if (!key) {
    throw new Error(
      'VOYAGE_API_KEY is not set. Add it to .env.local AND to the VARS array in ' +
        'push-env-to-vercel.sh, or the sync works locally and 500s in production.',
    );
  }
  return key;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${requireKey()}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    // 429 is a rate limit, not a failure — the caller retries with backoff.
    const err = new Error(`Voyage ${path} ${res.status}: ${text.slice(0, 300)}`);
    (err as Error & { status?: number }).status = res.status;
    throw err;
  }
  return (await res.json()) as T;
}

async function withRetry<T>(fn: () => Promise<T>, attempts = 4): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i += 1) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      const status = (err as { status?: number }).status;
      // 4xx other than 429 is a request bug — retrying just burns time.
      if (status && status !== 429 && status < 500) throw err;
      await new Promise((r) => setTimeout(r, 2 ** i * 1000));
    }
  }
  throw lastError;
}

type ContextualResponse = {
  data: Array<{ data: Array<{ embedding: number[]; index: number }> }>;
};
type FlatResponse = { data: Array<{ embedding: number[]; index: number }> };

/**
 * Embed chunks, grouped by parent document.
 *
 * Grouping is required for contextualised models and harmless otherwise, so
 * the call shape stays the same either way. Document grouping is also why the
 * document unit is kept small (plan §2.2): a chunk's vector depends on its
 * siblings, so an edit re-embeds its whole unit — which is fine when a unit is
 * one post or one Doc section, and wasteful if it's the entire corpus.
 */
export async function embedChunks(
  chunksByDoc: Map<string, KbChunk[]>,
  opts: { inputType?: 'document' | 'query'; onProgress?: (done: number, total: number) => void } = {},
): Promise<EmbeddedChunk[]> {
  const inputType = opts.inputType ?? 'document';
  const contextual = isContextualModel(EMBEDDING_MODEL);
  const out: EmbeddedChunk[] = [];

  const groups = [...chunksByDoc.entries()].filter(([, chunks]) => chunks.length > 0);
  const totalChunks = groups.reduce((s, [, c]) => s + c.length, 0);

  // Batch whole documents together, but keep requests modest so one oversized
  // document can't blow the per-request token ceiling.
  const BATCH_DOCS = 8;
  let done = 0;

  for (let i = 0; i < groups.length; i += BATCH_DOCS) {
    const batch = groups.slice(i, i + BATCH_DOCS);
    const inputs = batch.map(([, chunks]) => chunks.map((c) => c.embeddedText));

    const embeddings = await withRetry(async () => {
      if (contextual) {
        const res = await post<ContextualResponse>('/contextualizedembeddings', {
          model: EMBEDDING_MODEL,
          inputs,
          input_type: inputType,
          output_dimension: EMBEDDING_DIMENSION,
        });
        return res.data.map((doc) =>
          [...doc.data].sort((a, b) => a.index - b.index).map((d) => d.embedding),
        );
      }
      const res = await post<FlatResponse>('/embeddings', {
        model: EMBEDDING_MODEL,
        input: inputs.flat(),
        input_type: inputType,
        output_dimension: EMBEDDING_DIMENSION,
      });
      const flat = [...res.data].sort((a, b) => a.index - b.index).map((d) => d.embedding);
      let cursor = 0;
      return inputs.map((docInputs) => flat.slice(cursor, (cursor += docInputs.length)));
    });

    batch.forEach(([, chunks], docIdx) => {
      const vectors = embeddings[docIdx] ?? [];
      chunks.forEach((chunk, chunkIdx) => {
        const embedding = vectors[chunkIdx];
        if (!embedding) {
          throw new Error(`Voyage returned no embedding for ${chunk.chunkId}`);
        }
        if (embedding.length !== EMBEDDING_DIMENSION) {
          throw new Error(
            `Dimension mismatch for ${chunk.chunkId}: got ${embedding.length}, ` +
              `expected ${EMBEDDING_DIMENSION}. Check KB_EMBEDDING_DIM.`,
          );
        }
        out.push({ ...chunk, embedding, embeddingModel: EMBEDDING_MODEL });
      });
      done += chunks.length;
    });

    opts.onProgress?.(done, totalChunks);
  }

  return out;
}

/**
 * Embed a single user question at query time.
 *
 * MUST use the same model that built the index. If they differ, cosine
 * similarity returns plausible-looking garbage: scores land in a normal range,
 * retrieval returns confidently wrong chunks, and the refusal gate — which
 * trusts the score — waves them through. That is the exact failure this product
 * exists to prevent, and it fails silently.
 */
export async function embedQuery(question: string): Promise<number[]> {
  const contextual = isContextualModel(EMBEDDING_MODEL);

  return withRetry(async () => {
    if (contextual) {
      const res = await post<ContextualResponse>('/contextualizedembeddings', {
        model: EMBEDDING_MODEL,
        inputs: [[question]],
        input_type: 'query',
        output_dimension: EMBEDDING_DIMENSION,
      });
      return res.data[0].data[0].embedding;
    }
    const res = await post<FlatResponse>('/embeddings', {
      model: EMBEDDING_MODEL,
      input: [question],
      input_type: 'query',
      output_dimension: EMBEDDING_DIMENSION,
    });
    return res.data[0].embedding;
  });
}

/**
 * Sanity check that the query encoder matches the stored index.
 *
 * Embed text that appears verbatim in a known chunk and compare against its
 * stored vector: same model scores > 0.95, a different one scores 0.3-0.7 —
 * which looks plausible and is worthless. Run this after any model change.
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB) || 1);
}
