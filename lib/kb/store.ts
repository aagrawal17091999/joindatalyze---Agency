import { BigQuery } from '@google-cloud/bigquery';
import type { EmbeddedChunk, KbChunk, PreparedDocument, RunMode, SourceType } from './types';
import { packEmbedding } from './text';

// BigQuery is the source of truth for the knowledge base. The vector store is a
// derived, disposable serving copy - which is the property that lets us swap it
// later without ceremony.
//
// Writes go through MERGE from a temp staging table, never streaming inserts.
// BigQuery has no primary keys, so a retried sync using INSERT would silently
// duplicate every row. (lib/api/bigquery.ts uses plain INSERT for leads, which
// is correct there - append-only, one row per event.)

const PROJECT_ID = process.env.BIGQUERY_PROJECT_ID;
const DATASET_ID = process.env.BIGQUERY_DATASET_ID || 'datalyze';

let client: BigQuery | null = null;

// Cached at module scope so warm Fluid Compute invocations reuse it, matching
// the pattern in lib/api/bigquery.ts.
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

function table(name: string): string {
  if (!PROJECT_ID) throw new Error('BIGQUERY_PROJECT_ID is not configured');
  return `\`${PROJECT_ID}.${DATASET_ID}.${name}\``;
}

export type SyncCounts = {
  documentsSeen: number;
  documentsChanged: number;
  documentsNew: number;
  documentsDeleted: number;
  chunksWritten: number;
};

/** Existing document hashes, for change detection. */
export async function loadDocumentHashes(): Promise<Map<string, string>> {
  const [rows] = await bq().query({
    query: `SELECT doc_id, content_hash FROM ${table('kb_documents')} WHERE status = 'active'`,
  });
  return new Map(rows.map((r: { doc_id: string; content_hash: string }) => [r.doc_id, r.content_hash]));
}

/**
 * Guard against a partial pull being mistaken for a successful one.
 *
 * A Ghost hiccup or an expired Apify token returns an empty list, which the
 * delete reconciliation would read as "everything was deleted" and use to
 * silently empty the knowledge base. Soft deletes make that recoverable but not
 * visible, which is worse. Four lines, and it's the difference between a bad
 * afternoon and a bad week.
 */
export async function assertSourceNotCollapsed(
  sourceType: SourceType,
  incomingCount: number,
): Promise<void> {
  const [rows] = await bq().query({
    query: `SELECT COUNT(*) AS n FROM ${table('kb_documents')}
            WHERE source_type = @sourceType AND status = 'active'`,
    params: { sourceType },
  });
  const previous = Number(rows[0]?.n ?? 0);

  if (previous === 0) return; // first run for this source

  if (incomingCount === 0) {
    throw new Error(
      `Source "${sourceType}" returned 0 documents but ${previous} are active. ` +
        'Refusing to tombstone the corpus - check credentials and the upstream API.',
    );
  }
  if (incomingCount < previous * 0.5) {
    throw new Error(
      `Source "${sourceType}" returned ${incomingCount} documents, down from ${previous} ` +
        '(>50% drop). Refusing to proceed - re-run, and if the drop is real, ' +
        'raise the threshold deliberately for this run.',
    );
  }
}

/**
 * Write rows with a LOAD job, never `table.insert()`.
 *
 * `table.insert()` uses the streaming API, and streamed rows sit in a streaming
 * buffer for up to ~90 minutes during which BigQuery refuses any UPDATE or
 * DELETE against the table ("would affect rows in the streaming buffer"). Since
 * this pipeline deletes a document's chunks before rewriting them, streaming
 * makes any re-run inside that window fail outright.
 *
 * Load jobs write directly to storage: no buffer, immediately DML-able, and
 * better suited to bulk writes anyway.
 */
async function loadRows(
  tableName: string,
  rows: Record<string, unknown>[],
  writeDisposition: 'WRITE_APPEND' | 'WRITE_TRUNCATE' = 'WRITE_APPEND',
): Promise<void> {
  if (!rows.length) return;

  const table = bq().dataset(DATASET_ID).table(tableName);
  const ndjson = rows.map((r) => JSON.stringify(r)).join('\n');

  await new Promise<void>((resolve, reject) => {
    const stream = table.createWriteStream({
      sourceFormat: 'NEWLINE_DELIMITED_JSON',
      writeDisposition,
      schemaUpdateOptions: [],
    });
    stream.on('error', reject);
    stream.on('job', (job) => {
      job.on('error', reject);
      job.on('complete', () => resolve());
    });
    stream.end(Buffer.from(ndjson, 'utf8'));
  });
}

async function mergeRows(
  targetTable: string,
  keyColumn: string,
  rows: Record<string, unknown>[],
  updateColumns: string[],
): Promise<void> {
  if (!rows.length) return;

  const dataset = bq().dataset(DATASET_ID);
  const stagingName = `_stage_${targetTable}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const [target] = await dataset.table(targetTable).getMetadata();
  const [staging] = await dataset.createTable(stagingName, {
    schema: target.schema,
    // Belt and braces: staging tables are dropped explicitly below, and expire
    // on their own if a crash means that never runs.
    expirationTime: String(Date.now() + 6 * 60 * 60 * 1000),
  });

  try {
    await loadRows(stagingName, rows);

    const setClause = updateColumns.map((c) => `T.${c} = S.${c}`).join(',\n        ');
    const allColumns = Object.keys(rows[0]);

    await bq().query({
      query: `
      MERGE ${table(targetTable)} T
      USING \`${PROJECT_ID}.${DATASET_ID}.${stagingName}\` S
      ON T.${keyColumn} = S.${keyColumn}
      WHEN MATCHED THEN UPDATE SET
        ${setClause}
      WHEN NOT MATCHED THEN INSERT (${allColumns.join(', ')})
        VALUES (${allColumns.map((c) => `S.${c}`).join(', ')})`,
    });
  } finally {
    await staging.delete({ ignoreNotFound: true }).catch(() => {});
  }
}

