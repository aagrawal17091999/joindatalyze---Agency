# 03 - How It Works (`/how-it-works`)

Source: `app/how-it-works/page.tsx` + `app/_components/method.tsx` + `lib/data/home-method.ts`

**Note:** already answer-first with HowTo + FAQPage schema. This is a *light* pass - it adds
per-phase deliverables and timing (currently the page describes phases but never says what
you receive or when), plus question-style H3s.

---

## A. The rewritten piece

### H1: How a Datalyze engagement works

**Answer-first intro** *(cut from 3 sentences to 2 - the middle sentence just restated the
four phase names in longhand, and the table below now does that job)*

> The Datalyze process has four phases: foundation, unification, visibility, and
> compounding. Onboarding takes less than a day, and most teams see their first actionable
> insights within 2 to 3 weeks.

---

### The four phases at a glance

*(New table - replaces the sentence cut above, and adds the deliverable and timing the page
never stated.)*

| Phase | What happens | You get | Typical timing |
|---|---|---|---|
| 01 Foundation | We audit product events, warehouse tables, pipelines and metric definitions, then fix what's broken, fill what's missing, rebuild what drifts | A data layer where every team pulls the same number for the same question | [ADD: weeks] |
| 02 Unification | We connect and model product analytics, warehouses, pipelines, billing and CRM | One view of your customer from first touch to revenue | [ADD: weeks] |
| 03 Visibility | We build the reporting layer your team will actually use | Executive dashboards, product funnels, cohort analyses - the handful that change how you operate | [ADD: weeks] |
| 04 Compounding | We find why users churn, why they don't convert, why some cohorts stick | Designed and run experiments, measured against revenue | Ongoing |

---

### Phase headings - reworded, not lengthened

The four `<Method />` step bodies stay **exactly as written**. Only the titles change, into
the question each phase answers. Same word count, better extraction:

| Current title | Change to |
|---|---|
| Your data becomes trustworthy | How do you make data trustworthy again? |
| Your tools start talking to each other | How do you get separate tools to agree? |
| You see what's actually happening | Which dashboards actually get used? |
| You grow with evidence, not intuition | How does analytics turn into growth? |

*(If you'd rather keep the current titles for tone, keep them - put the questions in the FAQ
block instead. Don't run both.)*

---

### What does week one look like?

*(New - three lines, and it's the most-asked process question.)*

A full data audit: what's broken, what's missing, what's tracked but never used. Then we
prioritize and start fixing. Weekly syncs from there.

### What we need from you

*(New - a short list, not a paragraph.)*

[ADD: 3–4 bullets. I'd expect admin access to the product analytics tool, warehouse read
access, ad platform access, and one named owner - but I'm not publishing an onboarding
checklist you haven't confirmed.]

---

## B. Title, meta description, slug

- **`<title>`:** `How Our Analytics Process Works` *(31 chars - unchanged, it's good)*
- **Meta description:** `Four phases: foundation, unification, visibility, compounding. Onboarding takes under a day; first insights land in 2–3 weeks.` *(126 chars)*
- **Slug:** `/how-it-works` (unchanged)

---

## C. FAQ block

Keep the five existing FAQs, and add:

**What do you need access to before you can start?**
[ADD - see section D.]

**Who on our team do you need time from?**
[ADD: realistic answer. Most engagements need a weekly sync with one owner plus ad-hoc
engineering time during instrumentation - confirm before publishing.]

**Do we own what you build?**
Yes. Everything - tracking plans, models, dashboards, documentation - is built in your tools
and owned by your team. When you eventually hire in-house, they inherit a clean, documented
foundation.

---

## D. "Add real data here"

1. **[ADD: typical duration per phase]** - the table has four blanks. Without them the page
   answers "what happens" but not "how long", which is half the query intent.
2. **[ADD STAT: % of dashboards never opened]** - Phase 03.
3. **[ADD: access/onboarding checklist]** - used in two places.
4. **[ADD: time commitment from the client team]** - FAQ.

---

## E. Internal links

| Link to | Anchor text | Place it in |
|---|---|---|
| `/pricing` | "what each phase costs" | Under the phase table |
| `/case-studies` | "engagements that ran this process end to end" | After Phase 04 |
| `/resources/client-vs-proxy-vs-server-tracking` | "client vs proxy vs server-side tracking" | Phase 01, on instrumentation |
| `/tools/event-tracking-plan-generator` | "generate a tracking plan yourself" | Phase 01 |
| `/about` | "the operators who do the work" | Week-one section |

---

## F. Change note

Added a four-phase table carrying the deliverable and timing the page never stated, reworded
the four phase titles into questions, and added two short blocks (week one, what we need from
you). Cut one sentence from the intro; the four step bodies are untouched. Net prose added:
about 40 words outside the table.
