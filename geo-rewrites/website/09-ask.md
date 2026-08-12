# 09 - Ask Ansh's AI (`/ask`)

Source: `app/ask/page.tsx` + `app/ask/ask-chat.tsx` + `lib/data/ask-questions.ts`

**The problem:** this page is a chat widget with essentially no crawlable text. It has a
`WebApplication` schema and a `<title>`, and that's it. An AI answer engine visiting `/ask`
finds nothing to cite. Meanwhile `/ask/[slug]` renders pre-answered questions - those are
where the real GEO value is, and the index page doesn't surface them as text.

---

## A. The rewritten piece

*(All of the below is new static copy to sit above and below the chat component. The chat
itself is unchanged.)*

### H1: Ask Ansh's AI an analytics question

**Answer-first intro** *(the page has no static text at all today, so this is genuinely new
- but it's two sentences)*

> A free AI that answers analytics questions using only Ansh Agrawal's published writing on
> tracking, attribution and retention. If the answer isn't in there, it says so rather than
> guessing.

*(chat component)*

---

### What can you ask it?

*(New - surface the pre-answered question corpus as crawlable links. These are the queries
people type into ChatGPT, so each one is a landing page.)*

[ADD: render the full `ask-questions.ts` list here as links to `/ask/[slug]`. I've only
sampled the file - before publishing I'll pull the real list and group it into the four
buckets below.]

- **Tracking and instrumentation** - where to fire events, client vs server, naming events,
  what a tracking plan should contain
- **Tools** - Mixpanel vs Amplitude vs PostHog, when GA4 is enough, when to add a warehouse
- **Attribution and marketing data** - why the ad platform and the product disagree,
  incrementality, branded search
- **Retention and activation** - finding the aha moment, diagnosing D30, cohort analysis

---

### How it works

*(Three lines, not three paragraphs.)*

- **Grounded** - answers come only from Ansh's published writing, not the open internet.
- **Refuses rather than guesses** - if it's not covered, you get a straight no.
  [ADD STAT: what share of questions it declines? Very quotable if you have it.]
- **Free, no signup.** [CONFIRM: any gate or rate limit?]

---

### Why an AI that says "I don't know"

*(New - 2 sentences, first person. This is the most GEO-valuable text on the page: an
opinionated stance an engine can quote and attribute to a named person.)*

[ADD: two sentences in Ansh's voice on why refusal beats a confident wrong answer. The
`/ai-analytics-agent` page already makes this argument about client agents; this page should
make it about its own. Personal opinion, so I'm not writing it for you.]

---

### Want a human answer instead?

For anything about *your* stack - book a free 30-minute call. → **Book a call**

---

## B. Title, meta description, slug

- **`<title>`:** `Ask Ansh's AI - Free Analytics Answers` *(38 chars)*
- **Meta description:** `Free AI that answers analytics questions from Ansh Agrawal's own writing on tracking, attribution and retention - and says no when it doesn't know.` *(146 chars)*
- **Slug:** `/ask` (unchanged)

---

## C. FAQ block

**What is Ask Ansh's AI?**
A free AI assistant that answers product-analytics questions using only Ansh Agrawal's
published writing. It's grounded in a fixed corpus rather than the open web, so it can cite
where an answer came from.

**Is it free?**
Yes. [CONFIRM: no signup, no rate limit?]

**What happens if my question isn't covered?**
It tells you it isn't covered. No answer beats a wrong one - that's the whole design
principle.

**How is this different from asking ChatGPT?**
ChatGPT answers from everything it has ever read, including a lot of analytics advice that's
wrong or out of date. This answers from one practitioner's published work across 150+
analytics engagements, and refuses outside it.

**Can it look at my data?**
No. It has no access to your tools or data. For anything specific to your stack, book a
call.

**Who is Ansh Agrawal?**
Founder of Datalyze, an analytics consultancy. He started his analytics career at CRED, then
spent years fixing analytics for startups one at a time before founding Datalyze in 2019.

---

## D. "Add real data here"

1. **[ADD: the full question list]** - I need to render `lib/data/ask-questions.ts` as
   crawlable links grouped into four buckets. This is the single biggest GEO win available
   on this page and it's mechanical, not editorial.
2. **[ADD STAT: refusal rate]** - what share of questions the AI declines.
3. **[CONFIRM: gating]** - free, signup, rate limits.
4. **[ADD: the "why refusal beats a wrong answer" paragraph]** - needs to be in Ansh's own
   words.
5. **⚙️ Technical:** the page is client-rendered chat with no static content. Everything
   above should be server-rendered static text around the widget, or crawlers see an empty
   page. Also worth adding `FAQPage` schema alongside the existing `WebApplication`.

---

## E. Internal links

| Link to | Anchor text | Place it in |
|---|---|---|
| `/ask/[slug]` × N | the question text itself | "What can you ask it" |
| `/ai-analytics-agent` | "we build agents like this for client data" | "How it works" |
| `/resources` | "the guides these answers come from" | Below the chat |
| `/contact` | "book a free 30-minute call" | "Want a human answer" |
| `/about` | "who Ansh is" | FAQ |

---

## F. Change note

Turned a text-free chat widget into a crawlable page. The page currently has *zero* static
prose, so everything here is additive by necessity - but it's kept to two sentences of intro,
three bullets, and a question index that's links rather than text. The FAQ sits below the
chat.
