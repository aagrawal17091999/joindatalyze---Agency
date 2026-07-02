import type { NextRequest } from 'next/server';

// Reverse proxy for Mixpanel ingestion — events (/track), profiles (/engage),
// session replay (/record), feature flags (/flags) and settings. Routing this
// through our own origin means ad/content blockers, which match on *.mxpnl.com
// and api*.mixpanel.com, never see a blockable request, so events and replays
// survive for visitors who run blockers (a large share of our audience).
//
// The visitor's IP is forwarded via X-Forwarded-For so Mixpanel's geolocation
// still resolves to the visitor rather than our serverless function. Only an
// explicit allowlist of headers is forwarded, so our own cookies never leak to
// Mixpanel. Paired with the SDK's api_host in lib/mixpanel.ts.
const UPSTREAM = 'https://api-js.mixpanel.com';

async function proxy(request: NextRequest): Promise<Response> {
  const url = new URL(request.url);
  const subpath = url.pathname.replace(/^\/mp\/api/, '');
  const target = `${UPSTREAM}${subpath}${url.search}`;

  const headers = new Headers();
  const passthrough = ['content-type', 'content-encoding', 'accept', 'authorization'];
  for (const name of passthrough) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  // On Vercel this is the client IP chain; Mixpanel reads it for geolocation.
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) headers.set('x-forwarded-for', forwardedFor);

  const body =
    request.method === 'GET' || request.method === 'HEAD'
      ? undefined
      : await request.arrayBuffer();

  const upstream = await fetch(target, {
    method: request.method,
    headers,
    body,
    redirect: 'manual',
  });

  const responseHeaders = new Headers();
  const contentType = upstream.headers.get('content-type');
  if (contentType) responseHeaders.set('content-type', contentType);
  responseHeaders.set('cache-control', 'no-store');

  return new Response(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  });
}

export const GET = proxy;
export const POST = proxy;

export const dynamic = 'force-dynamic';
