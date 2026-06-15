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

  // Keep Ghost's trailing-slash 301s inside /blog instead of bouncing to cms.*.
  const loc = upstream.headers.get('location');
  if (loc) {
    headers.set('location', loc.replaceAll(`https://${HOST}`, PUBLIC).replaceAll(`http://${HOST}`, PUBLIC));
  }

  // Re-scope any cookies Ghost sets so they apply on our domain.
  const setCookie = upstream.headers.get('set-cookie');
  if (setCookie) {
    headers.set('set-cookie', setCookie.replace(/Domain=[^;]+/gi, 'Domain=joindatalyze.com'));
  }

  // Rewrite Ghost's absolute URLs in text responses so canonicals, internal
  // links, theme /assets, sitemap, and RSS all point at www/blog.
  const ct = upstream.headers.get('content-type') ?? '';
  if (/text\/html|xml|rss|json/.test(ct)) {
    const body = (await upstream.text())
      .replaceAll(`https://${HOST}`, PUBLIC)
      .replaceAll(`http://${HOST}`, PUBLIC);
    return new Response(body, { status: upstream.status, headers });
  }
  return new Response(upstream.body, { status: upstream.status, headers });
}

export { handle as GET, handle as HEAD, handle as POST, handle as OPTIONS };
