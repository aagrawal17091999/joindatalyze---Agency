# 13 - Analytics Maturity Grader (`/tools/analytics-maturity-grader`)

Source: `app/tools/analytics-maturity-grader/page.tsx` + `lib/data/maturity-grader-data.ts`

Already has `SoftwareApplication` + `FAQPage` schema and two FAQs. The gap: the landing state
never explains *what analytics maturity is* or what the five dimensions mean, so there's
almost nothing citable. The quiz itself is client-side, so everything below needs to be
static landing copy.

---

## A. The rewritten piece

### H1: Analytics Maturity Grader

**Answer-first intro**

> A free two-minute quiz that scores your analytics setup across five dimensions - tracking
> infrastructure, data governance, metric definitions, team data literacy, and
> decision-making culture - and returns a letter grade with the fixes to make first. Same
> five dimensions we assess in every paid audit.

→ **Grade my analytics** *(the quiz asks for your email to send the scorecard - [CONFIRM
wording])*

---

### What is analytics maturity?

Analytics maturity is how reliably a company gets from a question, to a number it trusts, to
a decision it actually makes. Not how many tools or dashboards you own - most low-maturity
setups have plenty of both.

*(Two sentences. The table below carries the detail.)*

---

### The five dimensions, and what a low score in each looks like

*(New. This is the section that makes the page worth citing - each row is a self-contained
definition plus a symptom people will recognise.)*

| Dimension | What it measures | What a low score looks like |
|---|---|---|
| **Tracking infrastructure** | Whether events are captured correctly and completely in the first place | Events named three different ways, revenue firing client-side, nobody sure when tracking last worked |
| **Data governance** | Whether anyone owns definitions and anything stops them drifting | New events added ad hoc, no tracking plan, no review before shipping |
| **Metric definitions** | Whether a metric means the same thing in two rooms | Marketing's "signup" and product's "signup" differ by 40% and both are technically right |
| **Team data literacy** | Whether non-analysts can answer their own questions | Every question routes through one person; that person is a bottleneck |
| **Decision-making culture** | Whether anything actually changes because of the data | Accurate dashboards nobody opens; decisions made in the room and justified afterwards |

---

### What you get

- A letter grade overall, plus a score per dimension
- Prioritised recommendations - what to fix first, not everything at once
- A shareable scorecard image

*(Move "who is it for" into the FAQ - it's already there, and it doesn't need to be on the
page twice.)*

---

### One line on scoring

[ADD: one sentence - "two questions per dimension, banded into A–D" or whatever
`computeResults` actually does. A grade that appears without explanation reads as arbitrary;
one sentence fixes it.]

---

### What if the grade is bad?

*(Two sentences.)*

Most are. In almost every audit we run, the tools are fine and the foundation underneath them
isn't. [ADD STAT: median grade - you have this from your own API, and it'd be the most
quotable line on the page.]

---

## B. Title, meta description, slug

- **`<title>`:** `Analytics Maturity Grader - Free 2-Min Quiz` *(42 chars)*
- **Meta description:** `Free 2-minute quiz scoring your analytics across tracking, governance, metric definitions, literacy and decision culture. Get a grade and what to fix.` *(148 chars)*
- **Slug:** unchanged

---

## C. FAQ block

Keep both existing FAQs, add four:

**How long does it take?** *(existing)*
About two minutes. It's a short questionnaire, not a data integration - nothing connects to
your tools.

**Who is it for?** *(existing)*
Founders, product leaders, and growth or data teams who want an honest read on where their
analytics stands before investing in fixing it.

**What is analytics maturity?**
How reliably a company can go from a question, to a number it trusts, to a decision it
actually makes. Not how many tools or dashboards you have.

**Do I have to give my email?**
[ADD - the quiz currently gates results behind an email. State it here and on `/tools`.]

**Is my data safe?**
Nothing connects to your analytics tools and no product data is collected - the quiz is
self-reported answers only. [ADD: what happens to the email address.]

**What's a good score?**
[ADD: the banding, and the distribution if you'll share it.]

---

## D. "Add real data here"

1. **[ADD: email gate disclosure]** - used in two places here and once on `/tools`.
2. **[ADD: what happens to the email]**
3. **[ADD: the scoring model]** - two sentences, so the grade reads as earned.
4. **[ADD STAT: grade distribution]** - you have this from your own API. Highest-value stat
   available on any tool page.
5. **[CONFIRM: is the scorecard emailed or on-screen only?]**
6. **⚙️ Rendering:** the page is `'use client'` end to end. All the copy above must be
   server-rendered around the quiz or crawlers see a form and nothing else.

---

## E. Internal links

| Link to | Anchor text | Place it in |
|---|---|---|
| `/pricing` | "an audit covers the same five dimensions in depth, from $1,000" | "What if the grade is bad" |
| `/how-it-works` | "how we fix each dimension" | Dimensions table |
| `/tools/event-tracking-plan-generator` | "fix tracking infrastructure yourself" | Dimensions table, row 1 |
| `/resources/client-vs-proxy-vs-server-tracking` | "where each event should fire" | Dimensions table, row 1 |
| `/tools` | "the other four free tools" | Footer of page |

---

## F. Change note

The page is currently a form with almost no static text, so this is additive - but it's kept
to a two-sentence definition, one table, and three short blocks. The table does most of the
work: it answers the definitional query for someone who never takes the quiz.
