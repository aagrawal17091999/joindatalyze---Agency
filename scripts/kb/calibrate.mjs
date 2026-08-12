#!/usr/bin/env node
// -----------------------------------------------------------------------------
// Threshold calibration — docs/ai-avatar-plan.md §2.4, step 3.
//
//   npx tsx scripts/kb/calibrate.mjs            generate the set, sweep, report
//   npx tsx scripts/kb/calibrate.mjs --reuse    reuse the saved question set
//
// The question set is GENERATED, not hand-written, so this costs you an
// afternoon of compute rather than an afternoon of writing:
//
//   answerable   — Claude reads a real chunk and writes the question a VISITOR
//                  would type to reach it (not a summary of the chunk).
//   adjacent     — analytics-shaped questions the corpus provably doesn't cover.
//                  This is the discriminating set; weight it heaviest.
//   off-topic    — smoke test. Cheap to pass, near-zero information.
//
// Sweeping picks the LOWEST tau at which zero non-answerable questions get
// through, then steps up one notch for margin. Deliberately NOT F1: F1 treats a
// wrong answer and a missed answer as equally bad, and for this product they
// are not. Coverage is the price paid for zero leaks, and it is reported, not
// optimised.
//
// Writes docs/kb-calibration.json — commit it. It is the record of what tau was
// set to, against which index_version, and on what evidence.
// -----------------------------------------------------------------------------

import { loadEnv, ROOT } from './lib/env.mjs';
import { resolve } from 'node:path';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

loadEnv();
if (!process.env.KB_GDOC_LOCAL_PATH) {
  process.env.KB_GDOC_LOCAL_PATH = resolve(ROOT, 'Knowledge base - Ansh.md');
}

const { loadCorpus, retrieveAndRerank } = await import('../../lib/kb/retrieve/index.ts');
const { embedQuery } = await import('../../lib/kb/embed.ts');

const SET_PATH = resolve(ROOT, 'docs/kb-calibration-questions.json');
const OUT_PATH = resolve(ROOT, 'docs/kb-calibration.json');
const reuse = process.argv.includes('--reuse');

const ANSWERABLE_TARGET = 25;

/** Analytics-shaped, definitively not in the corpus. The discriminating set. */
const ADJACENT = [
  'How do I configure row-level security in Snowflake?',
  'What is the best dbt incremental model strategy for late-arriving facts?',
  'How do I set up a Braze journey with a canvas entry event?',
  'How do I shard Postgres for multi-tenancy?',
  'What is the difference between Airflow and Dagster for orchestration?',
  'How do I write a Looker LookML derived table?',
  'How do I configure Snowplow event validation schemas?',
  'What is the right way to model slowly changing dimensions in Snowflake?',
  'How do I set up Kafka Connect to stream into ClickHouse?',
  'How do I implement a feature store with Feast?',
  'What is the best way to do reverse ETL with Census?',
  'How do I tune a Databricks Delta Live Tables pipeline?',
];

const OFF_TOPIC = [
  'What is a good recipe for carbonara?',
  'Who won the 2022 FIFA World Cup?',
  'How do I change a flat tyre?',
  'What is the capital of Portugal?',
  'Write me a Python function to reverse a linked list.',
];

async function claude(prompt, maxTokens = 2000) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: process.env.KB_CALIBRATION_MODEL ?? 'claude-sonnet-4-5',
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const body = await res.json();
  return body.content.map((c) => c.text ?? '').join('');
}

