import { BigQuery } from '@google-cloud/bigquery';

// Chat history, keyed by email hash.
//
// The transcript is stored as an opaque JSON string rather than a modelled
// schema. That's deliberate: this table exists so a visitor who comes back on a
// new laptop gets their threads, not so anyone queries them. The analytics
// surface is ai_avatar_queries, which already has one row per question with the
// gate scores attached — modelling turns twice would mean two things to keep in
// step and no new answers.
//
// Writes are one MERGE per completed answer, not one per token. BigQuery is not
// an OLTP store and this is already the busiest DML path in the app; if the
// chat ever gets real traffic this is the first thing to move to Postgres or
// Redis. Nothing above this module's interface changes when it does.

const PROJECT_ID = process.env.BIGQUERY_PROJECT_ID;
const DATASET_ID = process.env.BIGQUERY_DATASET_ID || 'datalyze';

/** Threads returned to a returning visitor. Older ones stay in the table. */
const MAX_THREADS = 50;
/** A transcript larger than this is not a conversation, it's an upload. */
export const MAX_TRANSCRIPT_BYTES = 256_000;

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

function table(name: string): string {
  return `\`${PROJECT_ID}.${DATASET_ID}.${name}\``;
}

export type StoredThread = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  /** The client's Turn[]. Opaque here — see the note above. */
  turns: unknown[];
};

export function isConfigured(): boolean {
  return !!PROJECT_ID;
}

export async function listThreads(emailHash: string): Promise<StoredThread[]> {
  if (!PROJECT_ID) return [];

  const [rows] = await bq().query({
    query: `
      SELECT conversation_id, title, created_at, updated_at, turns
      FROM ${table('ai_avatar_conversations')}
      WHERE email_hash = @emailHash AND NOT COALESCE(deleted, FALSE)
      ORDER BY updated_at DESC
      LIMIT ${MAX_THREADS}`,
    params: { emailHash },
    // A thread saved seconds ago must show up. BigQuery's result cache will
    // otherwise replay the pre-write answer for an identical query text.
    useQueryCache: false,
  });

  return rows.flatMap((row: Record<string, unknown>) => {
    let turns: unknown[];
    try {
      const parsed = JSON.parse(String(row.turns ?? '[]'));
      turns = Array.isArray(parsed) ? parsed : [];
    } catch {
      // A corrupt blob loses one thread, not the whole history.
      return [];
    }
    return [
      {
        id: String(row.conversation_id),
        title: String(row.title ?? 'Chat'),
        createdAt: toMillis(row.created_at),
        updatedAt: toMillis(row.updated_at),
        turns,
      },
    ];
  });
}

/** BigQuery hands back {value: ISO string} for TIMESTAMP columns. */
function toMillis(value: unknown): number {
  if (value && typeof value === 'object' && 'value' in value) {
    return new Date(String((value as { value: unknown }).value)).getTime();
  }
  return new Date(String(value)).getTime();
}

export async function saveThread(emailHash: string, thread: StoredThread): Promise<void> {
  if (!PROJECT_ID) return;

  const turns = JSON.stringify(thread.turns ?? []);
  if (Buffer.byteLength(turns, 'utf8') > MAX_TRANSCRIPT_BYTES) {
    throw new Error('transcript_too_large');
  }

  // MERGE on (email_hash, conversation_id): the id is minted client-side, so
  // two devices editing the same thread converge on one row rather than racing
  // to insert duplicates. Last write wins — acceptable for a transcript that
  // only ever grows at the end.
  await bq().query({
    query: `
      MERGE ${table('ai_avatar_conversations')} T
      USING (
        SELECT @conversationId AS conversation_id, @emailHash AS email_hash
      ) S
      ON T.conversation_id = S.conversation_id AND T.email_hash = S.email_hash
      WHEN MATCHED THEN UPDATE SET
        title = @title,
        updated_at = TIMESTAMP_MILLIS(@updatedAtMs),
        saved_at = CURRENT_TIMESTAMP(),
        turn_count = @turnCount,
        turns = @turns,
        deleted = FALSE
      WHEN NOT MATCHED THEN INSERT (
        conversation_id, email_hash, title, created_at, updated_at,
        saved_at, turn_count, turns, deleted
      ) VALUES (
        @conversationId, @emailHash, @title,
        TIMESTAMP_MILLIS(@createdAtMs), TIMESTAMP_MILLIS(@updatedAtMs),
        CURRENT_TIMESTAMP(), @turnCount, @turns, FALSE
      )`,
    // Timestamps go over the wire as epoch millis, not ISO strings: a param
    // declared TIMESTAMP with a string value arrives as NULL through this
    // client, which a NOT NULL column turns into a 400 at insert time.
    params: {
      conversationId: thread.id,
      emailHash,
      title: thread.title.slice(0, 200),
      createdAtMs: thread.createdAt || Date.now(),
      updatedAtMs: thread.updatedAt || Date.now(),
      turnCount: thread.turns.length,
      turns,
    },
    types: {
      conversationId: 'STRING',
      emailHash: 'STRING',
      title: 'STRING',
      createdAtMs: 'INT64',
      updatedAtMs: 'INT64',
      turnCount: 'INT64',
      turns: 'STRING',
    },
  });
}

export async function deleteThread(emailHash: string, conversationId: string): Promise<void> {
  if (!PROJECT_ID) return;

  await bq().query({
    query: `
      UPDATE ${table('ai_avatar_conversations')}
      SET deleted = TRUE, updated_at = CURRENT_TIMESTAMP()
      WHERE email_hash = @emailHash AND conversation_id = @conversationId`,
    params: { emailHash, conversationId },
  });
}
