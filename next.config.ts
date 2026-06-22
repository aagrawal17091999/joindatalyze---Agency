import type { NextConfig } from 'next';

// Content-Security-Policy. Applies to the whole site INCLUDING the proxied
// /blog/* (Ghost) pages, so it must allow Ghost's needs too (jsdelivr, Ghost
// storage CDN, its inline theme scripts). 'unsafe-inline'/'unsafe-eval' are
// required — Next.js static output, our inline JSON-LD, and the Ghost theme all
// ship inline scripts, and there's no nonce path for statically rendered pages.
// The value is still meaningful: it blocks script/frame loads from any origin
// not on the allowlist, and adds frame-ancestors/object-src/base-uri hardening.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.rocketsdr.ai https://cdn.mxpnl.com https://*.mxpnl.com https://cdn.jsdelivr.net https://www.googletagmanager.com https://www.google-analytics.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://calendly.com https://assets.calendly.com",
  "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://assets.calendly.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https://cdn.jsdelivr.net",
  "connect-src 'self' https://api.mixpanel.com https://api-js.mixpanel.com https://*.mxpnl.com https://www.rocketsdr.ai https://*.google-analytics.com https://*.googletagmanager.com https://*.calendly.com https://vitals.vercel-insights.com",
  "frame-src 'self' https://calendly.com https://*.calendly.com https://www.youtube.com https://www.youtube-nocookie.com",
  "frame-ancestors 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://calendly.com",
  "worker-src 'self' blob:",
].join('; ');

const config: NextConfig = {
  reactStrictMode: true,
  // Ghost serves canonical URLs WITH a trailing slash; Next strips them by
  // default, which fought Ghost's own 301s and looped the /blog proxy. Skip the
  // auto-redirect so trailing-slash URLs reach the proxy and serve directly.
  skipTrailingSlashRedirect: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        // Security/trust headers across all routes. CSP is intentionally omitted
        // here — it needs a per-site policy designed against the actual asset
        // origins (Ghost CDN, Calendly, etc.) and a wrong CSP breaks the page.
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      // Serve the self-contained retention microsite at a clean, no-.html URL.
      {
        source: '/resources/improve-app-retention',
        destination: '/resources/retention-demo.html',
      },
    ];
  },
  async redirects() {
    return [
      // Legacy blog subdomain -> subdirectory, slug preserved. Fires only for
      // the blog.* host (now pointed at Vercel), so it never catches the proxy's
      // fetches to the Ghost origin and cannot create a redirect loop.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'blog.joindatalyze.com' }],
        destination: 'https://www.joindatalyze.com/blog/:path*',
        permanent: true, // 301
      },
      // Note: canonicalising bare /blog -> /blog/ is handled inside the proxy
      // route handler, NOT here. A config redirect with source '/blog' also
      // matches '/blog/' (path-to-regexp is lenient about the trailing slash,
      // especially with skipTrailingSlashRedirect), so it 308-loops /blog/ onto
      // itself. The handler can compare the exact pathname and avoid that.
    ];
  },
};

export default config;
