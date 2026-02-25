import { BigQuery } from '@google-cloud/bigquery';
import { randomUUID } from 'crypto';

const PROJECT_ID = process.env.BIGQUERY_PROJECT_ID;
const DATASET_ID = process.env.BIGQUERY_DATASET_ID || 'datalyze';

const clientOptions = { projectId: PROJECT_ID };
if (process.env.BIGQUERY_CREDENTIALS_JSON) {
  clientOptions.credentials = JSON.parse(process.env.BIGQUERY_CREDENTIALS_JSON);
}

export const bigquery = new BigQuery(clientOptions);

export async function healthCheck() {
  try {
    await bigquery.query({ query: 'SELECT 1 AS ok' });
    return true;
  } catch (_) {
    return false;
  }
}

// ── tool_downloads ───────────────────────────────────────────────────────────

export async function insertToolDownload({ email, tool_id, download_token, token_expires_at }) {
  const id = randomUUID();
  await bigquery.query({
    query: `INSERT INTO \`${PROJECT_ID}.${DATASET_ID}.tool_downloads\`
            (id, email, tool_id, download_token, token_expires_at, email_sent, created_at)
            VALUES (@id, @email, @tool_id, @download_token, @token_expires_at, false, CURRENT_TIMESTAMP())`,
    params: {
      id,
      email,
      tool_id,
      download_token,
      token_expires_at: token_expires_at ? BigQuery.timestamp(token_expires_at) : null,
    },
  });
  return { id, email, tool_id, download_token, token_expires_at, email_sent: false };
}

export async function markToolDownloadEmailSent(token) {
  await bigquery.query({
    query: `UPDATE \`${PROJECT_ID}.${DATASET_ID}.tool_downloads\`
            SET email_sent = true
            WHERE download_token = @token`,
    params: { token },
  });
}

