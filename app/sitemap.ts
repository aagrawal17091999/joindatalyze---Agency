import type { MetadataRoute } from 'next';
import { TOOL_CONFIG } from '@/lib/data/tool-config';

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
      ...RESOURCE_ARTICLES,
      ...toolRoutes,
    ]),
  );

  // No lastModified: we have no reliable per-page edit timestamps, and emitting
  // `new Date()` on every build trains Google to ignore the signal. Add a real
  // date per entry here if/when content sources start tracking one.
  return allPaths.map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: changeFreqFor(path),
    priority: priorityFor(path),
  }));
}
