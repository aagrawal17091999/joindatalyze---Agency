# 02 - Pricing (`/pricing`)

Source: `app/pricing/page.tsx` + `components/engagement/EngagementModel.tsx`

**Note:** this page is already the most GEO-ready on the site - answer-first intro, FAQPage
schema, Service/Offer schema. The rewrite below is a *light* pass: it adds the comparison
table (the biggest extractable structure missing), a one-sentence definition per tier, and
three adjacent FAQs. Everything else is preserved.

---

## A. The rewritten piece

### H1: What Datalyze costs

**Answer-first intro** *(cut from 5 sentences to 3 - the "scale into a project or retainer"
sentence is already implied by the table below)*

> Datalyze pricing starts at $1,000 for a one-time audit. Project work runs $1,500 to
> $4,000; ongoing embedded engagements are $2,000 to $5,000 per month. Work begins within a
> day of kickoff, and everything we build is owned by your team.

---

### Which tier should you pick?

*(New table - the highest-value addition on the page, and it *replaces* prose rather than
adding to it: the "who it's for" and "outcome" lines currently live inside the tab panels
and are only visible one at a time.)*

| # | Tier | Timeframe | Price | Pick this if… | You end up with |
|---|---|---|---|---|---|
| 01 | **Audit** *(best first step)* | 1–2 weeks | From $1,000 | You suspect something's broken but can't pinpoint where | Clarity on what to fix and what to build next |
| 02 | **Infra setup** | 30 days | $1,500–3,000, project | You're laying a foundation you can actually trust | A foundation that survives every future question |
| 03 | **Build** | 4–8 weeks | $2,000–4,000, project | You already know what you need built | A working system, fully owned by your team |
| 04 | **Embedded** | Ongoing, monthly | $2,000–5,000/mo | You need a data team without hiring one | A senior data function that compounds |

---

### One line per tier - added to the existing tab panels

**No new sections.** Keep `<EngagementModel />` exactly as it is. Add one sentence to each
panel, above the existing "What's included" list, defining the thing being bought. That's the
whole change - 4 sentences, ~15 words each.

| Tier | Sentence to add |
|---|---|
| 01 Audit | An audit is a systematic review of every place your data is produced, moved, modelled and reported - ending in a ranked list of what to fix. |
| 02 Infra setup | Infra setup builds the event tracking, pipelines and connections your analytics runs on, verified before anyone reports off it. |
| 03 Build | A build is a scoped piece of work you already know you need - an analysis, a dashboard suite, an agent, or a migration. |
| 04 Embedded | Embedded is a senior analytics function rented monthly instead of hired. |

The existing bullet lists stay as-is. The definitions are what get extracted for
"what is an analytics audit" queries; the bullets never will be.

---

### What's not included

*(New - one short line, not a section. It's the top post-price question and nothing on the
site answers it.)*

[ADD: one sentence. Candidates I'd expect but won't write unconfirmed - tool licences and
warehouse compute billed to you directly, engineering headcount for large in-app
instrumentation. Confirm which are true and it becomes a single line under the table.]

---

## B. Title, meta description, slug

- **`<title>`:** `Analytics Consulting Pricing - From $1k` *(39 chars)*
- **Meta description:** `Datalyze pricing: audits from $1k, project work $1.5k–$4k, embedded $2k–$5k/mo. See what each tier includes and which to start with.` *(132 chars)*
- **Slug:** `/pricing` (unchanged)

---

## C. FAQ block

Keep the five existing FAQs (they're good), and add these three:

**Do you charge for the first call?**
No. The first call is 30 minutes, free, and ends with us telling you what we'd fix first -
whether or not you hire us.

**Can we start with a project and move to a retainer later?**
Yes, and most teams do. The audit, infra setup and build tiers are all one-time projects.
Some clients run the output themselves afterwards; others move into embedded once they see
the backlog.

**What's not included in the price?**
[ADD: exclusions - see section D.] Tool licences and warehouse compute are billed to you
directly by those vendors. [CONFIRM]

---

## D. "Add real data here"

1. **[ADD STAT: revenue leaks per first audit]** - "3–5" is currently on the site; confirm.
2. **[ADD: what's not included]** - the exclusions section and its FAQ are blank until you
   tell me the real answer. This is the highest-intent unanswered question on the page.
3. **✅ Resolved - prices are live.** Remove the PLACEHOLDER comment from
   `EngagementModel.tsx`.
4. **Internal contradiction:** the existing FAQ answer says "Most engagements land between
   $2,000 and $5,000 per month" immediately after saying audits start at $1,000 one-time.
   Cut the second sentence - it muddies extraction and it's the one pricing statement that
   still contradicts the tiers.

---

## E. Internal links

| Link to | Anchor text | Place it in |
|---|---|---|
| `/how-it-works` | "what the four phases actually involve" | Under the tier table |
| `/case-studies` | "results from teams on each tier" | After tier 04 |
| `/tools/analytics-maturity-grader` | "not sure which tier? Grade your setup free" | Above the tier table |
| `/faqs` | "more questions answered" | End of FAQ block |
| `/contact` | "book the free 30-minute call" | Final CTA |

---

## F. Change note

Added a four-tier comparison table (surfacing content currently hidden one tab at a time),
one defining sentence per tier, and a one-line "what's not included" - plus cut two
sentences from the intro. Net prose added: roughly 80 words, all of it inside a table or a
single line.
