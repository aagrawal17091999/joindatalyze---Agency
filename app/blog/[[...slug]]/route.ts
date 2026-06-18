import type { NextRequest } from 'next/server';

// Ghost Pro origin (set as the custom domain in Ghost admin). Serves 200 and
// never redirects to /blog, so the proxy can't loop. If you later gate content,
// point member sign-in/account flows at this host directly.
const ORIGIN = 'https://cms.joindatalyze.com';
const HOST = 'cms.joindatalyze.com';
const PUBLIC = 'https://www.joindatalyze.com/blog';

export const dynamic = 'force-dynamic';

async function handle(req: NextRequest) {
  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/blog/, '') || '/';

  // Expose the public Content API (Portal/search need it); never the admin app.
  if (path.startsWith('/ghost') && !path.startsWith('/ghost/api/content')) {
    return new Response('Not found', { status: 404 });
  }

  const init: RequestInit = {
    method: req.method,
    headers: {
      'user-agent': req.headers.get('user-agent') ?? '',
      accept: req.headers.get('accept') ?? '',
      'accept-language': req.headers.get('accept-language') ?? '',
      'content-type': req.headers.get('content-type') ?? '',
      cookie: req.headers.get('cookie') ?? '',
    },
    redirect: 'manual',
  };
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    init.body = await req.arrayBuffer();
  }

  const upstream = await fetch(ORIGIN + path + url.search, init);

  const headers = new Headers(upstream.headers);
  headers.delete('content-encoding');
  headers.delete('content-length');
  // Never let an origin-level robots directive reach the public pages. The Ghost
  // origin (cms.*) is deindexed on purpose; if it ever emitted X-Robots-Tag, copying
  // it here would deindex /blog and sink its SEO. Indexing for /blog is controlled
  // solely by the canonical/meta tags in the rewritten HTML body, not origin headers.
  headers.delete('x-robots-tag');

  // Keep Ghost's redirects inside /blog instead of bouncing to cms.* or root.
  const loc = upstream.headers.get('location');
  if (loc) {
    let fixed = loc.replaceAll(`https://${HOST}`, PUBLIC).replaceAll(`http://${HOST}`, PUBLIC);
    // Ghost also issues root-relative redirects (e.g. "/slug/") that drop the
    // /blog prefix; re-anchor them so they don't escape to the site root.
    if (fixed.startsWith('/') && !fixed.startsWith('/blog')) {
      fixed = '/blog' + fixed;
    }
    headers.set('location', fixed);
  }

  // Re-scope any cookies Ghost sets so they apply on our domain.
  const setCookie = upstream.headers.get('set-cookie');
  if (setCookie) {
    headers.set('set-cookie', setCookie.replace(/Domain=[^;]+/gi, 'Domain=joindatalyze.com'));
  }

  // Rewrite Ghost's URLs in text responses so canonicals, internal links,
  // theme assets, sitemap, and RSS all resolve under /blog.
  const ct = upstream.headers.get('content-type') ?? '';
  if (/text\/html|xml|rss|json/.test(ct)) {
    let body = (await upstream.text())
      // Absolute origin URLs -> public subdirectory.
      .replaceAll(`https://${HOST}`, PUBLIC)
      .replaceAll(`http://${HOST}`, PUBLIC);
    // Ghost also emits ROOT-RELATIVE URLs (post permalinks like "/slug/", its
    // core "/public/*" scripts, form actions) that would otherwise resolve at
    // the site root and 404. Re-anchor them under /blog. Skip protocol-relative
    // ("//...") URLs and anything already under /blog.
    if (ct.includes('text/html')) {
      body = body
        .replace(/(href|src|action)="\/(?!\/|blog[/"])/g, '$1="/blog/')
        .replace(/\burl\(\/(?!\/|blog[/"])/g, 'url(/blog/');

      // SEO fixes for the Ghost "Source" theme, which paginates archives with a
      // JS load-more button. Two things Screaming Frog flags as a result:
      //   1. the rel=next/prev targets aren't exposed as crawlable <a> links, and
      //   2. /page/N/ archive pages render no <h1>.
      // Patch both in the proxied HTML (visually-hidden, so the design is
      // untouched), and only when the element is actually missing.
      const srOnly =
        'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0';
      const rel = [
        ...body.matchAll(/<link[^>]+rel="(next|prev)"[^>]+href="([^"]+)"[^>]*>/gi),
      ];
      if (rel.length && body.includes('</main>')) {
        const links = rel
          .map(
            (m) =>
              `<a href="${m[2]}" rel="${m[1].toLowerCase()}">${
                m[1].toLowerCase() === 'next' ? 'Older posts' : 'Newer posts'
              }</a>`,
          )
          .join('');
        body = body.replace(
          '</main>',
          `<nav aria-label="Pagination" style="${srOnly}">${links}</nav></main>`,
        );
      }
      const pageNo = path.match(/\/page\/(\d+)\/?$/);
      if (
        pageNo &&
        body.includes('<main class="gh-main">') &&
        !/<h1[\s>]/i.test(body)
      ) {
        body = body.replace(
          '<main class="gh-main">',
          `<main class="gh-main"><h1 style="${srOnly}">Datalyze blog — page ${pageNo[1]}</h1>`,
        );
      }
    }
    return new Response(body, { status: upstream.status, headers });
  }
  return new Response(upstream.body, { status: upstream.status, headers });
}

export { handle as GET, handle as HEAD, handle as POST, handle as OPTIONS };
