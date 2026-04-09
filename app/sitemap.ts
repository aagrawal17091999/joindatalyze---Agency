import type { MetadataRoute } from 'next';
import { TOOL_CONFIG } from '@/lib/data/tool-config';

const BASE = 'https://joindatalyze.com';

const STATIC_ROUTES = [
  '',
  '/about',
  '/case-studies',
  '/contact',
  '/tools',
  '/resources',
  '/faqs',
  '/ai-analytics-agent',
  '/tools/analytics-maturity-grader',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries = STATIC_ROUTES.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.7,
  }));

  const toolEntries = Object.keys(TOOL_CONFIG).map((toolId) => ({
    url: `${BASE}/tools/${toolId}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticEntries, ...toolEntries];
}
