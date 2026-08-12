#!/usr/bin/env node
// -----------------------------------------------------------------------------
// Ask Ansh's AI - build / refresh the knowledge base.
//
//   npx tsx scripts/kb/build.mjs --dry-run    report what would change, write nothing
//   npx tsx scripts/kb/build.mjs              build and write to BigQuery
//   npx tsx scripts/kb/build.mjs --no-embed   write the corpus without embeddings
//   npx tsx scripts/kb/build.mjs --force      ignore hashes, rebuild everything
//   npx tsx scripts/kb/build.mjs --incremental  LinkedIn: last 30 days, no delete reconciliation
//
// Same code path as the weekly sync (lib/kb/build.ts), so what runs every week
// is what was verified by hand up front.
//
// Sources: Ghost Content API, the internal Google Doc, and (once APIFY_TOKEN
// exists) LinkedIn. Run scripts/kb/migrate.mjs first.
// -----------------------------------------------------------------------------

import { loadEnv, ROOT } from './lib/env.mjs';
import { resolve } from 'node:path';

loadEnv();

// The committed snapshot is ALWAYS available as a fallback, even when
// KB_GDOC_ID is set: the live Doc is currently empty, and losing the whole
// internal tier silently would be worse than syncing a stale file loudly.
if (!process.env.KB_GDOC_LOCAL_PATH) {
  process.env.KB_GDOC_LOCAL_PATH = resolve(ROOT, 'Knowledge base - Ansh.md');
}

const { buildKnowledgeBase } = await import('../../lib/kb/build.ts');

const dryRun = process.argv.includes('--dry-run');
const skipEmbedding = process.argv.includes('--no-embed');
const force = process.argv.includes('--force');
// Only full runs reconcile deletes - see lib/kb/sources/linkedin.ts.
const linkedinRunMode = process.argv.includes('--incremental') ? 'incremental' : 'full';

const started = Date.now();
const report = await buildKnowledgeBase({
  dryRun,
  skipEmbedding,
  force,
  linkedinRunMode,
  onLog: (line) => console.log(`  ${line}`),
});

const pad = (x, w = 5) => String(x).padStart(w);

console.log('\n─── sources ' + '─'.repeat(50));
for (const s of report.sources) {
  console.log(
    `  ${s.sourceType.padEnd(10)} fetched ${pad(s.fetched)}   ` +
      `new ${pad(s.added, 4)}  changed ${pad(s.changed, 4)}  ` +
      `unchanged ${pad(s.unchanged, 4)}  deleted ${pad(s.deleted, 4)}`,
  );
}

if (report.excludedFromDoc.length) {
  const byReason = new Map();
  for (const b of report.excludedFromDoc) {
    const e = byReason.get(b.reason) ?? { blocks: 0, chars: 0 };
    e.blocks += 1;
    e.chars += b.charCount;
    byReason.set(b.reason, e);
  }
  console.log('\n─── excluded from the Doc ' + '─'.repeat(36));
  for (const [reason, e] of byReason) {
    console.log(`  ${reason.padEnd(24)} ${pad(e.blocks, 3)} blocks  ${pad(e.chars, 8)} chars`);
  }
}

console.log('\n─── corpus ' + '─'.repeat(51));
console.log(`  chunks total        ${pad(report.chunksTotal)}`);
console.log(`  chunks written      ${pad(report.chunksWritten)}`);
console.log(`  chunks embedded     ${pad(report.chunksEmbedded)}  ${report.embeddingModel ?? '(none)'}`);
console.log(`  pricing redacted    ${pad(report.redactedFigures)} figures`);
console.log(`  est. tokens         ${report.tokensEstimated.toLocaleString()}`);
console.log(`  index_version       ${report.indexVersion}`);

if (report.warnings.length) {
  console.log('\n─── warnings ' + '─'.repeat(49));
  for (const w of report.warnings) {
    console.log(`  ! ${w.replace(/\s+/g, ' ')}`);
  }
}

console.log(`\ndone in ${((Date.now() - started) / 1000).toFixed(1)}s${dryRun ? ' (dry run)' : ''}`);
