---
name: ghost-post-live
description: Set up a Ghost post for SEO and AI answer engines after Ansh publishes or drafts it. Use whenever he says a post is live, new, drafted, or ready on Ghost, pastes a Ghost editor or /blog URL, or asks to check/fix a post's meta tags, excerpt, tags, or slug. Also covers registering a new case study on the website.
---

# Ghost post go-live

Ansh writes posts in Ghost and tells Claude Code when one is live. This skill takes it from
"published" to "correctly set up": metadata, taxonomy, structure, and the website
registration a case study needs.

The editorial standard is [claude-code-content-contract-prompt.md](../../../claude-code-content-contract-prompt.md).
Read it before touching copy. This skill is the publishing half of that contract; the
contract is the writing half. Do not restate its rules, follow them.

## Setup

Every script needs the Ghost admin credentials from `.env.local`:

```bash
set -a && . ./.env.local && set +a
```

`GHOST_API_URL` and `GHOST_ADMIN_API_KEY` are already there. Do not print the key.

## Steps

### 1. Read the post and run the checker

```bash
python3 scripts/ghost-post-check.py <slug|post-id|ghost-editor-url>
```

It reports BLOCK (fix before this counts as done), WARN (fix unless there is a reason not
to), NOTE (judgement call). Then read the post body yourself. The checker catches
mechanical gaps; only reading catches a weak lede, a vague claim, or a section that does
not answer its own heading.

### 2. Fix metadata

Apply with a JSON patch. Never hand-edit these in the Ghost UI, they drift:

```bash
echo '{"meta_title":"...","meta_description":"...","custom_excerpt":"..."}' \
  | python3 scripts/ghost-post-update.py <slug>
```

- **meta_title** ≤60 chars. An answer-style summary, not the raw headline if the headline
  is long or clever. For case studies: `Client: what changed`.
- **meta_description** ≤155 chars. States what the reader learns. Never "read on to find out."
- **custom_excerpt** is the one people forget and it matters most. Without it Ghost cuts
  the card blurb and `og:description` out of the first ~200 characters of the body, which
  for a case study means the "About <client>" boilerplate. Write an answer-first summary:
  problem, what Datalyze did, what changed.
- **og_title / og_description / twitter_title / twitter_description**: set explicitly.
  They fall back to meta, but the fallback is silent and easy to get wrong.
- **feature_image** plus **feature_image_alt**. Only Ansh can supply the image, so flag it
  rather than shipping a placeholder. Never set alt text with no image.

### 3. Fix taxonomy and slug

Every post needs at least one **public** tag. Tags whose slug starts with `hash-` are
Ghost internal tags (from the 2026-02 import) and do not count: they create no archive
page and no topic signal.

Current public taxonomy:

| Tag | For |
|---|---|
| `case-studies` | Client work, one post per client |
| `indian-d2c-playbook` | The D2C playbook series |

If a post fits neither, propose a new tag to Ansh before creating one. A one-post tag is
worse than no tag. Do not stretch `case-studies` to cover a non-client post; that
happened to `d2c-playbook-6-incrementality-testing` and it pollutes the case study archive
and the site's case study count.

Slugs: case studies are `case-study-<client>`, playbook posts are `d2c-playbook-<n>-<topic>`.
**Changing the slug of an already-published post breaks its live URL.** If it must change,
add a 301 in `next.config` the same way the two renamed Ghost slugs were handled (commit
`8730574`), and say so explicitly. On a draft, just change it.

### 4. Fix structure and copy

Judgement, contract rules apply. The recurring problems in this blog:

- **No answer-first lede.** Case studies open on "About <client>", so nothing near the top
  says what Datalyze did or what changed. Add two sentences above it naming the client,
  the problem, and the outcome.
- **Repeated headings.** The case study template uses `Solution` and `Result` three times
  in one post. An answer engine quoting "Result" cannot tell which result. Make each one
  self-contained: `Result: activation now has a definition`.
- **Context-dependent openers.** "The team can now see" becomes "Buildern can now see."
- **Withheld specifics.** "Three specific actions came out of it" is the most citable
  sentence in the post and it names nothing. Ask Ansh whether it can be named. Never invent
  it, and never leave a `[VERIFY]` / `[ANSH]` flag in a post that is about to go live,
  raise it in chat instead.
- **Em dashes** are not Datalyze voice. The shared CTA card contains one; the checker
  ignores that card, so any em dash it reports is in body copy Ansh wrote.
- Every post should end with the CTA card linking to `/contact`.

Body edits go through `lexical`, not `html`. Read the lexical JSON, mutate the node tree in
Python, dump it back as a string in the patch. Do not retype the document.

### 5. Register a case study on the website

Only for posts tagged `case-studies`, and only once the post is actually live (the entry
links to the public URL).

1. Confirm the URL resolves: `curl -s -o /dev/null -w "%{http_code}" https://www.joindatalyze.com/blog/<slug>/`
2. Add the logo to `public/logos/<Client>.png`. Ansh supplies it.
3. Append an entry to `caseStudyList` in [lib/data/case-studies.ts](../../../lib/data/case-studies.ts).
   `thumbClass` cycles `''` → `'alt'` → `'gradient'` → `'bold'`; continue the cycle from the
   last entry. `description` is one sentence of outcome, with numbers when there are any.
4. The `/case-studies` metadata says "17+ startups". If `caseStudyList` grows past that,
   bump the number in `app/case-studies/page.tsx`.
5. `npx tsc --noEmit` to confirm the data file still typechecks.

### 6. Re-check and report

Run the checker again. Report to Ansh: what changed, what still needs him (a feature image,
a specific he has to confirm, a new tag to approve), and whether the site needs a deploy.

## Sweeping the back catalogue

```bash
python3 scripts/ghost-post-check.py --all --published
```

83 posts, and as of 2026-08-12 only `case-study-buildern` is clean. The 46 imported posts
carry internal tags only. Do not bulk-rewrite them unasked; work through them when Ansh
asks, oldest blockers first, and never change a published slug without a 301.
