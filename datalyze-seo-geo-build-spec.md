# Datalyze — SEO + GEO Build Spec for Claude Code

**Purpose:** Hand this file to Claude Code with every landing-page build. It defines how to structure, write, and mark up a page so it ranks in Google (SEO) and gets cited by AI answer engines like ChatGPT, Perplexity, Gemini, and Google AI Overviews (GEO).

**How to use:** Fill in the Page Brief block below, then tell Claude Code: *"Build this page following the Datalyze SEO + GEO Build Spec. Run the final QA gate before you finish."*

---

## 0. Page Brief (fill this in per page)

```
PAGE TYPE:        [ money | cluster | problem | vertical | comparison | tool ]
SLUG:             /...
PRIMARY QUERY:    the one search phrase this page targets
FAN-OUT QUERIES:  3-6 sub-questions a user/AI would break the primary query into
PRIMARY ENTITY:   the thing this page is "about" (e.g. "Mixpanel implementation", "product analytics consultant")
PRIMARY CTA:      Book a call | Download | Get the audit
SUPPORTING ASSET: existing post/case study to draw real content + numbers from
PROOF TO USE:     specific case-study numbers relevant to this page (e.g. Copyfy +31% signup)
```

> The FAN-OUT QUERIES field is not optional. AI engines split a question into smaller sub-queries, search each one, then synthesize. The page must contain a section that cleanly answers each sub-query. This is the single highest-leverage GEO input.

**Before building, verify intent.** Search the PRIMARY QUERY on Google and look at what already ranks on page one. If the results are service/agency pages, this is a money page (sell template, conversion-first). If they are blog posts and guides, this is informational (read template, depth-first). Build the page type the SERP rewards, not the one you assumed.

**One primary query per page, no cannibalization.** Each page owns exactly one primary query and intent. Do not let it compete with a sibling page for the same phrase. If two pages would both target, say, "mixpanel setup," split them by intent (a *hire-us* service page vs a *how-to* guide) or merge them. Cluster closely related long-tails onto one page instead of making a page per minor variation.

---

## 1. Non-negotiable rules (brand + correctness)

These override everything else. A page that breaks these ships broken.

1. **ZERO em dashes (—) or en dashes (–) in body copy.** Use commas, periods, parentheses, or " - " (spaced hyphen). This is a hard brand rule and also the fastest tell of AI-generated text.
2. **No marketer words:** leverage, synergy, unlock, transform, robust, best-in-class, actionable (as filler), holistic, "in today's data-driven world." Write plainly.
3. **Every claim is real.** Use only true Datalyze numbers and real case studies. Never invent a stat, client, or result. If a number isn't verified, don't write it. Fabricated specifics destroy both trust and GEO (AI cross-checks across sources).
4. **Specificity over vagueness.** "200+ unused events," "14% average lift," "4,949-user tracking gap" - never "a lot" or "many." Specific numbers are what AI extracts and cites.
5. **Brand design tokens.** Background `#0A0A0B`, lime accent `#D4FF3F`. Display: Instrument Serif. Body: General Sans. Mono/numbers: JetBrains Mono. Hard corners (no border-radius). Editorial-brutalist.
6. **Template family by page type.** Money / vertical / comparison pages use the **sell template** (high brand expression, proof, repeated CTA). Cluster / problem pages use the **read template** (content-first, narrow measure, brand as accent, soft CTA).
7. **Human-readable, not robot-readable.** Do not over-format into endless bullets and repetitive scaffolding. AI extraction likes structure, but a page that reads like a machine wrote it loses human trust and gets penalized for thin/low-quality signals. Structure serves the reader first.
8. **Every URL earns its place in the index.** Each page must carry genuinely unique main content, at minimum 300+ words that exist on no other page (tool-specific gotchas, a real case snippet, distinct FAQs). If you cannot write that much unique, expert content for a page, do not build it. This matters most for the templated tool, vertical, and use-case pages, where near-duplicate "swap the keyword" pages trigger Google's site-wide thin-content penalty and drag down the whole domain.

