# Ghost GEO pass — progress

Live edits, applied directly to published posts via the Admin API.

## How the edits are made (and why not HTML)

Ghost stores body copy as a **lexical JSON tree**, not HTML. The tree carries things an
HTML round-trip destroys: image cards with width/height, raw `html` cards (the dark CTA
blocks at the end of most posts), `extended-quote` callouts, and per-run format bitmasks for
bold/italic. Sending `html` to the Admin API re-parses everything and flattens it.

So every edit mutates the tree and puts it back:

| Script | Job |
|---|---|
| `scripts/ghost_lexical.py` | Lexical node builders + finders. Never touches image/html/hr cards. |
| `scripts/geo_apply.py` | Applies a spec. Dry-run by default; `--write` to publish. |
| `scripts/geo_outline.py` | Prints a compact post outline for authoring specs. |
| `scripts/ghost-post-update.py` | Pre-existing; handles the `updated_at` collision check. |

Specs live in `specs/<slug>.json`, one per post, so every live edit has a reviewable record.

### Duplication guards

The thing most likely to go wrong is bolting a second summary or FAQ onto a post that
already has one. Three guards:

- **TL;DR** is skipped if the post already has a heading containing "short version",
  "tl;dr" or "the gist", or already contains the literal `The short version:`. Most D2C
  Playbook posts already open with one, so they correctly get **headings + FAQ only**.
- **FAQ** is skipped if the FAQ title already appears anywhere in the post.
- **Headings** are only rewritten when the new text differs; a missing heading prints
  `!! heading not found — SKIPPED` rather than inserting anything.

Everything is idempotent — re-running a spec is a no-op.

### What gets changed

1. **Question-style H2/H3s.** Statement headings become the question the section answers.
   Voice is preserved: "What to do Monday" became "What should you do Monday?", not a
   generic "What should you do first?".
2. **A TL;DR callout** at the top, as a quote card so it reads as a callout rather than
   another wall of text — only where the post doesn't already have one.
3. **An FAQ block** before the trailing CTA card, H3 question + paragraph answer each.
4. **meta_title / meta_description** where missing or weak.

Nothing invents a statistic. Every FAQ answer restates something already in that post.

## Status: complete — all 83 posts

| Group | Count | What was done |
|---|---|---|
| D2C Playbook 1–7 | 7 | Question headings + FAQ. All 7 already had their own "short version", so none got a second one. |
| 2026 standalone essays | 8 | TL;DR (where missing) + question headings + FAQ |
| 2024–25 evergreen | 18 | TL;DR + question headings + FAQ |
| Drafts | 5 | Same treatment; all five left as drafts |
| `[Week N] Learning Mixpanel` | 28 | Factual corrections only — see below |
| Case studies | 17 | Answer-first "In short:" summary stating problem → what we did → result |

### Final audit (run against all 83 posts via the Admin API)

```
total posts: 83 | published: 78 | drafts: 5
posts with a summary block: 53/83
posts with an FAQ block:    38/83
duplicates: 0 | corrupt: 0
stale company counts remaining: 0
```

Plus live-page spot checks: image counts unchanged, CTA cards intact, exactly one summary
block per article body.

## Factual errors found and fixed along the way

These weren't part of the GEO brief — they turned up while reading the posts.

1. **Six `[Week N]` posts opened with "Welcome to Week 10"** when they were weeks 13, 15, 16,
   17, 18 and 22. Copy-pasted boilerplate that nobody had caught.
2. **Company count was inconsistent across the blog.** Posts variously claimed 50+, 60+ and
   90+ startups. All 52 mentions now read 150+, matching the website decision.

## Notes for future edits

- Re-running any spec is safe. Every step is guarded, so a second run reports
  `already present — SKIPPED` and writes nothing but genuinely new changes.
- Ghost auto-generates a post's excerpt from its opening text. Because the TL;DR is now
  first, the excerpt (and the `og:description` on posts without a custom one) leads with the
  answer — which is what you want in a search snippet.
- `_tail_insert_index()` walks **backwards** from the end of the post. An earlier version
  scanned forward for the first CTA card and would have dropped the FAQ into the middle of
  any post with an inline signup card — which is exactly what the PostHog post has.

