import { buildKnowledgeBase } from '@/lib/kb/build';
import { sendSyncReport } from '@/lib/kb/report';

// Weekly knowledge-base sync. Triggered by Vercel Cron (see vercel.ts).
//
// Pulls Ghost + LinkedIn (Apify) + the internal Doc, re-embeds only what
// changed, and republishes the serving artifact.
//
// Runs INCREMENTAL by default: LinkedIn is pulled for the last 30 days and
// delete reconciliation is skipped. A weekly `full` run would tombstone the
// entire back catalogue on any short pull; the monthly full run (a separate
// cron entry) is what reconciles deletes. See lib/kb/sources/linkedin.ts.

export const maxDuration = 300;

/** Must match the monthly entry in vercel.ts exactly, character for character. */
const FULL_RUN_SCHEDULE = '0 4 1 * *';

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  // No secret configured = local dev. In production this must be set, or the
  // sync endpoint is a public button that runs a paid Apify job.
  if (!secret) return process.env.NODE_ENV !== 'production';
  return request.headers.get('authorization') === `Bearer ${secret}`;
}

async function runSync(request: Request) {
  if (!authorized(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Which mode is decided by the SCHEDULE, not a query string. Vercel's
  // documented way to distinguish two crons on the same path is the
  // `x-vercel-cron-schedule` header; query strings in a cron `path` are not a
  // documented behaviour, so relying on one risks the monthly full run
  // silently executing as an incremental (and never reconciling deletes).
  // `?mode=full` still works for manual runs.
  const url = new URL(request.url);
  const schedule = request.headers.get('x-vercel-cron-schedule');
  const full = schedule === FULL_RUN_SCHEDULE || url.searchParams.get('mode') === 'full';
  const lines: string[] = [];

  try {
    const report = await buildKnowledgeBase({
      linkedinRunMode: full ? 'full' : 'incremental',
      onLog: (line) => lines.push(line),
    });

    // Email on every run, not just failures: a sync that silently succeeds
    // while changing nothing for weeks is how a broken cron hides.
    await sendSyncReport({ ok: true, report, lines }).catch((err) =>
      console.error('[kb/sync] report email failed:', err),
    );

    return Response.json({
      ok: true,
      mode: full ? 'full' : 'incremental',
      indexVersion: report.indexVersion,
      sources: report.sources,
      chunksWritten: report.chunksWritten,
      chunksEmbedded: report.chunksEmbedded,
      warnings: report.warnings,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[kb/sync] failed:', err);
    await sendSyncReport({ ok: false, error: message, lines }).catch(() => {});
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}

// Vercel Cron issues GET; POST is for manual runs.
export const GET = runSync;
export const POST = runSync;
