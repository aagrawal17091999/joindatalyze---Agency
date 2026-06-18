import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
      {
        // Explicitly welcome major AI/LLM crawlers so the site is eligible for
        // AI search surfaces. Content is server-rendered, so they can read it.
        userAgent: [
          'GPTBot',
          'OAI-SearchBot',
          'ChatGPT-User',
          'ClaudeBot',
          'Claude-Web',
          'anthropic-ai',
          'Google-Extended',
          'PerplexityBot',
          'CCBot',
        ],
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: [
      'https://www.joindatalyze.com/sitemap.xml',
      'https://www.joindatalyze.com/blog/sitemap.xml',
    ],
  };
}
