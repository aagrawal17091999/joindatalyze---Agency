import { BigQuery } from '@google-cloud/bigquery';
import type { SourceTier, SourceType } from '../types';
import { BM25Index } from './lexical';
import { applyTierMultiplier, reciprocalRankFusion } from './fuse';
import { cosineSimilarity } from '../embed';
import { rerank } from '../rerank';
import { unpackEmbedding } from '../text';
import { downloadArtifact, rebuildEmbeddedText, ARTIFACT_LOCATION } from '../artifact';

// Retrieval: hybrid search over chunks, then expansion to whole parent
// documents before generation.
//
// "Retrieve small, generate big" (plan §2.1). One-chunk-per-post is right for
// citation and for what the model reads, but wrong for search - a 2,000-word
// post compressed into one vector is a blurry average of everything it
// discusses, and loses to a narrowly on-topic short post even when it answers
// the question better. So we search sections and hand the model whole posts.

export type RetrievableChunk = {
  chunkId: string;
  docId: string;
  text: string;
  embeddedText: string;
  headingPath: string;
  embedding: number[];
};

export type RetrievableDocument = {
  docId: string;
  title: string;
  sourceUrl: string | null;
  sourceType: SourceType;
  sourceTier: SourceTier;
  publishedAt: Date | null;
  fullText: string;
};

export type Corpus = {
  chunks: RetrievableChunk[];
  documents: Map<string, RetrievableDocument>;
  lexical: BM25Index;
  embeddingModel: string | null;
  indexVersion: string | null;
};

export type ScoredDocument = {
  document: RetrievableDocument;
  /** Best chunk from this document, for showing why it matched. */
  bestChunk: RetrievableChunk;
  /** Post-tier-multiplier score used by the gate. */
  score: number;
  rawScore: number;
  /** Which retrievers found it - useful for debugging recall. */
  matchedBy: Array<'vector' | 'lexical'>;
};

export type RetrieveOptions = {
  /** Query vector. Omit to run lexical-only (no Voyage key). */
  queryEmbedding?: number[];
  candidateLimit?: number;
  documentLimit?: number;
  includeTiers?: SourceTier[];
};

export type RetrieveResult = {
  documents: ScoredDocument[];
  /**
   * Which score `ScoredDocument.score` carries. The gate refuses outright on
   * anything but 'rerank' - fused scores encode rank, not relevance.
   */
  scoreKind: 'rerank' | 'fused';
};

const DEFAULT_CANDIDATES = 40;
const DEFAULT_DOCUMENTS = 5;

function bqClient(): BigQuery {
  return new BigQuery({
    projectId: process.env.BIGQUERY_PROJECT_ID,
    credentials: process.env.BIGQUERY_CREDENTIALS_JSON
      ? JSON.parse(process.env.BIGQUERY_CREDENTIALS_JSON)
      : undefined,
  });
}

/**
 * Load the corpus from BigQuery into memory.
 *
 * BigQuery is the source of truth; this is a serving snapshot, cached at module
 * scope so warm invocations reuse it.
 *
 * SLOW PATH - fallback only. Measured ~47s cold even with packed embeddings,
 * because the BigQuery client paginates a multi-megabyte result set over many
 * sequential REST round trips. `loadCorpus()` reads the GCS artifact instead
 * and only falls back here when that is missing.
 *
 * Reads `embedding_f32` (base64 Float32) rather than the ARRAY<FLOAT64>; keep
 * it that way, it is still meaningfully cheaper than the array form.
 *
 * `contains_pricing` chunks are excluded here, at the source: Datalyze's own
 * rates are already redacted at ingest, and this is belt-and-braces.
 */
