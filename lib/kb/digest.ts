import { BigQuery } from '@google-cloud/bigquery';
import { embedQuery, cosineSimilarity } from './embed';
import { isPricingQuestion } from './gate';

// The refused-query digest.
//
// This is the actual long-term payoff of the whole feature. A question two
// strangers independently asked, that Ansh has not written about, is a
// validated content brief - better signal than any keyword tool, because
// someone typed it while genuinely wanting the answer.
//
// Clustered before sending. The same question arrives in fifteen phrasings and
// the raw list reads as noise; grouping is what turns it into a roadmap.

const PROJECT_ID = process.env.BIGQUERY_PROJECT_ID;
const DATASET_ID = process.env.BIGQUERY_DATASET_ID || 'datalyze';

/** Above this cosine, two refused questions are treated as the same ask. */
const CLUSTER_THRESHOLD = Number(process.env.KB_DIGEST_CLUSTER_THRESHOLD ?? 0.82);
/** Cap the embedding spend - the tail is single-occurrence noise anyway. */
const MAX_QUESTIONS = 120;

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

export type RefusedCluster = {
  /** The most-asked phrasing in the cluster - the one to write for. */
  representative: string;
  askers: number;
  variants: string[];
  avgTopScore: number;
};

export type Digest = {
  windowDays: number;
  totalQueries: number;
  answered: number;
  refused: number;
  refusalRate: number;
  p95LatencyMs: number | null;
  clusters: RefusedCluster[];
};

export async function buildDigest(windowDays = 7): Promise<Digest> {
  if (!PROJECT_ID) throw new Error('BIGQUERY_PROJECT_ID is not configured');
  const T = `\`${PROJECT_ID}.${DATASET_ID}.ai_avatar_queries\``;

  const [[totals]] = await bq().query({
    query: `
      SELECT COUNT(*) total, COUNTIF(answered) answered, COUNTIF(NOT answered) refused,
             CAST(APPROX_QUANTILES(latency_total_ms, 100)[OFFSET(95)] AS INT64) p95
      FROM ${T}
      WHERE created_at > TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL @days DAY)`,
    params: { days: windowDays },
  });

  // Only genuine coverage gaps. A quota_exhausted or ip_cap refusal says
  // nothing about content, and including it would pollute the roadmap.
  const [rows] = await bq().query({
    query: `
      SELECT question_normalized q, COUNT(*) n, AVG(top_score) avg_score,
             ANY_VALUE(question) sample
      FROM ${T}
      WHERE NOT answered
        AND refusal_reason IN ('below_threshold', 'flat_gap', 'insufficient_context')
        AND created_at > TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL @days DAY)
      GROUP BY q
      ORDER BY n DESC
      LIMIT @limit`,
    params: { days: windowDays, limit: MAX_QUESTIONS },
  });

  const clusters = await clusterQuestions(
    rows
      .map((r: Record<string, unknown>) => ({
        text: (r.sample as string) ?? (r.q as string),
        count: Number(r.n),
        score: Number(r.avg_score ?? 0),
      }))
      // Pricing questions refuse BY DESIGN - they are a product decision, not a
      // coverage gap. Leaving them in would put "how much does it cost" at the
      // top of the content roadmap every single week, forever, and no blog post
      // would ever resolve it.
      .filter((c) => !isPricingQuestion(c.text)),
  );

  const total = Number(totals?.total ?? 0);
  return {
    windowDays,
    totalQueries: total,
    answered: Number(totals?.answered ?? 0),
    refused: Number(totals?.refused ?? 0),
    refusalRate: total ? Number(totals?.refused ?? 0) / total : 0,
    p95LatencyMs: totals?.p95 ? Number(totals.p95) : null,
    clusters,
  };
}

type Candidate = { text: string; count: number; score: number };

/**
 * Greedy single-pass clustering. Questions arrive sorted by frequency, so the
 * first member of each cluster is its most-asked phrasing and becomes the
 * representative - which is also the one worth writing for.
 */
async function clusterQuestions(candidates: Candidate[]): Promise<RefusedCluster[]> {
  if (!candidates.length) return [];

  const embedded: Array<Candidate & { vector: number[] }> = [];
  for (const c of candidates) {
    embedded.push({ ...c, vector: await embedQuery(c.text) });
  }

  const clusters: Array<{ seed: (typeof embedded)[0]; members: Candidate[] }> = [];

  for (const item of embedded) {
    const match = clusters.find(
      (c) => cosineSimilarity(c.seed.vector, item.vector) >= CLUSTER_THRESHOLD,
    );
    if (match) match.members.push(item);
    else clusters.push({ seed: item, members: [item] });
  }

  return clusters
    .map((c) => ({
      representative: c.seed.text,
      askers: c.members.reduce((s, m) => s + m.count, 0),
      variants: c.members.slice(1).map((m) => m.text),
      avgTopScore: c.members.reduce((s, m) => s + m.score, 0) / c.members.length,
    }))
    .sort((a, b) => b.askers - a.askers);
}

export function formatDigest(digest: Digest): { subject: string; text: string } {
  // n >= 2 is the point: one person asking is curiosity, two independently
  // asking the same thing is demand.
  const briefs = digest.clusters.filter((c) => c.askers >= 2);
  const singles = digest.clusters.filter((c) => c.askers === 1);

  const subject = briefs.length
    ? `Ask Ansh: ${briefs.length} content brief${briefs.length === 1 ? '' : 's'} this week`
    : `Ask Ansh: ${digest.totalQueries} questions, nothing asked twice`;

  const lines: string[] = [
    `Last ${digest.windowDays} days`,
    `  ${digest.totalQueries} questions - ${digest.answered} answered, ${digest.refused} refused ` +
      `(${(digest.refusalRate * 100).toFixed(0)}% refusal rate)`,
    digest.p95LatencyMs ? `  p95 latency ${digest.p95LatencyMs}ms` : '',
    '',
    // A sudden DROP is the dangerous direction - it means the gate broke and
    // the thing is answering questions it shouldn't.
    'Watch the refusal rate for a sudden fall, not a rise: falling means the gate broke.',
    '',
  ];

  if (briefs.length) {
    lines.push('── CONTENT BRIEFS (asked by 2+ people, not covered) ──', '');
    briefs.forEach((c, i) => {
      lines.push(`${i + 1}. ${c.representative}   [${c.askers} askers, best match ${c.avgTopScore.toFixed(2)}]`);
      for (const v of c.variants.slice(0, 4)) lines.push(`     also asked: ${v}`);
      lines.push('');
    });
  } else {
    lines.push('No question was asked twice this week. Nothing to write yet.', '');
  }

  if (singles.length) {
    lines.push(`── ASKED ONCE (${singles.length}) ──`, '');
    for (const c of singles.slice(0, 15)) lines.push(`  ${c.representative}`);
  }

  return { subject, text: lines.join('\n') };
}

export async function sendDigest(digest: Digest): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.KB_SYNC_REPORT_TO ?? from;
  if (!key || !from || !to) return false;

  const { subject, text } = formatDigest(digest);
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [to], subject, text }),
  });
  return res.ok;
}
