import type { BuildReport } from './build';

// Sync reporting.
//
// The failure mode this exists for is silence: a cron that dies, or one that
// runs fine but stops seeing new content, looks identical to a healthy one
// unless something says so out loud every week.

const FROM = process.env.RESEND_FROM_EMAIL;
const TO = process.env.KB_SYNC_REPORT_TO ?? process.env.RESEND_FROM_EMAIL;

type Input =
  | { ok: true; report: BuildReport; lines: string[] }
  | { ok: false; error: string; lines: string[] };

export async function sendSyncReport(input: Input): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key || !FROM || !TO) return;

  const subject = input.ok
    ? subjectFor(input.report)
    : 'KB sync FAILED';

  const body = input.ok ? successBody(input.report) : `Sync failed:\n\n${input.error}`;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: FROM,
      to: [TO],
      subject,
      text: `${body}\n\n--- log ---\n${input.lines.join('\n')}`,
    }),
  });
}

function subjectFor(report: BuildReport): string {
  const added = report.sources.reduce((s, x) => s + x.added, 0);
  const changed = report.sources.reduce((s, x) => s + x.changed, 0);

  if (report.warnings.length) return `KB sync OK (${added} new, ${changed} changed) - ${report.warnings.length} warning(s)`;
  if (added === 0 && changed === 0) return 'KB sync OK - nothing new this week';
  return `KB sync OK - ${added} new, ${changed} changed`;
}

function successBody(report: BuildReport): string {
  const rows = report.sources
    .map(
      (s) =>
        `  ${s.sourceType.padEnd(10)} fetched ${String(s.fetched).padStart(4)}  ` +
        `new ${String(s.added).padStart(3)}  changed ${String(s.changed).padStart(3)}  ` +
        `unchanged ${String(s.unchanged).padStart(4)}  deleted ${String(s.deleted).padStart(3)}`,
    )
    .join('\n');

  const warnings = report.warnings.length
    ? `\n\nWARNINGS\n${report.warnings.map((w) => `  ! ${w}`).join('\n')}`
    : '';

  return [
    `index_version   ${report.indexVersion}`,
    `chunks written  ${report.chunksWritten} of ${report.chunksTotal}`,
    `chunks embedded ${report.chunksEmbedded} (${report.embeddingModel ?? 'none'})`,
    `pricing redacted ${report.redactedFigures} figures`,
    '',
    'SOURCES',
    rows,
    warnings,
  ].join('\n');
}
