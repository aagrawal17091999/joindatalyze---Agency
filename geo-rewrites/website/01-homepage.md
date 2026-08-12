# 01 - Homepage (`/`)

Source: `app/page.tsx` + `app/_components/{hero,pain-section,method,differentiators,case-cards,final-cta,faq}.tsx`,
`components/{tech-stack/TechStack,engagement/EngagementModel}.tsx`,
`lib/data/home-{faqs,method,pain-scenes,differentiators,case-studies}.ts`

---

## A. The rewritten piece

### HERO

**H1:** Find the revenue your data is hiding.

**Accent line:** Fix your data. Find your growth.

**Answer-first subhead** *(new - this is the paragraph AI engines will quote)*

> Datalyze is an analytics and growth partner for startups. We audit your data layer, fix
> the tracking that's broken, connect your product, marketing, revenue and warehouse tools
> into one source of truth, and then find the growth that was buried in it.

**Buttons:** Book a strategy call · Get a free audit
**Link:** Or ask my AI an analytics question

**Proof bar:** 150+ companies served · 14% avg revenue lift · 1-day kickoff

**Before/After figure caption:** Before: data scattered across Mixpanel, PostHog, GA4,
Amplitude, Stripe and Segment. After: one source of truth across product, marketing,
revenue and retention.

---

### THE COST - Why doesn't analytics work move the business?

*(H2 changed from a statement to the question people actually ask.)*

Most growing companies stall in one of these three places. None of them are obvious. All of
them are expensive.