export async function loadCorpusFromBigQuery(): Promise<Corpus> {
  const projectId = process.env.BIGQUERY_PROJECT_ID;
  const datasetId = process.env.BIGQUERY_DATASET_ID || 'datalyze';
  const bq = bqClient();

  const [chunkRows] = await bq.query({
    query: `
      SELECT c.chunk_id, c.doc_id, c.text, c.embedded_text, c.heading_path,
             c.embedding_f32, c.embedding_model, c.index_version
      FROM \`${projectId}.${datasetId}.kb_chunks\` c
      JOIN \`${projectId}.${datasetId}.kb_documents\` d USING (doc_id)
      WHERE c.status = 'active'
        AND d.status = 'active'
        AND NOT COALESCE(c.contains_pricing, FALSE)
      ORDER BY c.doc_id, c.chunk_index`,
  });

  const [docRows] = await bq.query({
    query: `
      SELECT doc_id, title, source_url, source_type, source_tier,
             published_at, full_text
      FROM \`${projectId}.${datasetId}.kb_documents\`
      WHERE status = 'active'`,
  });

  const chunks: RetrievableChunk[] = chunkRows.map((r: Record<string, unknown>) => ({
    chunkId: r.chunk_id as string,
    docId: r.doc_id as string,
    text: r.text as string,
    embeddedText: r.embedded_text as string,
    headingPath: (r.heading_path as string) ?? '',
    embedding: r.embedding_f32 ? unpackEmbedding(r.embedding_f32 as string) : [],
  }));

  const documents = new Map<string, RetrievableDocument>(
    docRows.map((r: Record<string, unknown>) => [
      r.doc_id as string,
      {
        docId: r.doc_id as string,
        title: r.title as string,
        sourceUrl: (r.source_url as string) ?? null,
        sourceType: r.source_type as SourceType,
        sourceTier: r.source_tier as SourceTier,
        publishedAt: r.published_at ? new Date((r.published_at as { value: string }).value) : null,
        fullText: (r.full_text as string) ?? '',
      },
    ]),
  );

  // Index the embedded text (breadcrumb + body) so heading terms are lexically
  // searchable too - "Lexicon" appears in a heading far more often than in prose.
  const lexical = new BM25Index(
    chunks.map((c) => ({ id: c.chunkId, text: c.embeddedText })),
  );

  const firstModel = chunkRows.find((r: Record<string, unknown>) => r.embedding_model);

  return {
    chunks,
    documents,
    lexical,
    embeddingModel: (firstModel?.embedding_model as string) ?? null,
    indexVersion: (chunkRows[0]?.index_version as string) ?? null,
  };
}

/**
 * Hybrid retrieval → parent expansion → tier-weighted ranking.
 *
 * Runs lexical-only when no query embedding is supplied, which is what makes
 * the retrieval path testable before a Voyage key exists. Lexical-only is a
 * development mode, not a serving mode: shipping it would lose every
 * paraphrased question.
 */
