# 14 - Analytics Strategy Creator (`/tools/analytics-strategy-creator`)

Source: `app/tools/analytics-strategy-creator/page.tsx`

**Assessment:** already close to best-practice. It opens with a definition ("An analytics
strategy is a short document that names the specific decision…"), has a four-question
framework, a "why founders skip it" section, and a strong quotable line ("A 30-metric
dashboard is not a strategy; it's a graveyard"). It has `SoftwareApplication` schema.

**The one real gap: no FAQ block and no FAQPage schema** - the only tool page missing it.
Everything below is additive; the existing prose stands.

---

## A. The rewritten piece

*(Keep all existing sections. Add the three below, and convert two H2s to questions.)*

### Heading changes

| Current | Change to |
|---|---|
| "What's inside" | *(keep)* |
| *(untitled definition section)* | **What is an analytics strategy?** |
| "Why founders skip analytics strategy (and pay for it later)" | *(keep - it's already a strong long-tail match)* |
| *(untitled "once installed" section)* | **How does the Claude skill work?** |

---

### NEW - What does the output look like?

*(The Tracking Plan Generator page shows its CSV columns; this page describes a markdown doc
but never shows its shape. Same fix.)*

[ADD: a short worked example - the actual markdown structure the skill emits, ideally for a
recognisable product. Two or three metrics with their counter-metrics and segmentation is
enough. This is the highest-value addition on the page: "show me an example analytics
strategy" is a real query and an example is the thing engines lift.]

Suggested shape, to be filled from a real run:

```
Decision: <the specific decision>
Primary metrics (3–5)
  1. <metric> - counter-metric: <metric> - segment by: <dimensions>
  ...
Explicitly skipping: <named vanity metrics, and why>
Instrumentation notes: <what needs tracking that doesn't exist yet>
```

---

### NEW - Analytics strategy vs tracking plan: what's the difference?

*(New. These two tools are adjacent and people conflate them constantly - a comparison table
here captures the query and routes people to the right tool.)*

| | **Analytics strategy** | **Event tracking plan** |
|---|---|---|
| Answers | *What should we measure, and why?* | *What events do we fire, and with what properties?* |
| Written | Before instrumentation | After the strategy, before implementation |
| Output | Markdown doc: decision, 3–5 metrics, counter-metrics, segmentation | CSV: event names, properties, types, triggers |
| Audience | Founder, PM, whoever owns the decision | Engineers implementing tracking |
| Tool | This one | [Event Tracking Plan Generator](/tools/event-tracking-plan-generator) |

Do them in that order. A tracking plan without a strategy is instrumentation that maps to no
decision.

---

### NEW - What is a counter-metric?

*(One sentence plus one example. It's the term the page uses throughout and never defines.)*

A counter-metric is the number you watch to catch your primary metric being gamed. Push
signups and you can wreck signup quality; the counter-metric is what catches it.

---

## B. Title, meta description, slug

- **`<title>`:** `Free Analytics Strategy Creator - Claude Skill` *(45 chars - unchanged)*
- **Meta description:** *(unchanged - it's good)* `Turn a fuzzy product question into a decision-driven analytics strategy. A free Claude skill that outputs metrics, counter-metrics, and segmentation.`
- **Slug:** unchanged

---

## C. FAQ block

*(New - this page has none, and it's the only tool page without FAQPage schema.)*

**What is an analytics strategy?**
A short document that names the specific decision you're trying to make, then picks the few
metrics that actually inform it. You write it before you build a dashboard or set up
tracking.

**How is it different from a tracking plan?**
The strategy decides *what to measure and why*; the tracking plan specs *which events fire
and with what properties*. Strategy first, then plan.

**What do I need to run it?**
A Claude Pro, Max or Team account - skills aren't available on the free plan. Nothing else.

**Is it free?**
Yes. It runs inside your own Claude account, so nothing you feed it comes to us. [CONFIRM:
the download form asks for an email - say so.]

**How long does it take?**
[ADD: realistic time for a run - "about 15 minutes including the questions it asks you" or
whatever it actually is.]

**What if I already have metrics defined?**
Run it anyway and compare. The common failure it catches isn't a missing metric - it's a
metric with no counter-metric, or a set of metrics that don't map to any decision you're
about to make.

**Does it work for B2B / marketplaces / mobile apps?**
[ADD: your answer. Any known limitation is worth stating.]

---

## D. "Add real data here"

1. **[ADD: a real worked example of the output]** - biggest single win on this page.
2. **[ADD: how long a run takes]**
3. **[ADD: product-type limitations]**
4. **[CONFIRM: email gate on download]** - the form says "enter your email and we'll start
   the download immediately", so the FAQ should say so plainly.
5. **⚙️ Missing `FAQPage` schema** - add it once the FAQ above is in.

---

## E. Internal links

| Link to | Anchor text | Place it in |
|---|---|---|
| `/tools/event-tracking-plan-generator` | "generate the tracking plan next" | Comparison table + end |
| `/tools/analytics-maturity-grader` | "grade your current setup first" | Intro |
| `/how-it-works` | "how we do this inside a paid engagement" | End |
| Ghost: `/blog/how-to-create-an-analytics-strategy` | "the long-form version of this method" | Definition section |
| Ghost: `/blog/let-go-of-vanity-metrics-and-start` | "why vanity metrics get skipped" | Four-questions list |

---

## F. Change note

Additive but small: one comparison table, one definition sentence, an output example, and the
page's first FAQ block (it was the only tool page without one). No existing prose changes -
this page is already the right length.
