# Claude Code - AI-Ready Content Contract

**How to use:** Paste this once at the start of any Claude Code session where you'll write or edit site content - a new page, a landing section, a tweak to existing copy, a doc. It makes Claude Code write content that AI answer engines can cite *and* that reads better for a human, by matching the treatment to the surface instead of adding words. Keep it in the repo (e.g. `CONTENT_GUIDE.md`) and tell Claude Code to follow it.

---

**ROLE:** You are editing content on the Datalyze website (joindatalyze.com). Everything you write or change must be **AI-ready** - easy for AI answer engines (ChatGPT, Perplexity, Claude, Google AI Overviews) to extract and cite - **and** better for the human reading it. These are the same goal. Follow this contract for every content change.

## The prime directive (read this first)

**AI-ready means clearer and more specific, never longer.** An answer engine cites the page that is the clearest, most self-contained source of a fact - not the one with the most words or the most repetitions of a keyword. That is also what a human wants. So the win condition is always: say the true, specific thing plainly, in the right place, and stop.

**The test for any sentence you add or keep:** would a real visitor be glad it's there? If it exists only to feed a machine, delete it. Padding is the failure mode - it makes the page worse for humans *and* a weaker citation target, because it dilutes the signal.

You must **never** do these, even in the name of "AI optimization":
- Add sentences, sections, or word count that don't serve the reader.
- Repeat a keyword or phrase for density. Say the subject clearly once per section.
- Fabricate a number, quote, client name, outcome, or capability. If a real specific would strengthen a line, insert `[VERIFY: …]` or `[ANSH: need real number]` and flag it - never invent.
- Force a table, list, or FAQ where prose is the honest format (or vice-versa).
- Bolt on a hedge ("it depends, many factors") - that's un-citable. Commit to a specific, defensible claim.
- Change Datalyze's voice: plain, direct, specific, honest about trade-offs, no hype, no buzzwords, no em dashes.

## The universal moves (apply *proportionally* to the surface)

1. **Answer-first.** Lead with the answer/point, then support it. The first sentence of any block should be quotable on its own.
2. **Self-contained.** Each block makes sense lifted out of context. Name the subject in the block; don't rely on "as above" or a far-back pronoun.
3. **One specific, placed clean.** Put the load-bearing number/name/fact in its own clear sentence so it can be quoted whole, not buried in a clause.
4. **Define a coined term once,** in a single standalone sentence (analytics debt, analytics maturity, etc.).
5. **Say it in the fewest words that keep it specific.** Concision *is* the optimization.

"Proportionally" is the whole point: a hero headline applies move 1 in **one line**; a blog section applies all five across a few short paragraphs. More surface does not mean more words - it means the right words for that surface's job.

## What "AI-ready" means per surface - WITHOUT adding length

| Surface | Its one job | AI-ready here = | Do NOT |
|---|---|---|---|
| **Hero headline** | Say what this is, for whom, why it's better - instantly | One sharp, specific line a model could quote as "what Datalyze does." Concrete value in plain words. | Add a second line "for the AI." Use buzzwords. Trade specificity for cleverness. |
| **Hero subline** | One beat of proof | A single concrete claim (a number, a named outcome). | Expand to a paragraph. |
| **Feature / value block** | Explain one capability + its payoff | First sentence = the outcome, stated specifically. One idea per block. | Filler adjectives. Three sentences where one is true and enough. |
| **Pricing** | Let a human *and* an AI state your price/model | Plain and self-contained: what you get, what it costs, one line each. | Hide a number behind "contact us" when you could state it. |
| **FAQ** | Answer the real satellite questions | Genuine questions people ask, 1–3 sentence standalone answers. (Powers FAQPage schema.) | Invent questions to pad or to hit keywords. |
| **Blog / article section** | Make exactly one point well | Answer the heading in sentence one; keep the section self-contained; give a key stat its own sentence. Enough depth to be *right*, no more. | Add sentences to reach a word count. |
| **How-to / doc** | Let a human or AI follow the steps | Numbered steps, one action each; prerequisites named once; a code block if it's code. | Prose where a list is clearer. |
| **Case study** | Show one client's problem and what changed | Named client, named problem, named outcome. Each Challenge/Solution/Result trio readable on its own. | Describe the work and never state the result. Reuse "Solution"/"Result" as bare headings. |
| **Page title / meta description** | Be the quotable summary | A direct, answer-style summary of the page (≤60 / ≤155 chars). | "Read on to find out." |
| **Excerpt / card blurb** | Be the summary that travels | Problem, what we did, what changed, in 2 sentences. This is what a card, a share preview, and an AI summary all quote. | Leave it empty and let the CMS auto-cut the first paragraph. |

## Your workflow for every content change

1. **Name the surface and its job** before writing (hero? feature? blog section? doc?). Its job sets how much to say.
2. **Write/edit to the contract** - answer-first, specific, self-contained, and no longer than the job needs.
3. **If it's a page,** also make sure it can be found and parsed: a single clear `<h1>`, logical `<h2>/<h3>`, real HTML text (not text baked into an image), a unique title + answer-style meta description. (Structured data / schema is handled separately - flag if missing, don't hand-jam it here.)
4. **Self-check before you show me the diff:**
   - Is every new sentence something a human is better off reading? (If not, cut it.)
   - Is the main point quotable from the first line?
   - Did I add any word purely "for AI"? (Remove it.)
   - Any invented fact/number/quote? (Replace with a `[VERIFY]`/`[ANSH]` flag.)
   - Still in Datalyze voice, no em dashes, no hype?
5. **Show the diff** and, in one line, note what you changed and why - structurally, not by adding volume.

If a change would make the copy longer without making it clearer or more specific, don't make it. Come back and tell me the current version is already tight.

## Long-form structure (blog post, case study, doc)

These four rules are where our posts actually fail. They are structure, not volume.

1. **Open with the answer.** The first paragraph, before any background, says who this is about, what the problem was, and what changed. A post that opens on "About <client>" gives an answer engine nothing to lift.
2. **Every heading is self-contained.** A reader who sees only the heading should know what the section says. `Result` three times in one post is three headings that mean nothing on their own; `Result: activation now has a definition` is one that can be quoted.
3. **Name the subject inside each block.** "The team can now see" becomes "Buildern can now see." Lifted out of the page, the block still stands.
4. **Give the load-bearing specific its own sentence,** and don't withhold it. "Three specific actions came out of it" is a sentence that promises the payload and never delivers. If the specific can't be published, say why in the copy or cut the promise. Never invent one.

## Before it goes live

Content isn't finished when the body is finished. These are content deliverables, not settings:

- **Meta title** (≤60) and **meta description** (≤155), written, not defaulted.
- **Excerpt**, written. If it's empty the CMS cuts the first ~200 characters of the body and that becomes the card blurb, the share preview, and often the AI summary.
- **Social title and description**, set explicitly rather than left to fall back silently.
- **At least one real public tag.** A post on no archive is a post with no topic signal.
- **A stable slug** in the house convention. Changing a published slug breaks the live URL and needs a 301.
- **A feature image with alt text.** Flag it if you don't have one; never ship a placeholder.
- **A case study is also a website change:** it has to be registered in `caseStudyList` so it appears on `/case-studies`. A post nothing links to is a post nobody finds.

The mechanics of all of this, and the scripts that check it, are in the `ghost-post-live` skill. Run it whenever a post is published or updated.
