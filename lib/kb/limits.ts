import { BigQuery } from '@google-cloud/bigquery';
import { normalizeForHash, sha256 } from './text';

// Abuse and cost controls (plan §2.7).
//
// Built on BigQuery + per-instance memory rather than Redis. That is a
// deliberate v1 choice, not an oversight:
//
//   - The per-email question cap is off by default (lib/kb/users.ts), so these
//     counters are the real ceiling on spend, not a second line.
//   - Every query is already written to ai_avatar_queries, so the counters
//     these need exist without adding a store.
//   - A per-instance cache is weaker than a shared one but strictly better
//     than none, and its failure mode is "fewer cache hits", not "wrong".
//
// Move the counters to Upstash Redis when traffic makes the ~400ms BigQuery
// read or the per-instance cache split actually hurt. Nothing above the
// interface changes when that happens.

const PROJECT_ID = process.env.BIGQUERY_PROJECT_ID;
const DATASET_ID = process.env.BIGQUERY_DATASET_ID || 'datalyze';

/** Global fuse. Never fires in normal operation - see plan §2.7. */
export const DAILY_ANSWER_CAP = Number(process.env.KB_DAILY_ANSWER_CAP ?? 1500);
/**
 * Per-IP daily cap - the real per-person limit now that the email gate hands
 * out unlimited questions. Sized to be invisible to anyone using the thing
 * honestly and hard to miss for anyone scripting it. Email alone can't do this
 * job: +1 addressing defeats it in one line.
 */
export const IP_DAILY_CAP = Number(process.env.KB_IP_DAILY_CAP ?? 40);

const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const COUNTER_TTL_MS = 60_000;

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

export function hashIp(request: Request): string | null {
  // Vercel sets x-forwarded-for; the client IP is the first entry.
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip');
  if (!ip) return null;
  // Hashed, never stored raw: this is a public unauthenticated endpoint and
  // there is no reason to hold IP addresses.
  return sha256(`${ip}:${process.env.TOOL_DOWNLOAD_TOKEN_SECRET ?? ''}`);
}

// --- response cache ---------------------------------------------------------

export type CachedAnswer = {
  text: string;
  sources: unknown[];
  citedDocIds: string[];
  refusal: { reason: string; nearest: unknown } | null;
};

type CacheEntry = { value: CachedAnswer; expires: number; indexVersion: string | null };
const responseCache = new Map<string, CacheEntry>();

export function cacheKey(question: string): string {
  return sha256(normalizeForHash(question));
}

export function readCache(question: string, indexVersion: string | null): CachedAnswer | null {
  const entry = responseCache.get(cacheKey(question));
  if (!entry) return null;

  // A rebuilt index invalidates every cached answer - otherwise a cached
  // response can keep citing a post that was deleted last night.
  if (entry.expires < Date.now() || entry.indexVersion !== indexVersion) {
    responseCache.delete(cacheKey(question));
    return null;
  }
  return entry.value;
}

export function writeCache(
  question: string,
  value: CachedAnswer,
  indexVersion: string | null,
): void {
  // Cache refusals too. They're free to serve and they are most of the
  // repeated traffic on a public endpoint.
  responseCache.set(cacheKey(question), {
    value,
    expires: Date.now() + CACHE_TTL_MS,
    indexVersion,
  });

  // Crude bound - this is a per-instance map, not a real cache.
  if (responseCache.size > 500) {
    const oldest = [...responseCache.entries()].sort((a, b) => a[1].expires - b[1].expires)[0];
    if (oldest) responseCache.delete(oldest[0]);
  }
}

// --- counters ---------------------------------------------------------------

let dailyCache: { value: number; expires: number } | null = null;

/** Answers served today, org-wide. Cached 60s so it costs ~1 query/minute. */
async function answersToday(): Promise<number> {
  if (dailyCache && dailyCache.expires > Date.now()) return dailyCache.value;
  if (!PROJECT_ID) return 0;

  const [rows] = await bq().query({
    query: `SELECT COUNT(*) n FROM \`${PROJECT_ID}.${DATASET_ID}.ai_avatar_queries\`
            WHERE answered AND DATE(created_at) = CURRENT_DATE()`,
  });
  const value = Number(rows[0]?.n ?? 0);
  dailyCache = { value, expires: Date.now() + COUNTER_TTL_MS };
  return value;
}

async function questionsFromIpToday(ipHash: string): Promise<number> {
  if (!PROJECT_ID) return 0;
  const [rows] = await bq().query({
    query: `SELECT COUNT(*) n FROM \`${PROJECT_ID}.${DATASET_ID}.ai_avatar_queries\`
            WHERE ip_hash = @ipHash AND DATE(created_at) = CURRENT_DATE()`,
    params: { ipHash },
  });
  return Number(rows[0]?.n ?? 0);
}

export type LimitVerdict =
  | { allowed: true }
  | { allowed: false; reason: 'daily_cap' | 'ip_cap'; retryAfterSeconds: number };

/** Seconds until UTC midnight, when both counters reset. */
function untilMidnight(): number {
  const now = new Date();
  const midnight = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
  );
  return Math.max(60, Math.ceil((midnight - now.getTime()) / 1000));
}

export async function checkLimits(ipHash: string | null): Promise<LimitVerdict> {
  const [daily, perIp] = await Promise.all([
    answersToday(),
    ipHash ? questionsFromIpToday(ipHash) : Promise.resolve(0),
  ]);

  // Global fuse first: it protects against distributed abuse that per-IP and
  // per-email limits cannot see.
  if (daily >= DAILY_ANSWER_CAP) {
    return { allowed: false, reason: 'daily_cap', retryAfterSeconds: untilMidnight() };
  }
  if (ipHash && perIp >= IP_DAILY_CAP) {
    return { allowed: false, reason: 'ip_cap', retryAfterSeconds: untilMidnight() };
  }
  return { allowed: true };
}
