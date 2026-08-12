import type { RunMode, SourceDocument, SourceResult } from '../types';

// LinkedIn posts via Apify actor 8xdDFsUQcFTpodoxO.
//
// ~355 posts, and the single largest slice of Ansh's voice in the corpus. They
// were previously pasted into the Google Doc with no URL and no date, which is
// why they're re-pulled from source: the whole point of the rebuild is that
// every chunk can be cited.
//
// ── The window is set HERE, never in the Apify UI ─────────────────────────────
// Delete reconciliation tombstones any document a FULL run didn't return. A
// UI-configured "last 1 week" actor returns ~2 posts, so all ~353 older ones
// would look deleted and the corpus would silently lose its largest source.
// Because deletes are soft, there'd be no error - just a quiet collapse in
// coverage. Driving the window from the API call keeps `full` vs `incremental`
// a property of the sync, not of a setting someone forgot they changed.

/**
 * `8xdDFsUQcFTpodoxO` is an Apify actor **TASK**, not an actor -
 * `domestic_squadron/linkedin-ansh-posts`, built on `harvestapi/linkedin-post-search`.
 * Tasks live under /v2/actor-tasks/, and hitting /v2/acts/ with this ID returns
 * 404 "Actor was not found or access denied" even with a valid token.
 *
 * Running the task rather than the actor is also the right call on the merits:
 * the task carries saved input targeting Ansh's profile
 * (`authorUrls: ["https://www.linkedin.com/in/anshagrawal/"]`, `maxPosts: 1000`,
 * `postedLimit: "any"`). We inherit that instead of reconstructing it here, so
 * the profile URL lives in one place - the Apify UI - and can't drift out of
 * sync with a hardcoded copy.
 */
const TASK_ID = process.env.APIFY_LINKEDIN_ACTOR_ID ?? '8xdDFsUQcFTpodoxO';

/**
 * Incremental window, in the actor's own vocabulary. The saved input uses
 * `postedLimit: "any"` for full history; "month" is the incremental mode -
 * a month rather than a week so three consecutive missed runs still recover.
 *
 * The actor validates this as an enum. Allowed values, from the API:
 *   any | 1h | 24h | week | month | 3months | 6months | year
 * Anything else is a 400 at run-start, which only shows up on the incremental
 * path - full runs omit the field entirely.
 */
const INCREMENTAL_POSTED_LIMIT = 'month';

export function hasApifyToken(): boolean {
  return Boolean(process.env.APIFY_TOKEN);
}

/**
 * Actor output shape.
 *
 * Field names vary between LinkedIn actors, so every field is read through a
 * list of aliases rather than assumed. The actor is private (404s
 * unauthenticated), so this is written defensively until a real run confirms
 * the exact keys - and `assertUsableFields` fails loudly rather than silently
 * ingesting posts with no provenance.
 */
type ApifyPost = Record<string, unknown>;

