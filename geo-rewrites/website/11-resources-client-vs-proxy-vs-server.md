# 11 - Client vs Proxy vs Server-Side Tracking (`/resources/client-vs-proxy-vs-server-tracking`)

Source: `app/resources/client-vs-proxy-vs-server-tracking/page.tsx`

**Assessment:** the best pure-content page on the domain - genuinely useful, well-argued,
already sectioned by method. It targets a high-volume comparison query ("client vs server
side tracking") and it is *this close* to being the page AI engines cite for it. What's
missing is the comparison table (mandatory for a "X vs Y" query), an event-by-event
recommendation, and any first-person evidence.

---

## A. The rewritten piece

### H1: Client vs proxy vs server-side tracking

**Answer-first TL;DR** *(replaces the current 2-sentence intro; one sentence longer, and it
carries the whole answer)*

> Fire revenue, sign-ups and anything that must be exact from your **server**. Fire UI
> interactions, engagement and behavioural detail from the **client**. Route those client
> events through a **first-party proxy** on your own domain to recover the 10–30% that ad
> blockers and tracking prevention would otherwise drop. Most products need all three, split
> deliberately per event - not one method for everything.
>
> [ADD STAT: the share of client-side events you actually see dropped in audits. I've written
> "10–30%" as a placeholder because it's the widely-cited range, but **do not publish it
> unless it's your number.** Replace it with what you measure, or cut the figure and keep
> "a meaningful share".]

---

### The three approaches compared

*(New. This table is the reason the page will or won't get cited for the comparison query.)*

| | **Client-side** | **Proxy (first-party)** | **Server-side** |
|---|---|---|---|
| Where it fires | User's browser or mobile app, via SDK | Browser → an endpoint on your domain → the tool | Your backend, after the action is confirmed |
| Completeness | Lowest - blockers, ITP and network failures drop events silently | High - requests look first-party, so most blocked events are recovered | Highest - nothing on the user's machine can stop it |
| Tamper-resistance | Low - code runs on the user's machine and can be inspected or spoofed | Low - still originates client-side | High |
| Front-end context | Full - clicks, page, referrer, device, UI sequence | Full - same payload, different route | Limited - the server often can't see UI state or client attribution signals |
| Setup effort | Lowest | Medium - needs infrastructure to run and maintain | Highest - real engineering per event |
| Best for | Engagement, UX behaviour, funnels through the interface | Recovering blocked client events without moving to server | Revenue, sign-ups, anything financial or business-critical |
| Worst for | Anything that must be exact | Being your only fix - it doesn't solve tamper-resistance | Being your whole setup - it's the source of truth, not the full picture |

---

### What is client-side tracking?

**One sentence:** Client-side tracking fires the event directly from the user's browser or
app via an analytics SDK.

It's the fastest to set up and captures rich front-end context: which button was clicked,
page and referrer details, device, and the full sequence of UI interactions. The downside is
reliability. Ad blockers, privacy browsers (Safari's ITP, Firefox) and network failures
silently drop a meaningful share of events, and because the code runs on the user's machine
it can be inspected or spoofed. Great for engagement and UX behaviour; risky for anything you
need to be exact.

### What is server-side tracking?

**One sentence:** Server-side tracking sends the event from your own backend after the
action is confirmed.

Because it doesn't depend on the user's browser, it can't be blocked by extensions and is far
harder to tamper with - which makes it the right home for revenue, sign-ups, and any
business-critical or financial event. The trade-off is that the server often lacks front-end
context (exact UI state, client-side attribution signals) and it takes more engineering effort
to instrument. It's the source of truth, not the full picture.

### What is proxy (first-party) tracking?

**One sentence:** A proxy routes client-side events through an endpoint on your own domain
before forwarding them to the analytics tool.

You keep the richness of client-side data while recovering much of what ad blockers and
tracking prevention would otherwise drop, because the requests look first-party rather than
third-party. It needs some infrastructure to run and maintain, but it's the practical way to
make client-side data more complete without moving everything to the server.

---

### Which method should each event use?

*(New - this is the practical table people actually want, and nothing on the internet does it
well.)*

| Event | Fire it from | Why |
|---|---|---|
| Purchase / payment completed | Server | Must be exact; must not be blockable or spoofable |
| Subscription started / renewed / cancelled | Server | Billing truth lives in your backend, not the browser |
| Sign-up / account created | Server | Business-critical; drives CAC and activation denominators |
| Free trial started | Server | Same |
| Page / screen viewed | Client (via proxy) | Needs front-end context; volume makes server instrumentation expensive |
| Button / CTA clicked | Client (via proxy) | Only the client knows what was on screen |
| Feature used in-app | Client (via proxy) | Behavioural detail the server can't see |
| Form field errors, drop-off within a flow | Client (via proxy) | Pure UI state |
| Onboarding step completed | Depends - server if it gates access, client if it's UI-only | [CONFIRM: your default] |
| Email opened / link clicked | Server (from your ESP webhook) | Not your front end at all |

---

### How to set this up

*(New - a numbered list, not prose. The page explains the concepts but never says what to do
on Monday.)*

[ADD: your four or five steps. From your other writing I'd expect something like: list every
event → mark the ones where being wrong costs money → move those to server → stand up the
proxy for the rest. Your method, so I'm not inventing it. Keep it to one line per step.]

**One line of first-hand evidence:** [ADD - e.g. how many setups you audit that fire revenue
client-side. This page has zero first-person signal today, and it's the page where
practitioner authority most changes whether an engine cites you over a vendor blog.]

---

### Common mistakes

*(New - four one-liners.)*

1. **Firing revenue from the client.** The most common cause of a product number that doesn't
   match Stripe. [ADD: how often you see it.]
2. **Treating a proxy as an accuracy fix.** It recovers *blocked* events. It doesn't make
   client data tamper-proof.
3. **Moving everything server-side.** You lose the behavioural detail and pay for it in
   engineering time.
4. **Deciding once, globally.** The unit of decision is the event, not the stack.

---

*(Keep the 13-slide deck below the article.)*

---

## B. Title, meta description, slug

- **`<title>`:** `Client vs Proxy vs Server-Side Tracking` *(38 chars - unchanged)*
- **Meta description:** `Server-side for revenue and sign-ups, client-side for behaviour, a first-party proxy to recover blocked events. Which method each event should use.` *(145 chars)*
- **Slug:** unchanged

---

## C. FAQ block

**Is server-side tracking better than client-side?**
Not better - different. Server-side is more reliable and harder to tamper with, so it's
right for revenue and sign-ups. Client-side sees the interface, so it's right for behaviour.
Most products need both.

**Do I need a first-party proxy?**
If a meaningful share of your client events are being dropped by ad blockers or Safari's
ITP, yes. It's the cheapest way to recover them without re-instrumenting everything
server-side.

**How many events do ad blockers actually block?**
[ADD: your measured number - see section D.]

**Does server-side tracking break attribution?**
It can. Click IDs and campaign parameters arrive in the browser, so if you move an event
server-side without passing that context through, attribution goes with it. Capture the
attribution parameters client-side on landing, persist them, and attach them to the
server-side event.

**Is server-side tracking better for privacy compliance?**
It gives you more control over what leaves your infrastructure, which helps - but where an
event fires doesn't determine whether you had a lawful basis to collect it. [CONFIRM: happy
to keep this cautious framing, or cut the question if you'd rather not touch compliance.]

**Can I use Google Tag Manager server-side instead?**
[ADD: your view. GTM server-side containers are the most common alternative to a custom
proxy, and the page doesn't mention them at all - which is a gap an engine will notice.]

---

## D. "Add real data here"

1. **🚩 "10–30% dropped" is my placeholder, not your number.** Replace or cut it. It appears
   in the TL;DR and one FAQ.
2. **[ADD: how often you see revenue events fired client-side]** - Common mistakes #1.
3. **[ADD: the practical setup sequence]** - "How do you actually set this up".
4. **[ADD: first-person evidence]** - the page has none, and it's the biggest single
   authority gap.
5. **[ADD: your take on server-side GTM]** - a notable omission for this topic.
6. **[CONFIRM: onboarding-step default]** - event table.
7. **⚙️ Schema:** breadcrumbs only. This should carry `Article` (or `TechArticle`) with an
   author reference to Ansh, plus `FAQPage`. It's the page most likely to be cited, and
   right now it doesn't declare an author.

---

## E. Internal links

| Link to | Anchor text | Place it in |
|---|---|---|
| `/tools/event-tracking-plan-generator` | "generate a tracking plan that marks each event's source" | Event table |
| `/how-it-works` | "how we do this in a real engagement" | "How do you set this up" |
| `/resources` | "the rest of the setup guides" | End |
| Ghost: `/blog/data-tracking-comparing-client-vs` | "the longer write-up on client vs server" | Intro |
| Ghost: `/blog/d2c-playbook-3-why-your-conversions-look-too-good` | "why your conversion numbers look too good" | Common mistakes |

---

## F. Change note

Added the two tables this page needs to be cited for a "X vs Y" query - the three-way
comparison and the event-by-event recommendation - plus a one-sentence definition on each
existing method section, four one-line common mistakes, and a six-question FAQ. The three
method paragraphs are unchanged. Most of the added content is tabular, not prose.

Also flagged that the page declares no author despite being the most citable thing on the
domain.
