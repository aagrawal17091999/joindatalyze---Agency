#!/usr/bin/env node
// -----------------------------------------------------------------------------
// Ghost blog — image alt-text auditor & batch-filler
//
// The Screaming Frog SEO audit flags ~200 blog images with missing alt text.
// Those images live in Ghost (storage.ghost.io), not in this Next.js repo, so
// they can't be fixed in code — they have to be edited in the posts themselves.
// This script does both halves of that:
//
//   1. AUDIT   node scripts/ghost-image-alt.mjs audit
//        Pulls every post via the Ghost Admin API, scans the rendered HTML for
//        <img> elements with missing/empty alt, and writes ghost-alt-audit.csv
//        with a blank `suggested_alt` column for you to fill in.
//
//   2. SUGGEST node scripts/ghost-image-alt.mjs suggest [--limit=N] [--overwrite]
//        Sends each flagged image to Claude (vision) and drafts the suggested_alt
//        column for you to review/edit. Needs ANTHROPIC_API_KEY. Resumable: only
//        fills empty rows, persists progress as it goes. ALT_MODEL overrides the
//        model (default claude-opus-4-8; set claude-haiku-4-5 for cheap bulk runs).
//
//   3. APPLY   node scripts/ghost-image-alt.mjs apply [--dry-run]
//        Reads the filled CSV and writes each suggested_alt back into the post's
//        Lexical image card (matched by src), then PUTs the post. Formatting and
//        every other card are preserved because we mutate the Lexical tree in
//        place rather than round-tripping through HTML. --dry-run shows what
//        would change without writing.
//
// Auth: uses GHOST_ADMIN_API_KEY + GHOST_API_URL from .env.local. No npm deps —
// the Admin JWT is signed with Node's built-in crypto, and fetch is global on
// Node 18+.
// -----------------------------------------------------------------------------

import { createHmac } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const CSV_PATH = resolve(ROOT, 'ghost-alt-audit.csv');
const API_VERSION = 'v5.0';

// --- tiny .env.local loader (no dotenv dependency) ---------------------------
function loadEnv() {
  const envPath = resolve(ROOT, '.env.local');
  if (!existsSync(envPath)) return;
  for (const raw of readFileSync(envPath, 'utf8').split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = val;
  }
}

// --- Ghost Admin JWT (HS256, signed with the hex secret) ---------------------
function adminToken(adminKey) {
  const [id, secret] = adminKey.split(':');
  if (!id || !secret) {
    throw new Error(
      'GHOST_ADMIN_API_KEY must be in the form "<id>:<hex-secret>" (copy it from Ghost → Settings → Integrations).',
    );
  }
  const b64 = (obj) =>
    Buffer.from(JSON.stringify(obj)).toString('base64url');
  const iat = Math.floor(Date.now() / 1000);
  const header = b64({ alg: 'HS256', typ: 'JWT', kid: id });
  const payload = b64({ iat, exp: iat + 300, aud: '/admin/' });
  const sig = createHmac('sha256', Buffer.from(secret, 'hex'))
    .update(`${header}.${payload}`)
    .digest('base64url');
  return `${header}.${payload}.${sig}`;
}

function apiBase() {
  const url = (process.env.GHOST_API_URL || '').replace(/\/$/, '');
  if (!url) throw new Error('GHOST_API_URL is not set in .env.local');
  return `${url}/ghost/api/admin`;
}

