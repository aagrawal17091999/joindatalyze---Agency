import { BigQuery } from '@google-cloud/bigquery';
import { randomUUID } from 'crypto';
import type { RefusalReason } from './gate';
import { normalizeForHash, sha256 } from './text';

// Query logging.
//
// This table is the point of the whole feature, not an afterthought: the
// refused half is the content roadmap, and the score columns are the only way
// to recalibrate tau later. Nothing here can be reconstructed retroactively —
// if it isn't logged at request time, it's gone.
//
// Written from `after()` in the route so it never blocks the response, matching
// the pattern in app/api/contact/route.ts.

const PROJECT_ID = process.env.BIGQUERY_PROJECT_ID;
const DATASET_ID = process.env.BIGQUERY_DATASET_ID || 'datalyze';

let client: BigQuery | null = null;
function bq(): BigQuery {
  if (!client) {
    client = new BigQuery({
      projectId: PROJECT_ID,
      credentials: process.env.BIGQUERY_CREDENTIALS_JSON
        ? JSON.parse(process.env.BIGQUERY_CREDENTIALS_JSON)
        : undefined,
    });
  }
  return client;
}

export type QueryLogInput = {
  question: string;
  emailHash: string | null;
  sessionId: string | null;
  answered: boolean;
  refusalReason: RefusalReason | null;
  topScore: number | null;
  scoreGap: number | null;
  scoresTop5: number[];
  retrievedChunkIds: string[];
  citedDocIds: string[];
  sourceTiers: string[];
  latency: {
    /** Cold-start corpus load. Dominates total latency on a cold instance. */
    corpusMs?: number;
    embedMs?: number;
    searchMs?: number;
    rerankMs?: number;
    generationMs?: number;
    totalMs: number;
  };
  cacheHit: boolean;
  model: string | null;
  embeddingModel: string | null;
  indexVersion: string | null;
  tau: number;
  delta: number;
  inputTokens: number | null;
  outputTokens: number | null;
  questionIndexInSession: number | null;
  referrer: string | null;
  /** Hashed, never raw — public unauthenticated endpoint. */
  ipHash: string | null;
};

/**
 * Append one row per question.
 *
 * Uses a streaming insert deliberately: this is append-only event data (like
 * `insertContactLead`), never updated or deleted, so the streaming buffer's
 * DML restriction — which forced load jobs for kb_chunks — doesn't apply here.
 */
export async function logQuery(input: QueryLogInput): Promise<void> {
  if (!PROJECT_ID) return;

  const normalized = normalizeForHash(input.question);

  await bq()
    .dataset(DATASET_ID)
    .table('ai_avatar_queries')
    .insert([
      {
        query_id: randomUUID(),
        created_at: new Date().toISOString(),
        email_hash: input.emailHash,
        session_id: input.sessionId,
        question: input.question,
        question_normalized: normalized,
        question_hash: sha256(normalized),
        answered: input.answered,
        refusal_reason: input.refusalReason,
        top_score: input.topScore,
        score_gap: input.scoreGap,
        // The full distribution, not just the top — revisiting tau in three
        // months needs the shape, and it can't be recovered later.
        scores_top5: input.scoresTop5,
        retrieved_chunk_ids: input.retrievedChunkIds,
        cited_doc_ids: input.citedDocIds,
        source_tiers: input.sourceTiers,
        latency_corpus_ms: input.latency.corpusMs ?? null,
        latency_embed_ms: input.latency.embedMs ?? null,
        latency_search_ms: input.latency.searchMs ?? null,
        latency_rerank_ms: input.latency.rerankMs ?? null,
        latency_generation_ms: input.latency.generationMs ?? null,
        latency_total_ms: input.latency.totalMs,
        cache_hit: input.cacheHit,
        model: input.model,
        embedding_model: input.embeddingModel,
        // index_version + tau together answer "did this metric move because the
        // content changed or because the config did?" — which comes up
        // constantly and is unanswerable without both.
        index_version: input.indexVersion,
        tau: input.tau,
        delta: input.delta,
        input_tokens: input.inputTokens,
        output_tokens: input.outputTokens,
        question_index_in_session: input.questionIndexInSession,
        referrer: input.referrer,
        ip_hash: input.ipHash,
      },
    ]);
}