function firstString(post: ApifyPost, keys: string[]): string | null {
  for (const key of keys) {
    const value = post[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return null;
}

// Confirmed against a real run of harvestapi/linkedin-post-search. Actual keys:
//   type, id, linkedinUrl, content, contentAttributes, author, postedAt,
//   postImages, socialContent, header, entityId, shareUrn, shareLinkedinUrl,
//   engagement, reactionIds, commentIds, query
const TEXT_KEYS = ['content', 'text', 'postText', 'description', 'commentary'];
const URL_KEYS = ['linkedinUrl', 'shareLinkedinUrl', 'url', 'postUrl', 'link', 'permalink'];
const ID_KEYS = ['id', 'entityId', 'shareUrn', 'urn', 'postId'];

/**
 * The profile whose posts belong in the knowledge base.
 *
 * NOT optional. The task runs `linkedin-post-search`, which returns search
 * results - and a real run returned 392 posts of which 5 were other people's
 * (4 from `its-shubho`, 1 from `anish-malhotra-21282492`). Ingesting those would
 * put strangers' words in Ansh's mouth, cited as his, which is precisely the
 * failure this product exists to prevent. Everything not authored by this
 * handle is dropped and counted.
 */
const AUTHOR_HANDLE = (process.env.LINKEDIN_AUTHOR_HANDLE ?? 'anshagrawal').toLowerCase();

function authorHandle(post: ApifyPost): string | null {
  const author = post.author;
  if (!author || typeof author !== 'object') return null;
  const a = author as { publicIdentifier?: string; name?: string };
  return (a.publicIdentifier ?? a.name ?? '').toLowerCase() || null;
}

/**
 * `postedAt` is a nested object - `{ timestamp, date, postedAgoShort, ... }` -
 * not a bare string, so the flat-key lookup used for everything else misses it.
 */
function parsePostedAt(post: ApifyPost): Date | null {
  const raw = post.postedAt;

  if (typeof raw === 'string') return toDate(raw);
  if (raw && typeof raw === 'object') {
    const p = raw as { date?: string; timestamp?: number };
    if (p.date) return toDate(p.date);
    if (typeof p.timestamp === 'number') return new Date(p.timestamp);
  }

  for (const key of ['postedAtISO', 'publishedAt', 'date', 'createdAt']) {
    const value = post[key];
    if (typeof value === 'string') {
      const parsed = toDate(value);
      if (parsed) return parsed;
    }
  }
  return null;
}

function toDate(value: string): Date | null {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Derive a stable id from the post URL when the actor doesn't supply one.
 * LinkedIn activity URLs embed the activity URN, which is stable across edits.
 */
function deriveId(url: string | null, fallbackIndex: number): string {
  if (url) {
    const urn = /activity[:-](\d+)/i.exec(url) ?? /\/posts\/[^/]*-(\d{10,})/.exec(url);
    if (urn) return urn[1];
    return url.replace(/[?#].*$/, '');
  }
  return `index-${fallbackIndex}`;
}

/**
 * Fail loudly if the actor returns posts without the provenance this whole
 * rebuild exists to obtain. Ingesting URL-less LinkedIn posts would recreate
 * the exact problem the old index had.
 */
function assertUsableFields(posts: ApifyPost[], mapped: SourceDocument[]): void {
  if (!posts.length) return;

  const withoutUrl = mapped.filter((d) => !d.sourceUrl).length;
  const withoutDate = mapped.filter((d) => !d.publishedAt).length;

  if (withoutUrl > mapped.length * 0.1) {
    throw new Error(
      `Apify task ${TASK_ID} returned ${withoutUrl}/${mapped.length} posts with no URL. ` +
        `Expected one of: ${URL_KEYS.join(', ')}. Actual keys: ${Object.keys(posts[0]).join(', ')}. ` +
        'Ingesting these would recreate the un-citable corpus the rebuild is replacing.',
    );
  }
  if (withoutDate > mapped.length * 0.5) {
    throw new Error(
      `Apify task ${TASK_ID} returned ${withoutDate}/${mapped.length} posts with no date. ` +
        `Expected postedAt.date or postedAt.timestamp. Actual keys: ${Object.keys(posts[0]).join(', ')}.`,
    );
  }
}

function requireToken(): string {
  const token = process.env.APIFY_TOKEN;
  if (!token) {
    throw new Error(
      'APIFY_TOKEN is not set. Add it to .env.local AND to the VARS array in ' +
        'push-env-to-vercel.sh.',
    );
  }
  return token;
}

/**
 * Start the task, poll to completion, then page through its dataset.
 *
 * Deliberately not `run-sync-get-dataset-items`: that endpoint hard-fails at
 * 300s, and scraping ~355 posts routinely runs longer. A timeout there would
 * look like a failed sync when the run is actually fine, and - worse - a
 * partial result would trip the delete reconciliation.
 */
async function runTask(
  runMode: RunMode,
  onLog?: (line: string) => void,
): Promise<ApifyPost[]> {
  const token = requireToken();
  const log = onLog ?? (() => {});

  // Inherit the task's saved input; override only the window.
  const body: Record<string, unknown> =
    runMode === 'incremental' ? { postedLimit: INCREMENTAL_POSTED_LIMIT } : {};

  const startRes = await fetch(
    `https://api.apify.com/v2/actor-tasks/${TASK_ID}/runs?token=${encodeURIComponent(token)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
  );
  if (!startRes.ok) {
    const text = await startRes.text().catch(() => '');
    throw new Error(`Apify task ${TASK_ID} start failed ${startRes.status}: ${text.slice(0, 300)}`);
  }

  const run = (await startRes.json()).data as { id: string; defaultDatasetId: string };
  log(`apify run ${run.id} started (${runMode})`);

  const deadline = Date.now() + 20 * 60 * 1000;
  let status = 'RUNNING';
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 10_000));
    const poll = await fetch(
      `https://api.apify.com/v2/actor-runs/${run.id}?token=${encodeURIComponent(token)}`,
    );
    const data = (await poll.json()).data as { status: string; stats?: { itemCount?: number } };
    status = data.status;
    if (status !== 'RUNNING' && status !== 'READY') break;
    log(`  apify ${status.toLowerCase()}…`);
  }

  if (status !== 'SUCCEEDED') {
    throw new Error(
      `Apify run ${run.id} finished as ${status}. Refusing to ingest a partial ` +
        'result - a short pull would tombstone the LinkedIn back catalogue.',
    );
  }

  const items: ApifyPost[] = [];
  const limit = 1000;
  for (let offset = 0; ; offset += limit) {
    const page = await fetch(
      `https://api.apify.com/v2/datasets/${run.defaultDatasetId}/items` +
        `?token=${encodeURIComponent(token)}&limit=${limit}&offset=${offset}&clean=true`,
    );
    if (!page.ok) {
      throw new Error(`Apify dataset read failed ${page.status}`);
    }
    const batch = (await page.json()) as ApifyPost[];
    if (!Array.isArray(batch) || batch.length === 0) break;
    items.push(...batch);
    if (batch.length < limit) break;
  }

  log(`apify returned ${items.length} items`);
  return items;
}

export async function fetchLinkedInDocuments(
  runMode: RunMode = 'full',
  onLog?: (line: string) => void,
): Promise<SourceResult> {
  const log = onLog ?? (() => {});
  const raw = await runTask(runMode, onLog);

  // Drop other people's posts BEFORE anything else, and say how many.
  const foreign = raw.filter((p) => {
    const handle = authorHandle(p);
    return handle !== null && handle !== AUTHOR_HANDLE;
  });
  if (foreign.length) {
    const handles = [...new Set(foreign.map(authorHandle))].join(', ');
    log(`dropped ${foreign.length} post(s) by other authors: ${handles}`);
  }
  const posts = raw.filter((p) => authorHandle(p) === AUTHOR_HANDLE);

  let emptyContent = 0;

  const documents: SourceDocument[] = posts
    .map((post, index): SourceDocument | null => {
      const text = firstString(post, TEXT_KEYS);
      if (!text) {
        emptyContent += 1;
        return null;
      }

      const url = firstString(post, URL_KEYS);
      const id = firstString(post, ID_KEYS) ?? deriveId(url, index);
      const publishedAt = parsePostedAt(post);

      // LinkedIn posts have no title. Use the first line, trimmed - it's the
      // hook, so it's the most title-like thing available and it makes the
      // chunker's breadcrumb meaningful.
      const firstLine = text.split('\n').find((l) => l.trim())?.trim() ?? '';
      const title = firstLine.length > 90 ? `${firstLine.slice(0, 87)}…` : firstLine;

      return {
        docId: `linkedin:${id}`,
        sourceType: 'linkedin' as const,
        sourceUrl: url,
        title: title || `LinkedIn post ${id}`,
        author: 'Ansh Agrawal',
        publishedAt,
        updatedAt: publishedAt,
        // Published content, same tier as the blog - they're public and in his
        // voice. Split to a `social` tier only if throwaway takes start
        // outranking considered posts.
        sourceTier: 'published' as const,
        text,
      };
    })
    .filter((d): d is SourceDocument => d !== null);

  if (emptyContent) log(`skipped ${emptyContent} post(s) with no text (image-only)`);

  assertUsableFields(posts, documents);

  return {
    sourceType: 'linkedin',
    runMode,
    documents,
    // Own posts only - the foreign ones must not count toward the count-drop
    // guard, or a search returning more strangers would mask a real shortfall.
    reportedTotal: posts.length,
  };
}
