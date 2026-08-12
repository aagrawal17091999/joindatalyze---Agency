#!/usr/bin/env node
// -----------------------------------------------------------------------------
// Ask Ansh's AI - verify the knowledge base in BigQuery.
//
//   npx tsx scripts/kb/verify.mjs
//
// Read-only assertions over what actually landed. Run after every build and
// after the weekly sync. The checks are chosen to catch the failure modes that
// are otherwise SILENT: missing provenance (breaks citations), chunk-id
// collisions (breaks citation anchors), unembedded chunks (breaks retrieval
// with no error), and any surviving rate card.
// -----------------------------------------------------------------------------

import { loadEnv } from './lib/env.mjs';
import { BigQuery } from '@google-cloud/bigquery';
loadEnv();
const bq = new BigQuery({ projectId: process.env.BIGQUERY_PROJECT_ID, credentials: JSON.parse(process.env.BIGQUERY_CREDENTIALS_JSON) });
const D = `${process.env.BIGQUERY_PROJECT_ID}.${process.env.BIGQUERY_DATASET_ID}`;
const q = async (sql) => (await bq.query({ query: sql }))[0];

console.log('- documents by source/tier -');
for (const r of await q(`SELECT source_type, source_tier, COUNT(*) n, SUM(chunk_count) chunks FROM \`${D}.kb_documents\` WHERE status='active' GROUP BY 1,2 ORDER BY 1,2`))
  console.log(`  ${r.source_type.padEnd(9)} ${r.source_tier.padEnd(10)} ${String(r.n).padStart(4)} docs  ${String(r.chunks).padStart(5)} chunks`);

console.log('\n- provenance completeness (the whole point of the rebuild) -');
const [p] = await q(`SELECT COUNT(*) total,
  COUNTIF(source_url IS NOT NULL) with_url,
  COUNTIF(published_at IS NOT NULL) with_date,
  COUNTIF(source_url IS NULL AND source_type!='gdoc') bad
  FROM \`${D}.kb_documents\` WHERE status='active'`);
console.log(`  ${p.with_url}/${p.total} have a source_url   ${p.with_date}/${p.total} have published_at   ${p.bad} non-gdoc docs missing a URL`);

console.log('\n- chunk integrity -');
const [c] = await q(`SELECT COUNT(*) n, COUNT(DISTINCT chunk_id) uniq, COUNTIF(heading_path IS NULL OR heading_path='') no_crumb,
  COUNTIF(ARRAY_LENGTH(embedding)=0) unembedded, MIN(LENGTH(text)) min_len, MAX(LENGTH(text)) max_len,
  CAST(APPROX_QUANTILES(LENGTH(text),2)[OFFSET(1)] AS INT64) p50
  FROM \`${D}.kb_chunks\` WHERE status='active'`);
console.log(`  ${c.n} chunks, ${c.uniq} unique ids ${c.n===c.uniq?'(ok)':'(COLLISION)'}`);
console.log(`  missing breadcrumb: ${c.no_crumb}   unembedded: ${c.unembedded}`);
console.log(`  text chars: min ${c.min_len}  p50 ${c.p50}  max ${c.max_len}`);

console.log('\n- pricing: does the rate card survive anywhere? -');
const leaks = await q(`SELECT doc_id, SUBSTR(text,1,90) t FROM \`${D}.kb_chunks\`
  WHERE REGEXP_CONTAINS(text, r'(?i)(pricing\\s*:|engagements? run|per engagement).{0,40}[$₹]\\s?[0-9]') LIMIT 5`);
console.log(leaks.length ? `  LEAK (${leaks.length}):` : '  none - rate cards are absent from the corpus.');
for (const l of leaks) console.log(`   ! ${l.doc_id}: ${l.t}`);

console.log('\n- redaction markers present -');
for (const r of await q(`SELECT doc_id, SUBSTR(text, GREATEST(1, STRPOS(text,'[pricing not shared here]')-55), 130) t
  FROM \`${D}.kb_chunks\` WHERE text LIKE '%[pricing not shared here]%' LIMIT 4`))
  console.log(`   ${r.t.replace(/\s+/g,' ').trim()}`);
