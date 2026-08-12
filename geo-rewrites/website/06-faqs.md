# 06 - FAQs (`/faqs`)

Source: `app/faqs/page.tsx` (renders `homeFaqs` + 2 extras = 9 Q&As)

**Structural problem:** this page renders the *same nine* Q&As that already appear on the
homepage, both wrapped in FAQPage schema, both indexable. That's duplicate structured data
competing with itself. The rewrite splits them: the homepage keeps the buying questions, and
`/faqs` becomes the deep page that answers everything - including the operational questions
the site currently never answers.

---

## A. The rewritten piece

### H1: Frequently asked questions

**Answer-first intro** *(replaces "Pricing, team, engagement, and what to expect…")*

> What it costs, how fast we start, who does the work, and what we need from you. If your
> question isn't here, [ask my AI](/ask).

*(One sentence. The page is a FAQ - the questions themselves are the content, and a long
intro just pushes them down.)*

---

### Pricing and commitment

**How much does Datalyze cost?**
Four tiers: a one-time audit from $1,000; infra setup at $1,500–3,000 per project; build
work at $2,000–4,000 per project; and embedded (ongoing) at $2,000–5,000 per month. Most
teams start with the audit.

**Do I have to commit to a retainer?**
No. The audit, infra setup and build tiers are all one-time projects. Some clients start with
an audit and scale into a retainer; others take a project and run it themselves afterwards.

**What's not included in the price?**
[ADD - same blank as `/pricing`. Tool licences and warehouse compute are presumably billed
to you directly by those vendors; confirm.]

**Why not just hire a full-time analyst?**
A full-time analyst costs $100,000–$150,000 loaded, takes 3–6 months to ramp, and brings
experience from one or two companies. We've seen the patterns across 150+ startups, start
within a day, and cost a fraction of that. When you're ready for that hire, they inherit a
clean, documented foundation.

**Can we cancel an embedded engagement?**
[ADD: notice period and terms.]

---

### Timing and process

**How fast can you actually start?**
Within a day of kickoff. No month-long discovery, no week of onboarding meetings. Share
access and we're auditing your data by tomorrow.

**How long until we see results?**
Most teams see their first actionable insights within 2 to 3 weeks. The audit itself takes
1–2 weeks; infra setup runs about 30 days.

**What does a typical engagement look like?**
Week one is a full data audit: what's broken, what's missing, what's tracked but never used.
From there we prioritize, fix critical tracking issues, unify data sources, build the
reporting your team actually needs, and start identifying growth levers. Weekly syncs keep it
aligned.

**What happens when an engagement ends?**
Everything we built - tracking plans, models, dashboards, documentation - is in your tools
and owned by your team. [ADD: do you offer a handover session or a support window?]

---

### The team

**Who will I work with?**
A small, focused team based on your needs - typically some combination of product analyst,
analytics engineer, growth strategist and developer. No unnecessary layers: you talk directly
to the people doing the work.

**What do you need from our team?**
Light developer support to implement tracking, add events, or help with data foundations for
modeling. [ADD: realistic weekly hours - "a few hours a week during instrumentation" is the
kind of specific answer buyers want, but I won't invent the number.]

**Do you sign NDAs?**
[ADD: yes/no.]

**Where are you based, and what timezones do you cover?**
[ADD - the site says Ansh is based in India but never states working hours or client
timezone coverage, and this is a top objection for US/EU buyers.]

---

### Tools and setup

**We already have analytics tools. Why do we need you?**
The tool is rarely the problem - the implementation is. Most setups we audit have 20–40% of
events, models or pipelines misconfigured, missing or quietly broken.

**What if we already have an analytics setup?**
Most companies do. The question is whether anyone trusts it. We audit what you have, fix
what's broken, fill what's missing, and build on what's working. We don't rip and replace.

**Which tools do you work with?**
Whatever you're already running: Mixpanel (Certified Partner), PostHog (Implementation
Specialist), Amplitude, Heap, GA4, Google Tag Manager, Google Ads, Meta Ads, HubSpot, Stripe,
Chargebee, Recurly, RevenueCat, BigQuery, Snowflake, Postgres, Looker Studio, Metabase,
Databricks, Segment, dbt, Fivetran, Hightouch and Airbyte.

**Do you do the engineering work, or do we?**
[ADD - a genuinely common objection and the site never answers it.]

---

### Results

**How do you measure the 14% revenue lift?**
Before-and-after revenue impact of the specific changes made during each engagement:
conversion improvements from tracking fixes, retention gains from product changes, revenue
from experiments we design and run. It's a weighted average across 150+ engagements, not a
cherry-picked best case.

**What if the work doesn't move the numbers?**
When an experiment doesn't move the needle, we tell you and run a better one. [ADD: is there
a guarantee, a refund, or a "we'll keep going" commitment? Say it plainly if so - this is
the highest-trust answer you could publish.]

---

## B. Title, meta description, slug

- **`<title>`:** `Datalyze FAQs - Pricing, Process, Team` *(38 chars)*
- **Meta description:** `What Datalyze costs, how fast we start, who does the work, what we need from your team, and what happens when an engagement ends.` *(128 chars)*
- **Slug:** `/faqs` (unchanged)

---

## C. FAQ block

The page *is* the FAQ block. Above: 20 Q&As across five sections (currently 9, ungrouped).

---

## D. "Add real data here"

1. **[ADD: what's not included]** *(also blocks `/pricing`)*
2. **[ADD: cancellation / notice terms for embedded]**
3. **[ADD: handover or support window after an engagement ends]**
4. **[ADD: weekly hours needed from the client team]**
5. **[ADD: NDA policy]**
6. **[ADD: base location + timezone coverage]** - top objection for US/EU buyers
7. **[ADD: do you write the instrumentation code, or does the client's team?]**
8. **[ADD: what happens if the work doesn't move the numbers - guarantee or not]**
9. **🚩 Duplicate FAQPage schema.** `/faqs` and `/` currently emit FAQPage schema over an
   overlapping set of nine questions. Recommend: homepage keeps 5 buying questions; `/faqs`
   carries all 20 and is the canonical FAQ entity. Confirm and I'll split the data file.

---

## E. Internal links

| Link to | Anchor text | Place it in |
|---|---|---|
| `/pricing` | "the full tier breakdown" | Pricing section |
| `/how-it-works` | "the four phases, in detail" | Timing and process |
| `/about` | "who's on the team" | The team section |
| `/ask` | "ask my AI an analytics question" | Intro + end |
| `/case-studies` | "16 engagements with the numbers" | Results section |

---

## F. Change note

Grouped 9 flat Q&As into 20 across five labelled sections so each block is liftable on its
own, cut the intro to one sentence, and tightened the four longest existing answers. This is
the one page where more text is correct - it's a FAQ, the questions are the content, and
each answer stays 1–3 sentences.
