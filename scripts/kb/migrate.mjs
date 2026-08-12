#!/usr/bin/env node
// -----------------------------------------------------------------------------
// Ask Ansh's AI - BigQuery schema migration
//
//   node scripts/kb/migrate.mjs           create/verify every table
//   node scripts/kb/migrate.mjs --check   report what exists, create nothing
//
// Idempotent (CREATE TABLE IF NOT EXISTS), so it's safe to re-run. Adding a
// column later means adding an ALTER below, not editing the CREATE - BigQuery
// won't retro-apply a changed CREATE to a table that already exists, and a
// silently-diverged schema is the kind of bug that only shows up in production.
//
// Tables:
//   kb_documents      one row per source document (post / doc section)
//   kb_chunks         retrieval units; embedded and searched at this level
//   ai_avatar_users   one row per email that used the chat
//   ai_avatar_queries one row per question asked - the content roadmap
//   ai_avatar_conversations  one row per chat thread, so history follows the email
//
// Design notes live in docs/ai-avatar-plan.md §2.3 and §2.8.
//
// Auth: BIGQUERY_* from .env.local, same credential path the app uses.
// -----------------------------------------------------------------------------

import { BigQuery } from '@google-cloud/bigquery';
import { loadEnv } from './lib/env.mjs';

loadEnv();

const PROJECT_ID = process.env.BIGQUERY_PROJECT_ID;
const DATASET_ID = process.env.BIGQUERY_DATASET_ID || 'datalyze';

if (!PROJECT_ID) {
  console.error('BIGQUERY_PROJECT_ID is not set (add it to .env.local).');
  process.exit(1);
}

const bq = new BigQuery({
  projectId: PROJECT_ID,
  credentials: process.env.BIGQUERY_CREDENTIALS_JSON
    ? JSON.parse(process.env.BIGQUERY_CREDENTIALS_JSON)
    : undefined,
});

const T = (name) => `\`${PROJECT_ID}.${DATASET_ID}.${name}\``;

