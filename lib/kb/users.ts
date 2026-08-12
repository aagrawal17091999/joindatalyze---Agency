import { BigQuery } from '@google-cloud/bigquery';

// The lead table behind the email gate, and the authoritative question counter.
//
// Counting in BigQuery rather than the cookie is deliberate: a signed cookie
// proves who you are but is replayable, so a count stored there could be rolled
// back to zero by re-sending an older cookie. This is the one place the quota
// can actually be enforced.

const PROJECT_ID = process.env.BIGQUERY_PROJECT_ID;
const DATASET_ID = process.env.BIGQUERY_DATASET_ID || 'datalyze';

/**
 * Per-email question cap. Null = unlimited, which is the default.
 *
 * The email is the gate, not a rationing device: someone who hands over an
 * address gets to keep asking. Abuse is handled where it actually belongs —
 * the per-IP and global daily caps in lib/kb/limits.ts, which a fresh +1
 * address can't walk around. Set KB_QUESTION_LIMIT to a positive number to
 * bring the per-email cap back.
 */
const RAW_QUESTION_LIMIT = Number(process.env.KB_QUESTION_LIMIT ?? 0);
export const QUESTION_LIMIT: number | null =
  Number.isFinite(RAW_QUESTION_LIMIT) && RAW_QUESTION_LIMIT > 0 ? RAW_QUESTION_LIMIT : null;

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

export type NewUser = {
  userId: string;
  email: string;
  emailHash: string;
  referrer: string | null;
  firstQuestion: string | null;
};

export async function upsertUser(user: NewUser): Promise<void> {
  if (!PROJECT_ID) return;
  const now = new Date().toISOString();

  // MERGE, not INSERT: a returning visitor with a cleared cookie must not
  // create a second row and silently reset their own quota.
  await bq().query({
    query: `
      MERGE ${table('ai_avatar_users')} T
      USING (SELECT @emailHash AS email_hash) S
      ON T.email_hash = S.email_hash
      WHEN MATCHED THEN UPDATE SET last_seen_at = @now
      WHEN NOT MATCHED THEN INSERT (
        user_id, email, email_hash, first_seen_at, last_seen_at,
        questions_asked, questions_answered, questions_refused,
        booked_call, ghost_member_created, first_referrer, first_question
      ) VALUES (
        @userId, @email, @emailHash, @now, @now, 0, 0, 0, FALSE, FALSE,
        @referrer, @firstQuestion
      )`,
    params: {
      userId: user.userId,
      email: user.email,
      emailHash: user.emailHash,
      now,
      referrer: user.referrer,
      firstQuestion: user.firstQuestion,
    },
    types: { referrer: 'STRING', firstQuestion: 'STRING' },
  });
}

export type Quota = {
  asked: number;
  /** Null when uncapped. */
  limit: number | null;
  remaining: number | null;
  exhausted: boolean;
};

function quotaFor(asked: number): Quota {
  if (QUESTION_LIMIT === null) {
    return { asked, limit: null, remaining: null, exhausted: false };
  }
  return {
    asked,
    limit: QUESTION_LIMIT,
    remaining: Math.max(0, QUESTION_LIMIT - asked),
    exhausted: asked >= QUESTION_LIMIT,
  };
}

export async function getQuota(emailHash: string): Promise<Quota> {
  if (!PROJECT_ID) return quotaFor(0);

  const [rows] = await bq().query({
    query: `SELECT questions_asked FROM ${table('ai_avatar_users')} WHERE email_hash = @emailHash LIMIT 1`,
    params: { emailHash },
  });

  return quotaFor(Number(rows[0]?.questions_asked ?? 0));
}

/**
 * Increment BEFORE generating, not after.
 *
 * A visitor who disconnects mid-answer has still consumed the work — billing us
 * for a question that never counted against their quota is the obvious way to
 * get free unlimited answers.
 */
export async function recordQuestion(emailHash: string, firstQuestion: string): Promise<void> {
  if (!PROJECT_ID) return;
  await bq().query({
    query: `
      UPDATE ${table('ai_avatar_users')}
      SET questions_asked = questions_asked + 1,
          last_seen_at = CURRENT_TIMESTAMP(),
          first_question = COALESCE(first_question, @firstQuestion)
      WHERE email_hash = @emailHash`,
    params: { emailHash, firstQuestion },
  });
}

export async function recordOutcome(emailHash: string, answered: boolean): Promise<void> {
  if (!PROJECT_ID) return;
  const column = answered ? 'questions_answered' : 'questions_refused';
  await bq().query({
    query: `UPDATE ${table('ai_avatar_users')} SET ${column} = ${column} + 1 WHERE email_hash = @emailHash`,
    params: { emailHash },
  });
}
