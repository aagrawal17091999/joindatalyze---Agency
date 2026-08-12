#!/usr/bin/env node
// -----------------------------------------------------------------------------
// Corpus inspector - the offline harness from docs/ai-avatar-plan.md step 2.
//
//   node scripts/kb/inspect.mjs gdoc      classify the knowledge Doc, report blocks
//   node scripts/kb/inspect.mjs ghost     pull Ghost posts, report tiers + chunking
//   node scripts/kb/inspect.mjs dedup     Doc blocks vs Ghost titles
//   node scripts/kb/inspect.mjs pricing   every chunk flagged as own-pricing
//   node scripts/kb/inspect.mjs chunks    chunk-size distribution across sources
//   node scripts/kb/inspect.mjs search "<question>"   run retrieval + the gate
//   node scripts/kb/inspect.mjs probe     run a fixed question set through the gate
//
// Reads only. Writes nothing to BigQuery, calls no embedding API. The point is
// to see exactly what the corpus looks like BEFORE anything is embedded - the
// old pipeline's problems were all visible at this stage and nobody looked.
//
// Runs the real lib/kb/* TypeScript through Next's compiler via a tiny loader
// so there's no second implementation to keep in sync.
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

const { parseKnowledgeDoc } = await import('../../lib/kb/sources/gdoc.ts');
const { fetchGhostDocuments } = await import('../../lib/kb/sources/ghost.ts');
const { chunkDocument } = await import('../../lib/kb/chunk.ts');
const { normalizeForHash } = await import('../../lib/kb/text.ts');
const { prepareAll, assertNoPricingLeaks } = await import('../../lib/kb/prepare.ts');
const { loadCorpus, retrieve, retrieveAndRerank } = await import('../../lib/kb/retrieve/index.ts');
const { evaluateGate, GATE_CONFIG, isPricingQuestion } = await import('../../lib/kb/gate.ts');
const { hasVoyageKey, embedQuery } = await import('../../lib/kb/embed.ts');
const { readFile } = await import('node:fs/promises');

const command = process.argv[2] ?? 'gdoc';

const n = (x) => String(x).padStart(6);
const pct = (a, b) => (b ? `${((a / b) * 100).toFixed(1)}%` : '-');

async function loadDoc() {
  const markdown = await readFile(process.env.KB_GDOC_LOCAL_PATH, 'utf8');
  return parseKnowledgeDoc(markdown, process.env.KB_GDOC_ID ?? 'local');
}

function chunkAll(documents) {
  return documents.flatMap((doc) => chunkDocument(doc));
}

function distribution(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const at = (p) => sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))];
  return {
    min: sorted[0] ?? 0,
    p50: at(0.5) ?? 0,
    p90: at(0.9) ?? 0,
    max: sorted[sorted.length - 1] ?? 0,
    mean: Math.round(sorted.reduce((s, v) => s + v, 0) / (sorted.length || 1)),
  };
}

// --- commands ----------------------------------------------------------------

async function cmdGdoc() {
  const { documents, excluded } = await loadDoc();
  const keptChars = documents.reduce((s, d) => s + d.text.length, 0);
  const dropChars = excluded.reduce((s, b) => s + b.charCount, 0);
  const total = keptChars + dropChars;

  console.log('KEPT (ingested as internal tier)\n');
  for (const d of documents) {
    console.log(`  ${n(d.text.length)} chars  ${d.title.slice(0, 60).padEnd(60)}  ${d.docId}`);
  }

  console.log('\nEXCLUDED (duplicated elsewhere, re-ingested from the real source)\n');
  const byReason = new Map();
  for (const b of excluded) {
    const e = byReason.get(b.reason) ?? { blocks: 0, chars: 0, first: b };
    e.blocks += 1;
    e.chars += b.charCount;
    byReason.set(b.reason, e);
  }
  for (const [reason, e] of byReason) {
    console.log(
      `  ${n(e.chars)} chars  ${String(e.blocks).padStart(3)} blocks  ${reason}` +
        `  (from line ${e.first.lineStart}: "${e.first.title.slice(0, 40)}")`,
    );
  }

  const chunks = chunkAll(documents);
  console.log(
    `\n  kept     ${n(keptChars)} chars  ${pct(keptChars, total)} of doc  -> ${chunks.length} chunks`,
  );
  console.log(`  excluded ${n(dropChars)} chars  ${pct(dropChars, total)} of doc`);
  console.log(`\n  Old pipeline indexed all of it as 825 unattributed chunks.`);
}

