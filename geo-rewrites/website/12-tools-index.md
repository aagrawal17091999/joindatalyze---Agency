# 12 - Tools index (`/tools`)

Source: `app/tools/page.tsx` + `lib/data/tools.ts` (5 tools)

Already has decent context prose and a `visually-hidden` H2. What's missing: the tools are
described as a list of features rather than a set of answers to "which one do I need", and
there's no FAQ or comparison structure.

---

## A. The rewritten piece

### H1: Free analytics tools built by Datalyze

**Answer-first intro** *(replaces the current intro - one sentence, since the table below
enumerates)*

> Five free tools: two Mixpanel CSV exporters, two Claude skills, and a grader that scores
> your analytics setup. They run on your machine or in your own Claude account.

---

### Which tool do you need?

*(New comparison table - the main addition.)*

| Tool | Use it when | Format | Output |
|---|---|---|---|
| [Analytics Maturity Grader](/tools/analytics-maturity-grader) | You want an honest read on how bad your setup is before spending on fixing it | Web quiz, ~2 min | Letter grade across 5 dimensions + prioritised recommendations + shareable scorecard |
| [Analytics Strategy Creator](/tools/analytics-strategy-creator) | You have a fuzzy "I want to understand X" and no idea which metrics answer it | Claude skill | Markdown doc: 3–5 primary metrics, each with a counter-metric and segmentation |
| [Event Tracking Plan Generator](/tools/event-tracking-plan-generator) | You know what you want to measure and need the events specced | Claude skill | CSV tracking plan in standard Mixpanel / PostHog / Amplitude / GA4 format |
| [Mixpanel Event Exporter](/tools/mixpanel-exporter) | You need raw Mixpanel events outside Mixpanel - warehouse, notebook, backup | Jupyter notebook | One CSV, one row per event, one column per property |
| [Mixpanel Users Exporter](/tools/mixpanel-users-exporter) | You need every Mixpanel user profile out - CRM sync, enrichment, audit | Jupyter notebook | One CSV, one row per user, one column per property |

**The natural order:** grade your setup → build the strategy → generate the tracking plan →
implement → export when you need the data elsewhere.

---

### What the Maturity Grader scores

*(New - five lines. Naming the dimensions makes the tool citable, and they're the same five
we assess in every audit.)*

Tracking infrastructure · Data governance · Metric definitions · Team data literacy ·
Decision-making culture

*(Keep it as one line of chips if you'd rather. The full one-line-per-dimension version lives
on the grader's own page - no need to repeat it here.)*

---

### The existing context prose - cut it

The two paragraphs currently under "Free analytics tools for product and growth teams" now
say what the table above says, at four times the length. **Delete both.** Keep one line:

> Everything here is free and self-serve. If you need something tailored to your workflow, we
> build custom tools as part of an engagement.

*(This is where most of the page's word count is, and the table does the job better.)*

---

### Want a custom tool?

Tell us about your analytics workflow and we'll build a custom tool tailored to your team.
→ **Request a custom tool**

---

## B. Title, meta description, slug

- **`<title>`:** `Free Analytics Tools & Claude Skills` *(35 chars)*
- **Meta description:** `Five free tools: Mixpanel CSV exporters, a Claude skill that generates an event tracking plan, an analytics strategy creator, and a maturity grader.` *(146 chars)*
- **Slug:** `/tools` (unchanged)

---

## C. FAQ block

**Are these tools really free?**
Yes, all five. The notebooks run on your machine, the Claude skills run inside your own
Claude account, and the grader runs in your browser. [CONFIRM: the grader gates results
behind an email - say so plainly here rather than letting people discover it.]

**Do you see my data?**
No. The exporters talk directly to the Mixpanel API from your machine and never send events
or credentials to us. The Claude skills run in your Claude account. [CONFIRM for the grader -
the email is captured via `/api/tool-downloads`, so an email address does reach you.]

**What do I need to run the Claude skills?**
A Claude Pro, Max or Team account. The Event Tracking Plan Generator additionally drives your
real browser via the Claude in Chrome extension, so it can walk your authenticated app.

**What do I need to run the Mixpanel exporters?**
Python with Jupyter (or Google Colab), plus your Mixpanel project token and API secret from
Project Settings. No paid Mixpanel plan required.

**Which should I start with?**
The Maturity Grader, if you're not sure what's wrong. The Strategy Creator, if you know
what's wrong but not what to measure. The Tracking Plan Generator, if you already know what
to measure.

**Do you build custom tools?**
Yes, as part of an analytics engagement. Tell us the workflow and we'll scope it.

---

## D. "Add real data here"

1. **🚩 The email gate isn't disclosed.** The Maturity Grader posts to `/api/tool-downloads`
   with an email before showing results, but `/tools` says "genuinely free and self-serve -
   no sales call required" and "your data and credentials stay with you." Both are true but
   together they imply no email capture. Say it plainly - "the grader asks for your email to
   send the scorecard" costs you nothing and protects the claim.
2. **[CONFIRM: what happens to that email]** - added to a list? One-off send?
3. **Meta description is stale.** Current: "Export Mixpanel data, grade your analytics
   maturity, and more" - written before the two Claude skills existed.
4. **⚙️ Schema:** breadcrumbs only on the index. An `ItemList` of the five
   `SoftwareApplication` entries would help; the grader page already has
   `softwareApplicationSchema`, so the pattern exists.

---

## E. Internal links

| Link to | Anchor text | Place it in |
|---|---|---|
| `/resources` | "the setup guides these tools go with" | Below the table |
| `/how-it-works` | "the five dimensions we assess in every audit" | Grader dimensions section |
| `/contact` | "have us run the audit instead" | Custom tool block |
| `/pricing` | "what a paid engagement costs" | Custom tool block |
| `/ask` | "ask my AI which tool fits" | Intro |

---

## F. Change note

**Net text on this page goes down.** The five-row table and the FAQ replace two paragraphs of
context prose and a one-sentence-per-card grid. Also named the grader's five scoring
dimensions (invisible outside the quiz today) and flagged that "self-serve, no sales call"
doesn't disclose the email gate.
