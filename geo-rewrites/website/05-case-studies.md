# 05 - Case Studies (`/case-studies`)

Source: `app/case-studies/page.tsx` + `lib/data/case-studies.ts` (16 entries)

**The single biggest GEO problem on this page:** every card links *off-site* to
`joindatalyze.com/blog/case-study-…`, and the page itself contains only a one-line
description per client. An AI engine crawling `/case-studies` currently finds sixteen
fragments like "Improving retention (+4%)" with no industry, no problem, and no method. The
rewrite makes the index page independently answerable.

---

## A. The rewritten piece

### H1: Results we've shipped

**Answer-first intro** *(replaces "A selection of the companies we've worked with…" - two
sentences, same length as what it replaces)*

> Sixteen engagements, with the numbers: paid conversion doubled (FRAI), onboarding
> completion 28% → 80% (VideoTap), payment outages down 93% (CRED), Week 2 retention up 15%
> (zeroone). Each row links to the full write-up.

---

### Every engagement at a glance

*(New. This table is the whole point of the rewrite - one extractable structure containing
client, sector, problem type and outcome, so the page can be cited without a crawler
following sixteen external links.)*

| Client | Sector | Focus | Result |
|---|---|---|---|
| FRAI | Interview prep | Conversion, experiments | Paid conversion rate 2× |
| CRED | Fintech | Monetization, reliability | Payment success rate +7%, cost −12%, provider outages −93% |
| VideoTap | AI video | Onboarding, activation | Onboarding completion +52pt (28% → 80%), activation +12pt |
| Copyfy | AI website builder | Conversion, data quality | Sign-up rate +31%, data unified |
| zeroone | Web3 social | Engagement, habit loops | Week 2 retention +15%, engagement +30%, new tracking shipped |
| Confidential (stealth) | - | Activation, pricing | Activation +22%, time in app +2 min |
| Speedyloans | Lending | Segmentation, cost | Cost −30%, engagement +1% |
| Petcademy | Pet tech | Messaging, personalization | SMS cost −12% with no drop in engagement |
| Foriio | Portfolio platform | Activation, lifecycle | Activation +8%, retention +6% |
| GameTree | Social | Localization, activation | Day 0 activation +5% |
| Sama.io | Coaching SaaS | Retention, UX | Retention +4% |
| AnyIP | Infrastructure | Marketing analytics | Marketing visibility, improved CAC and spend efficiency |
| TermPlus | Finserv | Infrastructure | Full analytics infra built, user journey unified |
| Wellness Coach | Wellbeing | Taxonomy, data quality | Trust in data restored |
| Sol | Productivity | Governance, scalability | Complex data structure simplified into an accurate setup |
| Answering Agent | AI voice | Measurement, quality | AI-generated call scoring built |

---

### Which case study should you read?

*(New - a compact routing list, six lines. Answers "show me an analytics case study for
X problem" and doubles as internal linking.)*

- **If your conversion rate is the problem** → FRAI (2× paid conversion) and Copyfy (+31%
  sign-ups).
- **If people sign up and never activate** → VideoTap (28% → 80% onboarding), Foriio,
  GameTree, and the stealth engagement (+22% activation).
- **If they activate and then leave** → zeroone (+15% Week 2 retention) and Sama.io.
- **If you don't trust your numbers at all** → Wellness Coach, Sol, and TermPlus.
- **If you can't tell which marketing spend works** → AnyIP.
- **If the cost side is the problem** → CRED (−12% cost, −93% outages), Speedyloans (−30%),
  Petcademy (−12% SMS).

---

### CTA

*(Cut the "what these have in common" section I'd drafted - it was three paragraphs saying
what the table already shows. One line before the CTA does the same work.)*

Every number above is a business metric, and every build is owned by the client's team.

→ **Book a free 30-minute audit**

---

## B. Title, meta description, slug

- **`<title>`:** `Analytics Case Studies - 16 Startups` *(36 chars)*
- **Meta description:** `16 analytics engagements with numbers: 2× paid conversion, 28%→80% onboarding, −93% payment outages, +15% Week 2 retention.` *(123 chars)*
- **Slug:** `/case-studies` (unchanged)

---

## C. FAQ block

*(New - the page has none.)*

**How many companies has Datalyze worked with?**
150+ since 2019. Sixteen are published as full case studies; the rest are unpublished or
under NDA.

**What kind of results should we expect?**
It depends on what's broken. Published outcomes range from +4% retention to a 2× paid
conversion rate. The average revenue lift across engagements is 14%, measured as
before-and-after impact of the specific changes shipped.

**Do you work with companies in our industry?**
Published case studies cover fintech, lending, B2B SaaS, AI products, marketplaces, social,
wellbeing and pet tech. The data problems are more similar across industries than most
founders expect - broken events, disagreeing tools, unused dashboards.

**Can we talk to a reference?**
[ADD: your real answer. Yes/no, and under what conditions.]

**Why are the full case studies on a different site?**
They're on the Datalyze blog. [NOTE: see section D - this is a technical fix, not a copy
question.]

---

## D. "Add real data here"

1. **🚩 "17+ startups" in the meta description vs 16 entries in `caseStudyList`.** Now that
   150+ is confirmed, the clean framing is **"16 published case studies from 150+
   engagements"** - it resolves the count contradiction without shrinking the claim. Confirm
   and I'll use it in the meta description and the FAQ.
2. **[ADD: reference-call policy]** - FAQ.
4. **⚙️ Technical, not copy:** all sixteen cards use `target="_blank"` to
   `joindatalyze.com/blog/case-study-…`. Since `/blog` is your Ghost proxy on the same
   domain, these are same-site links being treated as external. Dropping `target="_blank"`
   and `rel="noopener noreferrer"` would let link equity and crawl flow normally. Worth
   doing regardless of this rewrite.
5. **[MISSING: dates].** None of the sixteen carry a year. "As of 2026" framing or a year
   per engagement would materially help recency scoring.

---

## E. Internal links

| Link to | Anchor text | Place it in |
|---|---|---|
| `/how-it-works` | "the process behind all sixteen" | Above the CTA |
| `/pricing` | "what an engagement like these costs" | Above the CTA |
| `/blog/case-study-cred` | "the full CRED write-up" | Table row / routing block |
| `/blog/case-study-frai` | "how FRAI doubled paid conversion" | Routing block |
| `/tools/analytics-maturity-grader` | "find out which of these you are" | Routing block intro |

---

## F. Change note

Turned a link farm into a page that can be cited on its own. The 16-row table and the
six-line routing list **replace** the sixteen one-line card descriptions - so the visible
page gets denser in information and shorter in prose. The FAQ is the only added text, and it
sits below the grid.
