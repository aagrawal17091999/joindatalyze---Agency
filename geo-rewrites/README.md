# GEO rewrites - review folder

One file per page/post. Each follows the same structure:

- **A.** The rewritten piece (ready to publish)
- **B.** `<title>` + meta description + slug
- **C.** FAQ block
- **D.** "Add real data here" - every `[ADD …]` placeholder needing your input
- **E.** Internal links to add
- **F.** One-line change note

**Status: all 16 website files are APPLIED to the repo** (branch `geo-fixes`, 2026-08-12).
Build passes, every route returns 200. These files stay as the record of what changed and
what's still blocked on your input. Ghost posts are not started yet.

## Status

### Website (`website/`)

| # | File | Page | Applied |
|---|---|---|---|
| 01 | `01-homepage.md` | `/` | ✅ full |
| 02 | `02-pricing.md` | `/pricing` | ✅ done - "what's not included" dropped |
| 03 | `03-how-it-works.md` | `/how-it-works` | ✅ done - durations dropped, no phase table |
| 04 | `04-about.md` | `/about` | ✅ full |
| 05 | `05-case-studies.md` | `/case-studies` | ✅ full |
| 06 | `06-faqs.md` | `/faqs` | ✅ done - 14 Q&As, the other 6 dropped |
| 07 | `07-contact.md` | `/contact` | ✅ done - "after you book" dropped |
| 08 | `08-ai-analytics-agent.md` | `/ai-analytics-agent` | ⏭️ skipped by request |
| 09 | `09-ask.md` | `/ask` | ⏸️ open - link list pending your call |
| 10 | `10-resources.md` | `/resources` | ✅ full |
| 11 | `11-resources-client-vs-proxy-vs-server.md` | `/resources/client-vs-proxy-vs-server-tracking` | ✅ full |
| 12 | `12-tools-index.md` | `/tools` | ✅ full |
| 13 | `13-tool-analytics-maturity-grader.md` | `/tools/analytics-maturity-grader` | ✅ full |
| 14 | `14-tool-analytics-strategy-creator.md` | `/tools/analytics-strategy-creator` | ✅ full |
| 15 | `15-tool-event-tracking-plan-generator.md` | `/tools/event-tracking-plan-generator` | ⏭️ skipped by request (FAQ block was still added) |
| 16 | `16-sitewide-nav-footer.md` | Nav + footer + layout metadata | ✅ full |

**`/ask` is the only page still open.** Two separable pieces:

1. **A link list of the 17 `/ask/[slug]` questions** - needs no writing from you. Those pages
   are currently orphaned: nothing on the site links to them, and their only discovery path
   is `sitemap.ts`. A sitemap tells a crawler a URL exists but carries no importance signal,
   and the AI crawlers (GPTBot, PerplexityBot, ClaudeBot) mostly follow links rather than
   parsing sitemaps. It's a list of links, not prose, so it doesn't add page weight.
2. **A paragraph on why refusal beats a wrong answer** - optional, and only worth doing in
   your own words.

Everything else is closed. Where an answer needed facts I didn't have, the section was
dropped rather than shipped with placeholder text - nothing incomplete went live.

Not rewritten (no prose to optimise): `/contact/booked`, `/ask/[slug]` (template - the
answer corpus in `lib/data/ask-answers.ts` is handled separately),
`/tools/[toolId]` (template), `/tools/analytics-maturity-grader/results` (template).

### Ghost posts (`ghost/`)

82 posts. Started after the website set is approved.

## House rule: keep the pages short

**The site should not get more text-heavy.** Every rewrite here is written to that
constraint:

- **On-page prose stays lean.** Two or three short sentences per block, max. If a paragraph
  runs past four lines on a laptop, it's too long.
- **Depth lives in structure, not prose.** Tables, one-line definitions, and the FAQ block
  carry the detail. Those are scannable and they're what answer engines extract anyway - a
  long paragraph is worse for both the reader *and* the model.
- **The answer-first opener is the exception**, and even that is 2–3 sentences, not 4.
- **Net text added per page should be close to zero.** Where a section was added, something
  else was cut or compressed.

If a file below reads long, it's because sections D–F are working notes for you - those
never ship. Only section A is page copy.

## Blockers - resolved

| # | Issue | Decision |
|---|---|---|
| 1 | ~~Sitewide footer link to `/resources/improve-app-retention` (404 on every page)~~ | **❌ My error - not broken.** `next.config.ts:54` rewrites that path to the static `retention-demo.html` microsite. The route returns 200. Links restored, no change made. |
| 2 | 90+ vs 150+ startups | **150+ everywhere**, including `lib/seo.ts` `personNode.description` |
| 3 | "Seven years" vs "founded 2025" | **Founded 2019.** So "7 years" is correct and the founder note's "In 2025, I started Datalyze" is the line to fix. Also update `metadata`, the org node's `foundingDate`, and the `/about` bio. |
| 4 | Pricing marked PLACEHOLDER in code | **Prices are live.** Remove the PLACEHOLDER comment from `components/engagement/EngagementModel.tsx`. Still fix the homepage FAQ line that says "$2,000–$5,000 per month" - it contradicts the $1k audit tier. |

## Other findings - all closed

5. **✅ 17+ vs 16 case studies.** Not a contradiction: a 17th study (Buildern) exists in
   `caseStudyList`. The page now says "seventeen" consistently.
6. **✅ Email gate now disclosed.** The Maturity Grader FAQ states plainly that it asks for
   your email to send the scorecard, and that nothing connects to your analytics tools. This
   mattered because `/tools` claims "genuinely free and self-serve - no sales call required"
   and "your data and credentials stay with you" - both true, and together misleading.
7. **⏭️ `/ai-analytics-agent` has no price.** Still the only service page without one, while
   asking for a 4–6 week commitment. Skipped by request.
8. **✅ Duplicate FAQPage schema fixed.** `/` now carries 5 buying questions; `/faqs` is the
   canonical FAQ entity with 14, grouped into five sections.
9. **✅ Grader dimensions corrected.** The landing copy named five dimensions that didn't
   match the five actually scored in `maturity-grader-data.ts`.

## Content gaps you decided to drop

Recorded so they don't get re-raised: what's not included in an engagement, cancellation
terms, NDA policy, timezone coverage, weekly hours from the client team, who writes the
instrumentation code, AI-agent pricing and data handling, per-phase durations, tracking-plan
sample rows and naming conventions.

## Ghost publishing

The 77 published posts can only be updated in place while live - Ghost's Admin API has no
draft-revision-of-a-published-post. Confirm before I write anything back. The 5 existing
drafts can be updated safely either way.
