import { BigQuery } from '@google-cloud/bigquery';
import { uploadArtifact, type KbArtifact } from './artifact';

// Build the serving artifact from what's actually in BigQuery and upload it.
//
// Runs once per sync, out of the request path - so the ~47s BigQuery read that
// makes it unusable for serving is completely fine here.

const PROJECT_ID = process.env.BIGQUERY_PROJECT_ID;
const DATASET_ID = process.env.BIGQUERY_DATASET_ID || 'datalyze';

export async function publishArtifact(): Promise<number> {
  const bq = new BigQuery({
    projectId: PROJECT_ID,
    credentials: process.env.BIGQUERY_CREDENTIALS_JSON
      ? JSON.parse(process.env.BIGQUERY_CREDENTIALS_JSON)
      : undefined,
  });

  const [chunkRows] = await bq.query({
    query: `
      SELECT c.chunk_id, c.doc_id, c.text, c.heading_path, c.embedding_f32,
             c.embedding_model, c.index_version
      FROM \`${PROJECT_ID}.${DATASET_ID}.kb_chunks\` c
      JOIN \`${PROJECT_ID}.${DATASET_ID}.kb_documents\` d USING (doc_id)
      WHERE c.status = 'active' AND d.status = 'active'
        AND NOT COALESCE(c.contains_pricing, FALSE)
        AND c.embedding_f32 IS NOT NULL
      ORDER BY c.doc_id, c.chunk_index`,
  });

  const [docRows] = await bq.query({
    query: `
      SELECT doc_id, title, source_url, source_type, source_tier, published_at, full_text
      FROM \`${PROJECT_ID}.${DATASET_ID}.kb_documents\`
      WHERE status = 'active'`,
  });

  if (!chunkRows.length) {
    throw new Error('Refusing to publish an empty artifact - no embedded chunks found.');
  }

  const artifact: KbArtifact = {
    version: 1,
    indexVersion: (chunkRows[0]?.index_version as string) ?? null,
    embeddingModel: (chunkRows[0]?.embedding_model as string) ?? null,
    builtAt: new Date().toISOString(),
    chunks: chunkRows.map((r: Record<string, unknown>) => ({
      chunkId: r.chunk_id as string,
      docId: r.doc_id as string,
      text: r.text as string,
      headingPath: (r.heading_path as string) ?? '',
      embedding: r.embedding_f32 as string,
    })),
    documents: docRows.map((r: Record<string, unknown>) => ({
      docId: r.doc_id as string,
      title: r.title as string,
      sourceUrl: (r.source_url as string) ?? null,
      sourceType: r.source_type as string,
      sourceTier: r.source_tier as string,
      publishedAt: r.published_at ? (r.published_at as { value: string }).value : null,
      fullText: (r.full_text as string) ?? '',
    })),
  };

  return uploadArtifact(artifact);
}