async function ghostFetch(path, init = {}) {
  const token = adminToken(process.env.GHOST_ADMIN_API_KEY);
  const res = await fetch(`${apiBase()}${path}`, {
    ...init,
    headers: {
      Authorization: `Ghost ${token}`,
      'Accept-Version': API_VERSION,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Ghost API ${res.status} ${res.statusText} for ${path}\n${body}`);
  }
  return res.json();
}

// Fetch ALL posts (paginated), with both rendered html and the editable lexical.
async function fetchAllPosts() {
  const posts = [];
  let page = 1;
  for (;;) {
    const data = await ghostFetch(
      `/posts/?formats=html,lexical&limit=50&page=${page}&fields=id,title,slug,url,updated_at,html,lexical`,
    );
    posts.push(...data.posts);
    const next = data.meta?.pagination?.next;
    if (!next) break;
    page = next;
  }
  return posts;
}

// --- HTML <img> scan (matches what Screaming Frog sees) ----------------------
// Returns the src of every <img> whose alt is missing or empty/whitespace.
function imagesMissingAlt(html) {
  if (!html) return [];
  const out = [];
  for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = m[0];
    const src = (tag.match(/\bsrc\s*=\s*"([^"]*)"/i) ||
      tag.match(/\bsrc\s*=\s*'([^']*)'/i))?.[1];
    if (!src) continue;
    const altMatch = tag.match(/\balt\s*=\s*"([^"]*)"/i) ||
      tag.match(/\balt\s*=\s*'([^']*)'/i);
    const alt = altMatch ? altMatch[1].trim() : null; // null = attribute absent
    if (!alt) out.push(src); // missing OR empty
  }
  return out;
}

// --- Lexical walk: yield every image-bearing node so we can read/set alt ------
// Ghost Lexical image cards: { type:'image', src, alt, ... }
// Gallery cards:            { type:'gallery', images:[{ src, alt, ... }] }
function* imageNodes(node) {
  if (!node || typeof node !== 'object') return;
  if (node.type === 'image' && typeof node.src === 'string') {
    yield { get: () => node.alt ?? '', set: (v) => (node.alt = v), src: node.src };
  }
  if (node.type === 'gallery' && Array.isArray(node.images)) {
    for (const img of node.images) {
      if (img && typeof img.src === 'string') {
        yield { get: () => img.alt ?? '', set: (v) => (img.alt = v), src: img.src };
      }
    }
  }
  const kids = node.children;
  if (Array.isArray(kids)) for (const c of kids) yield* imageNodes(c);
}

function lexicalImageHandles(lexicalStr) {
  if (!lexicalStr) return [];
  let tree;
  try {
    tree = JSON.parse(lexicalStr);
  } catch {
    return [];
  }
  return [...imageNodes(tree.root)];
}

// --- minimal CSV read/write (quotes fields, handles embedded quotes/commas) ---
function toCsv(rows) {
  const esc = (s) => `"${String(s ?? '').replace(/"/g, '""')}"`;
  return rows.map((r) => r.map(esc).join(',')).join('\n') + '\n';
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQ = false;
      } else field += c;
    } else if (c === '"') inQ = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c === '\r') { /* skip */ }
    else field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.length > 1 || (r.length === 1 && r[0] !== ''));
}

// --- Claude vision: draft alt text for one image ----------------------------
// Default model is claude-opus-4-8 (override with ALT_MODEL — e.g. claude-haiku-4-5
// is ~5x cheaper and plenty for alt text across hundreds of images).
const ALT_MODEL = process.env.ALT_MODEL || 'claude-opus-4-8';
const ALT_SYSTEM =
  'You write concise, descriptive alt text for images embedded in blog posts about ' +
  'product analytics (Mixpanel, PostHog, Amplitude, GA4, dashboards, funnels, retention). ' +
  'Describe what the image actually shows so a screen-reader user and search engines ' +
  'understand it. 5-15 words. Do not start with "image of" or "picture of"; you may name ' +
  'the medium when it matters (e.g. "Mixpanel funnel report showing drop-off at checkout"). ' +
  'No trailing period. Output ONLY the alt text — no preamble, no quotes.';

