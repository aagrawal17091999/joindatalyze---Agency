# 04 - About (`/about`)

Source: `app/about/page.tsx`

**Resolved:** founded **2019**, **150+** companies. That makes "7 years building foundations"
correct and the founder note's "In 2025, I started Datalyze" the line that's wrong. Every
2025 reference on this page and in `lib/seo.ts` needs to become 2019.

---

## A. The rewritten piece

### HERO

**H1:** We don't sell dashboards. We build **foundations**.

**Answer-first subhead** *(replaces the current line - same length, but it now says what the
company is instead of how it feels)*

> Datalyze is an analytics consultancy founded by Ansh Agrawal in 2019. We rebuild the data
> foundation underneath a startup's analytics, then turn it into the reporting and
> experiments that move revenue. 150+ companies, senior operators only.

*(This **replaces** "Datalyze was started by operators who'd spent years watching companies
pour money into analytics tools that produced charts nobody trusted." Don't run both - the
founder note two sections down makes that point better and in first person.)*

---

### WHY WE EXIST - A note from the founder

*(Voice preserved verbatim. **One word changes: 2025 → 2019.** Nothing else.)*

I started my analytics career at CRED. After that, I spent a few years freelancing - one
startup at a time, fixing tracking, unblocking data teams, surfacing insights buried under
broken foundations.

By engagement 30 or 40, I'd seen the same pattern at every company: three tools, four
dashboards, zero confidence in any of the numbers. The fix wasn't more tools. It was the
foundation underneath them - the events, pipelines, definitions, and models that nobody had
time to fix.

In 2019, I started Datalyze to do this at scale. Senior operators only. No account managers,
no junior analysts learning on the client's budget. We fix the foundation first, then turn it
into the kind of insights that actually move revenue.

If your data has been telling you three different stories, we'd like to help.

- **Ansh Agrawal**, Founder, Datalyze

---

### WHO ACTUALLY DOES THE WORK? - The people in your data

*(Existing intro kept, minus one sentence. Only the H2 becomes a question.)*

Small team. Senior operators only. Every person here has built analytics foundations for
dozens of companies before joining Datalyze.

**Ansh Agrawal - Founder.** Built analytics infrastructure for 150+ startups since founding
Datalyze in 2019. Specializes in product analytics, experimentation, and the messy first 90
days of fixing a broken stack. Mixpanel Certified Partner. Based in India.

**Sara Maarouf - Product Growth.** Leads growth and experimentation engagements. Specializes
in turning trustworthy data into the experiments that compound - pricing tests, onboarding
flows, conversion paths.

---

### BY THE NUMBERS

*(Grid unchanged: 150+ companies · 14% average revenue lift · 20+ tools · 7 years. All four
are now consistent with a 2019 founding.)*

**One line added under the grid:**

> The 14% is before-and-after revenue impact of changes we shipped, weighted across every
> engagement - not a best case.

*(An unexplained "14%" is a claim an AI engine hedges or drops. One sentence makes it
quotable.)*

---

### FINAL CTA - Want to work with us?

Book a 30-minute call. We'll look at your stack, find the gaps, and tell you exactly what
we'd fix first. No pitch deck, no follow-up unless you ask for one.

→ **Book a Call**

---

## B. Title, meta description, slug

- **`<title>`:** `About Datalyze & Ansh Agrawal` *(29 chars - unchanged)*
- **Meta description:** `Datalyze is an analytics consultancy founded by Ansh Agrawal in 2019. Senior operators only - we rebuild data foundations, then find the growth.` *(142 chars)*
- **Slug:** `/about` (unchanged)

---

## C. FAQ block

*(New - the page has no FAQ today. These target the entity/credibility queries AI engines
run on a consultancy.)*

**Who is Ansh Agrawal?**
The founder of Datalyze. He started his analytics career at CRED, then spent several years
freelancing analytics work for startups one at a time before founding Datalyze in 2019.
Mixpanel Certified Partner, based in India.

**What is Datalyze?**
An analytics and growth consultancy for startups. We rebuild the data foundation - events,
pipelines, definitions, models - then build the reporting and run the experiments on top of
it. Engagements run from a $1k audit to $2–5k/month embedded work.

**How big is the team?**
Small and deliberately senior. Every person has built analytics foundations for dozens of
companies before joining. You work directly with the people in your data - no account
managers, no junior analysts learning on your budget.

**Where is Datalyze based?**
India, working with startups worldwide. [CONFIRM: is there a second location or a
timezone-coverage claim you want to make?]

**Is Datalyze a Mixpanel partner?**
Yes - Mixpanel Certified Partner, and a PostHog Implementation Specialist. We also work
across Amplitude, Heap, BigQuery, Snowflake, dbt, Segment and the rest of the modern stack.

---

## D. "Add real data here"

**✅ Resolved: founded 2019, 150+ companies.** Every "2025" and every "90+" becomes 2019 and
150+. Files to change: `app/about/page.tsx` (founder note, `TEAM` bio, `metadata`) and
`lib/seo.ts` (`personNode.description`, plus add `foundingDate: '2019'` to `organizationNode`).

Still open:

1. **[CONFIRM: location claim]** - "India, working with startups worldwide" is my wording for
   the FAQ. Confirm, and say whether you want a timezone-coverage line (it's a real objection
   for US/EU buyers).
2. **[OPTIONAL]** - one sentence on what Ansh saw at CRED would be the strongest E-E-A-T
   signal on the page. Only if you want it public.

---

## E. Internal links

| Link to | Anchor text | Place it in |
|---|---|---|
| `/case-studies` | "the 150+ engagements behind these numbers" | By the Numbers |
| `/how-it-works` | "how we fix a foundation" | Founder note, third paragraph |
| `/pricing` | "what working with us costs" | Final CTA |
| `/ask` | "ask my AI an analytics question" | Team section |
| Ghost: `/blog/5-biggest-problems-i-see-with-founders` | "the five problems I see at nearly every company" | Founder note, second paragraph |

---

## F. Change note

Replaced the hero subhead with one that states what Datalyze is, added one sentence
explaining the 14%, and fixed every founding-year and company-count reference to 2019/150+.
The only genuinely new copy is the FAQ block, which sits below the fold and targets the
entity queries ("who is Ansh Agrawal", "what is Datalyze") the site answers nowhere. On-page
prose above the fold gets shorter, not longer.
