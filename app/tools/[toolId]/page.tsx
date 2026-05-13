import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { toolList, toolById } from '@/lib/data/tools';
import ToolDownloadForm from '@/app/_components/tool-download-form';
import CtaButton from '@/app/_components/cta-button';

type Props = {
  params: Promise<{ toolId: string }>;
};

const DEDICATED_PAGE_IDS = new Set(['event-tracking-plan-generator']);

export function generateStaticParams() {
  return toolList
    .filter((tool) => tool.type !== 'web' && !DEDICATED_PAGE_IDS.has(tool.id))
    .map((tool) => ({ toolId: tool.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { toolId } = await params;
  const tool = toolById[toolId];
  if (!tool) return {};

  return {
    description: tool.longDescription,
    alternates: { canonical: `/tools/${toolId}` },
  };
}

export default async function ToolLandingPage({ params }: Props) {
  const { toolId } = await params;
  const tool = toolById[toolId];

  if (!tool) notFound();

  if (tool.type === 'web' && toolId === 'analytics-maturity-grader') {
    redirect('/tools/analytics-maturity-grader');
  }

  return (
    <div className="page-shell">
      <div className="container">
        <header className="page-header">
          <div className="eyebrow">{tool.fileType ?? 'Datalyze Tool'}</div>
          <h1 className="page-header__title">{tool.title}</h1>
          <p className="page-header__intro">{tool.longDescription}</p>
        </header>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.4fr) minmax(320px, 1fr)',
            gap: 'var(--space-8)',
            alignItems: 'start',
          }}
          className="tool-landing-layout"
        >
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-body), sans-serif',
                fontSize: 'var(--text-h3)',
                fontWeight: 600,
                color: 'var(--text-primary)',
              }}
            >
              What&apos;s inside
            </h2>
            <ul
              style={{
                marginTop: 'var(--space-4)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-3)',
                color: 'var(--text-secondary)',
              }}
            >
              {tool.features.map((f) => (
                <li
                  key={f}
                  style={{
                    position: 'relative',
                    paddingLeft: 'var(--space-5)',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '0.75em',
                      width: 8,
                      height: 1,
                      background: 'var(--accent)',
                    }}
                  />
                  {f}
                </li>
              ))}
            </ul>

            {tool.fileType ? (
              <p
                style={{
                  marginTop: 'var(--space-6)',
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: 12,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                }}
              >
                Format: {tool.fileType}
              </p>
            ) : null}
          </div>

          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-7)',
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-display), serif',
                fontSize: 'var(--text-display-sm)',
                fontWeight: 400,
                color: 'var(--text-primary)',
              }}
            >
              Get the {tool.title}
            </h3>
            <p
              style={{
                marginTop: 'var(--space-3)',
                color: 'var(--text-secondary)',
                marginBottom: 'var(--space-5)',
              }}
            >
              Enter your email and we&apos;ll start the download immediately.
            </p>
            <ToolDownloadForm tool={tool} autoFocus />
          </div>
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
          <CtaButton href="/contact" location="tool_landing_page">
            Request a custom tool
          </CtaButton>
        </div>

        <div style={{ marginTop: 'var(--space-8)' }}>
          <Link
            href="/tools"
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 12,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
            }}
          >
            ← All tools
          </Link>
        </div>
      </div>
    </div>
  );
}
