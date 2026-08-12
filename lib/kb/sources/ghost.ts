import type { SourceDocument, SourceResult, SourceTier } from '../types';
import { htmlToText } from '../text';

// Ghost blog + case studies. Read-only, via the Content API (not Admin) - the
// key already exists in .env.local as GHOST_CONTENT_API_KEY.
//
// NOTE: fetches the Ghost origin directly (cms.joindatalyze.com by default),
// not the /blog proxy. The proxy rewrites URLs in response bodies for SEO; for
// ingestion we want Ghost's own canonical data.

const CONTENT_API_VERSION = 'v5.0';

/**
 * The `[Week N] Learning Mixpanel` series gets its own tier. It's 28 of 82
 * posts - a third of the blog by count and denser than average - and it's
 * tutorial content rather than opinion. Left at `published` it would dominate
 * retrieval on anything Mixpanel-adjacent, and "how do I do X in Mixpanel"
 * overlaps heavily with "how should I think about X", so strategy questions
 * would keep pulling back a how-to.
 *
 * 0.95 (see lib/kb/config.ts) is deliberately gentle: on a real how-to question
 * the tutorial still wins easily, because a 5% haircut doesn't overcome a
 * genuine relevance gap. It only breaks ties.
 */
function tierFor(title: string, tags: string[]): SourceTier {
  if (/^\[week\s*\d+\]/i.test(title.trim())) return 'tutorial';
  if (tags.some((t) => /^(tutorial|learning mixpanel)$/i.test(t))) return 'tutorial';
  return 'published';
}

type GhostPost = {
  id: string;
  uuid: string;
  title: string;
  slug: string;
  url: string;
  html: string | null;
  plaintext: string | null;
  excerpt: string | null;
  published_at: string | null;
  updated_at: string | null;
  visibility: string;
  primary_author: { name: string } | null;
  tags: Array<{ name: string }> | null;
};

type GhostResponse = {
  posts: GhostPost[];
  meta?: { pagination?: { pages: number; total: number; next: number | null } };
};

function ghostOrigin(): string {
  // GHOST_API_URL points at datalyze.ghost.io; the custom domain serves the
  // same content and is what post URLs are canonicalised against.
  return process.env.GHOST_CONTENT_API_URL || 'https://cms.joindatalyze.com';
}

/**
 * Rewrite a Ghost canonical URL to its public /blog equivalent, matching what
 * app/blog/[[...slug]]/route.ts serves. Citations must link where visitors can
 * actually read the post, not at the deindexed cms.* origin.
 */
export function toPublicBlogUrl(ghostUrl: string): string {
  try {
    const url = new URL(ghostUrl);
    const path = url.pathname.replace(/^\/+/, '');
    return `https://www.joindatalyze.com/blog/${path}`;
  } catch {
    return ghostUrl;
  }
}

export async function fetchGhostDocuments(): Promise<SourceResult> {
  const key = process.env.GHOST_CONTENT_API_KEY;
  if (!key) {
    throw new Error(
      'GHOST_CONTENT_API_KEY is not set. It exists in .env.local but is NOT in ' +
        'push-env-to-vercel.sh\'s VARS array - add it there before deploying, or ' +
        'the sync works locally and 500s in production.',
    );
  }

  const origin = ghostOrigin();
  const posts: GhostPost[] = [];
  let page = 1;
  let pages = 1;
  let total: number | null = null;

  do {
    const params = new URLSearchParams({
      key,
      limit: '100',
      page: String(page),
      include: 'tags,authors',
      formats: 'html,plaintext',
      order: 'published_at desc',
      // Public posts only. Drafts and members-only content stay out of the KB.
      filter: 'status:published+visibility:public',
    });

    const res = await fetch(
      `${origin}/ghost/api/content/posts/?${params.toString()}`,
      { headers: { 'Accept-Version': CONTENT_API_VERSION } },
    );

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`Ghost Content API ${res.status}: ${body.slice(0, 300)}`);
    }

    const data = (await res.json()) as GhostResponse;
    posts.push(...data.posts);
    pages = data.meta?.pagination?.pages ?? 1;
    total = data.meta?.pagination?.total ?? total;
    page += 1;
  } while (page <= pages);

  const documents: SourceDocument[] = posts.map((post) => {
    // Prefer rendering from HTML: Ghost's `plaintext` flattens headings, so
    // chunking it would lose every section boundary in the post.
    const text = post.html ? htmlToText(post.html) : (post.plaintext ?? '');
    const tags = (post.tags ?? []).map((t) => t.name);

    return {
      docId: `ghost:${post.uuid}`,
      sourceType: 'ghost',
      sourceUrl: toPublicBlogUrl(post.url),
      title: post.title,
      author: post.primary_author?.name ?? null,
      publishedAt: post.published_at ? new Date(post.published_at) : null,
      updatedAt: post.updated_at ? new Date(post.updated_at) : null,
      sourceTier: tierFor(post.title, tags),
      // Prepend the title as an H1 so the chunker's breadcrumbs start from the
      // post title rather than from whatever the first in-body heading is.
      text: `# ${post.title}\n\n${text}`,
    };
  });

  return {
    sourceType: 'ghost',
    // Ghost always returns everything; there's no cheap incremental mode worth
    // having when the full pull is one paginated call.
    runMode: 'full',
    documents,
    reportedTotal: total,
  };
}
