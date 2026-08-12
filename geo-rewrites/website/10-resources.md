# 10 - Resources (`/resources`)

Source: `app/resources/page.tsx` (9 resources)

**Two problems.** Seven of the nine resources link off-site (Notion, Gumroad, YouTube) - the
page passes visitors and crawl equity straight out with nothing citable left behind. And one
internal link is broken: `/resources/improve-app-retention` doesn't exist. **Resolved: delete
it** (here and in the footer).

---

## A. The rewritten piece

### H1: Analytics guides, tools and templates

**Answer-first intro** *(replaces "Everything we've written, recorded, and built…" - one
sentence, since the tables below do the enumerating)*

> Setup guides, free tools, and a course - everything that came out of fixing analytics for
> 150+ startups.

---

### Setup guides - how do you implement each tool properly?

| Guide | What it covers | Format |
|---|---|---|
| [Mixpanel setup - the right way](https://www.notion.so/…) | Clean events, clear definitions, reliable data from day one | Notion guide |
| [PostHog setup - the right way](https://www.notion.so/…) | Avoiding the common tracking issues that make PostHog data unusable | Notion guide |
| [Amplitude setup - the right way](https://www.notion.so/…) | Implementing Amplitude so teams can trust the metrics | Notion guide |
| [Client vs proxy vs server-side tracking](/resources/client-vs-proxy-vs-server-tracking) | Where to fire each event, and why it changes your data | On-site guide + 13-slide deck |

---

### Tools we built

| Tool | What it does | Who it's for |
|---|---|---|
| [Pravix](https://joinpravix.com/) | Monitors Mixpanel data quality in real time and catches tracking issues before they reach reports | Teams whose Mixpanel data breaks silently |
| [DatalyzeInsights](https://datalyzeinsights.com/) | Turns product videos into tracking plans and analytics strategies using AI | Teams starting instrumentation from scratch |
| [Analytics maturity grader](/tools/analytics-maturity-grader) | Scores your analytics setup in about 3 minutes | Anyone unsure how bad their setup actually is |
| [Event tracking plan generator](/tools/event-tracking-plan-generator) | Generates a tracking plan for your product | Teams writing a plan for the first time |
| [Analytics strategy creator](/tools/analytics-strategy-creator) | Builds an analytics strategy from your product and goals | Teams with tracking but no strategy |

*(The three on-site tools aren't listed here today. They should be - they're the only
resources that keep the visitor on the domain.)*

---

### Learn

| Resource | What it is |
|---|---|
| [Learning Mixpanel](https://anshagrawal.gumroad.com/l/learning-mixpanel) | A hands-on course covering Mixpanel features with real examples, from basics to confident day-to-day analysis |
| [Datalyze on YouTube](https://www.youtube.com/channel/UCKdowFIRu4Z5lFxNM_JNxSQ) | Analytics concepts, Mixpanel walkthroughs, practical problem-solving |
| [The Datalyze blog](/blog) | 80+ posts on tracking, attribution, retention and the D2C data stack |

*(The blog isn't linked from this page at all today - the largest body of content you own,
and the resources index ignores it.)*

---

### Where to start

*(New - five lines. Doubles as internal linking.)*

- **Setting up analytics from scratch** → the setup guide for your tool, then the event
  tracking plan generator.
- **You have tracking but don't trust it** → client vs proxy vs server-side, then the
  maturity grader.
- **You have data but no strategy** → the analytics strategy creator.
- **You want to get good at Mixpanel** → the Learning Mixpanel course.
- **You want it fixed rather than to fix it** → [book a call](/contact).

---

## B. Title, meta description, slug

- **`<title>`:** `Analytics Guides, Tools & Templates` *(34 chars)*
- **Meta description:** `Free setup guides for Mixpanel, PostHog and Amplitude, a tracking plan generator, a maturity grader, and tools for keeping analytics data clean.` *(142 chars)*
- **Slug:** `/resources` (unchanged)

---

## C. FAQ block

**Are these resources free?**
The guides, the on-site tools and the YouTube channel are free. Learning Mixpanel is a paid
course on Gumroad. Pravix and DatalyzeInsights are separate products with their own pricing.

**Which analytics tool should we use?**
For most startups it comes down to Mixpanel, Amplitude or PostHog, and the honest answer is
that implementation quality matters more than the choice. [ADD: your actual default
recommendation and the condition that flips it - you have a strong published opinion on
PostHog and it belongs here.]

**Do I need a data warehouse?**
[ADD: your threshold. "Once you're doing X" is the kind of specific answer that gets cited.]

**Can you just set this up for us?**
Yes - that's the day job. An audit starts at $1,000 and infra setup runs about 30 days.

---

## D. "Add real data here"

1. **✅ Resolved - delete the link.** Remove the `/resources/improve-app-retention` entry
   from `RESOURCES` here and from `RESOURCES_LINKS` in `app/_components/footer.tsx`. Drop the
   row from the setup-guides table above too.
2. **[ADD: tool recommendation]** - FAQ 2. You have a published opinion; state it.
3. **[ADD: warehouse threshold]** - FAQ 3.
4. **⚙️ Notion links.** Three setup guides live on Notion. Notion pages are weakly indexed
   and give you no attribution. Consider porting them on-site like the client-vs-proxy guide
   - that one is already the best-performing GEO asset in this list because it's actually on
   your domain.
5. **⚙️ No schema beyond breadcrumbs.** An `ItemList` / `CollectionPage` would help.

---

## E. Internal links

| Link to | Anchor text | Place it in |
|---|---|---|
| `/blog` | "80+ posts on analytics" | Learn table |
| `/tools/analytics-maturity-grader` | "grade your setup in 3 minutes" | Tools table + routing block |
| `/tools/event-tracking-plan-generator` | "generate a tracking plan" | Tools + routing |
| `/tools/analytics-strategy-creator` | "build an analytics strategy" | Tools + routing |
| `/contact` | "have us fix it instead" | Routing block |

---

## F. Change note

Grouped nine ungrouped cards into three labelled tables plus a five-line routing list. The
tables **replace** the existing card descriptions, so prose goes down while the page gains
the three on-site tools and the blog - none of which it linked to. Also flagged the broken
link and that seven of nine resources point off-domain.
