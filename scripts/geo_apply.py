#!/usr/bin/env python3
"""Apply a GEO edit spec to a Ghost post's lexical tree.

  python3 scripts/geo_apply.py <spec.json> [--write]

Without --write it prints a diff-ish preview and touches nothing. Specs live in
geo-rewrites/ghost/specs/ so every live edit has a reviewable record.

Spec shape:
{
  "slug": "...",
  "tldr": "answer-first paragraph, or [runs]",       // optional
  "tldr_label": "The short version",                  // optional
  "headings": [["old substring", "new text"], ...],   // optional
  "faq": [["Q", "A"], ...],                           // optional
  "faq_title": "Frequently asked questions",          // optional
  "meta_title": "...",                                // optional
  "meta_description": "...",                          // optional
  "custom_excerpt": "..."                             // optional
}

Idempotent: if the TL;DR text or FAQ title is already in the post, that piece is
skipped rather than duplicated.
"""
import json
import subprocess
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import ghost_lexical as lx
from ghost_post_update import api, resolve  # noqa: E402


def preview(tree, limit=None):
    for node in lx.children(tree):
        t = node.get("type")
        if t == "extended-heading":
            print(f"  {node.get('tag', 'h?').upper()}  {lx.node_text(node)}")
        elif t == "extended-quote":
            print(f"  QUOTE {lx.node_text(node)[:110]}")
        elif t in ("image", "html", "horizontalrule"):
            print(f"  [{t}]")
        elif t == "paragraph":
            text = lx.node_text(node)
            if text:
                print(f"  p     {text[:110]}")


def apply_spec(spec, write=False):
    post = resolve(spec["slug"])
    tree = lx.load(post)
    changes = []

    for old, new in spec.get("headings", []):
        idx = lx.find_heading(tree, old)
        if idx is None:
            changes.append(f"  !! heading not found: {old!r} — SKIPPED")
            continue
        before = lx.node_text(lx.children(tree)[idx])
        if before.strip() == new.strip():
            continue
        lx.set_heading_text(tree, idx, new)
        changes.append(f"  H: {before!r} -> {new!r}")

    for old, new in spec.get("replacements", []):
        hits = lx.replace_text(tree, old, new)
        if hits:
            changes.append(f"  TEXT x{hits}: {old!r} -> {new!r}")
        else:
            changes.append(f"  !! text not found: {old!r} — SKIPPED")

    tldr = spec.get("tldr")
    if tldr:
        marker = tldr[:60] if isinstance(tldr, str) else ""
        # Several posts already open with their own "The short version" block.
        # Adding another answer-first paragraph on top of one is exactly the
        # duplication this pass is supposed to avoid.
        existing_summary = any(
            lx.find_heading(tree, phrase) is not None
            for phrase in ("short version", "tl;dr", "the gist")
        ) or lx.has_text(tree, "The short version:")
        if existing_summary:
            changes.append("  TLDR: post already has a summary block — SKIPPED")
        elif marker and lx.has_text(tree, marker):
            changes.append("  TLDR already present — SKIPPED")
        else:
            lx.insert_tldr(tree, tldr, spec.get("tldr_label", "The short version"))
            changes.append(f"  + TLDR: {str(tldr)[:80]}")

    faq = spec.get("faq")
    if faq:
        title = spec.get("faq_title", "Frequently asked questions")
        if lx.has_text(tree, title):
            changes.append("  FAQ already present — SKIPPED")
        else:
            lx.append_faq(tree, faq, title)
            changes.append(f"  + FAQ: {len(faq)} Q&As")

    patch = {}
    if changes:
        patch["lexical"] = lx.dump(tree)
    for field in ("meta_title", "meta_description", "custom_excerpt"):
        if spec.get(field) and post.get(field) != spec[field]:
            patch[field] = spec[field]
            changes.append(f"  {field}: {spec[field][:80]}")

    print(f"\n=== {spec['slug']} ({post['status']}) ===")
    if not changes:
        print("  no changes")
        return
    for line in changes:
        print(line)

    if not write:
        print("  -- dry run, nothing written --")
        return

    payload = {"posts": [{"id": post["id"], "updated_at": post["updated_at"], **patch}]}
    updated = api("PUT", f"/ghost/api/admin/posts/{post['id']}/", payload)["posts"][0]
    print(f"  WROTE {updated['slug']} -> {updated['updated_at']}")


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    write = "--write" in sys.argv
    if not args:
        print(__doc__)
        sys.exit(2)
    for path in args:
        spec = json.load(open(path))
        apply_spec(spec, write=write)
