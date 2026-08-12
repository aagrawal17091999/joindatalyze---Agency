# 15 - Event Tracking Plan Generator (`/tools/event-tracking-plan-generator`)

Source: `app/tools/event-tracking-plan-generator/page.tsx`

**Assessment:** the most complete tool page - definition up top, "why founders skip tracking
plans", how it works, the CSV columns, requirements, and a sample prompt. It does nearly
everything the checklist asks for.

**Gaps:** no FAQ block, no FAQPage schema, and it never shows a sample *row* of output - only
the column names.

---

## A. The rewritten piece

*(Keep all existing sections. Three additions and two heading changes.)*

### Heading changes

| Current | Change to |
|---|---|
| *(untitled definition section)* | **What is an event tracking plan?** |
| "Why founders skip tracking plans (and pay for it later)" | *(keep)* |
| *(untitled "once installed" section)* | **How does the Claude skill work?** |
| *(untitled CSV section)* | **What does the output look like?** |
| *(untitled requirements section)* | **What do you need to run it?** |

---

### NEW - A sample of the output

*(The page lists the CSV columns but never shows a filled row. One example row per journey
stage is what an engine will lift when someone asks "what should a tracking plan look
like".)*

[ADD: three or four real rows from a generated plan. Suggested shape - fill from an actual
run rather than my invention:]

| Event name | Journey stage | Trigger | Properties | Fire from |
|---|---|---|---|---|
| *(fill from a real run)* | Acquisition | | | |
| | Signup | | | |
| | Core action | | | |
| | Error | | | |

---

### NEW - How many events should a tracking plan have?

*(One or two sentences. Most-asked question in the category, and an opinionated number from
someone who's built 150+ plans is exactly what gets cited.)*

[ADD: your number and the reason. Shape: "most early-stage products need 25–40 events, not
200 - the ones with 200 are tracking clicks instead of outcomes." I won't invent the range.]

---

### NEW - Naming convention

*(Two sentences, and it's the detail that makes a tracking-plan page credible.)*

[ADD: your convention - `Object Action` past tense, snake case, whatever you standardise on -
plus the one rule you enforce most (e.g. never encode a value in the event name, put it in a
property).]

---

### NEW - Which stage does each event belong to?

*(One line plus a table. The grouping is the part most self-written plans miss.)*

Events are grouped by journey: **acquisition → signup → core → engagement → errors**.

| Stage | What belongs here | What people wrongly put here |
|---|---|---|
| Acquisition | Landing, campaign arrival, source attribution | [ADD] |
| Signup | Account created, verification, first login | Every field interaction in the form |
| Core | The action the product exists to deliver | [ADD] |
| Engagement | Repeat use, depth, habit signals | Raw page views |
| Errors | Failures that block the above | [ADD] |

---

## B. Title, meta description, slug

- **`<title>`:** `Free Event Tracking Plan Generator - Claude Skill` *(48 chars)*
- **Meta description:** `Free Claude skill that walks your live product and generates a ready-to-implement event tracking plan as a CSV for Mixpanel, PostHog, Amplitude or GA4.` *(149 chars)*
- **Slug:** unchanged

---

## C. FAQ block

*(New.)*

**What is an event tracking plan?**
A structured document listing every user interaction in your product that should be tracked,
with the properties each event carries and where it fires. It's the spec engineers implement
against, and the thing that stops three people naming the same event three ways.

**How many events should we track?**
[ADD - see section D.]

**What format does it output?**
A CSV in the standard format Mixpanel, PostHog, Amplitude and GA4 all accept, grouped by
user journey: acquisition → signup → core → engagement → errors.

**Do I need to give it access to my product?**
It drives your real Chrome browser via the Claude in Chrome extension, so it can walk your
authenticated app section by section - which means it sees what you see while you're logged
in. It pauses for your input as it goes. [CONFIRM: nothing is sent to Datalyze.]

**What do I need to run it?**
Claude Pro, Max or Team (skills aren't on the free plan), plus the Claude in Chrome
extension.

**Can I use this if I already have tracking?**
Yes, and it's arguably more useful - it surfaces what you're *not* tracking, which is the
harder half. Compare the generated plan against your existing event list.

**Does it work for mobile apps?**
[ADD: it drives a Chrome browser, so presumably web only. State the limitation plainly -
it's better than a user finding out after installing.]

---

## D. "Add real data here"

1. **[ADD: sample output rows]** - biggest win on the page.
2. **[ADD: how many events a plan should have]** - high-volume question, and your answer
   would be genuinely differentiated.
3. **[ADD: your naming convention]**
4. **[ADD: journey-stage table - the "wrongly put here" column]**
5. **[ADD: mobile / non-web limitation]**
6. **[CONFIRM: data handling]** - the skill walks an authenticated session; say explicitly
   that nothing reaches Datalyze.
7. **⚙️ Missing `FAQPage` schema.**

---

## E. Internal links

| Link to | Anchor text | Place it in |
|---|---|---|
| `/tools/analytics-strategy-creator` | "write the strategy first" | Intro |
| `/resources/client-vs-proxy-vs-server-tracking` | "decide where each event fires" | Output section |
| `/tools/analytics-maturity-grader` | "grade your current tracking" | End |
| Ghost: `/blog/creating-an-event-tracking-plan-for` | "the manual version of this method" | Definition section |
| Ghost: `/blog/what-are-events-and-properties-in` | "events vs properties, explained" | Definition section |

---

## F. Change note

Additive but small: two tables (sample output, journey stages), two short answers (how many
events, naming convention), and the page's first FAQ block. Existing prose is untouched - this
page is already thorough and the right length.
