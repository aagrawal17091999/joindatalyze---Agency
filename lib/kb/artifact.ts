import { gzipSync, gunzipSync } from 'zlib';
import { GoogleAuth } from 'google-auth-library';

// The serving artifact.
//
// WHY THIS EXISTS - measured, not theoretical:
//
//   loadCorpus() straight from BigQuery      ~61s cold
//   ...with base64 Float32 embeddings        ~47s cold
//   this artifact                            see below
//
// Packing the embeddings barely moved it, which ruled out the obvious
// suspect (parsing ~1M JSON numbers) and pointed at the real one: the
// BigQuery client paginates a multi-megabyte result set over many sequential
// REST round trips. No amount of shrinking rows fixes a per-page round trip.
//
// So serving reads ONE gzipped blob over ONE HTTP GET instead. BigQuery stays
// the source of truth and the build layer; this is a derived, disposable
// snapshot rebuilt after every sync - exactly the split the plan called for.
//
// Stored in the GCS bucket that already exists for the pipeline cache, using
// the service account the app already has. No new dependency (google-auth-library
// ships with @google-cloud/bigquery) and no new credential.

const BUCKET = process.env.KB_ARTIFACT_BUCKET ?? 'joindatalyze-pipeline-cache';
const OBJECT = process.env.KB_ARTIFACT_OBJECT ?? 'kb-index.json.gz';

export type ArtifactChunk = {
  chunkId: string;
  docId: string;
  text: string;
  headingPath: string;
  /** base64 Float32 - decoded lazily by the reader. */
  embedding: string;
};

export type ArtifactDocument = {
  docId: string;
  title: string;
  sourceUrl: string | null;
  sourceType: string;
  sourceTier: string;
  publishedAt: string | null;
  fullText: string;
};

export type KbArtifact = {
  version: 1;
  indexVersion: string | null;
  embeddingModel: string | null;
  builtAt: string;
  chunks: ArtifactChunk[];
  documents: ArtifactDocument[];
};

let auth: GoogleAuth | null = null;
async function accessToken(scope: string): Promise<string> {
  if (!auth) {
    auth = new GoogleAuth({
      scopes: [scope],
      credentials: process.env.BIGQUERY_CREDENTIALS_JSON
        ? JSON.parse(process.env.BIGQUERY_CREDENTIALS_JSON)
        : undefined,
    });
  }
  const client = await auth.getClient();
  const token = await client.getAccessToken();
  if (!token.token) throw new Error('Could not obtain a Google access token.');
  return token.token;
}

/**
 * `embedded_text` is deliberately NOT stored - it is exactly
 * `${headingPath}\n\n${text}`, so storing it would duplicate every chunk's
 * body for no reason. The reader reconstitutes it.
 */
export function rebuildEmbeddedText(headingPath: string, text: string): string {
  return `${headingPath}\n\n${text}`;
}

export async function uploadArtifact(artifact: KbArtifact): Promise<number> {
  const token = await accessToken('https://www.googleapis.com/auth/devstorage.read_write');
  const body = gzipSync(Buffer.from(JSON.stringify(artifact), 'utf8'), { level: 9 });

  const res = await fetch(
    `https://storage.googleapis.com/upload/storage/v1/b/${BUCKET}/o` +
      `?uploadType=media&name=${encodeURIComponent(OBJECT)}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/gzip',
        'Cache-Control': 'no-cache',
      },
      body: new Uint8Array(body),
    },
  );

  if (!res.ok) {
    throw new Error(
      `GCS upload failed ${res.status}: ${(await res.text()).slice(0, 300)}\n` +
        `Check the service account has objectAdmin on gs://${BUCKET}.`,
    );
  }
  return body.byteLength;
}

export async function downloadArtifact(): Promise<KbArtifact | null> {
  const token = await accessToken('https://www.googleapis.com/auth/devstorage.read_only');

  const res = await fetch(
    `https://storage.googleapis.com/storage/v1/b/${BUCKET}/o/${encodeURIComponent(OBJECT)}?alt=media`,
    { headers: { Authorization: `Bearer ${token}` } },
  );

  // A missing artifact is not an error - the caller falls back to BigQuery,
  // which is slow but correct. That keeps a failed upload from taking the
  // whole feature down.
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`GCS download failed ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }

  const raw = Buffer.from(await res.arrayBuffer());
  // fetch transparently decompresses when the object carries Content-Encoding:
  // gzip, so only gunzip when the magic bytes are actually still there.
  const json = raw[0] === 0x1f && raw[1] === 0x8b ? gunzipSync(raw) : raw;
  return JSON.parse(json.toString('utf8')) as KbArtifact;
}

export const ARTIFACT_LOCATION = `gs://${BUCKET}/${OBJECT}`;