async function draftAltText(imageUrl, postTitle, attempt = 0) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      'ANTHROPIC_API_KEY is not set (add it to .env.local). Needed only for the "suggest" command.',
    );
  }
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: ALT_MODEL,
      max_tokens: 120,
      system: ALT_SYSTEM,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image', source: { type: 'url', url: imageUrl } },
            {
              type: 'text',
              text: `This image appears in the blog post titled "${postTitle}". Write alt text for it.`,
            },
          ],
        },
      ],
    }),
  });

  if (res.status === 429 || res.status >= 500) {
    if (attempt >= 4) throw new Error(`Claude API ${res.status} after retries`);
    const retryAfter = Number(res.headers.get('retry-after')) || 2 ** attempt;
    await new Promise((r) => setTimeout(r, retryAfter * 1000));
    return draftAltText(imageUrl, postTitle, attempt + 1);
  }
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Claude API ${res.status}: ${body.slice(0, 200)}`);
  }

  const data = await res.json();
  if (data.stop_reason === 'refusal') return null; // safety decline — skip this image
  const text = (data.content || [])
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join(' ')
    .trim();
  // Strip surrounding quotes / trailing period the model occasionally adds.
  return text.replace(/^["']|["']$/g, '').replace(/\.$/, '').trim() || null;
}

// Small concurrency pool so 300 images don't run one-at-a-time (or all at once).
async function pool(items, size, worker) {
  const queue = [...items.entries()];
  const runners = Array.from({ length: Math.min(size, queue.length) }, async () => {
    for (;;) {
      const next = queue.shift();
      if (!next) return;
      const [i, item] = next;
      await worker(item, i);
    }
  });
  await Promise.all(runners);
}

// --- commands ----------------------------------------------------------------
async function audit() {
  const posts = await fetchAllPosts();
  const header = ['post_id', 'post_title', 'post_url', 'image_src', 'editable_in_lexical', 'suggested_alt'];
  const rows = [header];
  let total = 0;
  let manual = 0;

  for (const post of posts) {
    const missing = imagesMissingAlt(post.html);
    if (!missing.length) continue;
    const lexSrcs = new Set(lexicalImageHandles(post.lexical).map((h) => h.src));
    for (const src of missing) {
      const editable = lexSrcs.has(src);
      if (!editable) manual++;
      rows.push([post.id, post.title, post.url, src, editable ? 'yes' : 'no', '']);
      total++;
    }
  }

  writeFileSync(CSV_PATH, toCsv(rows));
  console.log(`\nScanned ${posts.length} posts.`);
  console.log(`Found ${total} images missing alt text across ${rows.length > 1 ? new Set(rows.slice(1).map((r) => r[0])).size : 0} posts.`);
  if (manual) {
    console.log(`  • ${total - manual} are Lexical image cards → fillable by this script.`);
    console.log(`  • ${manual} are inside raw HTML/markdown cards → marked editable_in_lexical=no; edit those in Ghost.`);
  }
  console.log(`\nWrote ${CSV_PATH}`);
  console.log('Next: AI-draft the alt text →  node scripts/ghost-image-alt.mjs suggest');
  console.log('  (or fill suggested_alt by hand), then →  node scripts/ghost-image-alt.mjs apply --dry-run');
}

async function suggest({ limit, overwrite }) {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      'ANTHROPIC_API_KEY is not set. Add it to .env.local (it is only needed for "suggest").',
    );
  }
  if (!existsSync(CSV_PATH)) {
    console.log('No audit CSV yet — running audit first…');
    await audit();
    console.log('');
  }
  const rows = parseCsv(readFileSync(CSV_PATH, 'utf8'));
  const [header, ...body] = rows;
  const col = Object.fromEntries(header.map((h, i) => [h.trim(), i]));
  for (const k of ['image_src', 'post_title', 'suggested_alt']) {
    if (!(k in col)) throw new Error(`CSV missing required column: ${k}`);
  }

  // Rows that still need a suggestion (skip already-filled unless --overwrite).
  let targets = body.filter((r) => overwrite || !(r[col.suggested_alt] || '').trim());
  if (limit) targets = targets.slice(0, limit);

  if (!targets.length) {
    console.log('Every row already has a suggested_alt. Use --overwrite to regenerate.');
    return;
  }

  console.log(`Drafting alt text for ${targets.length} image(s) with ${ALT_MODEL}…`);
  console.log('(Tip: set ALT_MODEL=claude-haiku-4-5 to cut cost ~5x for bulk runs.)\n');

  let done = 0;
  let failed = 0;
  await pool(targets, 5, async (r) => {
    try {
      const alt = await draftAltText(r[col.image_src], r[col.post_title]);
      if (alt) r[col.suggested_alt] = alt;
      else failed++;
    } catch (err) {
      failed++;
      console.warn(`! ${r[col.image_src].split('/').pop()}: ${err.message}`);
    }
    done++;
    if (done % 10 === 0 || done === targets.length) {
      // Persist progress periodically so a long run is resumable on interrupt.
      writeFileSync(CSV_PATH, toCsv([header, ...body]));
      process.stdout.write(`\r  ${done}/${targets.length} drafted…`);
    }
  });

  writeFileSync(CSV_PATH, toCsv([header, ...body]));
  console.log(`\n\nDone. Drafted ${targets.length - failed} alt texts${failed ? `, ${failed} skipped/failed` : ''}.`);
  console.log(`Review & edit ${CSV_PATH}, then:  node scripts/ghost-image-alt.mjs apply --dry-run`);
}

async function apply({ dryRun }) {
  if (!existsSync(CSV_PATH)) {
    throw new Error(`${CSV_PATH} not found — run "audit" first and fill in suggested_alt.`);
  }
  const rows = parseCsv(readFileSync(CSV_PATH, 'utf8'));
  const [header, ...body] = rows;
  const col = Object.fromEntries(header.map((h, i) => [h.trim(), i]));
  for (const k of ['post_id', 'image_src', 'suggested_alt']) {
    if (!(k in col)) throw new Error(`CSV missing required column: ${k}`);
  }

  // Group filled rows by post.
  const byPost = new Map();
  for (const r of body) {
    const alt = (r[col.suggested_alt] || '').trim();
    if (!alt) continue; // only act on rows you've filled in
    const id = r[col.post_id];
    if (!byPost.has(id)) byPost.set(id, []);
    byPost.get(id).push({ src: r[col.image_src], alt });
  }

  if (!byPost.size) {
    console.log('No rows with a suggested_alt value — nothing to apply. Fill the column first.');
    return;
  }

  let updatedPosts = 0;
  let updatedImages = 0;
  let skipped = 0;

  for (const [postId, edits] of byPost) {
    // Re-fetch the post fresh so updated_at is current (Ghost rejects stale writes).
    const { posts: [post] } = await ghostFetch(
      `/posts/${postId}/?formats=lexical&fields=id,title,lexical,updated_at`,
    );
    if (!post) { console.warn(`! post ${postId} not found, skipping`); continue; }

    const tree = JSON.parse(post.lexical);
    const handles = [...imageNodes(tree.root)];
    let changed = 0;
    const unmatched = [];

    for (const { src, alt } of edits) {
      const matches = handles.filter((h) => h.src === src && !h.get().trim());
      if (!matches.length) { unmatched.push(src); continue; }
      for (const h of matches) { h.set(alt); changed++; updatedImages++; }
    }

    if (unmatched.length) {
      skipped += unmatched.length;
      console.warn(`! ${post.title}: ${unmatched.length} src(s) not found as empty Lexical image cards (edit in Ghost): ${unmatched.join(', ')}`);
    }
    if (!changed) continue;

    if (dryRun) {
      console.log(`[dry-run] ${post.title}: would set alt on ${changed} image(s)`);
      updatedPosts++;
      continue;
    }

    await ghostFetch(`/posts/${postId}/`, {
      method: 'PUT',
      body: JSON.stringify({
        posts: [{ lexical: JSON.stringify(tree), updated_at: post.updated_at }],
      }),
    });
    console.log(`✓ ${post.title}: set alt on ${changed} image(s)`);
    updatedPosts++;
  }

  console.log(`\n${dryRun ? '[dry-run] ' : ''}Done. ${updatedImages} images across ${updatedPosts} posts${dryRun ? ' would be' : ''} updated.`);
  if (skipped) console.log(`${skipped} image(s) skipped (not editable as Lexical cards).`);
}

// --- main --------------------------------------------------------------------
(async () => {
  loadEnv();
  const cmd = process.argv[2];
  const dryRun = process.argv.includes('--dry-run');
  const overwrite = process.argv.includes('--overwrite');
  const limitArg = process.argv.find((a) => a.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : 0;
  try {
    if (cmd === 'audit') await audit();
    else if (cmd === 'suggest') await suggest({ limit, overwrite });
    else if (cmd === 'apply') await apply({ dryRun });
    else {
      console.log('Usage:');
      console.log('  node scripts/ghost-image-alt.mjs audit                 # write ghost-alt-audit.csv');
      console.log('  node scripts/ghost-image-alt.mjs suggest               # AI-draft the suggested_alt column (vision)');
      console.log('  node scripts/ghost-image-alt.mjs suggest --limit=5     # draft just 5 (cheap test run)');
      console.log('  node scripts/ghost-image-alt.mjs apply --dry-run       # preview writes back to Ghost');
      console.log('  node scripts/ghost-image-alt.mjs apply                 # write alt text back to Ghost');
      console.log('');
      console.log('  suggest flags: --overwrite (redo filled rows), --limit=N');
      console.log('  ALT_MODEL env overrides the model (default claude-opus-4-8; haiku for cheap bulk runs)');
      process.exit(1);
    }
  } catch (err) {
    console.error('\nError:', err.message);
    process.exit(1);
  }
})();