export function retrieve(
  corpus: Corpus,
  query: string,
  options: RetrieveOptions = {},
): ScoredDocument[] {
  const candidateLimit = options.candidateLimit ?? DEFAULT_CANDIDATES;
  const documentLimit = options.documentLimit ?? DEFAULT_DOCUMENTS;
  const includeTiers = options.includeTiers ?? ['published', 'tutorial', 'internal'];

  const lexicalHits = corpus.lexical.search(query, candidateLimit);

  let vectorHits: { id: string; score: number }[] = [];
  if (options.queryEmbedding?.length) {
    vectorHits = corpus.chunks
      .filter((c) => c.embedding.length > 0)
      .map((c) => ({
        id: c.chunkId,
        score: cosineSimilarity(options.queryEmbedding as number[], c.embedding),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, candidateLimit);
  }

  const lists = [vectorHits, lexicalHits].filter((l) => l.length > 0);
  if (!lists.length) return [];

  const fused = reciprocalRankFusion(lists);

  const lexicalIds = new Set(lexicalHits.map((h) => h.id));
  const vectorIds = new Set(vectorHits.map((h) => h.id));
  const chunkById = new Map(corpus.chunks.map((c) => [c.chunkId, c]));

  // Collapse chunks to their parent document, keeping the best-scoring chunk as
  // the evidence for why the document matched. This is the "generate big" half:
  // the caller hands the model `document.fullText`, not the chunk.
  const byDocument = new Map<string, ScoredDocument>();

  for (const [chunkId, rawScore] of fused) {
    const chunk = chunkById.get(chunkId);
    if (!chunk) continue;

    const document = corpus.documents.get(chunk.docId);
    if (!document || !includeTiers.includes(document.sourceTier)) continue;

    const score = applyTierMultiplier(rawScore, document.sourceTier);
    const existing = byDocument.get(document.docId);
    if (existing && existing.rawScore >= rawScore) continue;

    const matchedBy: Array<'vector' | 'lexical'> = [];
    if (vectorIds.has(chunkId)) matchedBy.push('vector');
    if (lexicalIds.has(chunkId)) matchedBy.push('lexical');

    byDocument.set(document.docId, {
      document,
      bestChunk: chunk,
      score,
      rawScore,
      matchedBy,
    });
  }

  return [...byDocument.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, documentLimit);
}

/**
 * Full serving path: hybrid retrieval → rerank → tier weighting → parent
 * expansion.
 *
 * The rerank stage sits between fusion and the gate, and operates on candidate
 * CHUNKS. Only after ranking do we collapse to parent documents, so a long post
 * is judged on its most relevant section rather than on its average.
 */
export async function retrieveAndRerank(
  corpus: Corpus,
  query: string,
  options: RetrieveOptions = {},
): Promise<RetrieveResult> {
  const candidateLimit = options.candidateLimit ?? DEFAULT_CANDIDATES;
  const documentLimit = options.documentLimit ?? DEFAULT_DOCUMENTS;
  const includeTiers = options.includeTiers ?? ['published', 'tutorial', 'internal'];

  // Stage 1-2: hybrid candidates, keeping chunk granularity.
  const lexicalHits = corpus.lexical.search(query, candidateLimit);
  let vectorHits: { id: string; score: number }[] = [];
  if (options.queryEmbedding?.length) {
    vectorHits = corpus.chunks
      .filter((c) => c.embedding.length > 0)
      .map((c) => ({
        id: c.chunkId,
        score: cosineSimilarity(options.queryEmbedding as number[], c.embedding),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, candidateLimit);
  }

  const lists = [vectorHits, lexicalHits].filter((l) => l.length > 0);
  if (!lists.length) return { documents: [], scoreKind: 'fused' };

  const fused = reciprocalRankFusion(lists);
  const chunkById = new Map(corpus.chunks.map((c) => [c.chunkId, c]));

  const candidates = [...fused.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, candidateLimit)
    .map(([chunkId]) => chunkById.get(chunkId))
    .filter((c): c is RetrievableChunk => Boolean(c))
    .filter((c) => {
      const doc = corpus.documents.get(c.docId);
      return doc !== undefined && includeTiers.includes(doc.sourceTier);
    });

  if (!candidates.length) return { documents: [], scoreKind: 'fused' };

  // Stage 3: rerank. Chunk text only - the breadcrumb is already prefixed to
  // embeddedText, which gives the cross-encoder the section's context.
  const hits = await rerank(
    query,
    candidates.map((c) => c.embeddedText),
  );

  const lexicalIds = new Set(lexicalHits.map((h) => h.id));
  const vectorIds = new Set(vectorHits.map((h) => h.id));

  // Stage 4: tier weighting, then collapse to parents keeping the best chunk.
  const byDocument = new Map<string, ScoredDocument>();
  for (const hit of hits) {
    const chunk = candidates[hit.index];
    if (!chunk) continue;
    const document = corpus.documents.get(chunk.docId);
    if (!document) continue;

    const score = applyTierMultiplier(hit.score, document.sourceTier);
    const existing = byDocument.get(document.docId);
    if (existing && existing.score >= score) continue;

    const matchedBy: Array<'vector' | 'lexical'> = [];
    if (vectorIds.has(chunk.chunkId)) matchedBy.push('vector');
    if (lexicalIds.has(chunk.chunkId)) matchedBy.push('lexical');

    byDocument.set(document.docId, {
      document,
      bestChunk: chunk,
      score,
      rawScore: hit.score,
      matchedBy,
    });
  }

  return {
    documents: [...byDocument.values()]
      .sort((a, b) => b.score - a.score)
      .slice(0, documentLimit),
    scoreKind: 'rerank',
  };
}

function corpusFrom(
  chunks: RetrievableChunk[],
  documents: Map<string, RetrievableDocument>,
  embeddingModel: string | null,
  indexVersion: string | null,
): Corpus {
  return {
    chunks,
    documents,
    lexical: new BM25Index(chunks.map((c) => ({ id: c.chunkId, text: c.embeddedText }))),
    embeddingModel,
    indexVersion,
  };
}

/**
 * Load the serving corpus.
 *
 * Artifact first (one gzipped GET), BigQuery as the fallback. The fallback is
 * correct but ~47s cold, so a missing artifact degrades latency rather than
 * availability - which is the right trade, but it should be loud: the warning
 * below is the signal that a sync failed to publish.
 */
export async function loadCorpus(): Promise<Corpus> {
  const artifact = await downloadArtifact().catch((err) => {
    console.warn(`[kb] artifact unavailable (${err.message}); falling back to BigQuery`);
    return null;
  });

  if (!artifact) {
    console.warn(
      `[kb] no serving artifact at ${ARTIFACT_LOCATION} - using the slow BigQuery ` +
        'path. Run `npm run kb:build` to publish one.',
    );
    return loadCorpusFromBigQuery();
  }

  const chunks: RetrievableChunk[] = artifact.chunks.map((c) => ({
    chunkId: c.chunkId,
    docId: c.docId,
    text: c.text,
    embeddedText: rebuildEmbeddedText(c.headingPath, c.text),
    headingPath: c.headingPath,
    embedding: unpackEmbedding(c.embedding),
  }));

  const documents = new Map<string, RetrievableDocument>(
    artifact.documents.map((d) => [
      d.docId,
      {
        docId: d.docId,
        title: d.title,
        sourceUrl: d.sourceUrl,
        sourceType: d.sourceType as RetrievableDocument['sourceType'],
        sourceTier: d.sourceTier as RetrievableDocument['sourceTier'],
        publishedAt: d.publishedAt ? new Date(d.publishedAt) : null,
        fullText: d.fullText,
      },
    ]),
  );

  return corpusFrom(chunks, documents, artifact.embeddingModel, artifact.indexVersion);
}