async function cmdGhost() {
  const result = await fetchGhostDocuments();
  const byTier = new Map();
  for (const d of result.documents) {
    byTier.set(d.sourceTier, (byTier.get(d.sourceTier) ?? 0) + 1);
  }

  console.log(`Ghost posts: ${result.documents.length} (API reports ${result.reportedTotal})\n`);
  for (const [tier, count] of byTier) console.log(`  ${n(count)}  ${tier}`);

  const missingUrl = result.documents.filter((d) => !d.sourceUrl);
  const missingDate = result.documents.filter((d) => !d.publishedAt);
  console.log(`\n  ${n(missingUrl.length)}  missing source_url`);
  console.log(`  ${n(missingDate.length)}  missing published_at`);

  const chunks = chunkAll(result.documents);
  const d = distribution(chunks.map((c) => c.text.length));
  console.log(
    `\n  ${chunks.length} chunks - chars min ${d.min} p50 ${d.p50} p90 ${d.p90} max ${d.max} mean ${d.mean}`,
  );

  console.log('\n  Sample tutorial-tier titles:');
  for (const doc of result.documents.filter((x) => x.sourceTier === 'tutorial').slice(0, 4)) {
    console.log(`    - ${doc.title.slice(0, 72)}`);
  }
}

async function cmdDedup() {
  const [{ documents: docBlocks, excluded }, ghost] = await Promise.all([
    loadDoc(),
    fetchGhostDocuments(),
  ]);

  const ghostTitles = new Map(
    ghost.documents.map((d) => [normalizeForHash(d.title), d.title]),
  );

  console.log(`Ghost posts: ${ghost.documents.length}`);
  console.log(`Doc blocks kept: ${docBlocks.length}, excluded: ${excluded.length}\n`);

  const leaked = docBlocks.filter((d) => ghostTitles.has(normalizeForHash(d.title)));
  console.log(
    leaked.length
      ? `LEAK - ${leaked.length} kept Doc blocks share a Ghost title:`
      : 'No kept Doc block matches a Ghost post title. Clean split.',
  );
  for (const d of leaked) console.log(`  ! ${d.title.slice(0, 78)}`);

  const caught = excluded.filter((b) => ghostTitles.has(normalizeForHash(b.title)));
  console.log(
    `\nExcluded blocks that match a Ghost title exactly: ${caught.length}` +
      ` (these are the duplicates the strip removes)`,
  );
  for (const b of caught.slice(0, 8)) console.log(`  - ${b.title.slice(0, 78)}`);
  if (caught.length > 8) console.log(`  … and ${caught.length - 8} more`);
}

async function cmdPricing() {
  const { documents } = await loadDoc();
  let ghostDocs = [];
  try {
    ghostDocs = (await fetchGhostDocuments()).documents;
  } catch (err) {
    console.log(`(skipping Ghost: ${err.message.split('\n')[0]})\n`);
  }

  const prepared = prepareAll([...documents, ...ghostDocs]);
  const withRedactions = prepared.filter((d) => d.redactions.length);
  const totalFigures = withRedactions.reduce(
    (s, d) => s + d.redactions.reduce((t, r) => t + r.figures.length, 0),
    0,
  );

  console.log(
    `REDACTED - ${totalFigures} figures across ${withRedactions.length} of ${prepared.length} documents\n`,
  );
  for (const doc of withRedactions) {
    console.log(`  ${doc.title.slice(0, 66)}  [${doc.sourceTier}]`);
    for (const r of doc.redactions) {
      console.log(`     - ${r.sentence.replace(/\s+/g, ' ').slice(0, 104)}`);
    }
    console.log('');
  }

  // Everything that still holds a currency figure but was deliberately kept.
  const survivors = [];
  for (const doc of prepared) {
    for (const chunk of doc.chunks) {
      for (const sent of chunk.text.split(/(?<=[.!?])\s+|\n+/)) {
        if (/[$₹€£]\s?\d/.test(sent) && !sent.includes('[pricing not shared here]')) {
          survivors.push([doc.sourceTier, sent.replace(/\s+/g, ' ').trim()]);
        }
      }
    }
  }
  console.log(`KEPT - ${survivors.length} sentences with figures that are NOT own-pricing:`);
  for (const [tier, sent] of survivors.slice(0, 10)) {
    console.log(`  [${tier}] ${sent.slice(0, 100)}`);
  }
  if (survivors.length > 10) console.log(`  … and ${survivors.length - 10} more`);

  try {
    assertNoPricingLeaks(prepared);
    console.log('\n  assertNoPricingLeaks: PASS - no own-pricing survives redaction.');
  } catch (err) {
    console.log(`\n  assertNoPricingLeaks: FAIL\n${err.message}`);
    process.exitCode = 1;
  }
}

