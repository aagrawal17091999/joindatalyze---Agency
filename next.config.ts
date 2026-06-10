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
};

export default config;
