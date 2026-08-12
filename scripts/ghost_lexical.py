#!/usr/bin/env python3
"""Helpers for GEO-editing a Ghost post's lexical tree in place.

Why not just send HTML? Ghost stores body copy as a lexical JSON tree whose
nodes carry things HTML round-tripping loses: image cards with width/height,
raw `html` cards (the CTA blocks), `extended-quote` callouts, and per-run format
bitmasks for bold/italic. Sending `html` to the Admin API re-parses everything
and flattens those. So we mutate the tree and put it back.

Node shapes we care about (lexical v1, Ghost's Koenig dialect):
  paragraph          {type: paragraph, children: [text-run...]}
  heading            {type: extended-heading, tag: h2|h3, children: [...]}
  quote              {type: extended-quote, children: [...]}
  image / html /
  horizontalrule     leaf cards — never touched
  text run           {type: extended-text, text, format}  format: 1=bold 2=italic

Everything here is additive or a targeted replace. Nothing deletes a card.
"""
import json

BOLD = 1
ITALIC = 2


def text_run(text, format=0):
    return {
        "detail": 0,
        "format": format,
        "mode": "normal",
        "style": "",
        "text": text,
        "type": "extended-text",
        "version": 1,
    }


def _block(node_type, runs, **extra):
    node = {
        "children": runs,
        "direction": "ltr",
        "format": "",
        "indent": 0,
        "type": node_type,
        "version": 1,
    }
    node.update(extra)
    return node


def paragraph(*runs):
    return _block("paragraph", list(runs))


def heading(text, tag="h2"):
    return _block("extended-heading", [text_run(text)], tag=tag)


def quote(*runs):
    return _block("extended-quote", list(runs))


def qa(question, answer):
    """One FAQ entry: bolded question, then the answer as its own paragraph.

    Two blocks rather than one bold-run-plus-text so each answer stands alone
    when an engine lifts it, and so it renders with breathing room.
    """
    return [
        _block("extended-heading", [text_run(question)], tag="h3"),
        paragraph(text_run(answer)),
    ]


def load(post):
    return json.loads(post["lexical"])


def dump(tree):
    return json.dumps(tree, ensure_ascii=False, separators=(",", ":"))


def children(tree):
    return tree["root"]["children"]


def node_text(node):
    """Flatten a block's text, descending through link nodes."""
    out = []
    for child in node.get("children", []):
        if child.get("type") == "extended-text":
            out.append(child.get("text", ""))
        elif child.get("children"):
            out.append(node_text(child))
    return "".join(out)


def find_heading(tree, needle, tag=None):
    """Index of the first heading whose text contains `needle` (case-insensitive)."""
    for i, node in enumerate(children(tree)):
        if node.get("type") != "extended-heading":
            continue
        if tag and node.get("tag") != tag:
            continue
        if needle.lower() in node_text(node).lower():
            return i
    return None


def set_heading_text(tree, index, text):
    node = children(tree)[index]
    assert node["type"] == "extended-heading", "not a heading"
    node["children"] = [text_run(text)]


def first_content_index(tree):
    """Index of the first real block, skipping a leading horizontal rule.

    Several posts open with a `horizontalrule` divider; a TL;DR inserted above
    it would sit outside the visual body.
    """
    kids = children(tree)
    for i, node in enumerate(kids):
        if node.get("type") not in ("horizontalrule",):
            return i
    return 0


def insert_tldr(tree, runs_or_text, label="The short version"):
    """Put an answer-first block at the very top, as a quote card.

    A quote renders as a visually distinct callout, so the page doesn't just
    gain another wall of paragraph text — which is the failure mode when you
    bolt a TL;DR onto an already-long post.
    """
    idx = first_content_index(tree)
    runs = (
        [text_run(runs_or_text)] if isinstance(runs_or_text, str) else list(runs_or_text)
    )
    block = quote(text_run(f"{label}: ", BOLD), *runs)
    children(tree).insert(idx, block)
    return block


# Cards that always belong at the very bottom of a post. New sections must land
# above the first of them, or an FAQ ends up underneath the signup box.
TRAILING_CARD_TYPES = ("signup", "call-to-action", "email-cta", "product")


def _tail_insert_index(tree):
    """Index to insert new sections at: above the trailing card block.

    Scanning forward for the first CTA card is wrong — several posts embed a
    signup or CTA card mid-article, and an FAQ inserted there lands in the
    middle of the piece. So walk backwards from the end instead, stepping over
    empty paragraphs, CTA-ish cards and the rules that separate them, and stop
    at the last real content block.
    """
    kids = children(tree)
    i = len(kids)
    while i > 0:
        node = kids[i - 1]
        t = node.get("type")
        is_cta = t in TRAILING_CARD_TYPES or (
            t == "html" and "joindatalyze.com/contact" in node.get("html", "")
        )
        is_blank = t == "paragraph" and not node_text(node)
        if is_cta or is_blank or t == "horizontalrule":
            i -= 1
            continue
        break
    return i


def append_faq(tree, pairs, title="Frequently asked questions"):
    """Append an FAQ block before the trailing CTA card (or at the end)."""
    blocks = [heading(title, "h2")]
    for question, answer in pairs:
        blocks.extend(qa(question, answer))

    at = _tail_insert_index(tree)
    children(tree)[at:at] = blocks
    return blocks


def has_text(tree, needle):
    """Guard against double-applying an edit to an already-edited post."""
    return needle.lower() in json.dumps(tree, ensure_ascii=False).lower()


def replace_text(tree, old, new):
    """Replace an exact substring inside every text run. Returns hit count.

    Operates on individual runs so bold/italic formatting and link nodes are
    preserved — the run keeps its format bitmask, only `text` changes. Only use
    for short, unambiguous strings (a stat, a company count); a substring that
    spans two runs won't match, by design.
    """
    hits = 0

    def walk(node):
        nonlocal hits
        if node.get("type") == "extended-text" and old in node.get("text", ""):
            node["text"] = node["text"].replace(old, new)
            hits += 1
        for child in node.get("children", []) or []:
            walk(child)

    for node in children(tree):
        walk(node)
    return hits