*(That's the whole intro - two lines. The three scenes below already carry the argument.)*

**01 / Money - The money you're already spending wrong**
You spent $180K on paid acquisition last quarter. Your marketing dashboard says it drove
400 signups. Your product database says 260. Finance says 310. Nobody can tell you the real
CAC.
*Real cost: a CAC you don't actually know, and a budget you can't defend.*

**02 / Team - What your PM did last Tuesday**
Your PM wrote SQL in BigQuery on Tuesday, trying to pull cohort retention. Your senior
engineer spent Wednesday debugging a tracking event that's been wrong since March. Your
head of growth reconciled MRR across Stripe and the warehouse on Sunday. None of them
shipped a feature, ran an experiment, or talked to a customer.
*Real cost: senior people on plumbing - and the features, customer calls and experiments
that didn't happen because of it.*

**03 / Growth - The growth lever in plain sight**
Your retention dashboard is accurate. It's been accurate for months. Nobody opens it. Six
months in, you finally dig and find that users who adopted your March feature retain 40%
better than those who didn't. You shipped that feature quietly as a side project. The data
was sitting there the whole time.
*Real cost: insights buried in clean data, and the growth you'd already have captured if
anyone was looking.*

Sound familiar? Let's show you what your data is actually hiding. → **Get a free audit**

---

### THE METHOD - How does Datalyze fix analytics? The 4-step Datalyze Method

Four stages - Foundation, Unification, Visibility, Compounding - that fix the data layer
before anyone builds a dashboard on it.

Most agencies start with dashboards. We start with the foundation. By the time we get to
dashboards, they actually mean something.

*(Replaces the existing intro rather than adding to it - same length, but it now names the
four stages, which is what makes it quotable.)*

**01 - Foundation: Your data becomes trustworthy.** We audit your entire data layer:
product events, warehouse tables, pipelines, metric definitions. We fix what's broken, fill
what's missing, rebuild what drifts. Every team pulls the same number for the same question.

**02 - Unification: Your tools start talking to each other.** Product analytics,
warehouses, pipelines, billing, CRM - we connect and model everything into a single source
of truth. One view of your customer from first touch to revenue.

**03 - Visibility: You see what's actually happening.** We build the reporting layer your
team will actually use - executive dashboards, product funnels, cohort analyses. The
handful that change how you operate.

**04 - Compounding: You grow with evidence, not intuition.** We go find the answers - why
users churn, why they don't convert, why some cohorts stick and others don't. Then we design
and run the experiments that fix it.

Curious how this would work on your stack? → **Book a call**

---

### TECH STACK - Which analytics tools does Datalyze work with?

We work inside your stack, not ours. As of 2026:

| Layer | Tools we implement and fix |
|---|---|
| Product analytics | Mixpanel (Certified Partner), PostHog (Implementation Specialist), Amplitude, Heap |
| Marketing | Google Ads, Meta Ads, GA4, Google Tag Manager, HubSpot |
| Revenue | Stripe, Chargebee, Recurly, RevenueCat |
| Warehouse | BigQuery, Snowflake, Postgres |
| Dashboarding | Looker Studio, Metabase, Databricks |
| Pipelines | Segment, dbt, Fivetran, Hightouch, Airbyte |

Your stack is our stack.

---

### WHY DATALYZE - What makes Datalyze different from an analytics agency?

*(No intro line needed - the four blocks speak for themselves. Only one change below: block
01 gains a five-word clause.)*

**01. You work with the people who do the work.** Every engagement is staffed by senior
operators with 150+ startup builds behind them. You talk directly to the people in your
data - no account managers.

**02. We start in a day, not a quarter.** No two-week onboarding. No discovery phase eating
a month. We've audited enough stacks to know where to look first.

**03. We own the outcome, not the deliverable.** When an experiment doesn't move the
needle, we tell you and run a better one. We measure revenue impact on every change we ship.

**04. If we find it, we fix it.** Most agencies hand you a change order. We don't. When we
find something broken - even if it wasn't in scope - we fix it. You hired us to make your
data work.

---

### RESULTS - What happens after Datalyze gets involved?

| Client | Result | What we did |
|---|---|---|
| FRAI | 2× paid conversion rate | No clarity on which segments converted or why others dropped. We ran deep behavioural analysis, designed the A/B tests, and left a repeatable experimentation process behind. |
| CRED | −93% provider outages | Payment routing was leaking money on both success rate and cost. We built a linear-programming routing engine plus a real-time outage-detection model: success rate +7%, cost −12%, provider outages −93% month over month. |
| VideoTap | 28% → 80% onboarding completion | Most signups never reached the dashboard. We rebuilt the upload UX from 4 steps to 2; activation went from 7% to 19%. |

These are real results from teams like yours. → **See how we did it**

---

### PRICING - How much does Datalyze cost?

**Keep the existing interactive tier selector.** The only change is a one-line summary above
it, so the numbers are readable without clicking through four tabs:

> From $1k for a one-time audit, up to $2–5k/month embedded. Most teams start with the audit.

**Cut from the homepage:** the four "what's included" bullet lists. They're on `/pricing` in
full, and repeating them here is the main reason this section reads long. Link instead:
"See what each tier includes →".

---

### VOICES - What teams say after they've worked with us

*(Testimonial wall unchanged.)*

Ready to join them? → **Book a call**

---

### FINAL CTA

**See what your data is hiding from you.**

Most teams are sitting on revenue they can't see: broken tracking, misattributed spend,
drop-offs nobody's caught. Bring us your stack, and in 30 minutes we'll show you where
yours is.

→ **Book a call**

---

## B. Title, meta description, slug

- **`<title>`:** `Datalyze - Analytics & Growth Partner for Startups` *(50 chars)*
- **Meta description:** `We fix your tracking, unify your tools into one source of truth, and find the growth hiding in your data. 150+ startups. Audits from $1k.` *(136 chars)*
- **Slug:** `/` (unchanged)

---

## C. FAQ block

**How much does Datalyze cost?**
Four tiers: a one-time audit from $1k, infra setup at $1.5–3k per project, build work at
$2–4k per project, and embedded (ongoing) at $2–5k/month. Most teams start with the audit
and scale from there.

**How long until we see results?**
Most teams see their first actionable insights within 2 to 3 weeks of kickoff. The audit
itself takes 1–2 weeks.

**Why not just hire a full-time analyst?**
A full-time analyst costs $100,000–$150,000 loaded, takes 3–6 months to ramp, and brings
experience from one or two companies. We bring senior operators who've seen the patterns
across 150+ startups, start within a day, and cost a fraction of that. When you're ready for
that hire, they inherit a clean, documented foundation instead of the mess they'd spend six
months untangling.

**We already have analytics tools. Why do we need you?**
The tool is rarely the problem - the implementation is. Whether you're on Mixpanel,
Amplitude, PostHog, BigQuery, Snowflake or all of them, most setups we audit have 20–40% of
events, models or pipelines misconfigured, missing or quietly broken. We fix the foundation
across the whole stack, then make it useful for decisions.

**How fast can you actually start?**
Within a day of kickoff. No month-long discovery, no week of onboarding meetings. Share
access and we're auditing your data by tomorrow.

**What if we already have an analytics setup?**
Most companies do. The question is whether anyone trusts it. We audit what you have, fix
what's broken, fill what's missing, and build on what's working. We don't rip and replace -
we make your current investment reliable.

**What does a typical engagement look like?**
Week one is a full data audit: what's broken, what's missing, what's tracked but never used.
From there we prioritize, fix critical tracking issues, unify data sources, build the
reporting your team actually needs, and start identifying growth levers. Weekly syncs keep
it aligned.

**How do you measure the 14% revenue lift?**
We measure before-and-after revenue impact of the specific changes made during each
engagement: conversion improvements from tracking fixes, retention gains from product
changes, revenue from experiments we design and run. The 14% is a weighted average across
150+ engagements, not a cherry-picked best case.

---

## D. "Add real data here"

1. **[ADD STAT: revenue leaks per first audit]** - the site currently claims "3–5 revenue
   leaks in the first audit." Confirm or replace with your real number.
2. **✅ Prices are live** - remove the PLACEHOLDER comment from `EngagementModel.tsx`. Still
   fix the homepage FAQ line "$2,000–$5,000 per month": it contradicts the $1k audit tier.
   Cut that sentence and let the tier answer stand.
3. **[OPTIONAL STAT: % of tracked events that go unused]** - you already have the "20–40%
   misconfigured" figure; a companion "X% of events nobody ever queries" line would be the
   most quotable stat on the page if your audits support it.
4. **Empty subhead** - `TechStack.tsx` renders an empty `<p className={styles.sub}>`. I
   wrote a one-line replacement ("We work inside your stack, not ours"); confirm.

---

## E. Internal links

| Link to | Anchor text | Place it in |
|---|---|---|
| `/pricing` | "See full pricing and what's included in each tier" | End of the pricing section |
| `/how-it-works` | "the Datalyze Method, step by step" | Method intro |
| `/case-studies` | "all 16 case studies" | Under the results table |
| `/ask` | "ask my AI an analytics question" | Hero (already present) |
| `/tools/analytics-maturity-grader` | "grade your analytics maturity in 3 minutes" | Pain section, as a self-serve alternative to the audit CTA |

---

## F. Change note

Added a self-contained answer-first paragraph to the hero (the page never stated what
Datalyze *is* in a quotable sentence), converted four statement H2s into the questions
buyers actually ask, replaced the results cards and tech-stack grid with tables, and split
cost and timing into separate FAQ entries.

**Net text on the page goes down**, not up: the pricing section loses four "what's included"
lists to `/pricing`, the pain intro drops from four lines to one, and the tech-stack and
results sections become tables. The only genuinely new prose is the hero paragraph.
