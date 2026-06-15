import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resources',
  description:
    'Guides, tools, courses, and content on product analytics, Mixpanel, PostHog, Amplitude, and data quality.',
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
    title: 'How to improve your app’s retention',
    href: '/resources/improve-app-retention',
    internal: true,
    description:
      'A six-step diagnostic for finding what actually drives your D30 retention — and what to do about it. Walked through with sample data.',
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
      <div className="container">
        <header className="page-header">
          <div className="eyebrow">Resources</div>
          <h1 className="page-header__title">Guides, tools, and content</h1>
          <p className="page-header__intro">
            Everything we&apos;ve written, recorded, and built for teams trying
            to make their analytics stack trustworthy.
          </p>
        </header>

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
      </div>
    </div>
  );
}