---

## 2. Page architecture (on-page structure)

### 2.1 The answer-first opening (most important block on the page)

The first 150-200 words carry disproportionate weight in both Google's AI features and external LLM retrieval. Lead with the answer, do not build up to it.

- **First sentence = a definitional statement** using the pattern: *`[Entity] is a [category] that [differentiator].`*
  Example: "A Mixpanel implementation is the setup of event tracking, identity resolution, and reporting that turns raw user actions into metrics a product team can trust."
- **Next 2-4 sentences** directly answer the PRIMARY QUERY in full. Assume the reader (or the AI) reads only this block.
- For cluster/problem pages, add a short **"Short answer" / TL;DR block** right after the H1: 2-4 sentences or a tight 3-5 item summary that an AI can lift whole. Keep it plain text, no links or images inside it (links/images break clean extraction).

### 2.2 Heading hierarchy

- **One H1.** Contains the primary query phrase, reads naturally, not stuffed.
- **H2s are questions or clear topics that map to the FAN-OUT QUERIES.** If a fan-out query is "how long does Mixpanel setup take," there is an H2 that answers exactly that. Phrase H2s the way a person would ask.
- **H3s** break H2 sections into scannable parts. Don't skip levels.
- Every H2 section should be **self-contained**: answerable on its own if an AI pulls just that section out of context.

### 2.3 Paragraphs and rhythm

- **2-3 sentences per paragraph, maximum.** Long blocks are harder to parse and less likely to be cited.
- Single-sentence paragraphs are fine for emphasis (matches Datalyze voice).
- Use the "**Not because X. Because Y.**" construction where it fits naturally.

### 2.4 Required structural elements

- **FAQ section** near the bottom, 4-8 Q&As, where each question matches an exact phrase a user would type or ask an AI. Pull these from the FAN-OUT QUERIES and from real client questions. Mark up with FAQPage schema (see §4).
- **Comparison or summary table** wherever the topic involves options, tiers, or "X vs Y" (tables are extracted cleanly by AI and favored for citation). Use a real table, not an image of one.
- **A citable "framework" or data box** on cluster/problem pages: a named, self-contained nugget (a checklist, a 3-step method, a benchmark) that an AI can quote and attribute. This is where Datalyze's proprietary experience becomes a citation.
- **Visible author bio block** on every cluster/problem/content page: a short bio for Ansh Agrawal with role, credentials (Mixpanel Certified Partner, 7 years, ex-CRED, 150+ companies), and a link to his profile. This is a confirmed E-E-A-T and AI-citation signal, and the schema `Person` node alone does not satisfy it. The bio must be visible on the page, not just in JSON-LD.
- **Internal links:** every cluster/problem page links up to its money page (e.g. a Mixpanel how-to links to "Mixpanel implementation & consulting"), and across to 2-3 sibling pages in the same cluster. Every money page links down to 3-5 supporting cluster pages. Use descriptive anchor text, never "click here." This hub-and-spoke linking is how a small site signals topical authority and distributes link equity.
- **Primary CTA** appears at least twice on sell-template pages (after the opening value prop, and at the end). Once, softly, at the end of read-template pages.

### 2.5 Freshness signals (GEO citations decay without these)

- Visible **"Last updated: [Month Year]"** near the top of content pages.
- `dateModified` in schema kept current on every edit.
- Reference the current year in at least the title and opening where the topic is time-sensitive (tool comparisons, pricing, "best X").
- Plan a refresh cycle: revisit priority pages every 60-90 days, update a stat, add an FAQ from real questions, bump the date.

---

## 3. Technical SEO checklist

Every page must satisfy all of these before it ships.

