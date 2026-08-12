import type { Metadata } from 'next';
import Link from 'next/link';
import CtaButton from '../_components/cta-button';
import { toolList } from '@/lib/data/tools';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Free Analytics Tools & Claude Skills',
  description:
    'Five free tools: Mixpanel CSV exporters, a Claude skill that generates an event tracking plan, an analytics strategy creator, and a maturity grader.',
  alternates: { canonical: '/tools' },
};

export default function ToolsPage() {
  return (
    <div className="page-shell">
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Tools', path: '/tools' },
        ])}
      />
      <div className="container">
        <header className="page-header">
          <div className="eyebrow">Tools</div>
          <h1 className="page-header__title">
            Free analytics tools built by Datalyze
          </h1>
        </header>

        <h2 className="visually-hidden">Browse the tools</h2>
        <div className="card-grid">
          {toolList.map((tool) => (
            <Link key={tool.id} href={`/tools/${tool.id}`} className="card">
              <div className="card__tag">
                {tool.type === 'web' ? 'Interactive · Web' : tool.fileType ?? 'Download'}
              </div>
              <h3 className="card__title">{tool.title}</h3>
              <p className="card__body">{tool.description}</p>
              <span className="card__cta">{tool.cta}</span>
            </Link>
          ))}
        </div>

        <div
          style={{
            marginTop: 'var(--space-10)',
            padding: 'var(--space-8) var(--space-7)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-6)',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-display), serif',
                fontSize: 'var(--text-display-sm)',
                fontWeight: 400,
                letterSpacing: '-0.025em',
                color: 'var(--text-primary)',
              }}
            >
              Want a custom tool?
            </h2>
            <p
              style={{
                marginTop: 'var(--space-3)',
                color: 'var(--text-secondary)',
                maxWidth: 560,
              }}
            >
              Tell us about your analytics workflow and we&apos;ll build a
              custom tool tailored to your team.
            </p>
          </div>
          <CtaButton href="/contact" location="tools_page">
            Request a custom tool
          </CtaButton>
        </div>
      </div>
    </div>
  );
}