const TABLES = [
  {
    name: 'kb_documents',
    ddl: `CREATE TABLE IF NOT EXISTS ${T('kb_documents')} (
  doc_id STRING NOT NULL,
  source_type STRING NOT NULL,      -- ghost | linkedin | gdoc
  source_url STRING,                -- canonical public URL; NULL only for gdoc
  title STRING,
  author STRING,
  published_at TIMESTAMP,
  updated_at TIMESTAMP,
  source_tier STRING NOT NULL,      -- published | tutorial | internal | draft
  content_hash STRING NOT NULL,     -- sha256 of normalised text; drives change detection
  full_text STRING,                 -- what generation sees after parent expansion
  token_count INT64,
  chunk_count INT64,
  contains_pricing BOOL,            -- excluded from retrieval (plan §2.6)
  first_seen_at TIMESTAMP NOT NULL,
  last_seen_at TIMESTAMP NOT NULL,  -- drives delete detection on full runs
  status STRING NOT NULL,           -- active | deleted (soft delete only)
  index_version STRING
)
PARTITION BY DATE(last_seen_at)
CLUSTER BY source_type, status, doc_id
OPTIONS (description = "KB source documents for Ask Ansh's AI. See docs/ai-avatar-plan.md 2.3.")`,
  },
  {
    name: 'kb_chunks',
    ddl: `CREATE TABLE IF NOT EXISTS ${T('kb_chunks')} (
  chunk_id STRING NOT NULL,         -- STABLE: <doc_id>#<ordinal>, never a content hash
  doc_id STRING NOT NULL,
  chunk_index INT64 NOT NULL,
  text STRING NOT NULL,             -- raw, for display
  embedded_text STRING NOT NULL,    -- breadcrumb + text; what actually got embedded
  heading_path STRING,
  content_hash STRING NOT NULL,
  token_count INT64,
  contains_pricing BOOL,
  embedding ARRAY<FLOAT64>,         -- archived here; Upstash serves it
  embedding_model STRING,           -- never omit: makes a model migration filterable
  embedded_at TIMESTAMP,
  index_version STRING,
  status STRING NOT NULL
)
PARTITION BY DATE(embedded_at)
CLUSTER BY doc_id, status
OPTIONS (description = "Retrieval units. Search here, expand to kb_documents.full_text for generation.")`,
  },
  {
    name: 'ai_avatar_users',
    ddl: `CREATE TABLE IF NOT EXISTS ${T('ai_avatar_users')} (
  user_id STRING NOT NULL,
  email STRING NOT NULL,
  email_hash STRING NOT NULL,       -- sha256; what goes to Mixpanel and the query log
  first_seen_at TIMESTAMP NOT NULL,
  last_seen_at TIMESTAMP NOT NULL,
  questions_asked INT64,
  questions_answered INT64,
  questions_refused INT64,
  booked_call BOOL,
  ghost_member_created BOOL,        -- false means addGhostMember threw; visible, not silent
  first_referrer STRING,
  first_question STRING             -- highest-signal field on the row
)
PARTITION BY DATE(first_seen_at)
CLUSTER BY email_hash
OPTIONS (description = "One row per email that used Ask Ansh's AI. Lead table - sits beside contact_leads.")`,
  },
  {
    name: 'ai_avatar_queries',
    ddl: `CREATE TABLE IF NOT EXISTS ${T('ai_avatar_queries')} (
  query_id STRING NOT NULL,
  created_at TIMESTAMP NOT NULL,
  email_hash STRING,
  session_id STRING,
  question STRING NOT NULL,
  question_normalized STRING,
  question_hash STRING,
  answered BOOL NOT NULL,
  refusal_reason STRING,            -- below_threshold | flat_gap | insufficient_context
                                    -- | bad_citation | pricing_blocked | quota_exhausted
  top_score FLOAT64,
  score_gap FLOAT64,
  scores_top5 ARRAY<FLOAT64>,       -- log the distribution; it can't be reconstructed later
  retrieved_chunk_ids ARRAY<STRING>,
  cited_doc_ids ARRAY<STRING>,
  source_tiers ARRAY<STRING>,
  latency_embed_ms INT64,
  latency_search_ms INT64,
  latency_rerank_ms INT64,
  latency_generation_ms INT64,
  latency_total_ms INT64,
  cache_hit BOOL,
  model STRING,
  embedding_model STRING,
  index_version STRING,             -- with tau: tells you whether a metric moved
  tau FLOAT64,                      -- because content changed or config did
  delta FLOAT64,
  input_tokens INT64,
  output_tokens INT64,
  question_index_in_session INT64,
  referrer STRING
)
PARTITION BY DATE(created_at)
CLUSTER BY answered, refusal_reason
OPTIONS (description = "One row per question. The refused half is the content roadmap. See docs/ai-avatar-plan.md 2.8.")`,
  },
  {
    name: 'ai_avatar_conversations',
    ddl: `CREATE TABLE IF NOT EXISTS ${T('ai_avatar_conversations')} (
  conversation_id STRING NOT NULL,  -- minted client-side; stable across devices
  email_hash STRING NOT NULL,       -- the only identity here; raw email stays in ai_avatar_users
  title STRING,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  turn_count INT64,
  saved_at TIMESTAMP NOT NULL,      -- server clock; created_at/updated_at come from the browser
  turns STRING,                     -- JSON transcript. Opaque to SQL on purpose: this is a
                                    -- restore blob for the UI, not an analytics surface -
                                    -- ai_avatar_queries is where questions get analysed.
  deleted BOOL                      -- soft: a delete is one MERGE, and a mis-click is recoverable
)
-- Deliberately NOT partitioned, unlike every other table here. The dataset
-- carries a 60-day default partition expiry, so a partitioned thread table
-- would quietly delete the history it exists to preserve - and a partition key
-- taken from the visitor's clock can land in an already-expired partition, so
-- the row vanishes the moment it's written. This table is one small row per
-- thread and is only ever read by email_hash: clustering is what it needs.
CLUSTER BY email_hash, conversation_id
OPTIONS (
  expiration_timestamp = NULL,
  description = "Chat threads for Ask Ansh's AI, keyed by email hash so history survives a new browser."
)`,
  },
];

async function tableExists(name) {
  const [exists] = await bq.dataset(DATASET_ID).table(name).exists();
  return exists;
}

async function main() {
  const checkOnly = process.argv.includes('--check');
  console.log(`${PROJECT_ID}.${DATASET_ID}${checkOnly ? '  (check only)' : ''}\n`);

  for (const { name, ddl } of TABLES) {
    const existedBefore = await tableExists(name);

    if (checkOnly) {
      console.log(`${existedBefore ? '  ok     ' : '  MISSING'} ${name}`);
      continue;
    }
    if (existedBefore) {
      console.log(`  exists  ${name}`);
      continue;
    }

    await bq.query({ query: ddl });
    console.log(`  created ${name}`);
  }

  if (checkOnly) return;

  // Row counts are a cheap sanity check that we're pointed at the right dataset.
  const [rows] = await bq.query({
    query: TABLES.map(
      // `rows` is a BigQuery reserved keyword - alias as row_count.
      ({ name }) => `SELECT '${name}' AS table_name, COUNT(*) AS row_count FROM ${T(name)}`,
    ).join('\nUNION ALL\n'),
  });
  console.log('');
  for (const r of rows.sort((a, b) => a.table_name.localeCompare(b.table_name))) {
    console.log(`  ${String(r.row_count).padStart(7)}  ${r.table_name}`);
  }
}

main().catch((err) => {
  console.error(`\n${err.message}`);
  process.exit(1);
});
