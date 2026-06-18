import type { NextConfig } from 'next';

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
    ];
  },
};

export default config;
