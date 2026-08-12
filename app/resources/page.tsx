import type { Metadata } from 'next';
import Link from 'next/link';
import { toolList } from '@/lib/data/tools';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Analytics Guides, Tools & Templates',
  description:
    'Free setup guides for Mixpanel, PostHog and Amplitude, a tracking plan generator, a maturity grader, and tools for keeping analytics data clean.',
  alternates: { canonical: '/resources' },
};

type Resource = {
  title: string;
  href: string;
  description: string;
  internal?: boolean;
};

const RESOURCES: Resource[] = [
  {
    title: 'Client vs proxy vs server-side tracking',
    href: '/resources/client-vs-proxy-vs-server-tracking',
    internal: true,
    description:
      'Where to fire each event and why it matters for your data. A short, visual guide to the three places tracking can live.',
  },
  {
    title: 'How to improve your app\u2019s retention',
    href: '/resources/improve-app-retention',
    internal: true,
    description:
      'A six-step diagnostic for finding what actually drives your D30 retention - and what to do about it. Walked through with sample data.',
  },
  {
    title: 'Mixpanel setup',
    href: 'https://www.notion.so/Mixpanel-setup-The-right-way-6b6ec85312f7433494e8649dfeb8f646?pvs=21',
    description:
      'A straightforward guide to implementing Mixpanel with clean events, clear definitions, and reliable data.',
  },
  {
    title: 'PostHog setup',
    href: 'https://www.notion.so/Posthog-setup-The-right-way-f4f7fd378e5f4cdab9c510cf9899d1e7?pvs=21',
    description:
      'A step-by-step guide to avoid common tracking issues and get consistent, usable data in PostHog.',
  },
  {
    title: 'Amplitude setup',
    href: 'https://www.notion.so/Amplitude-setup-The-right-way-798518b62b744cb09dad0a217409f13d?pvs=21',
    description:
      'A clear approach to implementing Amplitude so teams can trust their metrics and analysis.',
  },
  {
    title: 'Learning Mixpanel',
    href: 'https://anshagrawal.gumroad.com/l/learning-mixpanel',
    description:
      'A hands-on course covering Mixpanel features with real examples. From basic usage to confident, day-to-day analysis.',
  },
  {
    title: 'Datalyze',
    href: 'https://www.youtube.com/channel/UCKdowFIRu4Z5lFxNM_JNxSQ',
    description:
      'Videos on analytics concepts, Mixpanel walkthroughs, and practical problem-solving.',
  },
  {
    title: 'Pravix',
    href: 'https://joinpravix.com/',
    description:
      'Monitor Mixpanel data quality in real time and catch tracking issues before they affect reports.',
  },
  {
    title: 'DatalyzeInsights',
    href: 'https://datalyzeinsights.com/',
    description:
      'Turn product videos into tracking plans and analytics strategies using AI.',
  },
];

export default function ResourcesPage() {
  return (
    <div className="page-shell">
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Resources', path: '/resources' },
        ])}
      />
      <div className="container">
        <header className="page-header">
          <div className="eyebrow">Resources</div>
          <h1 className="page-header__title">
            Analytics guides, tools and templates
          </h1>
        </header>

        <h2 className="visually-hidden">
          Analytics guides, tools, and templates
        </h2>
        <div className="card-grid">
          {RESOURCES.map((r) => (
            <a
              key={r.href}
              href={r.href}
              {...(r.internal
                ? {}
                : { target: '_blank', rel: 'noopener noreferrer' })}
              className="card"
            >
              <h3 className="card__title">{r.title}</h3>
              <p className="card__body">{r.description}</p>
              <span className="card__cta">View resource</span>
            </a>
          ))}
        </div>

        {/* The five on-site tools and the blog were the only resources this
            page didn't link to - and they're the ones that keep a visitor on
            the domain. */}
        <section className="res-more">
          <h2 className="res-more__title">Free tools we built</h2>
          <div className="card-grid">
            {toolList.map((tool) => (
              <Link key={tool.id} href={`/tools/${tool.id}`} className="card">
                <h3 className="card__title">{tool.title}</h3>
                <p className="card__body">{tool.description}</p>
                <span className="card__cta">{tool.cta}</span>
              </Link>
            ))}
            <Link href="/blog/" className="card">
              <h3 className="card__title">The Datalyze blog</h3>
              <p className="card__body">
                80+ posts on tracking, attribution, retention and the D2C data
                stack.
              </p>
              <span className="card__cta">Read the blog</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