**Metadata**
- `<title>` — under ~60 chars, primary query near the front, brand at the end. Format: `Primary Query | Datalyze`.
- `<meta name="description">` — 140-160 chars, contains the primary query, written as a benefit, ends with an implicit reason to click. Not keyword-stuffed.
- One `<h1>` matching the page intent.
- `<link rel="canonical">` set to the clean URL.
- Slug is short, lowercase, hyphenated, keyword-bearing, no dates or stop-word clutter.

**Crawl + index**
- Page is in `sitemap.xml`; `robots.txt` does not block it.
- No accidental `noindex`.
- Internal links use absolute, clean URLs. No orphan pages (every page linked from at least one other).

**URL structure (use this exact scheme for every new page)**
- Brand and utility at root: `/about`, `/contact`, `/case-studies`.
- Money / service pages under `/services/`: `/services/mixpanel-implementation`, `/services/posthog-implementation`, `/services/analytics-audit`, `/services/data-infrastructure`, `/services/ai-analytics-agent`, with `/services` as the pillar hub.
- Content (clusters, problem/solution, comparisons, migrations-as-content) under `/blog/`: `/blog/mixpanel-retention-analysis`, `/blog/two-tool-seed-stack`, `/blog/mixpanel-vs-amplitude`.
- Vertical landing pages under `/industries/`: `/industries/saas-analytics`, `/industries/fintech-analytics`.
- Tool / lead-magnet pages under `/tools/`.
- Folder depth is not a ranking factor. This scheme is for consistency, breadcrumbs, and folder-level analytics, not a ranking boost. The keyword-bearing slug matters more than the folder. Never relocate a URL that already has search traction without a deliberate 301.

