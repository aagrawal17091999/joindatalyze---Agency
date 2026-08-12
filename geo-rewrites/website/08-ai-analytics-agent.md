# 08 - AI Analytics Agent (`/ai-analytics-agent`)

Source: `app/ai-analytics-agent/page.tsx` + `_components/{failures,query-demo}.tsx`

**Assessment:** the strongest page on the site already - opinionated, specific, seven good
FAQs, Service + FAQPage schema. It needs a *light* pass. The three things missing are: a
definition of the thing being sold, a comparison table for the two paths, and price. It's
the only service page with no number on it.

---

## A. The rewritten piece

### HERO

**H1:** Most AI data tools confidently give you wrong answers. *Ours doesn't.*

**Answer-first subhead** *(existing copy, with its opening clause replaced - net change is
about +5 words, and it removes the repetition of "no understanding of your business")*

> An AI analytics agent lets your team ask questions in plain English and get the right
> number back - but only if the data underneath it is clean. That's why every "ask your data
> in plain English" tool fails. We fix the foundation, build the context, and ship you an AI
> agent your team can actually trust - custom-built for your product, or set up on top of
> Julius, Vanna, or DataGPT.

**Meta row:** 4-week build · Custom or tool-based · Tested on your real data

---

### Why do most AI analytics agents give wrong answers?

*(Existing "Failures" section - keep as is, but lead it with this extractable summary.)*

**Short version:** the data is broken, the model doesn't know what your metrics mean, and
nobody checked the answers in week one.

*(One line above the existing Failures component, which already covers all three in
detail - this just makes the summary extractable.)*

---

### What does it take to ship an AI analytics agent that works? The 6-step build

*(H2 converted to a question. Steps preserved verbatim - they're specific and in voice.)*

Six steps, built around the three things every other approach skips: clean data, real
business context, and a validation loop. Most engagements take 4–6 weeks end to end.

| # | Step | What it fixes |
|---|---|---|
| 01 | We start with how your business actually works | The "no business context" failure |
| 02 | We clean and model your data so the agent can reason over it | The "hallucinated numbers" failure |
| 03 | We build the agent's brain (knowledge base, definitions, gotchas) | The "can't answer the questions that matter" failure |
| 04 | We build the agent, or set up the right tool | Lock-in and overspend |
| 05 | Two weeks of supervised testing on your real questions | The "team stops using it" failure |
| 06 | We keep it sharp over time | Slow decay |

*(Then the six full step write-ups, unchanged.)*

---

### Custom agent or off-the-shelf tool - which should you pick?

*(H2 converted to a question; the two path cards become one table.)*

| | **Path A - Custom AI agent** | **Path B - Tool setup** |
|---|---|---|
| What you get | We build the agent, tailored to your stack and business logic. You own the code, knowledge base and deployment. | We configure Julius AI, Vanna.ai or DataGPT on top of your cleaned data and knowledge base. |
| Best for | Complex data, unique product logic, sensitive data that can't go through third-party tools, teams wanting full control | Data that fits an existing tool's model, buyers who want a polished UI, teams who'd rather pay a subscription than maintain code |
| Timeline | 4–6 weeks build + ongoing maintenance | 3–4 weeks setup + ongoing maintenance |
| Pricing | Per-seat: none. [ADD: price] | Your SaaS subscription + [ADD: our setup fee] |
| Lock-in | None | Vendor's terms |

*(The table replaces the two path cards' body text. Keep the existing "Not sure which?"
paragraph underneath - it's good and it stays as-is.)*

---

### Price

**⚠️ The biggest gap on the page.** Every other service page carries a number; this one
carries none while asking for a 4–6 week commitment.

[ADD: one line. A "from $X" in the two-paths table is enough - it doesn't need its own
section. If you won't publish a number, publish the reason: "priced per engagement because
the foundation work varies more than the build does" is a better answer than silence, and
engines will quote it.]

---

### What this looks like in practice

*(Proof card preserved. One change: label the numbers so they're liftable.)*

**Series B fintech · consumer finance · 100K+ customers**

- **The problem:** the growth team was asking the data team 30+ ad-hoc questions per week.
  Half had been answered before. The other half took 2–3 days and came back with conflicting
  numbers. Their analyst spent 60% of the week fielding repeat questions.
- **What we built:** a custom agent on their cleaned warehouse, with a knowledge base
  covering 80+ business metric definitions, table relationships, and the specific gotchas in
  their Stripe and payment data model. Two weeks of supervised testing before handoff.
- **The outcome:** ad-hoc data requests down 73% within 6 weeks; the growth team self-served
  4 out of 5 questions; the data team reclaimed ~15 hours a week.

> "For the first time, I trust an AI tool to answer a metrics question without checking the
> work. That's what we'd been trying to get to for two years."
> - Head of Growth, Series B fintech

---

### FINAL CTA

Stop *guessing* whether your data is right.

Book a 30-minute call. Bring your stack, the top 5 questions your team asks every week, and
any AI tools you've already tried. We'll tell you exactly what would need to happen to make
an AI analytics agent work for you - and whether it's worth doing yet.

→ **Book a Call**

We take on 2–3 new AI analytics builds per month.

---

## B. Title, meta description, slug

- **`<title>`:** `AI Analytics Agent Built on Clean Data` *(37 chars)*
- **Meta description:** `Most AI data tools give confident wrong answers because the data is broken. We fix the foundation, build the context, and ship an agent you can trust.` *(148 chars)*
- **Slug:** `/ai-analytics-agent` (unchanged)

---

## C. FAQ block

Keep all seven existing FAQs - they're the best on the site. Add these three:

**What is an AI analytics agent?**
A system that lets anyone on your team ask a data question in plain English and get the
correct number back, by translating the question into a query against your warehouse. What
separates one that works from one that doesn't is a knowledge base describing what your
metrics actually mean - not the model.

**How much does it cost?**
[ADD - see section D.]

**What data does the agent have access to, and where does it go?**
[ADD: this is the #1 objection from anyone with sensitive data. Path A is pitched partly on
"data that can't go through third-party tools", so the security answer is half-written
already - state which model provider is used, whether data leaves your infrastructure, and
what retention applies.]

---

## D. "Add real data here"

1. **🚩 [ADD: price]** - the only service page with no number. Used in two places.
2. **[ADD: data handling / security answer]** - model provider, data residency, retention.
   Named as a selling point for Path A but never actually answered.
3. **"About a third of our engagements are tool setups"** - confirm this is current.
4. **"We take on 2–3 new AI analytics builds per month"** - confirm.
5. **Named tools (Julius AI, Vanna.ai, DataGPT)** - worth a recency check before republish;
   this category moves fast and the page will be read as current. Consider "as of 2026" on
   that sentence.

---

## E. Internal links

| Link to | Anchor text | Place it in |
|---|---|---|
| `/pricing` | "how this fits with our other engagements" | Pricing section |
| `/how-it-works` | "the foundation work in step 02, explained" | Step 02 |
| `/case-studies` | "16 engagements where we fixed the foundation first" | Proof section |
| `/ask` | "see a grounded agent in action - ask mine" | Hero, under the demo |
| Ghost: `/blog/you-have-data-flowing-everywhere-and-trust-none-of-it` | "why nobody trusts the numbers" | Failures section |

---

## F. Change note

Light pass on an already-strong page. The two new tables **replace** prose (the six step
labels and the two path cards' bodies), so the page gets shorter. Added one definition
sentence to the hero and a three-clause summary above the failures section; everything else
is a heading reword. Flagged the missing price and data-security answers.
