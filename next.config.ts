import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
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
