# 07 - Contact (`/contact`)

Source: `app/contact/page.tsx`

Short page, and mostly fine. Two GEO gaps: it never says *what happens after* you book (the
top pre-booking anxiety), and it has no FAQ or schema beyond breadcrumbs.

---

## A. The rewritten piece

### H1: Book a call with us

**Answer-first intro** *(replaces the current one, roughly same length)*

> A free 30-minute working session, not a sales pitch. A senior analyst reviews your stack
> live and shows you the two or three things quietly distorting your numbers. You leave with
> a plan you can hand to your own team, whether or not you hire us.

---

### What you'll get on the call

- **A live audit of your stack** - tracking, warehouse, dashboards and attribution,
  reviewed on the call.
- **The 2–3 highest-leverage fixes** - the gaps quietly distorting your numbers, and what
  it takes to close them.
- **A clear next step** - whether that's working with us or a plan you can hand to your own
  team. No obligation.

---

### What to bring

*(New - four bullets, no prose. Lifted from the AI-agent page's CTA, which already asks for
exactly this.)*

- Access to, or a screen-share of, your analytics tool
- The top 3–5 questions your team asks the data every week
- Any numbers that currently disagree between two systems

You don't need to prepare a deck. Bring the mess.

---

### After you book

*(New - three short lines. The one thing every booking page must answer and this one
doesn't.)*

Calendar invite lands immediately. [ADD: pre-call questionnaire or access request - yes or
no?] On the call it's a senior analyst, not a salesperson. Afterwards: [ADD - `/about`
promises "no follow-up unless you ask for one", so say plainly what does and doesn't arrive].

*(Cut the "who is this call for" section I'd drafted - it's better as a single FAQ than a
block of qualification copy on the page itself.)*

---

## B. Title, meta description, slug

- **`<title>`:** `Book a Free 30-Minute Analytics Audit` *(36 chars)*
- **Meta description:** `Book a free 30-minute call. A senior analyst reviews your tracking, warehouse and attribution live, and names the 2–3 fixes that matter most.` *(140 chars)*
- **Slug:** `/contact` (unchanged)

---

## C. FAQ block

*(New - the page has none.)*

**Is the call really free?**
Yes. Thirty minutes, no charge, no obligation. You leave with the fixes we'd prioritise
whether or not you work with us.

**Who will be on the call?**
A senior analyst from the team - the person who'd actually do the work, not an account
manager or an SDR.

**What do I need to prepare?**
Access to your analytics tool (or a screen-share), and the questions your team keeps asking
the data. That's it.

**Will you try to sell me a retainer?**
No. Roughly [ADD: share] of first calls end with us telling the team what to fix themselves.
When an engagement makes sense we'll say so, and when it doesn't we'll say that too.

**How soon can we start after the call?**
Within a day of kickoff. We don't need a discovery phase.

**Can we sign an NDA first?**
[ADD: yes/no and how.]

---

## D. "Add real data here"

1. **[ADD: the post-booking sequence]** - do you send a questionnaire? An access request?
2. **[ADD: what arrives after the call, and when]** - summary, proposal, or nothing unless
   asked. `/about` says "no follow-up unless you ask"; make the two pages agree.
3. **[ADD: fit criteria]** - stage or budget floor, for the FAQ rather than the page body
4. **[ADD: share of calls that end without a pitch]** - only if you have it; it's the single
   most disarming stat you could put on this page.
5. **[ADD: NDA policy]** *(also open on `/faqs`)*
6. **⚙️ Missing schema:** this page has breadcrumbs only. It should also carry
   `ContactPage` and a `Service`/`Offer` for the free audit - that's how an engine
   learns a free audit exists.

---

## E. Internal links

| Link to | Anchor text | Place it in |
|---|---|---|
| `/pricing` | "what an engagement costs after the audit" | "After you book" |
| `/how-it-works` | "the four phases we'd run" | "After you book" |
| `/case-studies` | "what we found in 16 other stacks" | Under "what you'll get" |
| `/faqs` | "everything else people ask before booking" | End of FAQ |
| `/tools/analytics-maturity-grader` | "not ready to book? Grade your setup in 3 minutes" | Bottom of page |

---

## F. Change note

Added two short blocks - what to bring, and what happens after you book - totalling about 60
words, plus a six-question FAQ below them. Cut the qualification section I'd first drafted;
it works as one FAQ instead. Also flagged that the page carries breadcrumb schema only when
it should describe the free audit as an offer.
