# Free Event Tracking Plan Generator (Claude Skill)

A Claude skill that generates a complete, ready-to-implement event tracking plan for your product - by actually opening your site, clicking through it, and figuring out what's worth tracking. Output is a CSV in the standard Mixpanel / PostHog / Amplitude / GA4 format. Free to download, free to use.

**[Download the .skill file →]** *(button placement)*

---

## What is an event tracking plan?

An event tracking plan is a structured document listing every user interaction in your product that should be tracked, along with the data (properties) sent with each event. It's the single source of truth your engineering team uses to instrument analytics - and the document your data team uses to know what's actually being captured.

A good plan answers four questions for every event:

- **When does it fire?** (e.g., "When a user successfully publishes a post")
- **What's it called?** (e.g., `post_published`)
- **What data goes with it?** (e.g., `post_id`, `word_count`, `has_cover_image`)
- **What type is each property?** (e.g., string, numeric, boolean)

Without a tracking plan, you end up with inconsistent event names, missing properties, duplicate instrumentation, and dashboards nobody trusts. **Tracking debt compounds faster than tech debt.**

## Why founders skip tracking plans (and pay for it later)

Most early-stage founders skip the tracking plan entirely and just instrument events as they go. Six months in, they have:

- Three different events for "user signed up" (`signup`, `signup_completed`, `Sign Up`)
- Critical events (like `payment_failed`) not tracked at all
- Funnels that don't add up because event timing is inconsistent
- A data warehouse full of garbage that takes months to untangle

By the time you realize you need a tracking plan, you've already shipped a thousand events into production and you're playing catch-up.

## What this tool does

Once installed in Claude, you give it your product URL and answer three quick questions. Then Claude:

1. Opens your product in your real Chrome browser (via the Claude in Chrome extension)
2. Walks through your authenticated app section by section - clicking, exploring, decoding what's a meaningful event vs. what's noise
3. Asks you to sign in when it hits a login wall, then keeps going
4. Pauses periodically to show you what it's logged so far, so you can redirect
5. Outputs a CSV tracking plan in the standar format you can hand to your engineering team

## What you get

A CSV file with these columns, ready to import or share:

| Column | Description |
|---|---|
| Event | Plain-English trigger (e.g., "When a user publishes a post") |
| Event Name | Lowercase snake_case event name (e.g., `post_published`) |
| Properties to track | Property names (e.g., `post_id`, `word_count`) |
| Property Type | Event / Super / Profile |
| Example Property Values | Realistic example value |
| Data / Property Type | string / numeric / boolean / array / datetime |
| Has this been implemented? | Empty - for your engineers to fill in |

Rows are grouped by event and ordered to mirror the user journey: acquisition → signup → onboarding → core feature events → state transitions → engagement → errors.

## Installation

You need **Claude Pro, Max, or Team** (skills aren't available on the free plan), plus the **Claude in Chrome browser extension** installed and connected.

Steps:

1. Download the `.skill` file from this page
2. Open Claude → Settings → Capabilities → Skills
3. Click "Upload skill" and select the file
4. Open a new conversation. The skill activates automatically when you ask Claude to create a tracking plan.

## How to use it

Start a new chat and say something like:

> "I want to create a tracking plan for my product. The URL is `https://app.yourproduct.com` - it's a [one-line description]."

Claude will then ask you three questions:

1. **Product context** - who uses it, what's the core "aha" moment, what's the monetization model. A few sentences is enough; the more context you give, the better the event names will be.

2. **Detail level** - `Detailed` (every meaningful step in multi-step flows) or `Simple` (only the most important events). Pick `Detailed` for a first plan if you have the engineering bandwidth to instrument it all; pick `Simple` if you want to start narrow.

3. **Sections to cover** - `all` for the entire authenticated product, or list specific sections like `dashboard, billing, store creation`.

Then it starts driving your browser. You'll see Claude navigate, click, scroll, and explore each section in real time. When it hits a login screen, it pauses and asks you to sign in. When it finishes a section, it pauses and shows you what it's added - you can ask it to remove, rename, or add events before it moves on.

The full run typically takes **20–60 minutes**, depending on how complex your product is. The CSV is delivered at the end.

## Suggested SEO metadata for this page

**Page title (title tag):** Free Event Tracking Plan Generator - Claude Skill | Datalyze
**Meta description:** Generate a complete event tracking plan for your product in under an hour. Free Claude skill. Outputs a Mixpanel/PostHog/Amplitude/GA4-compatible CSV. Built by Datalyze.
**URL slug:** `/tools/event-tracking-plan-generator`
**Primary keyword:** event tracking plan generator
**Supporting keywords:** event tracking plan template, mixpanel tracking plan, posthog event tracking, ai tracking plan, claude skill analytics, automated event tracking plan, tracking plan tool

**Schema markup to add to the page:**
- `SoftwareApplication` with `applicationCategory: BusinessApplication`, `operatingSystem: Web`, `offers.price: 0`
- `HowTo` for the "How to use it" section (step-by-step)
- `FAQPage` for the FAQ section

**Internal links to add:**
- Link "tracking debt" phrase → your "Analytics Debt" blog post
- Link "Mixpanel" → your Mixpanel partnership / services page
- Link "PostHog" → your PostHog blog post
- Link "AI Analytics Agent" → your AI agent product page
- Link "book a call" → your booking flow

**OpenGraph image suggestion:** A screenshot of the CSV output with a Datalyze brand frame (the editorial-brutalist `#0A0A0B` + `#D4FF3F` look), captioned "Event tracking plan, generated in 30 minutes."
