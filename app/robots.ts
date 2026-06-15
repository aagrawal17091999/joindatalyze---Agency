import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
    sitemap: [
      'https://joindatalyze.com/sitemap.xml',
      'https://www.joindatalyze.com/blog/sitemap.xml',
    ],
  };
}
