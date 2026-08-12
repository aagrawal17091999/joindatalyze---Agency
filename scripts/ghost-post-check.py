#!/usr/bin/env python3
"""Audit Ghost posts against the Datalyze content contract.

Usage:
  python3 scripts/ghost-post-check.py <slug|post-id|ghost-editor-url>   # one post, full report
  python3 scripts/ghost-post-check.py --all                             # every post, one line each
  python3 scripts/ghost-post-check.py --all --published                 # published only

Needs GHOST_API_URL and GHOST_ADMIN_API_KEY (both in .env.local):
  set -a && . ./.env.local && set +a
"""
import os, sys, json, time, hmac, hashlib, base64, urllib.request, urllib.error, re, collections

API = os.environ["GHOST_API_URL"].rstrip("/")
KID, SECRET = os.environ["GHOST_ADMIN_API_KEY"].split(":")
PUBLIC_BLOG = "https://www.joindatalyze.com/blog"

# Limits and conventions from claude-code-content-contract-prompt.md
MAX_META_TITLE = 60
MAX_META_DESC = 155
PUBLIC_TAGS = {"case-studies", "indian-d2c-playbook"}


def _b64(raw):
    return base64.urlsafe_b64encode(raw).rstrip(b"=")


def _token():
    iat = int(time.time())
    head = _b64(json.dumps({"alg": "HS256", "typ": "JWT", "kid": KID}).encode())
    body = _b64(json.dumps({"iat": iat, "exp": iat + 300, "aud": "/admin/"}).encode())
    sig = _b64(hmac.new(bytes.fromhex(SECRET), head + b"." + body, hashlib.sha256).digest())
    return (head + b"." + body + b"." + sig).decode()


def api(path):
    req = urllib.request.Request(
        API + path,
        headers={"Authorization": "Ghost " + _token(), "Accept-Version": os.environ.get("GHOST_API_VERSION", "v5.0")},
    )
    return json.loads(urllib.request.urlopen(req).read())


def all_posts(fmt="html"):
    posts, page = [], 1
    while True:
        d = api(f"/ghost/api/admin/posts/?formats={fmt}&limit=15&page={page}&include=tags")
        posts += d["posts"]
        if page >= d["meta"]["pagination"]["pages"]:
            break
        page += 1
    return posts


def one_post(ref):
    m = re.search(r"[0-9a-f]{24}", ref)
    if m:
        return api(f"/ghost/api/admin/posts/{m.group(0)}/?formats=html&include=tags")["posts"][0]
    slug = ref.rstrip("/").split("/")[-1]
    return api(f"/ghost/api/admin/posts/slug/{slug}/?formats=html&include=tags")["posts"][0]


def strip_cta(html):
    """Drop the shared dark CTA card so its copy isn't linted as body prose."""
    return re.sub(r'<div style="margin:48px.*?</a>\s*</div>', "", html, flags=re.S)


