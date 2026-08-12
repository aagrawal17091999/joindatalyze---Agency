import { type VercelConfig } from '@vercel/config/v1';

// Scheduled jobs.
//
// Two entries, deliberately different modes — this split is load-bearing:
//
//   weekly  (incremental) picks up new Ghost posts and the last 30 days of
//           LinkedIn. It does NOT reconcile deletes, because an incremental
//           pull returns a recent slice and treating everything it didn't
//           return as deleted would tombstone the entire back catalogue.
//
//   monthly (full) pulls the complete history and reconciles deletes. This is
//           the only run allowed to mark anything deleted.
//
// See lib/kb/sources/linkedin.ts for the full reasoning.
export const config: VercelConfig = {
  crons: [
    { path: '/api/kb/sync', schedule: '0 3 * * 1' },
    // Same path as the weekly run. The route tells them apart by the
    // `x-vercel-cron-schedule` header, so this string must stay in sync with
    // FULL_RUN_SCHEDULE in app/api/kb/sync/route.ts.
    { path: '/api/kb/sync', schedule: '0 4 1 * *' },
    // An hour after the weekly sync, so the digest reflects a fresh index.
    { path: '/api/kb/digest', schedule: '0 4 * * 1' },
  ],
};
