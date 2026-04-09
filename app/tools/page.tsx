import type { Metadata } from 'next';
import Link from 'next/link';
import CtaButton from '../_components/cta-button';
import { toolList } from '@/lib/data/tools';

export const metadata: Metadata = {
  title: 'Tools',
  description:
    'Free analytics tools built by Datalyze. Export Mixpanel data, grade your analytics maturity, and more.',
  alternates: { canonical: '/tools' },
};

export default function ToolsPage() {
  return (
    <div className="page-shell">
      <div className="container">
        <header className="page-header">
          <div className="eyebrow">Tools</div>
          <h1 className="page-header__title">Tools built by Datalyze</h1>
          <p className="page-header__intro">
            Small, sharp utilities we&apos;ve built because our clients kept
            asking for them. Free to use — bring your own stack.
          </p>
        </header>

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
