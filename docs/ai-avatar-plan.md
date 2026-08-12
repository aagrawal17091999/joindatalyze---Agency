# Ask Ansh's AI — Implementation Plan

**Status:** Step 1 (corpus rebuild) is **built and running**. See "Implementation status" below.
**Audited:** 2026-08-05, branch `main` @ `4d93e94`.
**Revision 2** — supersedes r1 after the indexer code landed. r1's central unknown (where the KB lives, what embedded it) is resolved, and the answer changes the plan materially.

---

## Implementation status

| Step | State |
| --- | --- |
| 0 · Locate KB, confirm model | ✅ `voyage-3` pickle in GCS, 825 chunks, no provenance |
| 1 · Rebuild corpus with provenance | ✅ **Built.** Ghost + Doc live in BigQuery; LinkedIn blocked on `APIFY_TOKEN` |
| 2 · Offline retrieval harness | ✅ **Built.** Hybrid BM25 + dense + `rerank-2.5-lite` + tiers + parent expansion |
| 3 · Threshold calibration | ✅ **GO.** τ=0.6406, δ=0.0146 — zero leaks, 96% coverage |
| 4 · API route + gate | ✅ **Built.** `POST /api/ask` streams, gates, validates, logs |
| 5 · Email gate, quota, chat page | ✅ **Built.** `/ask` live; the email gate is now raised on page entry (unauthenticated visitors can't reach the composer) and chat history is mirrored to `ai_avatar_conversations`, keyed by email hash, so threads follow the person across devices. Note: that table is deliberately unpartitioned — the dataset's 60-day default partition expiry would otherwise delete the history. The 3-question quota was removed — an email now buys unlimited questions, and spend is bounded by the per-IP (40/day) and global daily caps in `lib/kb/limits.ts`. Set `KB_QUESTION_LIMIT` to a positive number to bring the per-email cap back |
| 6 · Abuse controls | ✅ **Built** on BigQuery + per-instance cache — no Upstash needed yet |
| 7 · Weekly sync | ✅ **Built.** `vercel.ts` crons + `/api/kb/sync` + Resend report |
| 8 · SEO pages + digest | ✅ **Built.** 16 answers drafted (1 reviewed), digest clustering verified |

**What runs today**

```bash
npm run kb:migrate           # create/verify the 4 BigQuery tables (idempotent)
npm run kb:inspect gdoc      # classify the Doc: kept vs excluded, with reasons
npm run kb:inspect pricing   # every redacted figure, and every figure kept
npm run kb:build -- --dry-run
npm run kb:build             # writes to BigQuery; embeds when VOYAGE_API_KEY exists
npm run kb:pages             # draft /ask/[slug] answers for review (never auto-publishes)
npm run kb:verify            # read-only assertions over what actually landed
                             # kb:build also publishes the serving artifact to GCS

# Scheduled (vercel.ts):
#   Mon 03:00 UTC   GET /api/kb/sync             incremental — no delete reconciliation
#   1st  04:00 UTC  GET /api/kb/sync?mode=full   full history — the only run that tombstones
#   Mon  04:00 UTC  GET /api/kb/digest           refused-query content roadmap
npm run kb:inspect search "how do I set up mixpanel"   # retrieval + gate, one query
npm run kb:inspect probe     # 15-question probe set across answerable / adjacent / off-topic
```

**Current corpus in `joindatalyze.datalyze`** — fully embedded with `voyage-context-4`

| | docs | chunks |
| --- | --- | --- |
| `ghost` / `published` | 49 | 331 |
| `ghost` / `tutorial` | 28 | 186 |
| `linkedin` / `published` | 386 | 389 |
| `gdoc` / `internal` | 2 | 51 |
| **total** | **465** | **957** |

463/465 carry a real `source_url` and `published_at` (the 2 without are the internal Doc blocks, which correctly have none). 957/957 chunk IDs unique, 0 missing breadcrumbs, 0 unembedded. LinkedIn spans 2019-07-27 → 2026-08-11.

**Measured serving latency** (`/api/ask`, dev, logged to `ai_avatar_queries`)

| stage | warm | cold |
| --- | --- | --- |
| corpus load | 0 ms (cached) | 3,128 ms |
| embed query | ~370 ms | ~364 ms |
| hybrid search + rerank | ~540 ms | ~401 ms |
| generation (Haiku 4.5, streamed) | ~4,900 ms | ~3,845 ms |
| **total** | **~5.8 s** | **~7.7 s** |

**The cold-start load took three attempts and the first two diagnoses were wrong** — worth recording, because the obvious explanation was not the cause:

| approach | cold corpus load |
| --- | --- |
| `ARRAY<FLOAT64>` straight from BigQuery | **60,952 ms** |
| base64 `Float32` in BigQuery | **47,180 ms** |
| single gzipped GCS artifact | **3,128 ms** |

Packing the embeddings barely moved it, which ruled out the intuitive culprit (parsing ~1M JSON numbers) and pointed at the real one: **the BigQuery client paginates a multi-megabyte result set over many sequential REST round trips.** Shrinking the rows can't fix a per-page round trip. Serving now reads one 4.4 MB gzipped blob from `gs://joindatalyze-pipeline-cache/kb-index.json.gz` in a single GET, published automatically at the end of every `kb:build`. BigQuery remains the source of truth; the artifact is a derived, disposable snapshot, and a missing one degrades latency (falls back to BigQuery) rather than availability.

**Calibration result (step 3 go/no-go): GO**

| set | n | min | p50 | max |
| --- | --- | --- | --- | --- |
| answerable | 25 | **0.578** | 0.824 | 0.926 |
| adjacent-absent | 12 | 0.338 | 0.397 | **0.508** |
| off-topic | 5 | 0.334 | 0.385 | 0.397 |

The distributions separate **completely** — the lowest answerable score sits above the highest non-answerable one. τ=0.6406 gives **zero leaks at 96% coverage**. Full record in `docs/kb-calibration.json`; question set in `docs/kb-calibration-questions.json`.

**Three things the build surfaced that the plan had wrong**

1. **The Doc is 93.2% duplicated content**, not the ~60% implied by "63 of 82 posts". Its own header reads *"Blog archive: blog.joindatalyze.com — Auto-synced from Ghost. 63 posts."* After the strip it contributes 44,617 chars / 51 chunks, not the 100–200 chunks §2.1 estimated.
2. **Ghost's Content API exposes 77 posts, not 82.** The other 5 are drafts — including *The $5K Analytics Stack That Should Cost $100*. Drafts are excluded: an unpublished post would cite to a 404 and leak unfinished thinking. See open question 1.
3. **Pricing needed redaction, not exclusion**, and the Doc holds *two full rate cards*, not the one line §2.6 anticipated. Details below.

### The gate cannot work without a reranker — measured, not argued

§2.2 said reranking buys a better-calibrated signal. That understated it. Running the probe set against fused RRF scores on the real corpus:

```
"How do I set up Mixpanel the right way?"   fused top score = 0.0164
"What is a good recipe for carbonara?"      fused top score = 0.0164
```

Identical. RRF assigns `1/(60+rank)`, so the rank-1 result scores ~0.0164 whether it is a perfect match or the least-irrelevant thing in the corpus. **The fused score encodes rank position, not match quality**, so thresholding it passes everything or nothing.

Reranking is therefore not a quality upgrade for this product — it is the component that makes the refusal gate possible at all. `evaluateGate` now **fails closed**: it refuses everything with `not_calibrated` unless the score came from a reranker *and* τ has been calibrated. That makes the missing reranker impossible to ship past, rather than a silent quality regression.

Retrieval itself is in good shape. BM25 alone already puts the right post at rank 1 for most answerable questions — *"how should I think about incrementality testing"* → **D2C Playbook 6 — Incrementality Testing**, *"how do I create an event tracking plan"* → **How to Create a Tracking Plan, and Why It Matters**. That is the evidence the chunking rebuild worked; the dense half will only widen it.

## 0. What changed from revision 1

### 0.1 The knowledge base is not in BigQuery. It never was.

It's a **pickle file in GCS**: `gs://joindatalyze-pipeline-cache/context_index.pkl`. I pulled it and read it. Real numbers, not inference:

| | |
| --- | --- |
| **Model** | `voyage-3` |
| **Vectors** | 825 × 1024, `float32`, L2-normalized |
| **Chunks** | **825** |
| **Total content** | 598,769 chars ≈ 150k tokens ≈ 300 pages ✅ matches your description |
| **Sources** | **One** Google Doc (`1QNqJfVtAqZo…`) |
| **File size / last built** | 3.85 MB / **2026-05-18** — 2.5 months stale |
| **Per-chunk fields** | `source`, `title`, `text`, `id` — that's all |
| **Chunk size (chars)** | min 200 · p50 **612** · p90 1,329 · max 2,806 |

So: my r1 sweep of BigQuery was looking in the right place for the wrong thing. Nothing is wrong with your setup — it's a Colab pipeline with a GCS cache, and it works. But it means there is no BigQuery table to extend, no vector index question, and no "reuse vs rebuild" debate about infrastructure. There's a pickle and a notebook.

### 0.2 The real blocker isn't embeddings. It's that the chunks have no provenance.

This is the finding that reshapes the plan:

- **Only 16 of 825 chunks contain a URL anywhere in their text.**
- The only metadata per chunk is `source` (the first 12 chars of the Google Doc ID — identical for all 825 rows) and `title` (the raw heading line).
- **347 chunks are titled `Post 1` … `Post 355`** — your LinkedIn posts, pasted into the Doc, with no URL, no date, no engagement, nothing. (8 numbers in that range are missing — see §0.4.)
- The other 478 are your voice/positioning/methodology sections: `The one-liner`, `Hard rules`, `Register modes`, `What are events & properties in Mixpanel?`, `Mixpanel setup → The right way`.

**You cannot ship a citing product on this index.** Your hard requirement is that answers are grounded and refusals are clean, and you've now also asked that both answers *and* refusals link to source content. A chunk that says `## Post 11` and nothing else cannot become a link. Neither can `## The one-liner`.

That reframes the whole build. **The rebuild is about metadata, not about vectors.** Re-embedding is the trivial part — 150k tokens against Voyage's 200M free tier costs literally nothing. The work is rebuilding the corpus so every chunk knows what it came from, when, and at what URL.

Good news: this makes the "reuse vs rebuild" question moot in the most useful way. You keep the *content* — it's all in that Doc, and you have it. You rebuild the *pipeline*. And since you're rebuilding, you're free of `voyage-3` (now legacy) and every other early decision.

### 0.3 Fixed: `tool_downloads`

You asked me to fix this, so I did rather than writing it up.

`joindatalyze.datalyze.tool_downloads` didn't exist, so every insert in [app/api/tool-downloads/route.ts](app/api/tool-downloads/route.ts) was throwing silently inside `after()`. I created it to match exactly what [lib/api/bigquery.ts](lib/api/bigquery.ts) writes:

```sql
CREATE TABLE `joindatalyze.datalyze.tool_downloads` (
  id STRING NOT NULL, email STRING NOT NULL, tool_id STRING NOT NULL,
  download_token STRING NOT NULL, token_expires_at TIMESTAMP,
  email_sent BOOL, created_at TIMESTAMP NOT NULL)
PARTITION BY DATE(created_at) CLUSTER BY email, tool_id
```

Then I ran the app's exact `INSERT` and its `UPDATE … WHERE download_token = @token` against it, confirmed both succeeded, and deleted the test row. Table is live and empty. **No application code changed** — the code was always right, the table was missing. Partitioned by day and clustered on `email, tool_id` so the "who downloaded what" queries you'll eventually want stay cheap.

Historical downloads before today are gone — they were never written anywhere. Emails still went out (Resend fires independently) and Ghost members were still created, so you haven't lost the leads, just the log.

### 0.4 Three bugs in the current indexer, worth knowing before you reuse any of it

1. **Silent data loss.** `chunk_markdown` has `if not sec or len(sec) < 200: continue` — **any section under 200 characters is dropped without a word.** That's 8 of your 355 LinkedIn posts gone, plus an unknown number of short definitional sections. Short sections are often the highest-value ones for Q&A ("What is a super property?" is a 3-sentence answer). If a visitor asks about something you *did* write and gets a refusal, this is a likely cause.
2. **`id = md5(text)[:12]`** makes chunk IDs content-addressed. That's accidentally good — it's a free change detector — but it means **a chunk's ID changes whenever its text changes**, so IDs are useless as stable references for citations, feedback, or analytics. You need a stable `chunk_id` *and* a separate `content_hash`.
3. **The `## `-and-deeper split regex (`\n(?=#{2,4} )`) never splits on `# `.** H1 sections get absorbed into whatever precedes them, and no chunk carries a parent breadcrumb — a chunk under `# Mixpanel` › `## Setup` › `### Event properties` is embedded knowing only `### Event properties`. Adding the breadcrumb is the single cheapest retrieval improvement available.

None of this is worth patching in place. It gets fixed by the rebuild.

---

# Phase 1 — Audit findings (application)

Unchanged from r1 and all still accurate. Condensed:

| Thing | Finding |
| --- | --- |
| Framework | Next.js `^15.1.0`, App Router, React 19, npm, TS strict, path alias `@/*` |
| Styling | **No Tailwind.** `app/globals.css` (4,877 lines) + CSS Modules |
| Hosting | Vercel, project `datalyze` (`prj_g67iE4HAA6GtZeraF66n9aJ8Mu0r`) |
| Server runtime | **Node, already in use.** 4 route handlers; `after()` from `next/server` in two of them; `@google-cloud/bigquery` at module scope. Nothing edge. Adding a streaming route is a drop-in. |
| Build config | `next.config.ts` only. **No `vercel.json` / `vercel.ts`** → no cron config exists yet |
| Streaming | **Nothing streams anywhere.** No `ai` / `@ai-sdk/*` installed. Greenfield. |

**Landing CTA:** [app/_components/hero.tsx:35-46](app/_components/hero.tsx#L35-L46), the `hero__buttons` div. Reuse [CtaButton](app/_components/cta-button.tsx) (a `'use client'` `next/link` wrapper that fires `track('CTA Clicked', {cta_text, location})`) with `location="home_hero_ask_ai"`. You'll need a new `.btn-link` variant — `globals.css` §4 has only `.btn-primary` and `.btn-secondary` — and a look at `.hero__buttons` at both [:754](app/globals.css#L754) and `:892` (media query), which are sized for two buttons.

**Design tokens** (`:root`, top of `globals.css`) — dark-only, `color-scheme: dark`, one accent:
`--bg-base #0a0a0b` · `--bg-surface #131316` · `--bg-surface-2 #1c1c20` · `--border-subtle/-default/-strong` · `--text-primary #fafaf9` / `--text-secondary #b8b8bd` / `--text-muted #9a9aa3` · **`--accent #d4ff3f`** + `--accent-hover/-muted/-glow` · `--negative #ff6b47` — **do not use this for refusals** (§2.8) · full type scale with 1024/768/480 overrides · `--space-1..12` · `--radius-sm 2px` (what buttons use) · elevation as borders+glows, not shadows · `--ease-out`, `--duration-base 250ms`.

**Fonts** ([lib/fonts.ts](lib/fonts.ts)): `--font-body` General Sans (self-hosted), `--font-display` Instrument Serif, `--font-mono` JetBrains Mono (registered, `preload: false`, **already available** — use it for citation chips and any SQL in answers).

**Reuse:** [InlineCTA](components/inline-cta/InlineCTA.tsx) (17 lines: heading + arrow button — this *is* your refusal/CTA block), [JsonLd](components/seo/JsonLd.tsx) + [lib/seo.ts](lib/seo.ts), [contact-form.tsx](app/contact/contact-form.tsx) (the house style for form instrumentation — read it before building the email gate), global classes `.section` `.container` `.page-header` `.eyebrow`.

**Ghost:** proxy at [app/blog/[[...slug]]/route.ts](app/blog/[[...slug]]/route.ts) (`force-dynamic`, rewrites URLs, strips `x-robots-tag`); Admin API JWT in [lib/api/ghost.ts](lib/api/ghost.ts) used only for `addGhostMember(email)`. **`GHOST_CONTENT_API_KEY` exists in `.env.local` but is used nowhere and is not in `push-env-to-vercel.sh`'s `VARS` array, so it isn't deployed.**

**Analytics:** Mixpanel (not PostHog), init'd at module-eval time, routed through first-party `/mp/api` + `/mp/libs` proxies to beat ad blockers, `autocapture` on, 100% session replay. 16 events, PascalCase-with-spaces. `track()` supports `sendBeacon` and a flush callback.

**Secrets:** `.env.local` → [push-env-to-vercel.sh](push-env-to-vercel.sh), which iterates a **hardcoded `VARS` array**. A new key must be added in *two* places or it works locally and 500s in production. `ANTHROPIC_API_KEY` is also local-only today.

**CSP:** [next.config.ts](next.config.ts) sets a strict policy site-wide with an explicit `connect-src` allowlist. Keep every model call server-side behind your own `/api/*` and you never touch it.

**Automation:** none. No `.github/`, no cron, no Inngest, no Apify SDK, no `googleapis`. The `social.*` BigQuery tables hold scraped prospect posts written by something outside this repo.

---

# Phase 2 — Design

## 2.1 Corpus and metadata — the actual foundation

Everything else depends on this, so it goes first now.

**Split the single Google Doc into three sources by origin, and stop pasting published content into it.**

| Source | Where it comes from | Has URL? | Has date? | Tier |
| --- | --- | --- | --- | --- |
| **Blog posts + case studies** | Ghost Content API — **82 posts** | ✅ real | ✅ real | `published` |
| **LinkedIn posts** | Apify actor `8xdDFsUQcFTpodoxO`, your profile | ✅ real | ✅ real | `published` |
| **Internal notes, methodology, voice** | The Google Doc (what's left) | ❌ none | manual | `internal` |

Case studies turn out not to be a separate source — they're **already Ghost posts** (`CRED: Improving PSR (+7%)…`, `Foriio: Improving Activation…`, and 12 more). One fewer integration to build.

### ⚠️ The Doc is a superset. 77% of your blog is already pasted into it.

I compared the 1,021 headings in [Knowledge base - Ansh.md](Knowledge%20base%20-%20Ansh.md) against the live Ghost post list. **63 of your 82 Ghost posts appear in the Doc as verbatim-titled sections**, including all 14 case studies and the entire 28-part `[Week N] Learning Mixpanel` series. Plus 5 near-matches under shortened headings.

So if you ingest Ghost *and* the Doc without stripping first, **~63 blog posts get indexed twice** — once with a real URL at `published` tier, once without a URL at `internal` tier. The consequences are all bad and none are loud:

- Retrieval returns two near-identical chunks, wasting half the context window on a duplicate.
- The model may cite the internal copy, which has no URL — so it renders as "from my notes" for content that's a public blog post you'd rather link.
- Your tier system silently stops meaning anything, because the same text exists at two tiers.

**Fix, and it's mechanical:** exact title match already catches 63 of them. Match Doc headings against Ghost titles, delete those sections from the Doc, hand-check the 5 near-matches, done. Add a permanent **ingest-time dedup guard** too — if a Doc section's normalized text is >90% similar to an already-ingested `published` document, skip it and log it. That way the Doc drifting back out of sync (you paste a new post in out of habit) degrades gracefully instead of silently.

Same story for the 347 `Post N` chunks: delete them from the Doc, re-pull from Apify where URLs and dates actually exist.

**What's left in the Doc is what has no other home** — positioning, hard rules, register modes, ICP, engagement model, methodology write-ups. That's a much smaller corpus than 825 chunks, and it's exactly the content that *should* be tier-gated (§2.6). Expect the Doc to drop to roughly 100–200 chunks once the published content is stripped out, with the other ~600 arriving from Ghost and Apify carrying real provenance.

**Chunking: your one-chunk-per-post instinct is right, but implement it as "retrieve small, generate big."**

One-chunk-per-post is right for *citation* and for *generation*. It is wrong for *retrieval* — a 2,000-word post compressed into one 1024-dim vector is a blurry average of everything it discusses, and it will lose to a short post that's narrowly on-topic even when the long post answers the question better. This is the most common self-inflicted retrieval wound.

So do both:

```
EMBED + SEARCH on:   sections (~200–800 tokens, with heading breadcrumb prefix)
RETURN to the model:  the whole parent post/document
CITE:                 one URL per parent
```

Store `parent_id` on every chunk. Retrieve top-k chunks, dedupe to their parents, load full parent text, hand the model 3–5 whole posts. You get precise retrieval, complete context, and exactly the one-citation-per-post model you asked for. Long posts stop being penalised. Short posts (most LinkedIn posts — p50 is 812 chars) are naturally one chunk anyway, so for them the two collapse into one and nothing changes.

Fix the three §0.4 bugs while you're here: **no minimum-length filter** (embed short sections, they're often the best answers), stable `chunk_id` separate from `content_hash`, and **prepend the heading breadcrumb** (`Mixpanel setup → The right way › Event properties`) to the embedded text while keeping raw text separate for display.

## 2.2 Embedding model

**Use `voyage-context-4`. Output dimension 1024. Keep `input_type="document"` / `"query"` — the existing code already does this correctly.**

`voyage-3` is legacy; Voyage states the current generation is strictly better on quality, context length, latency and throughput. Since you're rebuilding the corpus anyway, there is no migration cost — you re-embed from scratch either way.

`voyage-context-4` over plain `voyage-4` specifically because of your chunking. It embeds **each chunk in the context of the other chunks from the same document**, which is a direct fix for the breadcrumb problem: a section titled `### Event properties` gets embedded knowing it sits inside your Mixpanel setup guide. It's the model-level version of the trick I'd otherwise ask you to hand-roll. 32k tokens per chunk, 120k total per document, 1024 default dims (256/512/2048 also available).

**Cost is a non-issue and will remain one.** Voyage gives 200M free tokens per account. Your entire corpus is ~150k tokens. **You could re-embed the whole knowledge base from scratch, weekly, for over 25 years before paying anything.** Any part of this plan that optimizes to avoid re-embedding is optimizing for latency and correctness, not money — worth remembering when you're deciding how much incremental-update machinery to build (§2.5).

One constraint contextualized embeddings impose: a chunk's vector depends on its siblings, so changing one section technically invalidates its neighbours. Handle it by making the **document unit small** — one post, or one H1 section of the Doc. When any part of a unit changes, re-embed that whole unit. Units are a few thousand tokens; the cost is zero and the correctness is exact.

**Reranking: `rerank-2.5-lite`** ($0.02/M, 32k context, up to 1,000 docs/request). Slots after fusion, before the gate. The reason it matters for you is calibration, not just ordering: cosine similarity from a bi-encoder is a *similarity* measure pressed into service as a *relevance* measure, and its values bunch into a narrow band that makes threshold-setting miserable. Cross-encoder scores spread out and mean something closer to "is this passage actually responsive." **Your entire product is one threshold decision — buy the better signal.** Use `-lite` for latency; upgrade to `rerank-2.5` only if quality demands it.

## 2.3 Serving layer — built for the size you're growing into

You asked for something that still works when the KB is much bigger. That rules out the answer I'd give for 825 chunks in isolation (load it all into function memory), because that stops working somewhere north of ~100k chunks and I'd rather you not rebuild this twice.

**Recommendation: Upstash Vector (hybrid index) for serving, BigQuery as source of truth, GCS out of the loop.**

```
Ghost API ─┐
Apify      ├─→ sync job ─→ BigQuery (kb_documents, kb_chunks)   ← source of truth, queryable, permanent
Google Doc ┘                      │
                                  └─→ upsert ─→ Upstash Vector (dense + sparse)  ← serving
```

Why Upstash Vector specifically:

- **Hybrid search is built in.** It maintains a dense *and* a sparse (BM25) component in one index and fuses them with **RRF (K=60) by default**. This is precisely the design I'd otherwise have you hand-build — and it's the fix for your exact-term problem (`HogQL`, `UTM`, `GA4`, `$identify`, `mixpanel_distinct_id`). Dense retrieval maps "HogQL" into the same neighbourhood as "SQL" and hands back a chunk about BigQuery. BM25 doesn't. You need both, and here you get both without running Elasticsearch or building an inverted index.
- **Bring your own vectors** — you upsert Voyage embeddings directly, so nothing is locked to their embedding models.
- **Metadata filtering** — needed for tier filtering (§2.6) and for excluding `status='deleted'`.
- **Serverless, pay-per-request, on the Vercel Marketplace**, and you need Upstash Redis anyway for the email gate and rate limiting (§2.7). One vendor, one dashboard, two products.
- Scales to millions of vectors without you thinking about it. Which is the requirement.

**Why not the alternatives:**

- **BigQuery `VECTOR_SEARCH` at request time** — 400–1,200 ms of job-submission overhead per query, and BigQuery **won't create a vector index below 5,000 rows**, so at 825 chunks every query is a brute-force scan paying full job latency. Cost is fine (~$0.0003/query); latency isn't.
- **In-memory** — genuinely optimal *today* (24 MB, ~10 ms, exact), but you told me to design past today.
- **pgvector/Neon** — perfectly good, but you'd hand-build BM25 on top, and connection pooling from serverless is a real ongoing annoyance. Upstash gives you hybrid for free.

**Latency budget, p50:**

| Stage | ms |
| --- | --- |
| Embed query (`voyage-context-4`) | 150–250 |
| Hybrid search (Upstash, RRF) | 30–60 |
| Rerank (`rerank-2.5-lite`, ~30 docs) | 120–200 |
| Load parent docs + assemble | 20–40 |
| **Total before first token** | **~350–550** |

Acceptable for a streamed chat UI. Generation begins streaming immediately after.

**BigQuery keeps every chunk, every vector, and every version.** It's your source of truth, your analytics substrate, and your rebuild path if you ever change vector stores or embedding models. Upstash is a derived, disposable serving copy — which is exactly the property that lets you swap it later without ceremony.

### New table: `datalyze.kb_documents`

| Column | Type | Notes |
| --- | --- | --- |
| `doc_id` | STRING | `ghost:<uuid>` / `linkedin:<urn>` / `gdoc:<docid>#<slug>` |
| `source_type` | STRING | `ghost` \| `linkedin` \| `gdoc` |
| `source_url` | STRING | Canonical public URL. **NULL only for `gdoc`.** |
| `title`, `author` | STRING | |
| `published_at`, `updated_at` | TIMESTAMP | |
| `source_tier` | STRING | §2.6 |
| `content_hash` | STRING | SHA-256 of normalized text |
| `full_text` | STRING | The parent doc returned to the model (§2.1) |
| `token_count` | INT64 | |
| `first_seen_at`, `last_seen_at` | TIMESTAMP | `last_seen_at` drives delete detection |
| `status` | STRING | `active` \| `deleted` |

### New table: `datalyze.kb_chunks`

| Column | Type | Notes |
| --- | --- | --- |
| `chunk_id` | STRING | **Stable.** `<doc_id>#<ordinal>` — not a content hash |
| `doc_id` | STRING | → parent |
| `chunk_index` | INT64 | |
| `text` | STRING | Raw, for display |
| `embedded_text` | STRING | Breadcrumb + text, what actually got embedded |
| `heading_path` | STRING | `Mixpanel setup → The right way → Event properties` |
| `content_hash` | STRING | Change detection |
| `embedding` | ARRAY\<FLOAT64\> | Archived here; Upstash serves it |
| `embedding_model` | STRING | **`voyage-context-4`. Never omit this column.** It's the thing I couldn't determine in r1 — putting it on every row means a future model migration is a filterable, resumable operation instead of a total rebuild. |
| `contains_pricing` | BOOL | §2.6 — excluded from retrieval by metadata filter |
| `embedded_at`, `index_version` | TIMESTAMP, STRING | |

Partition both by `DATE(last_seen_at)` / `DATE(embedded_at)`, cluster by `source_type` and `doc_id`.

## 2.4 The refusal gate

Mechanism, three parts. Two you proposed, one you didn't.

**1. Score threshold on the *rerank* score (not cosine), before generation.** Load-bearing. Everything else is defence in depth.

**2. Structural citations, verified in code.** Don't *ask* the model to cite. Force structured output where every claim carries a `doc_id`, then **deterministically check every returned ID against the retrieved set.** Any ID that wasn't retrieved → refuse the entire response. Zero tokens, zero latency, catches the most common hallucination (inventing a source). Free — do it.

**3. The score gap — add this, it's the cheapest signal you're not using.** Don't gate on `top_score > τ` alone. Also require `top_score − mean(scores[2..6]) > δ`. An answerable question produces one or two chunks clearly ahead of the rest. A question your KB doesn't cover produces a **flat** distribution — five chunks all vaguely about analytics, none about the question. **Flatness is the signature of "not in the KB," and it catches the case that hurts you most: the adjacent-but-absent question**, where the top score alone looks respectable. One extra line.

**Cut the LLM verification pass**, at least for v1. It doubles latency and cost, and it's the weakest of the checks — you're asking a model to grade another model's grounding, on the same evidence. It catches subtle extrapolation beyond a chunk. That's real, but it's second-order; your first-order risk is retrieving irrelevant chunks and answering anyway, which is what the threshold handles. Cheaper substitute in the same call: have the model emit `INSUFFICIENT_CONTEXT` as a structured field, and treat it as a refusal. Add the real verification pass later if the logs show extrapolation is what's actually leaking.

### On skipping calibration

You can skip hand-writing 50 questions. **You cannot skip picking the number.** τ is the product — set it blind and you're shipping the failure mode you built this to avoid, and you won't find out from the logs, because a confidently wrong answer looks exactly like a good one in a dashboard.

So here's the version that costs you zero effort. Both halves are generated, not written by you:

- **Answerable half** — sample 25 chunks, have Claude write the question each one answers. Free, and closer to real phrasing than your headings are.
- **Unanswerable half** — 25 analytics questions your KB provably doesn't cover. Generate these too: "Snowflake row-level security," "dbt incremental model strategies," "Braze journey orchestration." Adjacent to your domain, definitively absent.

Run all 50 through retrieval + rerank, log the scores, plot two distributions, pick τ at the point where **zero** unanswerable questions get through, then step up once for margin. Report the coverage you get on the answerable half as the cost.

Don't optimise F1 — it treats a wrong answer and a missed answer as equal, and you've said plainly they aren't. Optimise for zero leaks, accept the coverage hit.

**Total effort: one script, one afternoon, no writing.** If coverage at zero-leak lands above ~60%, ship. Below ~40%, retrieval is the problem, not the threshold.

Then **τ becomes invalid whenever you change the embedding model, the reranker, or the chunking.** Put it in a versioned config file with a dated comment saying so. And after launch your production refusal log (§2.8) becomes a far better eval set than any 50 questions — which is the real reason to instrument it properly in step 3 rather than as an afterthought.

## 2.5 Incremental updates

**Orchestrator: Vercel Cron → a route handler in this repo.**

The repo has nothing scheduled, so there's no incumbent — the question is purely what to introduce for one weekly job over three sources. Inngest and the Workflow DevKit are both better tools *in the abstract*; both are overbuilt for this. Vercel Cron costs you a `vercel.ts` (which you want anyway — it's the current recommended config format, replacing `vercel.json`), and the service-account creds, BigQuery client, Ghost JWT helper and deploy pipeline all already exist here.

```ts
// vercel.ts
import { type VercelConfig } from '@vercel/config/v1';
export const config: VercelConfig = {
  crons: [{ path: '/api/kb/sync', schedule: '0 3 * * 1' }], // Mondays 03:00 UTC
};
```

Guard it with a `CRON_SECRET` bearer check — it's a public URL otherwise. Default function timeout is 300 s, ample for a weekly delta.

**Escalate to the Workflow DevKit if** the sync starts needing durable retries across sources — e.g. Apify times out and you don't want to redo Ghost and Drive, or a full re-embed has to run inside the same job. Its `"use step"` model gives per-step retry and replay, which is genuinely the right shape for a multi-source pipeline. It is not the right shape for three sequential API calls once a week. Concrete trigger: **when the sync exceeds ~120 s or you add a fourth source, switch.**

### Change detection

Hash at the **document** level, embed at the **unit** level (§2.2), and normalize before hashing — strip HTML, collapse whitespace, drop Ghost's injected markup and LinkedIn's tracking params. Without normalization a theme change rewrites every hash and you re-embed the world. (Which costs $0 — but it churns your vector store and invalidates your response cache, so it still matters.)

- `content_hash` unchanged → touch `last_seen_at`, stop.
- Changed → **delete the doc's chunks, re-chunk, re-embed the whole document.** Don't diff at chunk level; boundaries shift when text changes and you get a mess of near-duplicates for no saving. A document is 5–15 chunks.
- New `doc_id` → chunk, embed, insert.

Writes to BigQuery via `MERGE` from a staging table (BigQuery has no primary keys, and the streaming-insert pattern in `insertToolDownload` is the wrong tool here — a retried run would duplicate). Then upsert changed chunks to Upstash by `chunk_id`, and delete removed ones.

### Deletes — the one everyone gets wrong

Each **full** source pass must produce the **complete current ID set**, not just recent items. Otherwise deletions are invisible forever. Any `active` doc from that source not in this run's set → `status='deleted'`, and delete its vectors from Upstash.

> ### ⚠️ Don't switch the Apify actor to "last 1 week"
>
> You said you'd narrow the actor in the UI to pull only the last week's posts going forward. **That would delete your entire LinkedIn corpus on the first run.**
>
> The reconciliation above tombstones any document a source didn't return. A one-week pull returns ~2 posts, so all 350-odd older ones look "missing" and get marked deleted. The KB silently loses your highest-volume content, and because deletes are soft you wouldn't see an error — just a quiet collapse in coverage.
>
> **Fix: mark each source run `full` or `incremental`, and let only `full` runs drive deletion.**
>
> ```
> weekly   → incremental pull (last 30 days) → upsert only, never tombstone
> monthly  → full pull (all posts)           → upsert + reconcile deletes
> ```
>
> This is worth having regardless of Apify cost, because it's the same guard that protects you from a partial API response. Store `run_mode` on the sync log so you can always tell which kind of run last touched a source.
>
> Use 30 days, not 7, for the incremental window — it costs nothing extra and gives you three weeks of slack for a cron that silently died.

Two guards, non-negotiable:

1. **Soft-delete only.** Never `DELETE FROM` in BigQuery. You want to see what vanished and be able to undo it.
2. **Abort the entire sync if any source returns zero documents, or fewer than 50% of its previous count.** A Ghost hiccup or an expired Apify token returns an empty list, which reads as "everything was deleted" and silently empties your knowledge base. Four lines of code; the difference between a bad afternoon and a bad week.

**Fail loudly** — email via Resend ([lib/api/resend.ts](lib/api/resend.ts), already wired) on any failure, on the count guard tripping, and on *three consecutive syncs that changed nothing*, which is how you discover a dead cron.

### Per source

- **Ghost** — Content API: `/posts/?formats=plaintext,html&limit=all&fields=id,uuid,title,url,updated_at,published_at`. One call, full ID set free. Uses `GHOST_CONTENT_API_KEY` — **which you must add to `push-env-to-vercel.sh`'s `VARS` array** or the cron will 500 in production while working perfectly on your laptop.
- **LinkedIn / Apify** — actor **`8xdDFsUQcFTpodoxO`**, run against your own profile. Confirmed as the actor that pulls your full post history. It 404s unauthenticated, so it's private — I'll need `APIFY_TOKEN` to read its input schema and pin the exact field names, but nothing in this design depends on that. **Drive the window from the API call, not the Apify UI** (see the box above) so the sync controls `full` vs `incremental` rather than a setting you might forget you changed. Posts are effectively immutable; treat a hash change as suspicious rather than routine. Most are short enough to be one chunk, which is what you wanted anyway.
- **Google Doc** — see §2.6.

After a successful sync, bump `index_version` and write it into every touched row. Then invalidate the response cache (§2.7) — stale cached answers citing deleted posts is a small, embarrassing, entirely preventable bug.

## 2.6 The Google Doc, and content promotion

### "One doc I keep updating, without re-embedding the whole thing"

**Yes — keep the single Doc. That's the right call and it needs no new machinery.**

The reason it works: change detection is per-**section**, not per-document. Each `##`/`###` section becomes a document unit with its own `content_hash`. On each sync you pull the Doc, split it, hash each section, and diff against what's stored. Edit one section → one section re-embeds. Add a section → one section embeds. Delete a section → it disappears from the ID set and gets tombstoned by the same reconciliation as everything else.

Your existing indexer is *already 80% of the way here* — `id = md5(text)[:12]` is a per-section content hash. It just throws the information away by rebuilding everything behind `FORCE_REINDEX`. The fix is to stop rebuilding and start diffing.

The SA already reads the Doc (that's `_load_gdoc_as_markdown` with `documents.readonly`), so **there's no new auth to set up.** Port that function to TypeScript with `googleapis` and you're done.

Multiple files would also work but they're strictly worse for you: more places to forget, no single-document view, and no benefit — per-section hashing already gives you file-level granularity inside one file.

**Two requirements on how you write in the Doc**, both trivial:

1. **Every section needs an `##` or `###` heading.** Headings are the unit boundary. A wall of text with no headings is one giant unit that re-embeds on every keystroke.
2. **Front-load a metadata line under each H1** for anything that has an external source:
   ```
   ## Why event volume ≠ data quality
   <!-- tier: internal | published: 2026-03-14 | url: -->
   ```
   Parse it, fall back to `tier: internal` if absent. **Nothing enters at a higher tier than `internal` without an explicit line** — an unlabelled note quietly promoting itself to published-grade is the exact failure this feature exists to prevent.

**The Doc is the approval gesture.** In it = approved. Deleted from it = gone next sync. No approval UI, no status field that can disagree with reality. You already work this way; the pipeline should just respect it.

### Confidence tiers

| Tier | Contents | Rerank multiplier |
| --- | --- | --- |
| `published` | Blog posts (opinion/strategy), LinkedIn posts, case studies | **1.00** |
| `tutorial` | The 28-part `[Week N] Learning Mixpanel` series | **0.95** |
| `internal` | Google Doc sections | **0.85** |
| `draft` | Anything provisional | **0.70**, excluded from serving by default |

**On the `tutorial` tier.** The `[Week N]` series is 28 of your 82 Ghost posts — a third of the blog by count, and denser than average, so a larger share by chunk count. Left at `published` it would dominate retrieval on anything Mixpanel-adjacent, and since "how do I do X in Mixpanel" phrasing overlaps heavily with "how should I think about X," a strategy question would keep pulling back a how-to. The 0.95 multiplier is deliberately gentle: on a genuine how-to question the tutorial content still wins easily, because a 5% haircut doesn't overcome a real relevance gap. It only breaks ties — which is exactly the case where you'd rather sound like yourself than like documentation.

Watch this one in the logs. If tutorial content is winning questions it shouldn't, drop it to 0.90; if how-to questions start refusing, raise it back to 1.00. It's one number.

**Apply the multiplier to the rerank score, after reranking, before the gate.** Not to the embedding, not during retrieval. Retrieval should find the best match on merit; ranking is where editorial policy belongs. As a post-hoc multiplier it's one number in a config file you can change without touching the index.

Three consequences to be deliberate about:

- A demoted chunk can drop below τ and cause a refusal. **That's correct** — if all you have is an internal note that barely clears the bar, refusing is right.
- **Calibrate τ *after* tiers are wired**, not before, or you calibrate on scores that don't exist in production.
- **Surface tier in the citation.** Published → a link to the post. Internal → "from my notes," no link. Different epistemic weight, different presentation — and it means you never render a citation that points nowhere.

Note you gave `published` to LinkedIn posts by asking for all of them. I'd agree — they're public, they're in your voice, and they're your highest-volume content. But it does mean a throwaway LinkedIn take can outrank a considered blog post. If that shows up in the logs, split LinkedIn to its own `social` tier at 0.92 and move on.

### Pricing must never appear in an answer

You cleared the Doc's contents as safe to surface **except pricing numbers**. That's a hard constraint, so it gets a mechanism rather than a prompt instruction. Three layers, because any one of them alone will leak eventually:

1. **Ingest-time (primary).** During chunking, flag any chunk matching a currency/rate pattern near pricing vocabulary — `$`/`₹`/`USD`/`INR` adjacent to `price|pricing|retainer|rate|cost|fee|monthly|per month|engagement`. Flagged chunks get `contains_pricing = TRUE` and are **excluded from retrieval entirely** by an Upstash metadata filter. They stay in BigQuery so you keep the record; they're just never retrievable.
2. **Prompt-level.** The system prompt states that specific figures are never disclosed and that pricing questions route to a booking CTA. Necessary but not sufficient — treat it as the weakest layer, not the control.
3. **Output-level (the actual guarantee).** Regex the generated answer for currency-figure patterns before it leaves the server. On a hit, discard the answer and serve the pricing-specific refusal. Deterministic, ~free, and it catches the case where the model infers a number rather than copying one.

Layer 3 is what makes this a guarantee instead of a hope, and it's about ten lines.

Pricing questions are also **high-intent**, so don't waste the moment on a generic refusal — this is the single best booking prompt in the product:

> **I don't quote numbers here — it depends on scope.**
> What I can tell you: [engagement model, from the Doc, no figures]. Real pricing takes ten minutes on a call. [Book a call →]

Add "how much does this cost" to your `/ask` starter questions. People want to ask it, and answering it *this* way converts better than answering it with a number would.

## 2.7 Access, abuse, and the 3-question limit

Your model — **email required, then 3 questions, then a booking modal** — is a better product than free-and-anonymous, and it changes the architecture in a way worth naming: this isn't a public chatbot with abuse controls bolted on. **It's a lead-capture tool with a chat interface.** Everything gets simpler once you accept that framing.

**Flow:**

1. Land on `/ask` → static page, indexable, shows what it can answer, example questions.
2. First question attempt → email modal. Reuse `contact-form.tsx`'s validation and event patterns.
3. On submit: mint a signed session cookie (HMAC, same pattern as [lib/api/download-token.ts](lib/api/download-token.ts) — `TOOL_DOWNLOAD_TOKEN_SECRET` already exists as precedent), write to `datalyze.ai_avatar_users`, and **call `addGhostMember(email)`**. That function already exists and already handles the 422-already-exists case. Every chat user becomes a newsletter subscriber for free.
4. Questions 1–3 answered. A counter shows "2 questions left" — sets expectations and makes the limit feel designed rather than punitive.
5. After #3 → modal: their session's best-matching content + Calendly. **Reuse `InlineCTA`.**

**Counting:** Redis (Upstash, same account as Vector), key `ask:q:<sha256(email)>`, plus a **secondary IP-hash counter** at ~10/day. Email alone is trivially bypassed with `+1` addressing; the IP counter is what actually holds. Don't over-invest — someone determined will get through, and the cost of that is a few cents.

**The rest, cheapest first:**

1. **Vercel BotID** on the endpoint. Blocks scripted abuse before a function is invoked. Near-zero code. Do this first.
2. **Input cap 500 chars, enforced server-side.** Client counter for UX, server check for reality.
3. **Response cache** — `sha256(normalize(question))` → answer, in Redis, 7-day TTL, invalidated on sync. **Cache refusals too** — they're free to serve and they're most of the abuse traffic. On a public page a surprising share of questions repeat verbatim; this is your biggest cost lever.
4. **Output cap `maxTokens: 700`.** A product decision (answers should be tight, 3–5 sentences plus citations) that happens to be a cost control.
5. **Global daily circuit breaker — default 1,500 answered questions/day.** One Redis counter; past it, everyone gets "back tomorrow."

   To answer what you asked: the 3-per-person limit caps an *individual*, not the *total*. 500 people × 3 = 1,500 questions, and nothing in the per-person limit stops that from being 50,000 if a post lands well on LinkedIn. The breaker is the only thing standing between a good traffic day and an unbounded bill.

   1,500/day is roughly **$5/day worst case** at Haiku pricing with the 700-token cap, and it's ~10× any realistic day-one volume — so it will never fire in normal operation, which is the point. It's a fuse, not a quota. Raise it once you've seen a month of real traffic. One constant in the config file.
6. **Model:** with good retrieval, generation is synthesis over 3–5 documents, not reasoning. Haiku 4.5 is plenty and ~10× cheaper than the frontier tier. **Read the `claude-api` skill for current model IDs and pricing before wiring this — don't take model IDs from memory.**

**Cost envelope:** embedding and reranking are free (200M-token allowance, §2.2). Real spend is generation only. At 500 gated questions/day with 30% cache hits, that's ~350 calls/day at ~4k in / 400 out on a small model — low single-digit dollars/day, capped by the breaker.

You're right to defer the paywall. Ship the limit, watch how many people hit it, decide later.

## 2.8 Answers, refusals, and instrumentation

### Every answer and every refusal carries a CTA

**Answer:** 3–5 sentences → citation chips (JetBrains Mono, `--accent`, linking to the post; internal-tier chips are unlinked and read "from my notes") → `InlineCTA`: *"Want this applied to your stack? Book a call."*

**Refusal:** never a dead end.

> **I haven't written about that.**
> Closest thing I have: [*Why event volume isn't data quality*] — that's about X, not quite what you asked.
> If you want a straight answer on this, that's a 30-minute call. [Book a call →]

The "closest thing" comes free — you already have the ranked results, you just render the top-1 *below* threshold instead of discarding it. Two rules: **label the mismatch explicitly** ("that's about X, not quite what you asked") so it reads as honest rather than evasive, and **hard-floor it** — below some very low score, show nothing rather than something absurd. This is the screen most users will see. Design it first, not last.

**Styling: treat it as an answer, not an error.** No `--negative`, no warning iconography, no reduced-emphasis container. Same type scale, same spacing, same `--accent` CTA as a successful answer. The only visual difference should be the absence of citation chips. A refusal styled as a failure teaches people the tool is broken; styled as an answer, it teaches them the tool is careful — which is the entire brand claim you're making by building the gate in the first place.

**This is also why §2.1 is the foundation.** Both of these features are just links to source content. Neither is buildable on the current index.

### Where the data lands

**BigQuery `datalyze.ai_avatar_users`** — one row per email, written once on gate submission. This is a lead table, so it should look like [`contact_leads`](lib/api/bigquery.ts) and live beside it:

```
user_id STRING, email STRING, email_hash STRING,
first_seen_at TIMESTAMP, last_seen_at TIMESTAMP,
questions_asked INT64, questions_answered INT64, questions_refused INT64,
booked_call BOOL, ghost_member_created BOOL,
first_referrer STRING, first_question STRING
```

`first_question` earns its place — the question someone was willing to hand over an email to ask is the highest-signal field on the row, and it's what you'd open the record to read before a sales call. `booked_call` gets set by joining `Ask AI Booking Clicked` → `Calendly Event Scheduled`, or backfilled from `contact_leads` on email match.

On submission, in one `after()` block: insert here, then **`addGhostMember(email)`** — which already exists in [lib/api/ghost.ts](lib/api/ghost.ts) and already swallows the 422-already-exists. Set `ghost_member_created` from whether it threw, so a Ghost outage is visible rather than silent. **Wrap it so a Ghost failure can't fail the insert** — the lead is worth more than the newsletter subscription, and right now `addGhostMember` throws on any non-422 error.

**BigQuery `datalyze.ai_avatar_queries`** — the analytical log. Same reasoning as `insertContactLead`: BigQuery is ad-blocker-proof and permanent, Mixpanel is neither. Write it from `after()` so logging never blocks the response.

```
query_id, created_at, email_hash, session_id,
question, question_normalized, question_hash,
answered BOOL, refusal_reason,        -- below_threshold | flat_gap | insufficient_context | bad_citation | quota_exhausted
top_score, score_gap, scores_top5 ARRAY<FLOAT64>,
retrieved_chunk_ids ARRAY<STRING>, cited_doc_ids ARRAY<STRING>, source_tiers ARRAY<STRING>,
latency_embed_ms, latency_search_ms, latency_rerank_ms, latency_generation_ms, latency_total_ms,
cache_hit BOOL, model, embedding_model, index_version, tau, delta,
input_tokens, output_tokens, question_index_in_session, referrer
```

Three things people leave out and regret: **`index_version` + `tau`** (without them you can't tell whether last month's refusal rate moved because your content changed or because you changed the threshold — and that question comes up constantly), **the full top-5 score array** (when you revisit τ in three months, the distribution is what you need and it can't be reconstructed), and **`email_hash` not `email`** in the query log — the raw email belongs in `ai_avatar_users` once, not on every row.

**Mixpanel** — the behavioural funnel, following existing conventions. **Call `identify()` on email submission**, using `sha256(email)` rather than the raw address — it joins chat behaviour to the existing session-replay and contact-form funnels (which is the whole value) without putting plaintext emails into a third party you're already proxying to dodge ad blockers. The mapping back to a real person lives in `ai_avatar_users`, where it belongs. Also `mixpanel.people.set` the first-seen date and question count so you can build cohorts on it.
`Ask AI Link Clicked` (free from `CtaButton`) · `Ask AI Email Submitted` · `Ask AI Question Submitted` · `Ask AI Answer Received` · `Ask AI Refused` · `Ask AI Citation Clicked` (**the strongest quality signal you'll get** — clicking through means the answer was worth pursuing) · `Ask AI Quota Reached` · `Ask AI Booking Clicked`.

That last one joins to `Calendly Event Scheduled`, which is **already tracked** — so you get end-to-end hero-link → booked-call attribution on day one. Score *buckets* in Mixpanel, raw floats in BigQuery; Mixpanel handles continuous properties badly.

### The refused-query log is the real product

Weekly Resend digest:

```sql
SELECT question_normalized, COUNT(*) n, AVG(top_score) avg_score
FROM `joindatalyze.datalyze.ai_avatar_queries`
WHERE NOT answered AND refusal_reason IN ('below_threshold','flat_gap')
  AND created_at > TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 7 DAY)
GROUP BY 1 HAVING n >= 2 ORDER BY n DESC LIMIT 25
```

`n >= 2` is the point: **a question two strangers independently asked that you haven't written about is a validated content brief.** Cluster by embedding similarity before reading — the same question arrives in fifteen phrasings and the raw list reads as noise. You have the embedding pipeline; it's five lines.

Two guardrails weekly: **refusal rate** (a sudden *drop* means the gate broke — that's the dangerous direction) and **p95 latency**.

## 2.9 SEO

**First, the distinction — this is two separate things, and my earlier question was about the second one.**

| | **`/ask`** — the live chat | **`/ask/[slug]`** — the SEO pages |
| --- | --- | --- |
| Who asks | Any visitor, anything they type | You, in advance — a fixed list |
| When answered | Live, per request | Once, at build time |
| Who sees it | That one visitor | Google, then everyone |
| Gated | Yes (email + 3 questions) | No — public, static |

The live chat is exactly what you described and nothing about it changes: a visitor types anything, the model retrieves from the KB and answers or refuses. No human in that loop, ever.

But **that page cannot rank.** It's an input box behind an email gate — no text for Google to index, and Googlebot can't fill a form or type a question. If SEO is a goal (you said it is), the ranking has to come from somewhere else: a set of pages that already contain a question and its answer as static HTML, before anyone visits.

That's `/ask/[slug]`. And because those pages are *published content with your name on them* — indexed, permanent, and quotable — the question was whether the model's draft goes live unreviewed.

**Recommendation: model drafts, you review, publish only what passes.** It's ~20–40 pages, one time, maybe two hours of reading. Everything after that is automated. The live chat's safety net is that a bad answer is seen by one person and dies; a bad `/ask/[slug]` page is indexed by Google and cited back to you for years. Different risk, so a different bar.

**Two rules for those pages.**

1. **Curate. Never auto-publish.** Mass-generating answer pages from your refusal log is scaled content abuse and it will hurt the domain that `/blog` proxy work was built to protect. Pick 20–40 questions you actually answer well, review each answer, publish those.
2. **Only publish questions your KB genuinely answers**, at high confidence — meaning τ with a wide margin. If a page's answer would have been a refusal, it doesn't become a page. It becomes a blog post first.

Implementation on **Next 15.1** (what you're on): a `generateStaticParams` + `export const revalidate` route. Answers are generated at build/revalidate time, not per request, so latency and cost are irrelevant and there's no gate to bypass.

Each page: the question as `<h1>`, the answer, **linked citations to the source posts** (real internal links to `/blog/*`, which helps both pages), a related-questions block, and `QAPage` JSON-LD via the existing [JsonLd](components/seo/JsonLd.tsx) component. Add the routes to [app/sitemap.ts](app/sitemap.ts).

**Don't turn on Cache Components / PPR for this.** It requires Next 16 and a `cacheComponents: true` migration; `generateStaticParams` + ISR gets you the identical outcome on 15.1. Worth revisiting when you upgrade Next for other reasons — not as part of this project.

The compounding loop this creates is the actual long-term value: refused questions → what to write → blog post → enters the KB → the question becomes answerable → becomes a `/ask/[slug]` page → ranks → brings people who ask more questions.

---

# Phase 3 — Build order

I agreed with your r1 sequencing and I still do — retrieval and refusal before automation. But the r1 ordering assumed the corpus was usable and only the serving layer was missing. It isn't: §0.2 means **the corpus rebuild moves to the front**, because retrieval quality can't be evaluated and citations can't be built on chunks with no provenance.

The riskiest thing is no longer "will retrieval work." It's **"can we reconstruct provenance for content that was pasted into a Doc without it."**

### Step 1 — Rebuild the corpus with provenance · **3–4 days**

Ghost Content API → 82 posts with URLs and dates. Apify actor `8xdDFsUQcFTpodoxO` against your profile → LinkedIn posts with URLs and dates. **Strip the 63 duplicated blog posts and the 347 `Post N` sections out of the Doc** (exact title match does most of it); what remains is internal. Parse the Doc per-section with the tier/date/url comment line. Build `kb_documents` + `kb_chunks`, embed with `voyage-context-4`, load BigQuery, upsert Upstash. Fix the three §0.4 bugs. **Write it as a standalone script first** — it becomes the sync job's body in step 5.

*Risks:* Now materially lower — you've confirmed the actor returns URL and date per post, which was this step's biggest unknown. What's left: the 5 near-match Doc sections need hand-checking (a couple of hours, and it's the last time); the Apify run may return fewer than 355 posts if LinkedIn paginates oddly, so **compare the returned count against 355 before ingesting** and re-run rather than accepting a short pull; and any posts that genuinely don't come back get tiered `internal` — present and answerable, just uncited — rather than dropped.

### Step 2 — Offline retrieval harness · **2 days**

A **script**, not a route, not a page. Question in → ranked chunks with scores out. Layer hybrid search, then rerank, then tier multipliers, measuring recall@5 at each stage so you know which layer earned its place. Verify the parent-expansion (§2.1) returns whole posts cleanly.

*Risks:* Upstash hybrid tuning (dense/sparse weighting) taking longer than expected. Reranker latency worse than budgeted from India → measure p95, not p50. The urge to build UI here — resist it; you'll iterate 50× faster without a browser.

### Step 3 — Threshold calibration · **half a day, automated**

Per §2.4. Generate both halves with Claude. Sweep τ and δ. Pick zero-leak. Commit questions, scores, and thresholds with a dated comment.

*Risks:* Generated answerable questions being too easy because they're derived from chunk text — mitigate by asking for questions a *visitor* would type, not a summary. Zero-leak coverage below 40% → **go back to step 2**; that's a retrieval problem wearing a threshold costume.

**This is the go/no-go gate.** If it fails, it fails cheaply, before any UI exists.

### Step 4 — API route + refusal gate, no UI · **2 days**

`app/api/ask/route.ts`. Node runtime, streaming. Threshold + gap gate, structured citations, deterministic ID validation, `INSUFFICIENT_CONTEXT`. Nearest-content fallback for refusals. Log to `ai_avatar_queries` via `after()`. Test with `curl`.

*Risks:* Streaming prose *and* emitting structured citations pull against each other — you'll likely stream the answer and emit citations at the end. Verify `after()` actually writes when the client disconnects mid-stream. **Read the `ai-sdk` skill before writing this** — don't write streaming code from memory.

### Step 5 — Email gate, quota, chat page, hero link · **3–4 days**

Email modal → signed cookie → `ai_avatar_users` + `addGhostMember`. Redis counters. Post-question-3 modal. The chat page in existing tokens. `.btn-link` + the hero link with `location="home_hero_ask_ai"` + both `.hero__buttons` blocks.

*Risks:* The email gate suppressing usage more than expected — instrument the drop-off from `Ask AI Link Clicked` → `Ask AI Email Submitted` from day one so you can see it. Mobile keyboard + streaming viewport is fiddly. Refusal reading as an error rather than an honest answer. Ship 5–8 suggested starter questions; they set scope expectations and cut first-contact refusals substantially.

### Step 6 — Abuse controls + ship · **1 day**

BotID, IP-hash secondary limit, response cache, output cap, circuit breaker. **Ship here.** A manual index refresh is a script run; read real refused queries for two weeks before automating anything.

### Step 7 — Weekly sync · **3–4 days**

`vercel.ts` cron + `/api/kb/sync`, wrapping step 1's script. Ghost first (cleanest API, highest-value content, proves the hash/MERGE/tombstone path), then the Doc, then Apify last (most fragile). Count-drop guard, soft deletes, Resend alerts, cache invalidation. **Add `GHOST_CONTENT_API_KEY`, `VOYAGE_API_KEY`, `APIFY_TOKEN`, `CRON_SECRET`, and the Upstash vars to `push-env-to-vercel.sh`.**

*Risks:* The empty-source-wipes-the-KB failure — the guard is non-negotiable. Normalization instability re-embedding everything weekly (watch the "documents changed" count in the sync email; near 100% means normalization is broken). Apify actor drift. Upstash and BigQuery drifting out of sync — make BigQuery authoritative and add a weekly count reconciliation.

### Step 8 — SEO pages + refused-query digest · **2 days**

`/ask/[slug]` for 20–40 curated questions, `QAPage` JSON-LD, sitemap entries. The weekly digest email.

---

**Total ~2.5–3.5 weeks**, go/no-go at day 5–6, shippable at step 6 (~2–2.5 weeks).

### Where I'd push back

- **The corpus rebuild is not optional and it's not a nice-to-have.** If you take one thing from this revision: your citation feature, your "closest thing I've written" refusal, and your SEO pages are all the same feature — a link to source content — and none of them exist on the current index. That's step 1 and it can't be deferred.
- **Don't skip threshold calibration** (§2.4). I've made it an automated afternoon instead of a writing exercise. Shipping τ un-set on a product whose entire premise is refusal correctness is the one place I'd genuinely dig in.
- **One-chunk-per-post is right for citation and generation, wrong for retrieval** (§2.1). Retrieve small, generate big — you get what you asked for without the recall cost.
- **Everything else you specified, I'd build as specified.** The email gate, the 3-question limit, the always-present CTA, the SEO pages, LinkedIn as published content — all good calls. The email gate in particular makes this a better product than the free-and-anonymous version in r1.

---

# Decisions locked

Everything below is settled and reflected in the plan above. Recorded here so nobody relitigates it in three weeks.

| # | Decision | Consequence |
| --- | --- | --- |
| 1 | **Rebuild the corpus** | Step 1. Ghost + Apify + stripped Doc, all with provenance |
| 2 | **Re-pull LinkedIn from Apify**, actor `8xdDFsUQcFTpodoxO` | Gets real URLs + dates for all ~355 posts. The 8 posts the old 200-char filter silently dropped come back too |
| 3 | **Your own posts only** | The 13,000+ rows in `social.linkedin_founder_posts` / `linkedin_3k_user_posts` are prospects' posts. **Never ingest them** — the avatar would answer in strangers' words |
| 4 | **One Google Doc, `1QNqJfVtAqZo…`** | Single Doc source, per-section hashing (§2.6). No multi-file Drive folder needed |
| 5 | **Global fuse: 1,500 answered questions/day** | Distinct from your 3-per-person limit — see §2.7. Never fires in normal operation |
| 6 | **Doc is safe to surface, except pricing figures** | Three-layer redaction, §2.6. Layer 3 (output regex) is the actual guarantee |
| 7 | **Refusals styled as answers, not errors** | No `--negative`, no warning iconography. §2.8 |
| 8 | **Identify users, log to BigQuery, push to Ghost** | `ai_avatar_users` + `identify(sha256(email))` + `addGhostMember`. §2.8 |
| 9 | **`/ask/[slug]` answers: model drafts, you review** | ~20–40 pages, one afternoon, one time. §2.9 |
| 10 | **Apify actor returns URL + date per post** | Confirmed. No LinkedIn-export fallback needed; step 1's biggest risk is gone |
| 11 | **`tutorial` tier for the `[Week N]` series** | 0.95 multiplier. Breaks ties toward your voice without losing how-to questions. §2.6 |
| 12 | **All 82 Ghost posts are in scope** | No exclusions. The sync takes everything, including case studies |
| 13 | **URLs: `/ask` and `/ask/[slug]`** | Locked before Google indexes anything. Goes in [app/sitemap.ts](app/sitemap.ts) |

### Two things in your answers I changed

**Don't narrow the Apify actor to "last 1 week" in the UI.** It would tombstone your entire LinkedIn corpus on the first run — the delete reconciliation treats "not returned by this pull" as "deleted." Drive the window from the sync's API call instead, and split runs into `full` (monthly, reconciles deletes) and `incremental` (weekly, upsert-only). Full reasoning in the box in §2.5. This is the single highest-consequence correction in this revision.

**Case studies aren't a separate source** — they're already Ghost posts. One fewer integration.

### And one thing I found while checking

**63 of your 82 Ghost posts are already pasted into the Google Doc verbatim**, including all 14 case studies and the whole 28-part `[Week N] Learning Mixpanel` series. Ingest both without stripping and those posts get indexed twice — once with a URL at `published`, once without at `internal` — which quietly breaks citations and makes the tier system meaningless. §2.1 covers the strip (exact title match catches 63 of them mechanically) and the permanent dedup guard. Budget for the Doc dropping to ~100–200 chunks once published content moves out.

---

# Still open

**No open design questions.** What's left is credentials, plus three decisions the build surfaced.

### Provision to unblock the next step

| What | Unblocks |
| --- | --- |
| `VOYAGE_API_KEY` | Embedding the 568 chunks already in BigQuery, then step 2 (retrieval harness). **This is the critical path.** |
| `APIFY_TOKEN` | LinkedIn ingestion — ~355 posts, currently absent from the KB entirely |
| `UPSTASH_VECTOR_*`, `UPSTASH_REDIS_*` | Step 2 serving, step 5 quota/cache. Vercel Marketplace, one account |
| `CRON_SECRET` | Step 7 |
| `ANTHROPIC_API_KEY`, `GHOST_CONTENT_API_KEY` | Already in `.env.local`; **add both to `push-env-to-vercel.sh`'s `VARS`** or the cron works locally and 500s in production |

### Questions the build surfaced

1. **5 Ghost posts are drafts and are currently excluded** — *Creating a good tracking plan using AI*, *How to actually improve your app's retention*, *Identity Stitching*, *Why most analytics work dies in a Slack channel*, *The $5K Analytics Stack That Should Cost $100*. You said keep all 82; the Content API only serves 77. Publish them and they're picked up automatically on the next sync. Want them in before that, as `draft` tier?

2. **The Doc's live ID is gone.** The pickle recorded `1QNqJfVtAqZo…` and nothing in your Drive matches it. The build currently reads the committed `Knowledge base - Ansh.md`. Send me the live Doc ID for `KB_GDOC_ID` — otherwise the weekly sync reads a snapshot that never changes.

3. **After the strip, the Doc is only 51 chunks of genuinely internal content.** That's thin — it's your positioning, hard rules, ICP, and engagement model, and nothing else. Worth deciding whether to write more into it (methodology, opinions you haven't blogged), because right now the avatar's voice comes almost entirely from published posts.

### Decisions deferred by design

Not open questions — things this plan intentionally defers until real traffic exists:

- **The paywall.** Ship the 3-question limit, watch how many people hit it, decide later.
- **The `tutorial` multiplier (0.95)** and **the daily fuse (1,500)** — one number each, tuned from logs.
- **τ and δ** — set at step 3, then re-derived from production refusals.
- **The LLM verification pass** — cut from v1 (§2.4); add only if logs show extrapolation leaking.
- **Splitting LinkedIn to its own tier** — only if throwaway takes outrank considered posts.
