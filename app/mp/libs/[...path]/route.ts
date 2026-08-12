import type { NextRequest } from 'next/server';

// Proxy for Mixpanel's lazy-loaded bundles - most importantly the session-replay
// recorder, which the SDK fetches on demand from cdn.mxpnl.com/libs/. Blockers
// block that CDN too, so without this proxy the recorder never loads and no
// session is captured, even though the ingestion proxy in ../api is in place.
// Paired with the SDK's lib_base_path in lib/mixpanel.ts.
const UPSTREAM = 'https://cdn.mxpnl.com/libs';

export async function GET(request: NextRequest): Promise<Response> {
  const url = new URL(request.url);
  const subpath = url.pathname.replace(/^\/mp\/libs/, '');
  const target = `${UPSTREAM}${subpath}${url.search}`;

  const upstream = await fetch(target);

  const headers = new Headers();
  const contentType = upstream.headers.get('content-type');
  if (contentType) headers.set('content-type', contentType);
  // The bundles are content-hashed (e.g. mixpanel-recorder-<hash>.js), so they
  // are safe to cache aggressively at the browser and the Vercel edge.
  headers.set('cache-control', 'public, max-age=86400, s-maxage=31536000, immutable');

  return new Response(upstream.body, {
    status: upstream.status,
    headers,
  });
}
