import type { MetadataRoute } from 'next';
import { TOOL_CONFIG } from '@/lib/data/tool-config';
import { PLAYBOOKS } from '@/lib/data/playbooks';

// Canonical host is www — the apex (joindatalyze.com) 307-redirects here, so
// listing www URLs directly avoids a redirect hop on every sitemap entry.
const BASE = 'https://www.joindatalyze.com';

// Core static pages that aren't generated from a content source.
const CORE_ROUTES = [
  '',
  '/about',
  '/case-studies',
  '/contact',
  '/tools',
  '/resources',
  '/faqs',
  '/ai-analytics-agent',
];

// File-based resource articles under /resources. Add new article slugs here
// when a new app/resources/<slug>/page.tsx (or rewrite) ships.
const RESOURCE_ARTICLES = [
  '/resources/client-vs-proxy-vs-server-tracking',
  '/resources/improve-app-retention',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Released Indian D2C Playbook entries + the playbook index. Coming-soon
  // entries have no slug and no page, so they're filtered out automatically.
  const playbookRoutes = [
    '/indian-d2c-playbook',
    ...PLAYBOOKS.filter((p) => p.status === 'released' && p.slug).map(
      (p) => `/indian-d2c-playbook/${p.slug}`,
    ),
  ];

  // Tool pages generated from the tool registry.
  const toolRoutes = Object.keys(TOOL_CONFIG).map((toolId) => `/tools/${toolId}`);

  // Dedupe by path so a route listed in more than one source emits once.
  const priorityFor = (path: string) => {
    if (path === '') return 1;
    if (path.startsWith('/tools/')) return 0.6;
    return 0.7;
  };
  const changeFreqFor = (path: string): 'weekly' | 'monthly' =>
    path.startsWith('/tools/') ? 'monthly' : 'weekly';

  const allPaths = Array.from(
    new Set([
      ...CORE_ROUTES,
      ...playbookRoutes,
      ...RESOURCE_ARTICLES,
      ...toolRoutes,
    ]),
  );

  return allPaths.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: changeFreqFor(path),
    priority: priorityFor(path),
  }));
}
