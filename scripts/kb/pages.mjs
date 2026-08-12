#!/usr/bin/env node
// -----------------------------------------------------------------------------
// Draft the /ask/[slug] SEO answers.
//
//   npx tsx scripts/kb/pages.mjs            draft any question missing an answer
//   npx tsx scripts/kb/pages.mjs --force    redraft everything
//
// Writes lib/data/ask-answers.generated.json. THE OUTPUT IS A DRAFT — read it
// before committing. These pages are published under Ansh's name, indexed by
// Google, and quotable for years; a bad live-chat answer is seen by one person
// and dies, so they get a different bar.
//
// A question the gate refuses does NOT become a page. It is reported and
// skipped: that question needs a blog post first, not a generated answer.
// -----------------------------------------------------------------------------

import { loadEnv, ROOT } from './lib/env.mjs';
import { resolve } from 'node:path';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

loadEnv();

const { loadCorpus, retrieveAndRerank } = await import('../../lib/kb/retrieve/index.ts');
const { embedQuery } = await import('../../lib/kb/embed.ts');
const { evaluateGate, GATE_CONFIG } = await import('../../lib/kb/gate.ts');
const { streamAnswer } = await import('../../lib/kb/answer.ts');
const { validateAnswer } = await import('../../lib/kb/gate.ts');
const { ASK_QUESTIONS } = await import('../../lib/data/ask-questions.ts');

const OUT = resolve(ROOT, 'lib/data/ask-answers.generated.json');
const force = process.argv.includes('--force');

const existing = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : {};
const corpus = await loadCorpus();
console.log(`corpus: ${corpus.chunks.length} chunks, index ${corpus.indexVersion}\n`);

const out = force ? {} : { ...existing };
const skipped = [];

for (const item of ASK_QUESTIONS) {
  if (out[item.slug]) {
    console.log(`  = ${item.slug} (already drafted)`);
    continue;
  }

  const queryEmbedding = await embedQuery(item.question);
  const { documents, scoreKind } = await retrieveAndRerank(corpus, item.question, { queryEmbedding });
  const decision = evaluateGate(documents, GATE_CONFIG, scoreKind);

  if (!decision.answer) {
    skipped.push([item.slug, decision.reason, decision.topScore.toFixed(3)]);
    console.log(`  ! ${item.slug} REFUSED (${decision.reason}, top=${decision.topScore.toFixed(3)})`);
    continue;
  }

  let text = '';
  let cited = [];
  let insufficient = false;
  for await (const chunk of streamAnswer(item.question, decision.documents)) {
    if (chunk.type === 'done') {
      text = chunk.answer;
      cited = chunk.citedDocIds;
      insufficient = chunk.insufficient;
    }
  }

  const validation = validateAnswer(
    { answer: text, citedDocIds: cited, insufficientContext: insufficient },
    decision.documents,
  );
  if (!validation.valid) {
    skipped.push([item.slug, validation.reason, decision.topScore.toFixed(3)]);
    console.log(`  ! ${item.slug} INVALID (${validation.reason})`);
    continue;
  }

  const sources = decision.documents
    .filter((d) => cited.includes(d.document.docId))
    .map((d) => ({
      docId: d.document.docId,
      title: d.document.title,
      url: d.document.sourceUrl,
      sourceType: d.document.sourceType,
    }));

  out[item.slug] = {
    question: item.question,
    answer: text,
    sources,
    topScore: Number(decision.topScore.toFixed(4)),
    indexVersion: corpus.indexVersion,
    draftedAt: new Date().toISOString(),
    // Flip to true after reading it. Nothing renders until you do.
    reviewed: false,
  };
  console.log(`  + ${item.slug} drafted (${text.length} chars, ${sources.length} sources)`);
}

writeFileSync(OUT, `${JSON.stringify(out, null, 2)}\n`);

const drafted = Object.keys(out).length;
const unreviewed = Object.values(out).filter((a) => !a.reviewed).length;

console.log(`\n  ${drafted} drafted, ${skipped.length} skipped -> ${OUT}`);
if (skipped.length) {
  console.log('\n  SKIPPED — the corpus does not answer these. Write the post first:');
  for (const [slug, reason, score] of skipped) console.log(`    ${slug.padEnd(38)} ${reason} (${score})`);
}
if (unreviewed) {
  console.log(`\n  ${unreviewed} answer(s) awaiting review. Read them, fix what's wrong,`);
  console.log('  then set "reviewed": true. Unreviewed answers do NOT render.');
}