**Semantics + accessibility**
- Semantic HTML5: `<header> <main> <article> <section> <nav> <footer>`, not `<div>` soup.
- Every image has descriptive `alt` text (helps SEO and is the only way AI "reads" an image's intent).
- Logical heading order, no skipped levels.
- Visible keyboard focus states; respects `prefers-reduced-motion`.

**Performance (Core Web Vitals)**
- Mobile-first and fully responsive (most analytics buyers research on desktop, but Google indexes mobile-first).
- Lazy-load below-the-fold images; serve modern formats (WebP/AVIF); set width/height to avoid layout shift (CLS).
- Inline critical CSS or keep CSS lean; defer non-critical JS. Target LCP < 2.5s, CLS < 0.1, INP < 200ms.
- Preconnect/preload fonts; use `font-display: swap`.

**Social / share**
- Open Graph and Twitter Card tags: `og:title`, `og:description`, `og:image` (1200×630, on-brand), `og:url`, `og:type`, `twitter:card=summary_large_image`.

---

## 4. Structured data (JSON-LD)

Schema makes the page machine-readable for both Google and AI engines. Add the blocks relevant to the PAGE TYPE. **Prefer a single `@graph` block with `@id` references that connect the nodes** (Organization ↔ Person ↔ Service/Article), rather than disconnected snippets. Connected entities are what let Google and AI systems resolve "Datalyze" and "Ansh Agrawal" as coherent, linked entities. Keep schema values identical to what's visible on the page (no mismatches). See the Mixpanel implementation page for a worked `@graph` example.

**Two guards, learned the hard way:**
- **Do not add self-serving `Review` or `AggregateRating` schema** to Organization or Service expecting star snippets. Google does not show review rich results for self-applied review markup. Use real testimonials as visible on-page content instead. The stars will not appear, and forcing the schema risks a structured-data manual action.
- **FAQPage rarely earns Google rich results anymore** (Google restricted them to authoritative government and health sites in 2023). Keep FAQPage schema anyway, because its real value now is clean AI extraction and entity clarity, not a Google snippet.

**Sitewide (every page)**
- `Organization` — Datalyze, logo, url, `sameAs` (LinkedIn company page, YouTube, any profiles). This builds the brand as a known entity.
- `BreadcrumbList` — reflects the URL path.

**Author (every content page)**
- `Person` — Ansh Agrawal, `jobTitle: Founder`, `worksFor: Datalyze`, credentials (Mixpanel Certified Partner), `sameAs` to his LinkedIn/profiles. Author authority is a real GEO + E-E-A-T signal.

**By page type**
- **Money / service pages →** `Service` or `ProfessionalService` with `provider: Datalyze`, `areaServed`, `serviceType`, and an `offers`/price-range hint where appropriate.
- **Cluster / problem pages →** `Article` (or `BlogPosting`) with `headline`, `author` (the Person above), `datePublished`, `dateModified`, `image`.
- **Any page with Q&A →** `FAQPage` with each `Question` + `acceptedAnswer`. Questions must match the on-page FAQ exactly.
- **Any list / comparison / "best X" page →** `ItemList` describing the ranked items. Lists are disproportionately cited by AI; making the list machine-parseable compounds that.

**Minimal templates** (fill the brackets, keep current):

```html
<!-- Article + Author (content pages) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "[H1 text]",
  "datePublished": "[YYYY-MM-DD]",
  "dateModified": "[YYYY-MM-DD]",
  "author": {
    "@type": "Person",
    "name": "Ansh Agrawal",
    "jobTitle": "Founder",
    "worksFor": { "@type": "Organization", "name": "Datalyze" },
    "sameAs": ["[LinkedIn URL]", "[YouTube URL]"]
  },
  "publisher": {
    "@type": "Organization",
    "name": "Datalyze",
    "logo": { "@type": "ImageObject", "url": "[logo URL]" }
  }
}
</script>

<!-- FAQPage (any page with a real FAQ block) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "[exact question]",
      "acceptedAnswer": { "@type": "Answer", "text": "[answer]" } }
  ]
}
</script>
```

---

## 5. The GEO layer (getting cited by AI engines)

SEO gets the page into the index. GEO gets it quoted in AI answers. These add on top of everything above.

**What earns AI citations**
- **Answer-first + extractable passages** (see §2.1). The opening and each H2 must stand alone.
- **Original data and named sources.** Lead with Datalyze's own numbers and label them: "Across 150+ implementations, the most common failure we see is..." AI engines prefer first-party data and verifiable specifics over generic claims. This is Datalyze's biggest edge - use it on every page.
- **Question-aligned subheads** matching the FAN-OUT QUERIES, in the phrasing people actually use.
- **Tables, ranked lists, and step-by-step methods.** These formats are extracted and cited far more than prose walls.
- **Outbound citations to authoritative sources** on content/cluster pages. Pages that cite real sources (with outbound links), include statistics, show an author bio, and carry a visible update date earn measurably more AI citations. This applies to content pages, not money pages (a service page should not send a buyer away mid-decision). Cite the original source, never invent an attribution.
- **Definitional sentences** for any key term the page introduces (the `[Entity] is a [category] that [differentiator]` pattern).
- **Freshness** (see §2.5). Stale pages lose citations to newer ones.
- **Consistency.** The same entity names, numbers, and claims across the whole site. Contradictions lower the confidence AI assigns to Datalyze as a source.

**What to ignore (do not waste effort here)**
- Per Google's official 2026 guidance, for Google Search and its AI Overviews/AI Mode you do **not** need `llms.txt`, special markdown files, content "chunking" hacks, or inauthentic mentions. Google's AI features run on the normal Search index, so strong SEO *is* the GEO play for Google.
- `llms.txt` is low-cost and harmless to add for other crawlers if desired, but treat it as optional, not a lever. Do not build strategy around it.
- Do not over-optimize into robotic formatting. Endless bullets and repetitive scaffolding frustrate human readers and signal low quality.

**Page-type nuance (important):** Pure service/money pages convert humans who arrive via SEO and branded search; they rarely get *cited* by AI. Cluster, problem, comparison, and "best X" pages are what earn AI citations. So:
- Optimize **money pages** primarily for SEO, conversion, and entity clarity (clear Service schema, strong proof, sharp CTA).
- Optimize **cluster/problem/comparison pages** primarily for GEO citability (answer-first, original data, tables, FAQ, freshness). These then funnel authority and clicks toward the money pages via internal links.

---

## 6. Content quality bar (E-E-A-T + voice)

- **Experience and expertise on the page surface.** Author byline with credentials (Mixpanel Certified Partner, 7 years, ex-CRED, 150+ companies). First-hand framing: "what we see," "the pattern across our engagements."
- **Proof, not adjectives.** Replace "we're great at retention" with a real result: "+15% Week-2 retention for zeroone." Pull from the SUPPORTING ASSET and PROOF fields.
- **A real point of view.** Datalyze has sharp opinions (two-tool seed stack, analytics debt is a culture problem, fewer tools beat more). State them. Opinionated, defensible content is more citable and more memorable than neutral summaries.
- **Information density over word count.** There is no target length and no padding. Analysis of pages hit by Google's helpful-content changes found no correlation between word count and recovery (recovered pages averaged ~1,400 words, non-recovered ~1,650). Cover the topic completely enough that the reader needs no other page, then stop. Every sentence earns its place or gets cut.
- **Voice:** direct, short sentences, numbers always, no fluff, no hype. Open with an observation or a point, not a throat-clear. Genuine question at the end where it fits, never engagement bait.
- **No fabrication, ever.** If the page needs a stat you don't have, leave a `[VERIFY: ...]` placeholder for Ansh rather than inventing one.

---

## 7. Final QA gate (run before declaring the page done)

Claude Code must confirm every line before finishing:

- [ ] Zero em dashes / en dashes anywhere in copy.
- [ ] No banned marketer words.
- [ ] Every number and claim is real (or flagged `[VERIFY]`).
- [ ] Intent verified against the live SERP; page type (sell vs read) matches what ranks.
- [ ] Page owns one primary query and does not cannibalize a sibling page.
- [ ] Page carries 300+ words of genuinely unique main content (not a template with a swapped keyword).
- [ ] First 150-200 words directly answer the primary query; opens with a definitional sentence.
- [ ] An H2 section exists for each fan-out query, phrased as a real question/topic.
- [ ] Paragraphs are 2-3 sentences max; no padding to a word count.
- [ ] FAQ block present (4-8 Q&As) and matched by FAQPage schema.
- [ ] Table or ranked list present where the topic warrants it.
- [ ] One citable data/framework box on cluster/problem pages.
- [ ] Visible author bio block on content pages (not schema alone).
- [ ] Outbound citations to real sources on content pages (not on money pages).
- [ ] Internal links: up to money page, across to 2-3 siblings, and/or down to cluster pages, descriptive anchors.
- [ ] `<title>` (<60 chars), meta description (140-160 chars), one H1, canonical set.
- [ ] Slug clean and keyword-bearing; page in sitemap; not noindexed.
- [ ] Semantic HTML5; all images have alt text; logical heading order.
- [ ] Open Graph + Twitter Card tags with a 1200×630 on-brand image.
- [ ] JSON-LD present as a connected `@graph` for the page type (Organization + Breadcrumb + Person on content + Service or Article + FAQPage + ItemList as applicable), `@id` references linking the nodes, values matching visible content, and no self-serving Review/AggregateRating markup.
- [ ] "Last updated" visible; `dateModified` current.
- [ ] Core Web Vitals: responsive, images lazy-loaded + sized, fonts swapped, JS deferred.
- [ ] Correct template family (sell vs read) for the page type, on Datalyze brand tokens.
- [ ] Reads like a sharp human practitioner wrote it, not a machine.

---

*Keep this spec versioned. Revisit quarterly as AI engine behavior shifts. Version 1.1, revised against the Datalyze SEO research report. Last updated: June 2026.*
