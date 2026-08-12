#!/usr/bin/env python3
"""Print a compact outline of a Ghost post: headings, card types, first lines.

Enough to author a GEO spec against without pulling the whole body.
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import ghost_lexical as lx
from ghost_post_update import resolve

for slug in sys.argv[1:]:
    post = resolve(slug)
    tree = lx.load(post)
    print(f"\n########## {slug}  [{post['status']}]  title={post['title']!r}")
    print(f"# meta_title={post.get('meta_title')!r} meta_desc={str(post.get('meta_description'))[:60]!r}")
    paras = 0
    for n in lx.children(tree):
        t = n.get("type")
        if t == "extended-heading":
            print(f"  {n.get('tag','h?').upper()}| {lx.node_text(n)}")
            paras = 0
        elif t == "extended-quote":
            print(f"  QT | {lx.node_text(n)[:100]}")
        elif t in ("image", "html", "horizontalrule", "code"):
            print(f"  [{t}]")
        elif t == "paragraph":
            txt = lx.node_text(n)
            if txt:
                paras += 1
                if paras <= 3:
                    print(f"  p  | {txt[:150]}")
                elif paras == 4:
                    print("  p  | ...")
        else:
            print(f"  [{t}]")