export async function upsertDocuments(
  docs: PreparedDocument[],
  indexVersion: string,
): Promise<void> {
  const now = new Date().toISOString();
  const rows = docs.map((d) => ({
    doc_id: d.docId,
    source_type: d.sourceType,
    source_url: d.sourceUrl,
    title: d.title,
    author: d.author,
    published_at: d.publishedAt?.toISOString() ?? null,
    updated_at: d.updatedAt?.toISOString() ?? null,
    source_tier: d.sourceTier,
    content_hash: d.contentHash,
    full_text: d.text,
    token_count: d.tokenCount,
    chunk_count: d.chunks.length,
    contains_pricing: d.containsPricing,
    first_seen_at: now,
    last_seen_at: now,
    status: 'active',
    index_version: indexVersion,
  }));

  await mergeRows('kb_documents', 'doc_id', rows, [
    'source_type', 'source_url', 'title', 'author', 'published_at', 'updated_at',
    'source_tier', 'content_hash', 'full_text', 'token_count', 'chunk_count',
    'contains_pricing', 'last_seen_at', 'status', 'index_version',
    // first_seen_at is deliberately absent: it must survive updates.
  ]);
}

/**
 * Replace every chunk belonging to the given documents.
 *
 * Accepts embedded or un-embedded chunks: the corpus can land in BigQuery
 * before a Voyage key exists, and embeddings backfill later. `embedding_model`
 * being NULL is the marker for "not yet embedded".
 */
export async function replaceChunks(
  docIds: string[],
  chunks: Array<KbChunk | EmbeddedChunk>,
  indexVersion: string,
): Promise<void> {
  if (!docIds.length) return;

  // Delete-then-insert rather than MERGE: chunk boundaries shift when a
  // document changes, so stale chunk_ids from the previous shape would
  // otherwise linger forever as orphans.
  await bq().query({
    query: `DELETE FROM ${table('kb_chunks')} WHERE doc_id IN UNNEST(@docIds)`,
    params: { docIds },
  });

  if (!chunks.length) return;

  const now = new Date().toISOString();
  const rows = chunks.map((c) => ({
    chunk_id: c.chunkId,
    doc_id: c.docId,
    chunk_index: c.chunkIndex,
    text: c.text,
    embedded_text: c.embeddedText,
    heading_path: c.headingPath,
    content_hash: c.contentHash,
    token_count: c.tokenCount,
    contains_pricing: c.containsPricing,
    // BigQuery has no NULL arrays - a REPEATED field takes [] for "absent", and
    // rejects null outright ("Field value of embedding cannot be empty").
    embedding: 'embedding' in c ? c.embedding : [],
    // Serving copy: base64 Float32. The ARRAY<FLOAT64> above stays as the
    // portable source of truth; this is what loadCorpus actually reads,
    // because parsing ~1M JSON numbers took ~61s on a cold start.
    embedding_f32: 'embedding' in c ? packEmbedding(c.embedding) : null,
    embedding_model: 'embeddingModel' in c ? c.embeddingModel : null,
    embedded_at: 'embedding' in c ? now : null,
    index_version: indexVersion,
    status: 'active',
  }));

  // Load job, in batches - embeddings are ~1024 floats each, so a full corpus
  // rebuild is a large payload.
  const BATCH = 500;
  for (let i = 0; i < rows.length; i += BATCH) {
    await loadRows('kb_chunks', rows.slice(i, i + BATCH));
  }
}

/**
 * Soft-delete documents a FULL run didn't return.
 *
 * Never called for incremental runs - see plan §2.5. An incremental pull
 * returns a recent slice, and reconciling deletes against it would tombstone
 * everything older.
 */
export async function reconcileDeletes(
  sourceType: SourceType,
  runMode: RunMode,
  seenDocIds: string[],
): Promise<number> {
  if (runMode !== 'full') return 0;

  const [rows] = await bq().query({
    query: `
      UPDATE ${table('kb_documents')}
      SET status = 'deleted', last_seen_at = CURRENT_TIMESTAMP()
      WHERE source_type = @sourceType
        AND status = 'active'
        AND doc_id NOT IN UNNEST(@seenDocIds)`,
    params: { sourceType, seenDocIds },
  });
  void rows;

  const [countRows] = await bq().query({
    query: `SELECT COUNT(*) AS n FROM ${table('kb_documents')}
            WHERE source_type = @sourceType AND status = 'deleted'`,
    params: { sourceType },
  });
  return Number(countRows[0]?.n ?? 0);
}

export type ChunkDrift = { doc_id: string; expected: number; actual: number };

/**
 * Documents whose recorded chunk_count disagrees with the rows actually in
 * kb_chunks. Non-zero means a write was interrupted between the two tables.
 */
export async function findChunkCountDrift(): Promise<ChunkDrift[]> {
  const [rows] = await bq().query({
    query: `
      SELECT d.doc_id, d.chunk_count AS expected, COUNT(c.chunk_id) AS actual
      FROM ${table('kb_documents')} d
      LEFT JOIN ${table('kb_chunks')} c
        ON c.doc_id = d.doc_id AND c.status = 'active'
      WHERE d.status = 'active'
      GROUP BY d.doc_id, d.chunk_count
      HAVING expected != actual
      ORDER BY d.doc_id
      LIMIT 50`,
  });
  return rows as ChunkDrift[];
}
