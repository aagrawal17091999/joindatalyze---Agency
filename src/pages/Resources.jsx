const resources = [
  { chip: 'Blog', title: 'Mixpanel Simplified', href: 'https://mixpanelsimplified.substack.com/', description: 'Practical writing on product analytics, Mixpanel usage, and common mistakes teams make when working with data.' },
  { chip: 'Guide', title: 'Mixpanel setup — the right way', href: 'https://www.notion.so/Mixpanel-setup-The-right-way-6b6ec85312f7433494e8649dfeb8f646?pvs=21', description: 'A straightforward guide to implementing Mixpanel with clean events, clear definitions, and reliable data.' },
  { chip: 'Guide', title: 'Posthog setup — the right way', href: 'https://www.notion.so/Posthog-setup-The-right-way-f4f7fd378e5f4cdab9c510cf9899d1e7?pvs=21', description: 'A step-by-step guide to avoid common tracking issues and get consistent, usable data in PostHog.' },
  { chip: 'Guide', title: 'Amplitude setup — the right way', href: 'https://www.notion.so/Amplitude-setup-The-right-way-798518b62b744cb09dad0a217409f13d?pvs=21', description: 'A clear approach to implementing Amplitude so teams can trust their metrics and analysis.' },
  { chip: 'Course', title: 'Learning Mixpanel', href: 'https://anshagrawal.gumroad.com/l/learning-mixpanel', description: 'A hands-on course covering Mixpanel features with real examples. Designed to help teams go from basic usage to confident, day-to-day analysis.' },
  { chip: 'YouTube', title: '@anshdoesanalytics', href: 'https://www.youtube.com/@anshdoesanalytics', description: 'Videos on analytics concepts, Mixpanel walkthroughs, and practical problem-solving.' },
  { chip: 'Product', title: 'Pravix', href: 'https://joinpravix.com/', description: 'Monitor Mixpanel data quality in real time and catch tracking issues before they affect reports.' },
  { chip: 'Product', title: 'DatalyzeInsights', href: 'https://datalyzeinsights.com/', description: 'Turn product videos into tracking plans and analytics strategies using AI.' },
];

export default function Resources() {
  return (
    <section id="resources" className="section surface">
      <div className="container">
        <div className="section-header">
          <p className="eyebrow">Resources</p>
          <h2>Guides, tools, and content</h2>
        </div>
        <div className="resources-grid">
          {resources.map((r) => (
            <article key={r.href} className="resource-card">
              <span className="resource-chip">{r.chip}</span>
              <h3>
                <a className="resource-link" href={r.href} target="_blank" rel="noreferrer">
                  {r.title}
                </a>
              </h3>
              <p>{r.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