def check(p):
    """Return a list of (severity, message). severity: BLOCK | WARN | NOTE"""
    html = p.get("html") or ""
    body = strip_cta(html)
    out = []

    def block(m): out.append(("BLOCK", m))
    def warn(m): out.append(("WARN", m))
    def note(m): out.append(("NOTE", m))

    # --- metadata -----------------------------------------------------------
    mt = p.get("meta_title")
    if not mt:
        block(f"meta_title empty (falls back to the post title, {len(p['title'])} chars)")
    elif len(mt) > MAX_META_TITLE:
        block(f"meta_title is {len(mt)} chars, budget is {MAX_META_TITLE}")

    md = p.get("meta_description")
    if not md:
        block("meta_description empty")
    elif len(md) > MAX_META_DESC:
        block(f"meta_description is {len(md)} chars, budget is {MAX_META_DESC}")

    if not p.get("custom_excerpt"):
        block("custom_excerpt empty (card + og:description get auto-cut body text)")
    elif len(p["custom_excerpt"]) > 300:
        warn(f"custom_excerpt is {len(p['custom_excerpt'])} chars, Ghost caps at 300")

    for f in ("og_title", "og_description", "twitter_title", "twitter_description"):
        if not p.get(f):
            note(f"{f} empty (falls back to meta/title)")

    if not p.get("feature_image"):
        warn("no feature_image (social + AI previews use the site default)")
    elif not p.get("feature_image_alt"):
        warn("feature_image set but feature_image_alt empty")

    # --- taxonomy -----------------------------------------------------------
    public_tags = [t["slug"] for t in p.get("tags", []) if t.get("visibility") == "public"]
    if not public_tags:
        block("no public tag (post appears on no tag archive)")
    else:
        unknown = [t for t in public_tags if t not in PUBLIC_TAGS]
        if unknown:
            note(f"tag(s) outside the known taxonomy: {', '.join(unknown)}")

    # --- slug ---------------------------------------------------------------
    slug = p["slug"]
    is_case_study = "case-studies" in public_tags
    if is_case_study and not slug.startswith("case-study-"):
        block(f"case study slug '{slug}' should be case-study-<client>")
    if not is_case_study and slug.startswith("case-study-"):
        warn(f"slug '{slug}' looks like a case study but isn't tagged case-studies")
    if len(slug) > 60:
        note(f"slug is {len(slug)} chars, consider shortening")

    # --- structure ----------------------------------------------------------
    heads = [(t, re.sub("<[^>]+>", "", x).strip())
             for t, x in re.findall(r"<(h[1-6])[^>]*>(.*?)</\1>", html, re.S)]
    if any(t == "h1" for t, _ in heads):
        block("an <h1> in the body competes with the post title")
    h2s = [x for t, x in heads if t == "h2"]
    dupes = [k for k, v in collections.Counter(h2s).items() if v > 1]
    if dupes:
        block("duplicate h2 headings, not self-contained when quoted: " + "; ".join(dupes))

    paras = re.findall(r"<p[^>]*>(.*?)</p>", body, re.S)
    first = re.sub("<[^>]+>", "", paras[0]).strip() if paras else ""
    if heads and html.strip().startswith("<h") and not first:
        warn("post opens on a heading with no answer-first lede paragraph")
    elif first and not re.search(r"\b(Datalyze|" + re.escape(p["title"].split(":")[0]) + r")\b", first):
        note("opening paragraph names neither the client nor Datalyze; may not stand alone if quoted")

    # --- voice --------------------------------------------------------------
    text = re.sub("<[^>]+>", " ", body)
    if "-" in text:
        warn("em dash in body copy (not Datalyze voice)")
    for flag in re.findall(r"\[(?:VERIFY|ANSH)[^\]]*\]", text):
        block(f"unresolved editorial flag left in the copy: {flag}")

    # --- linking ------------------------------------------------------------
    if "joindatalyze.com/contact" not in html:
        warn("no CTA block linking to /contact")
    internal = re.findall(r'href="https://www\.joindatalyze\.com/(?!blog)([^"#?]*)', html)
    if not [i for i in internal if i not in ("contact", "contact/")]:
        note("no internal link to a site page other than the CTA")

    return out


def line(p):
    sev = check(p)
    blocks = [m for s, m in sev if s == "BLOCK"]
    warns = [m for s, m in sev if s == "WARN"]
    tail = f"{len(blocks)} block, {len(warns)} warn" if (blocks or warns) else "clean"
    return f"[{p['status']:9}] {p['slug'][:48]:48} {tail}"


def report(p):
    print(f"\n{p['title']}")
    print(f"  {p['status']}  {PUBLIC_BLOG}/{p['slug']}/")
    print(f"  tags: {', '.join(t['slug'] for t in p.get('tags', [])) or 'none'}")
    print(f"  meta_title:       {p.get('meta_title') or '(empty)'}")
    print(f"  meta_description: {p.get('meta_description') or '(empty)'}")
    print(f"  custom_excerpt:   {(p.get('custom_excerpt') or '(empty)')[:120]}")
    issues = check(p)
    if not issues:
        print("\n  No issues.")
        return 0
    print()
    for sev in ("BLOCK", "WARN", "NOTE"):
        for s, m in issues:
            if s == sev:
                print(f"  {sev:5}  {m}")
    return sum(1 for s, _ in issues if s == "BLOCK")


if __name__ == "__main__":
    args = sys.argv[1:]
    if not args:
        print(__doc__)
        sys.exit(2)
    if args[0] == "--all":
        posts = all_posts()
        if "--published" in args:
            posts = [p for p in posts if p["status"] == "published"]
        for p in posts:
            print(line(p))
        print(f"\n{len(posts)} posts checked.")
    else:
        sys.exit(1 if report(one_post(args[0])) else 0)
