import mixpanel from '../utils/mixpanel';
import SEO from '../components/SEO';

const resources = [
  { title: 'Mixpanel Simplified', href: 'https://mixpanelsimplified.substack.com/', description: 'Practical writing on product analytics, Mixpanel usage, and common mistakes teams make when working with data.' },
  { title: 'Mixpanel setup — the right way', href: 'https://www.notion.so/Mixpanel-setup-The-right-way-6b6ec85312f7433494e8649dfeb8f646?pvs=21', description: 'A straightforward guide to implementing Mixpanel with clean events, clear definitions, and reliable data.' },
  { title: 'Posthog setup — the right way', href: 'https://www.notion.so/Posthog-setup-The-right-way-f4f7fd378e5f4cdab9c510cf9899d1e7?pvs=21', description: 'A step-by-step guide to avoid common tracking issues and get consistent, usable data in PostHog.' },
  { title: 'Amplitude setup — the right way', href: 'https://www.notion.so/Amplitude-setup-The-right-way-798518b62b744cb09dad0a217409f13d?pvs=21', description: 'A clear approach to implementing Amplitude so teams can trust their metrics and analysis.' },
  { title: 'Learning Mixpanel', href: 'https://anshagrawal.gumroad.com/l/learning-mixpanel', description: 'A hands-on course covering Mixpanel features with real examples. Designed to help teams go from basic usage to confident, day-to-day analysis.' },
  { title: '@anshdoesanalytics', href: 'https://www.youtube.com/@anshdoesanalytics', description: 'Videos on analytics concepts, Mixpanel walkthroughs, and practical problem-solving.' },
  { title: 'Pravix', href: 'https://joinpravix.com/', description: 'Monitor Mixpanel data quality in real time and catch tracking issues before they affect reports.' },
  { title: 'DatalyzeInsights', href: 'https://datalyzeinsights.com/', description: 'Turn product videos into tracking plans and analytics strategies using AI.' },
];

export default function Resources() {
  return (
    <section id="resources" className="section surface">
      <SEO
        title="Resources"
        description="Guides, tools, courses, and content on product analytics, Mixpanel, PostHog, Amplitude, and data quality."
        path="/resources"
      />
      <div className="container">
        <div className="section-header">
          <h2>Guides, tools, and content</h2>
        </div>
        <div className="resources-grid">
          {resources.map((r) => (
            <article key={r.href} className="resource-card">
              <h3>{r.title}</h3>
              <p>{r.description}</p>
              <div className="tool-footer">
                <a className="btn primary" href={r.href} target="_blank" rel="noreferrer" onClick={() => mixpanel.track('Resource Clicked', { resource_title: r.title })}>View resource</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