async function cmdChunks() {
  const { documents: docBlocks } = await loadDoc();
  let ghostDocs = [];
  try {
    ghostDocs = (await fetchGhostDocuments()).documents;
  } catch (err) {
    console.log(`(skipping Ghost: ${err.message.split('\n')[0]})\n`);
  }

  for (const [label, docs] of [
    ['gdoc (internal)', docBlocks],
    ['ghost (published+tutorial)', ghostDocs],
  ]) {
    if (!docs.length) continue;
    const chunks = chunkAll(docs);
    const d = distribution(chunks.map((c) => c.text.length));
    console.log(
      `${label.padEnd(28)} ${String(docs.length).padStart(4)} docs  ` +
        `${String(chunks.length).padStart(5)} chunks  ` +
        `chars min ${d.min} p50 ${d.p50} p90 ${d.p90} max ${d.max}`,
    );
  }

  const all = chunkAll([...docBlocks, ...ghostDocs]);
  const ids = new Set(all.map((c) => c.chunkId));
  console.log(`\n  total chunks     ${all.length}`);
  console.log(`  unique chunk ids ${ids.size}  ${ids.size === all.length ? '(ok)' : '(COLLISION)'}`);
  console.log(`  est. tokens      ${all.reduce((s, c) => s + c.tokenCount, 0).toLocaleString()}`);
  const noBreadcrumb = all.filter((c) => !c.headingPath.trim());
  console.log(`  missing breadcrumb ${noBreadcrumb.length}`);
}


// --- retrieval ---------------------------------------------------------------

let corpusCache = null;
async function corpus() {
  if (!corpusCache) corpusCache = await loadCorpus();
  return corpusCache;
}

async function runQuery(c, question) {
  if (!hasVoyageKey()) {
    const results = retrieve(c, question, {});
    return { results, decision: evaluateGate(results, GATE_CONFIG, 'fused') };
  }
  const queryEmbedding = await embedQuery(question);
  const { documents, scoreKind } = await retrieveAndRerank(c, question, { queryEmbedding });
  return { results: documents, decision: evaluateGate(documents, GATE_CONFIG, scoreKind) };
}

async function cmdSearch() {
  const question = process.argv.slice(3).join(' ');
  if (!question) {
    console.error('Usage: inspect.mjs search "how do I set up Mixpanel?"');
    process.exit(1);
  }

  const c = await corpus();
  if (!hasVoyageKey()) {
    console.log('! VOYAGE_API_KEY not set - LEXICAL ONLY (BM25). Dense recall is absent,');
    console.log('  so paraphrased questions will under-retrieve. Dev mode, not serving mode.\n');
  }

  const { results, decision } = await runQuery(c, question);
  console.log(`Q: ${question}`);
  console.log(`   pricing question: ${isPricingQuestion(question)}\n`);

  results.forEach((r, i) => {
    console.log(
      `  ${i + 1}. ${r.score.toFixed(5)} (raw ${r.rawScore.toFixed(5)}) ` +
        `[${r.document.sourceTier}] [${r.matchedBy.join('+') || 'none'}]`,
    );
    console.log(`     ${r.document.title.slice(0, 74)}`);
    console.log(`     ${r.document.sourceUrl ?? '(internal - no link)'}`);
    console.log(`     ↳ ${r.bestChunk.headingPath.slice(0, 74)}`);
  });
  if (!results.length) console.log('  (no results)');

  console.log(
    `\n  GATE: ${decision.answer ? 'ANSWER' : `REFUSE (${decision.reason})`}` +
      `  top=${decision.topScore.toFixed(5)} gap=${decision.scoreGap.toFixed(5)}` +
      `  [tau=${GATE_CONFIG.tau} delta=${GATE_CONFIG.delta}]`,
  );
  if (!decision.answer && decision.nearest) {
    console.log(`  nearest: ${decision.nearest.document.title.slice(0, 66)}`);
  }
}

