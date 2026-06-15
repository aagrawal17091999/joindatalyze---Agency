// "From the blog" strip — pulls recent posts from the Ghost Content API and
// links into the proxied /blog subdirectory. Server Component; gracefully
// renders nothing if the API is unavailable or the key is unset.

type Post = {
  slug: string;
  title: string;
  excerpt?: string;
  feature_image?: string | null;
  reading_time?: number;
};

async function getLatestPosts(): Promise<Post[]> {
  const key = process.env.GHOST_CONTENT_API_KEY;
  const base = process.env.GHOST_API_URL || 'https://datalyze.ghost.io';
  if (!key) return [];

  try {
    const res = await fetch(
      `${base}/ghost/api/content/posts/?key=${key}&limit=3` +
        `&fields=slug,title,excerpt,feature_image,reading_time` +
        `&order=published_at%20desc`,
      // Revalidate hourly so new posts surface without a redeploy.
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];
    const data = (await res.json()) as { posts?: Post[] };
    return data.posts ?? [];
  } catch {
    return [];
  }
}

export default async function LatestPosts() {
  const posts = await getLatestPosts();
  if (posts.length === 0) return null;

  return (
    <section className="section" id="from-the-blog">
      <div className="container">
        <header
          className="page-header"
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 'var(--space-6)',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <div className="eyebrow">From the blog</div>
            <h2 className="page-header__title">Latest thinking on data &amp; growth</h2>
          </div>
          <a
            href="/blog"
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 12,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              whiteSpace: 'nowrap',
            }}
          >
            All posts →
          </a>
        </header>

        <div
          style={{
            marginTop: 'var(--space-7)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'var(--space-6)',
          }}
        >
          {posts.map((post) => (
            <a
              key={post.slug}
              href={`/blog/${post.slug}/`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              {post.feature_image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.feature_image}
                  alt=""
                  loading="lazy"
                  style={{
                    width: '100%',
                    aspectRatio: '16 / 9',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              ) : null}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-3)',
                  padding: 'var(--space-6)',
                }}
              >
                <h3
                  style={{
                    fontFamily: 'var(--font-display), serif',
                    fontSize: 'var(--text-display-sm)',
                    fontWeight: 400,
                    color: 'var(--text-primary)',
                    lineHeight: 1.2,
                  }}
                >
                  {post.title}
                </h3>
                {post.excerpt ? (
                  <p
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: 'var(--text-body-sm, 0.95rem)',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {post.excerpt}
                  </p>
                ) : null}
                {post.reading_time ? (
                  <span
                    style={{
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: 12,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {post.reading_time} min read
                  </span>
                ) : null}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
