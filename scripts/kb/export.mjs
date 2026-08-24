#!/usr/bin/env node
// -----------------------------------------------------------------------------
// Export the live knowledge base as a single HTML/PDF snapshot.
//
//   node scripts/kb/export.mjs                    -> kb-export/ (HTML + PDF)
//   node scripts/kb/export.mjs --source ghost     -> one tier only (repeatable)
//   node scripts/kb/export.mjs --no-pdf           -> HTML only
//
// BigQuery (kb_documents, status='active') is the source of truth, so this is
// whatever the avatar can actually answer from right now - not the committed
// markdown snapshots, which are only one input to the build.
//
// PDF is printed with headless Chrome; no extra dependency to keep current.
// -----------------------------------------------------------------------------

import { loadEnv, ROOT } from './lib/env.mjs';
import { BigQuery } from '@google-cloud/bigquery';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, join } from 'node:path';

loadEnv();

const argv = process.argv.slice(2);
const wantPdf = !argv.includes('--no-pdf');
const sources = argv.flatMap((a, i) => (a === '--source' ? [argv[i + 1]] : [])).filter(Boolean);

const PROJECT_ID = process.env.BIGQUERY_PROJECT_ID;
const DATASET_ID = process.env.BIGQUERY_DATASET_ID || 'datalyze';
if (!PROJECT_ID) throw new Error('BIGQUERY_PROJECT_ID is not configured');

const bq = new BigQuery({
  projectId: PROJECT_ID,
  credentials: process.env.BIGQUERY_CREDENTIALS_JSON
    ? JSON.parse(process.env.BIGQUERY_CREDENTIALS_JSON)
    : undefined,
});

const where = sources.length ? 'AND source_type IN UNNEST(@sources)' : '';
const [docs] = await bq.query({
  query: `SELECT doc_id, source_type, source_tier, source_url, title, author,
                 published_at, updated_at, last_seen_at, token_count, chunk_count,
                 contains_pricing, full_text
          FROM \`${PROJECT_ID}.${DATASET_ID}.kb_documents\`
          WHERE status = 'active' ${where}
          ORDER BY source_type, published_at DESC NULLS LAST, title`,
  params: sources.length ? { sources } : {},
});

const [[meta]] = await bq.query({
  query: `SELECT MAX(last_seen_at) AS last_sync, COUNT(*) AS docs, SUM(token_count) AS tokens
          FROM \`${PROJECT_ID}.${DATASET_ID}.kb_documents\` WHERE status = 'active'`,
});

// --- rendering ---------------------------------------------------------------

const esc = (s) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const ts = (v) => (v?.value ? new Date(v.value) : v instanceof Date ? v : null);
const day = (v) => (ts(v) ? ts(v).toISOString().slice(0, 10) : '—');

// Deliberately small markdown subset: the corpus is headings, lists, links and
// paragraphs, and a full parser would be a dependency to keep alive for that.
function md(text) {
  const inline = (s) =>
    esc(s)
      .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2">$1</a>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|\W)\*([^*\n]+)\*(?=\W|$)/g, '$1<em>$2</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');

  const out = [];
  let list = null;
  const closeList = () => { if (list) { out.push(`</${list}>`); list = null; } };

  for (const raw of String(text ?? '').split('\n')) {
    const line = raw.trimEnd();
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    const ul = line.match(/^\s*[-*•]\s+(.*)$/);
    const ol = line.match(/^\s*\d+[.)]\s+(.*)$/);

    if (h) { closeList(); out.push(`<h${Math.min(h[1].length + 2, 6)}>${inline(h[2])}</h${Math.min(h[1].length + 2, 6)}>`); }
    else if (ul) { if (list !== 'ul') { closeList(); out.push('<ul>'); list = 'ul'; } out.push(`<li>${inline(ul[1])}</li>`); }
    else if (ol) { if (list !== 'ol') { closeList(); out.push('<ol>'); list = 'ol'; } out.push(`<li>${inline(ol[1])}</li>`); }
    else if (!line) closeList();
    else { closeList(); out.push(`<p>${inline(line)}</p>`); }
  }
  closeList();
  return out.join('\n');
}

const TIER_LABEL = {
  ghost: 'Blog — datalyze.in/blog (Ghost)',
  linkedin: 'LinkedIn posts',
  gdoc: 'Internal knowledge doc',
};

const groups = new Map();
for (const d of docs) {
  if (!groups.has(d.source_type)) groups.set(d.source_type, []);
  groups.get(d.source_type).push(d);
}

const generated = new Date().toISOString().slice(0, 10);
const anchor = (id) => id.replace(/[^a-zA-Z0-9]+/g, '-');