// Questions chosen to exercise the three cases that matter: answerable,
// adjacent-but-absent (the discriminating set), and far off-topic.
const PROBE_SET = [
  ['answerable', 'How do I set up Mixpanel the right way?'],
  ['answerable', 'What is a super property?'],
  ['answerable', 'How do I create an event tracking plan?'],
  ['answerable', 'What is identity stitching and why does it break?'],
  ['answerable', 'How should I think about incrementality testing for D2C?'],
  ['answerable', 'Why are my branded search conversions overstated?'],
  ['answerable', 'What is Lexicon in Mixpanel?'],
  ['answerable', 'How do I measure retention properly?'],
  ['adjacent-absent', 'How do I configure Snowflake row-level security?'],
  ['adjacent-absent', 'What is the best dbt incremental model strategy?'],
  ['adjacent-absent', 'How do I set up Braze journey orchestration?'],
  ['adjacent-absent', 'How do I shard a Postgres database for multi-tenancy?'],
  ['off-topic', 'What is a good recipe for carbonara?'],
  ['off-topic', 'Who won the 2022 World Cup?'],
  ['pricing', 'How much does Datalyze cost?'],
];

async function cmdProbe() {
  const c = await corpus();
  if (!hasVoyageKey()) {
    console.log('! LEXICAL ONLY - no VOYAGE_API_KEY. Treat answerable-question');
    console.log('  misses as expected: BM25 alone cannot match paraphrases.\n');
  }

  const buckets = new Map();
  for (const [kind, question] of PROBE_SET) {
    const { results, decision } = await runQuery(c, question);
    const verdict = decision.answer ? 'ANSWER' : `refuse:${decision.reason}`;
    const b = buckets.get(kind) ?? { answered: 0, total: 0 };
    b.answered += decision.answer ? 1 : 0;
    b.total += 1;
    buckets.set(kind, b);

    console.log(
      `  ${kind.padEnd(16)} ${verdict.padEnd(20)} top=${decision.topScore.toFixed(4)}  ` +
        `${question.slice(0, 44)}`,
    );
    console.log(
      `  ${' '.repeat(16)} └─ ${(results[0]?.document.title ?? '(nothing)').slice(0, 68)}`,
    );
  }

  console.log('\n  summary (answered / total):');
  for (const [kind, b] of buckets) {
    // Pricing questions SHOULD answer: the figures are redacted at ingest, so
    // the model gets the engagement model without numbers and routes to the
    // booking CTA (plan §2.6). A flat refusal there would waste the highest-
    // intent question in the product.
    const shouldAnswer = kind === 'answerable' || kind === 'pricing';
    const good = shouldAnswer ? b.answered : b.total - b.answered;
    console.log(
      `    ${kind.padEnd(16)} ${b.answered}/${b.total} answered   ${good}/${b.total} desired`,
    );
  }
  console.log(`\n  tau=${GATE_CONFIG.tau} delta=${GATE_CONFIG.delta} calibrated=${GATE_CONFIG.calibratedAt?.slice(0,10) ?? 'NO'}`);
  console.log('  For answerable: higher is better. For everything else a leak is the');
  console.log('  failure this product exists to prevent.');
}

const COMMANDS = {
  gdoc: cmdGdoc,
  ghost: cmdGhost,
  dedup: cmdDedup,
  pricing: cmdPricing,
  chunks: cmdChunks,
  search: cmdSearch,
  probe: cmdProbe,
};

const run = COMMANDS[command];
if (!run) {
  console.error(`Unknown command "${command}". One of: ${Object.keys(COMMANDS).join(', ')}`);
  process.exit(1);
}

await run();
