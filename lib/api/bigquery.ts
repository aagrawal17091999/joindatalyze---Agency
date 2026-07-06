import { BigQuery } from '@google-cloud/bigquery';
import { randomUUID } from 'crypto';

const PROJECT_ID = process.env.BIGQUERY_PROJECT_ID;
const DATASET_ID = process.env.BIGQUERY_DATASET_ID || 'datalyze';

type ClientOptions = {
  projectId?: string;
  credentials?: Record<string, unknown>;
};

function buildClient() {
  const options: ClientOptions = { projectId: PROJECT_ID };
  if (process.env.BIGQUERY_CREDENTIALS_JSON) {
    options.credentials = JSON.parse(process.env.BIGQUERY_CREDENTIALS_JSON);
  }
  return new BigQuery(options);
}

// Cache the client at module scope so warm Fluid Compute invocations reuse it.
let clientInstance: BigQuery | null = null;
function getClient(): BigQuery {
  if (!clientInstance) clientInstance = buildClient();
  return clientInstance;
}

export async function healthCheck(): Promise<boolean> {
  try {
    await getClient().query({ query: 'SELECT 1 AS ok' });
    return true;
  } catch {
    return false;
  }
}

export type InsertToolDownloadInput = {
  email: string;
  tool_id: string;
  download_token: string;
  token_expires_at: Date;
};

export async function insertToolDownload({
  email,
  tool_id,
  download_token,
  token_expires_at,
}: InsertToolDownloadInput) {
  if (!PROJECT_ID) {
    throw new Error('BIGQUERY_PROJECT_ID is not configured');
  }
  const id = randomUUID();
  await getClient().query({
    query: `INSERT INTO \`${PROJECT_ID}.${DATASET_ID}.tool_downloads\`
            (id, email, tool_id, download_token, token_expires_at, email_sent, created_at)
            VALUES (@id, @email, @tool_id, @download_token, @token_expires_at, false, CURRENT_TIMESTAMP())`,
    params: {
      id,
      email,
      tool_id,
      download_token,
      token_expires_at: token_expires_at
        ? BigQuery.timestamp(token_expires_at)
        : null,
    },
  });
  return { id, email, tool_id, download_token, token_expires_at };
}

export async function markToolDownloadEmailSent(token: string) {
  if (!PROJECT_ID) return;
  await getClient().query({
    query: `UPDATE \`${PROJECT_ID}.${DATASET_ID}.tool_downloads\`
            SET email_sent = true
            WHERE download_token = @token`,
    params: { token },
  });
}

export type InsertContactLeadInput = {
  name: string;
  email: string;
  website: string | null;
  goal: string | null;
  source: string;
};

// Lead captured from the /contact form before we hand off to Calendly. Writing
// this ourselves means the lead survives even if the visitor never completes
// booking (ad blocker, drop-off, etc.). Table DDL:
//   CREATE TABLE `<project>.datalyze.contact_leads` (
//     id STRING, name STRING, email STRING, website STRING,
//     goal STRING, source STRING, created_at TIMESTAMP);
export async function insertContactLead({
  name,
  email,
  website,
  goal,
  source,
}: InsertContactLeadInput) {
  if (!PROJECT_ID) {
    throw new Error('BIGQUERY_PROJECT_ID is not configured');
  }
  const id = randomUUID();
  await getClient().query({
    query: `INSERT INTO \`${PROJECT_ID}.${DATASET_ID}.contact_leads\`
            (id, name, email, website, goal, source, created_at)
            VALUES (@id, @name, @email, @website, @goal, @source, CURRENT_TIMESTAMP())`,
    params: { id, name, email, website, goal, source },
    // Nullable params need explicit types so BigQuery can bind a NULL value.
    types: { website: 'STRING', goal: 'STRING' },
  });
  return { id };
}
