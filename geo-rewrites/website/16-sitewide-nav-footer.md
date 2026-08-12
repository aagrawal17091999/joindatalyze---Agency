# 16 - Sitewide: layout metadata, entity graph, nav and footer

Source: `app/layout.tsx`, `lib/seo.ts`, `app/_components/{nav,footer}.tsx`

This isn't a page rewrite - it's the copy and structured data on every page, and it's where
the contradictions flagged elsewhere actually get published to answer engines. All four
decisions land here.

---

## A. The rewritten piece

### Site-wide `<title>` template and description

**Current:**
- Default title: `Datalyze - Analytics & Growth Partner`
- Template: `%s | Datalyze`
- Description: *"We've seen this across 150+ startups. Datalyze rebuilds your data foundation, then shows you the growth your data has been hiding."*

**Change to:**
- Default title: `Datalyze - Analytics & Growth Partner for Startups` *(50 chars)*
- Template: `%s | Datalyze` *(keep)*
- Description: `Datalyze rebuilds your data foundation, connects your tools into one source of truth, and finds the growth hiding in it. 150+ startups.` *(133 chars)*

**Why:** the current description opens with "We've seen this across 150+ startups" - a
sentence fragment that depends on context the reader doesn't have. As a standalone snippet it
reads as a non-sequitur, and it's the fallback description on every page without its own.

---

### Organization description (structured data)

**Current:** *"Datalyze is an analytics & growth partner. We rebuild your data foundation, then surface the growth your data has been hiding."*

**Change to:** *"Datalyze is an analytics and growth consultancy for startups. We rebuild the data foundation - events, pipelines, definitions, models - connect product, marketing, revenue and warehouse tools into one source of truth, and run the experiments that turn it into revenue. Founded 2019 by Ansh Agrawal."*

**Why:** this is the single most important string on the site for entity resolution - it's
what an answer engine reads to learn what Datalyze *is*. The current version uses a metaphor
("surface the growth your data has been hiding") where it should use nouns. Naming the
service categories, the founder and the founding year makes the entity resolvable.

**Also add to `organizationNode`:**

```
foundingDate: '2019'
founder: personRef              // already present
areaServed: 'Worldwide'
knowsAbout: [ … ]               // mirror the Person's list
sameAs: [ LinkedIn, + ADD: YouTube channel, Gumroad, Twitter/X if any ]
```

The `sameAs` array currently holds one URL. You have a YouTube channel and a Gumroad store
linked from `/resources` that aren't declared as the same entity. [ADD: the full list.]

---

### Person description (structured data)

**Current:** *"Built analytics infrastructure for 90+ startups before founding Datalyze in 2025…"*

**Change to:**

> *"Built analytics infrastructure for 150+ startups since founding Datalyze in 2019.
> Specializes in product analytics, experimentation, and the messy first 90 days of fixing a
> broken stack. Mixpanel Certified Partner. Based in India."*

This string is in structured data, so it's the version an answer engine repeats. Both fixes -
150+ and 2019 - matter most here.

**Also add:** `alumniOf` / `worksFor` history is absent, and `knowsAbout` omits several
topics you actually publish on - incrementality, marketing mix modelling, data warehousing
for D2C, identity stitching. Worth adding, since `knowsAbout` is a direct topical-authority
signal.

---

### Footer tagline

**Current:** *"The foundation your data was supposed to be. We rebuild it, then find the growth it's been hiding."*

**Keep it.** It's in voice and it's on every page. No change.

---

### Nav and footer link changes

| Change | Where | Why |
|---|---|---|
| ❌ ~~Delete `/resources/improve-app-retention`~~ | - | **My error.** There's no `page.tsx` for it, which is what I checked - but `next.config.ts:54` rewrites the path to the static `retention-demo.html` microsite, so it returns 200. Nothing was changed. |
| ❌ ~~Add `/case-studies` and `/tools` to nav~~ | - | **My error.** Both are already in `PRIMARY_LINKS` / `SECONDARY_LINKS`. Nothing was changed. |
| ✅ Drop `target="_blank"` on `/blog/` | Nav **and** footer | `/blog` is your own Vercel-proxied Ghost on the same domain; marking it external leaked crawl and link equity. Applied in both places. |

---

## B. Title, meta description, slug

Covered above - this section governs the sitewide defaults rather than one page.

---

## C. FAQ block

N/A - sitewide layer.

---

## D. "Add real data here"

**✅ All four decisions are applied above.** Code changes they imply:

| File | Change |
|---|---|
| `app/_components/footer.tsx` | `/blog/` no longer marked `external` |
| `app/_components/nav.tsx` | Same - `/blog/` is an internal `<Link>` now |
| `lib/seo.ts` | `personNode.description`: 90+ → 150+, 2025 → 2019. Add `foundingDate: '2019'` and `areaServed` to `organizationNode`. Rewrite `organizationNode.description` per above. |
| `app/about/page.tsx` | Founder note "In 2025" → "In 2019"; `TEAM` bio 90+/2025 → 150+/2019; `metadata.description` → 2019 |
| `app/layout.tsx` | New default title + description |
| `components/engagement/EngagementModel.tsx` | Delete the PLACEHOLDER pricing comment |

Still open:

1. **[ADD: full `sameAs` list]** - YouTube, Gumroad, Twitter/X, personal site. Currently one
   LinkedIn URL each for the org and the person.
2. **[ADD: expanded `knowsAbout`]** - incrementality testing, marketing mix modelling,
   identity stitching, D2C data stacks. All topics you've published on.
3. **⚙️ `rocketsdr.ai` pixel** loads on every page from `<head>`. Not a copy issue, but worth
   confirming it's still wanted.

---

## E. Internal links

Covered in the nav/footer table above.

---

## F. Change note

Rewrote the two strings that define the Datalyze entity for answer engines (sitewide meta
description and Organization description) to use concrete service nouns instead of metaphor,
propagated the 150+/2019 decisions through the Person and Organization nodes, and listed the
six files that need editing. No page prose gets longer - this file only touches metadata,
schema and links.
