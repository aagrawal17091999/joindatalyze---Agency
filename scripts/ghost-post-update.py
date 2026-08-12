#!/usr/bin/env python3
"""Update a Ghost post's fields from a JSON patch on stdin.

Usage:
  echo '{"meta_title":"...","meta_description":"..."}' \
    | python3 scripts/ghost-post-update.py <slug|post-id|ghost-editor-url>

Handles the updated_at collision check for you (Ghost rejects a PUT that does not
carry the post's current updated_at). Any Admin API post field is accepted:
meta_title, meta_description, custom_excerpt, og_title, og_description,
twitter_title, twitter_description, feature_image, feature_image_alt, slug,
tags, canonical_url, lexical, status, published_at.

To change body copy, pass "lexical" as a JSON *string*. Prefer editing the
lexical tree programmatically (read it, mutate nodes, dump it) over retyping it.

Needs GHOST_API_URL and GHOST_ADMIN_API_KEY:
  set -a && . ./.env.local && set +a
"""
import os, sys, json, time, hmac, hashlib, base64, urllib.request, urllib.error, re

API = os.environ["GHOST_API_URL"].rstrip("/")
KID, SECRET = os.environ["GHOST_ADMIN_API_KEY"].split(":")
IMMUTABLE = {"id", "uuid", "updated_at", "created_at", "url", "excerpt", "html"}


def _b64(raw):
    return base64.urlsafe_b64encode(raw).rstrip(b"=")


def _token():
    iat = int(time.time())
    head = _b64(json.dumps({"alg": "HS256", "typ": "JWT", "kid": KID}).encode())
    body = _b64(json.dumps({"iat": iat, "exp": iat + 300, "aud": "/admin/"}).encode())
    sig = _b64(hmac.new(bytes.fromhex(SECRET), head + b"." + body, hashlib.sha256).digest())
    return (head + b"." + body + b"." + sig).decode()


def api(method, path, payload=None):
    req = urllib.request.Request(
        API + path,
        method=method,
        data=json.dumps(payload).encode() if payload else None,
        headers={
            "Authorization": "Ghost " + _token(),
            "Content-Type": "application/json",
            "Accept-Version": os.environ.get("GHOST_API_VERSION", "v5.0"),
        },
    )
    try:
        return json.loads(urllib.request.urlopen(req).read())
    except urllib.error.HTTPError as e:
        sys.exit(f"Ghost API {e.code}: {e.read().decode()[:600]}")


def resolve(ref):
    m = re.search(r"[0-9a-f]{24}", ref)
    path = f"/ghost/api/admin/posts/{m.group(0)}/" if m else \
           f"/ghost/api/admin/posts/slug/{ref.rstrip('/').split('/')[-1]}/"
    return api("GET", path + "?formats=lexical")["posts"][0]


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(2)

    patch = json.load(sys.stdin)
    bad = IMMUTABLE & patch.keys()
    if bad:
        sys.exit(f"Refusing to set read-only field(s): {', '.join(sorted(bad))}")

    post = resolve(sys.argv[1])
    payload = {"posts": [{"id": post["id"], "updated_at": post["updated_at"], **patch}]}
    updated = api("PUT", f"/ghost/api/admin/posts/{post['id']}/", payload)["posts"][0]

    print(f"updated {updated['slug']} ({updated['status']}) at {updated['updated_at']}")
    for k in patch:
        v = updated.get(k)
        print(f"  {k}: {str(v)[:100]}")
