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
        //
        // Two kinds of agent are listed here and both matter. Training/indexing
        // crawlers (GPTBot, ClaudeBot, CCBot, Google-Extended) decide whether
        // the site can be learned from; retrieval crawlers (OAI-SearchBot,
        // PerplexityBot, Claude-SearchBot, ChatGPT-User) fetch pages live to
        // build an answer. Blocking a retrieval agent silently removes the site
        // from that engine's answers, so none of these should ever be
        // disallowed without a deliberate decision.
        userAgent: [
          'GPTBot',
          'OAI-SearchBot',
          'ChatGPT-User',
          'ClaudeBot',
          'Claude-SearchBot',
          'Claude-User',
          'Claude-Web',
          'anthropic-ai',
          'Google-Extended',
          'Google-CloudVertexBot',
          'PerplexityBot',
          'Perplexity-User',
          'Applebot',
          'Applebot-Extended',
          'Meta-ExternalAgent',
          'Bytespider',
          'CCBot',
          'cohere-ai',
          'Amazonbot',
          'DuckAssistBot',
          'MistralAI-User',
          'YouBot',
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