const toc = [...groups]
  .map(
    ([source, list]) => `<h3>${esc(TIER_LABEL[source] ?? source)} <span class="muted">(${list.length})</span></h3>
    <ol class="toc">${list
      .map((d) => `<li><a href="#${anchor(d.doc_id)}">${esc(d.title)}</a> <span class="muted">${day(d.published_at)}</span></li>`)
      .join('')}</ol>`,
  )
  .join('\n');

const body = [...groups]
  .map(
    ([source, list]) => `<section class="tier"><h1 class="tier-title">${esc(TIER_LABEL[source] ?? source)}</h1>
    ${list
      .map(
        (d) => `<article id="${anchor(d.doc_id)}">
        <h2>${esc(d.title)}</h2>
        <p class="meta">${esc(d.source_tier)} · ${day(d.published_at)}${d.author ? ` · ${esc(d.author)}` : ''} · ${d.token_count?.toLocaleString?.() ?? d.token_count} tokens · ${d.chunk_count} chunk(s)${d.contains_pricing ? ' · pricing redacted' : ''}
        ${d.source_url ? `<br><a href="${esc(d.source_url)}">${esc(d.source_url)}</a>` : ''}</p>
        ${md(d.full_text)}
      </article>`,
      )
      .join('\n')}</section>`,
  )
  .join('\n');

const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>Datalyze Knowledge Base — ${generated}</title>
<style>
  @page { size: A4; margin: 18mm 16mm; }
  body { font: 10.5pt/1.55 -apple-system, "Helvetica Neue", Arial, sans-serif; color: #14181f; max-width: 190mm; margin: 0 auto; }
  h1.cover { font-size: 26pt; margin: 0 0 6px; letter-spacing: -0.02em; }
  .cover-meta { color: #5b6470; font-size: 10pt; }
  .tier { page-break-before: always; }
  .tier-title { font-size: 18pt; border-bottom: 2px solid #14181f; padding-bottom: 6px; margin: 0 0 18px; }
  article { page-break-inside: auto; margin: 0 0 26px; padding-bottom: 18px; border-bottom: 1px solid #e6e9ee; }
  article h2 { font-size: 13.5pt; margin: 0 0 4px; page-break-after: avoid; }
  h3, h4, h5, h6 { page-break-after: avoid; margin: 14px 0 4px; font-size: 11pt; }
  .meta { color: #6b7480; font-size: 8.5pt; margin: 0 0 10px; }
  .muted { color: #8b939e; }
  p { margin: 0 0 8px; }
  ul, ol { margin: 0 0 8px 18px; padding: 0; }
  li { margin: 0 0 3px; }
  a { color: #1a4fd6; text-decoration: none; word-break: break-word; }
  code { background: #f2f4f7; padding: 0 3px; border-radius: 3px; font-size: 9.5pt; }
  ol.toc { font-size: 9.5pt; column-count: 2; column-gap: 14mm; margin-left: 16px; }
  ol.toc li { break-inside: avoid; }
  table.summary { border-collapse: collapse; font-size: 10pt; margin: 16px 0; }
  table.summary td { padding: 3px 16px 3px 0; }
</style></head><body>
<h1 class="cover">Datalyze — Knowledge Base</h1>
<p class="cover-meta">Live snapshot of the corpus behind Ask Ansh's AI · exported ${generated}</p>
<table class="summary">
  <tr><td>Documents</td><td><strong>${docs.length.toLocaleString()}</strong>${sources.length ? ` (filtered: ${esc(sources.join(', '))})` : ''}</td></tr>
  <tr><td>Tokens</td><td><strong>${Number(meta.tokens ?? 0).toLocaleString()}</strong> across ${Number(meta.docs ?? 0).toLocaleString()} active documents</td></tr>
  <tr><td>Last sync</td><td><strong>${day(meta.last_sync)}</strong></td></tr>
  <tr><td>Source of truth</td><td>BigQuery <code>${esc(PROJECT_ID)}.${esc(DATASET_ID)}.kb_documents</code></td></tr>
</table>
<h2>Contents</h2>
${toc}
${body}
</body></html>`;

const outDir = resolve(ROOT, 'kb-export');
mkdirSync(outDir, { recursive: true });
const base = `datalyze-knowledge-base-${generated}`;
const htmlPath = join(outDir, `${base}.html`);
writeFileSync(htmlPath, html);
console.log(`HTML  ${htmlPath}  (${docs.length} documents)`);

if (wantPdf) {
  const chrome = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  ].find((p) => existsSync(p));

  if (!chrome) {
    console.log('PDF   skipped - no Chrome/Chromium found. Print the HTML from any browser.');
  } else {
    const pdfPath = join(outDir, `${base}.pdf`);
    execFileSync(chrome, [
      '--headless',
      '--disable-gpu',
      '--no-pdf-header-footer',
      `--print-to-pdf=${pdfPath}`,
      `file://${htmlPath}`,
    ], { stdio: 'ignore' });
    console.log(`PDF   ${pdfPath}`);
  }
}