async function generateAnswerable(corpus) {
  // Sample across sources so the set isn't all blog or all LinkedIn.
  const docs = [...corpus.documents.values()].filter((d) => d.fullText.length > 600);
  const bySource = new Map();
  for (const d of docs) {
    const list = bySource.get(d.sourceType) ?? [];
    list.push(d);
    bySource.set(d.sourceType, list);
  }

  const picked = [];
  const sources = [...bySource.keys()];
  for (let i = 0; picked.length < ANSWERABLE_TARGET; i += 1) {
    const source = sources[i % sources.length];
    const list = bySource.get(source) ?? [];
    const doc = list[Math.floor((i / sources.length) * 3.7) % list.length];
    if (doc && !picked.includes(doc)) picked.push(doc);
    if (i > 300) break;
  }

  const questions = [];
  for (const doc of picked) {
    const prompt =
      'Below is an excerpt from an analytics consultant\'s published writing.\n\n' +
      'Write ONE question that a visitor to his website would type into a chat box, ' +
      'which this excerpt would answer well.\n\n' +
      'Rules:\n' +
      '- Phrase it the way a busy founder or PM types: short, direct, sometimes sloppy.\n' +
      '- Do NOT reuse the excerpt\'s distinctive phrasing or its title. Someone who ' +
      'has never read it must plausibly ask this.\n' +
      '- No preamble. Output the question and nothing else.\n\n' +
      `EXCERPT:\n${doc.fullText.slice(0, 2500)}`;
    const q = (await claude(prompt, 200)).trim().replace(/^["']|["']$/g, '');
    if (q && q.length < 200) {
      questions.push({ kind: 'answerable', question: q, expectedDocId: doc.docId });
      process.stdout.write(`\r  generated ${questions.length}/${picked.length}`);
    }
  }
  process.stdout.write('\n');
  return questions;
}

// --- build or load the question set ------------------------------------------

const corpus = await loadCorpus();
console.log(
  `corpus: ${corpus.chunks.length} chunks, ${corpus.documents.size} documents, ` +
    `model=${corpus.embeddingModel}, index=${corpus.indexVersion}\n`,
);

let set;
if (reuse && existsSync(SET_PATH)) {
  set = JSON.parse(readFileSync(SET_PATH, 'utf8'));
  console.log(`reusing ${set.length} questions from ${SET_PATH}\n`);
} else {
  console.log('generating answerable questions with Claude…');
  const answerable = await generateAnswerable(corpus);
  set = [
    ...answerable,
    ...ADJACENT.map((q) => ({ kind: 'adjacent', question: q, expectedDocId: null })),
    ...OFF_TOPIC.map((q) => ({ kind: 'off-topic', question: q, expectedDocId: null })),
  ];
  writeFileSync(SET_PATH, JSON.stringify(set, null, 2));
  console.log(`wrote ${set.length} questions to ${SET_PATH}\n`);
}

// --- score every question ----------------------------------------------------

console.log('scoring (embed → hybrid → rerank)…');
const scored = [];
for (const [i, item] of set.entries()) {
  const queryEmbedding = await embedQuery(item.question);
  const { documents, scoreKind } = await retrieveAndRerank(corpus, item.question, {
    queryEmbedding,
  });
  const scores = documents.map((d) => d.score);
  const top = scores[0] ?? 0;
  const window = scores.slice(1, 5);
  const gap = top - (window.length ? window.reduce((s, v) => s + v, 0) / window.length : 0);

  scored.push({
    ...item,
    top,
    gap,
    scoreKind,
    topDocId: documents[0]?.document.docId ?? null,
    topTitle: documents[0]?.document.title ?? null,
    hitExpected: item.expectedDocId
      ? documents.some((d) => d.document.docId === item.expectedDocId)
      : null,
  });
  process.stdout.write(`\r  scored ${i + 1}/${set.length}`);
}
process.stdout.write('\n\n');

// --- distributions -----------------------------------------------------------

const groups = new Map();
for (const s of scored) {
  const g = groups.get(s.kind) ?? [];
  g.push(s);
  groups.set(s.kind, g);
}

const stat = (xs) => {
  const v = [...xs].sort((a, b) => a - b);
  const q = (p) => v[Math.min(v.length - 1, Math.floor(p * v.length))];
  return { min: v[0], p25: q(0.25), p50: q(0.5), p75: q(0.75), max: v[v.length - 1] };
};

console.log('─── rerank score distribution ───────────────────────────────');
for (const [kind, items] of groups) {
  const s = stat(items.map((x) => x.top));
  console.log(
    `  ${kind.padEnd(12)} n=${String(items.length).padStart(3)}  ` +
      `min ${s.min.toFixed(4)}  p25 ${s.p25.toFixed(4)}  p50 ${s.p50.toFixed(4)}  ` +
      `p75 ${s.p75.toFixed(4)}  max ${s.max.toFixed(4)}`,
  );
}

const answerable = groups.get('answerable') ?? [];
const negatives = [...(groups.get('adjacent') ?? []), ...(groups.get('off-topic') ?? [])];

const recallAt5 = answerable.filter((a) => a.hitExpected).length;
console.log(
  `\n  recall@5 on answerable (source doc retrieved): ${recallAt5}/${answerable.length}` +
    ` (${((recallAt5 / Math.max(answerable.length, 1)) * 100).toFixed(0)}%)`,
);

// --- sweep -------------------------------------------------------------------

console.log('\n─── tau sweep ───────────────────────────────────────────────');
const candidates = [...new Set(scored.map((s) => s.top))].sort((a, b) => a - b);
const rows = [];
for (const tau of candidates) {
  const leaks = negatives.filter((n) => n.top >= tau).length;
  const covered = answerable.filter((a) => a.top >= tau).length;
  rows.push({ tau, leaks, covered });
}

const zeroLeak = rows.filter((r) => r.leaks === 0).sort((a, b) => a.tau - b.tau)[0];
for (const r of rows.filter((_, i) => i % Math.max(1, Math.floor(rows.length / 14)) === 0)) {
  console.log(
    `  tau ${r.tau.toFixed(4)}   leaks ${String(r.leaks).padStart(2)}/${negatives.length}   ` +
      `coverage ${String(r.covered).padStart(2)}/${answerable.length}` +
      `${zeroLeak && r.tau === zeroLeak.tau ? '   ← first zero-leak' : ''}`,
  );
}

if (!zeroLeak) {
  console.log('\n  NO zero-leak threshold exists. Retrieval, not the threshold, is the problem.');
  process.exit(1);
}

// One notch above the first zero-leak point, for margin.
const idx = candidates.indexOf(zeroLeak.tau);
const tau = candidates[Math.min(candidates.length - 1, idx + 1)] ?? zeroLeak.tau;
const coverage = answerable.filter((a) => a.top >= tau).length;

// Gap threshold: the flat-distribution check. Set below the answerable p25 so
// it only catches genuinely flat result sets, not merely close ones.
const answerableGaps = answerable.filter((a) => a.top >= tau).map((a) => a.gap);
const delta = answerableGaps.length ? Math.max(0, stat(answerableGaps).min * 0.5) : 0;

console.log(
  `\n  CHOSEN  tau=${tau.toFixed(4)}  delta=${delta.toFixed(4)}  ` +
    `coverage ${coverage}/${answerable.length} (${((coverage / answerable.length) * 100).toFixed(0)}%)  leaks 0/${negatives.length}`,
);

const verdict =
  coverage / answerable.length >= 0.6
    ? 'GO — coverage at zero leaks is acceptable.'
    : coverage / answerable.length >= 0.4
      ? 'MARGINAL — usable, but retrieval work would pay off before launch.'
      : 'NO-GO — retrieval is the problem, not the threshold. Do not tune around this.';
console.log(`  ${verdict}`);

writeFileSync(
  OUT_PATH,
  JSON.stringify(
    {
      calibratedAt: new Date().toISOString(),
      indexVersion: corpus.indexVersion,
      embeddingModel: corpus.embeddingModel,
      rerankModel: process.env.KB_RERANK_MODEL ?? 'rerank-2.5-lite',
      tau,
      delta,
      coverage: coverage / answerable.length,
      leaks: 0,
      counts: {
        answerable: answerable.length,
        adjacent: (groups.get('adjacent') ?? []).length,
        offTopic: (groups.get('off-topic') ?? []).length,
      },
      recallAt5: recallAt5 / Math.max(answerable.length, 1),
      verdict,
      scored: scored.map((s) => ({
        kind: s.kind,
        question: s.question,
        top: s.top,
        gap: s.gap,
        topTitle: s.topTitle,
        hitExpected: s.hitExpected,
      })),
    },
    null,
    2,
  ),
);
console.log(`\n  wrote ${OUT_PATH}`);
console.log('  Copy tau/delta/calibratedAt into GATE_CONFIG in lib/kb/gate.ts.');
console.log('  These become INVALID if the embedding model, reranker, or chunking changes.');
