import type { Metadata } from 'next';
import Link from 'next/link';
import CtaButton from '../_components/cta-button';
import { toolList } from '@/lib/data/tools';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Free Analytics Tools',
  description:
    'Free analytics tools built by Datalyze. Export Mixpanel data, grade your analytics maturity, and more.',
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
          <h1 className="page-header__title">Tools built by Datalyze</h1>
          <p className="page-header__intro">
            Small, sharp utilities we&apos;ve built because our clients kept
            asking for them. Free to use — bring your own stack.
          </p>
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

        <section className="tool-context">
          <h2 className="tool-context__title">
            Free analytics tools for product and growth teams
          </h2>
          <p className="tool-context__p">
            These are the small utilities we kept rebuilding for clients, so we
            cleaned them up and made them free. The Mixpanel exporters pull your
            raw event and user-profile data into clean CSVs you can load
            anywhere — handy for warehouse syncs, modeling in a notebook, or
            backing up a project before a migration. The Claude skills turn a
            fuzzy product question into a focused analytics strategy and a
            ready-to-implement event tracking plan. And the Analytics Maturity
            Grader scores your stack across the five dimensions we assess in
            every audit.
          </p>
          <p className="tool-context__p">
            Everything here is genuinely free and self-serve — no sales call
            required. They run on your own machine or inside your own Claude
            account, so your data and credentials stay with you. If you need
            something more tailored to your workflow, we also build custom tools
            as part of our analytics engagements.
          </p>
        </section>

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
