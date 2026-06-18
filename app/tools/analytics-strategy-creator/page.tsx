import type { Metadata } from 'next';
import Link from 'next/link';
import { toolById } from '@/lib/data/tools';
import ToolDownloadForm from '@/app/_components/tool-download-form';
import CtaButton from '@/app/_components/cta-button';

const tool = toolById['analytics-strategy-creator'];

export const metadata: Metadata = {
  title: 'Free Analytics Strategy Creator — Claude Skill',
  description:
    'Turn a fuzzy product question into a decision-driven analytics strategy. A free Claude skill that outputs metrics, counter-metrics, and segmentation.',
  alternates: { canonical: '/tools/analytics-strategy-creator' },
  openGraph: {
    title: 'Free Analytics Strategy Creator — Claude Skill',
    description:
      'Turn a fuzzy product question into a tight, decision-driven analytics strategy. Free Claude skill.',
    url: '/tools/analytics-strategy-creator',
    type: 'website',
  },
};

const sectionTitleStyle = {
  fontFamily: 'var(--font-display), serif',
  fontSize: 'var(--text-display-sm)',
  fontWeight: 400,
  color: 'var(--text-primary)',
  marginTop: 'var(--space-10)',
  marginBottom: 'var(--space-4)',
} as const;

const paragraphStyle = {
  color: 'var(--text-secondary)',
  lineHeight: 1.7,
  marginBottom: 'var(--space-4)',
} as const;

const bulletListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-3)',
  color: 'var(--text-secondary)',
  marginBottom: 'var(--space-5)',
  paddingLeft: 0,
  listStyle: 'none',
} as const;

const bulletItemStyle = {
  position: 'relative',
  paddingLeft: 'var(--space-5)',
  lineHeight: 1.6,
} as const;

const bulletDashStyle = {
  position: 'absolute',
  left: 0,
  top: '0.75em',
  width: 8,
  height: 1,
  background: 'var(--accent)',
} as const;

const numberedListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-4)',
  color: 'var(--text-secondary)',
  marginBottom: 'var(--space-5)',
  counterReset: 'step',
  paddingLeft: 0,
  listStyle: 'none',
} as const;

const numberedItemStyle = {
  position: 'relative',
  paddingLeft: 'var(--space-7)',
  lineHeight: 1.6,
  counterIncrement: 'step',
} as const;

const numberBadgeStyle = {
  position: 'absolute',
  left: 0,
  top: 0,
  fontFamily: 'var(--font-mono), monospace',
  fontSize: 12,
  color: 'var(--accent)',
  fontWeight: 500,
  letterSpacing: '0.08em',
} as const;

const calloutStyle = {
  background: 'var(--bg-surface)',
  border: '1px solid var(--border-default)',
  borderLeft: '3px solid var(--accent)',
  borderRadius: 'var(--radius-sm)',
  padding: 'var(--space-5) var(--space-6)',
  marginBottom: 'var(--space-5)',
  color: 'var(--text-secondary)',
  lineHeight: 1.6,
} as const;

const blockquoteStyle = {
  margin: 0,
  marginBottom: 'var(--space-5)',
  padding: 'var(--space-5) var(--space-6)',
  background: 'var(--bg-surface)',
  borderLeft: '3px solid var(--accent)',
  borderRadius: 'var(--radius-sm)',
  fontFamily: 'var(--font-mono), monospace',
  fontSize: 14,
  color: 'var(--text-primary)',
  lineHeight: 1.6,
} as const;

const monoInlineStyle = {
  fontFamily: 'var(--font-mono), monospace',
  fontSize: '0.95em',
  background: 'var(--bg-surface)',
  padding: '2px 6px',
  borderRadius: 4,
  color: 'var(--text-primary)',
} as const;

export default function AnalyticsStrategyCreatorPage() {
  return (
    <div className="page-shell">
      <div className="container">
        <header className="page-header">
          <div className="eyebrow">{tool.fileType}</div>
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
                ...bulletListStyle,
              }}
            >
              {tool.features.map((f) => (
                <li key={f} style={bulletItemStyle}>
                  <span style={bulletDashStyle} />
                  {f}
                </li>
              ))}
            </ul>

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
              Format: Claude Skill (.skill)
            </p>
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

        <section style={{ marginTop: 'var(--space-10)' }}>
          <h2 style={sectionTitleStyle}>What is an analytics strategy?</h2>
          <p style={paragraphStyle}>
            An analytics strategy is a short document that names the specific
            decision you&apos;re trying to make, then picks the few metrics that
            actually inform it. It&apos;s the thing you write{' '}
            <strong>before</strong> you build a dashboard, set up tracking, or
            argue about KPIs — so you don&apos;t spend the next quarter staring
            at numbers that don&apos;t change anyone&apos;s mind.
          </p>
          <p style={paragraphStyle}>
            A good strategy answers four questions:
          </p>
          <ul style={bulletListStyle}>
            <li style={bulletItemStyle}>
              <span style={bulletDashStyle} />
              <strong>What&apos;s the decision?</strong> (e.g., &ldquo;invest in
              onboarding redesign vs. paid acquisition&rdquo;)
            </li>
            <li style={bulletItemStyle}>
              <span style={bulletDashStyle} />
              <strong>What 3–5 metrics inform it?</strong> (paired with
              counter-metrics to catch gaming)
            </li>
            <li style={bulletItemStyle}>
              <span style={bulletDashStyle} />
              <strong>How do we segment each metric?</strong> (e.g.,{' '}
              <code style={monoInlineStyle}>traffic_source</code>,{' '}
              <code style={monoInlineStyle}>plan_tier</code>,{' '}
              <code style={monoInlineStyle}>new_vs_returning</code>)
            </li>
            <li style={bulletItemStyle}>
              <span style={bulletDashStyle} />
              <strong>Which vanity metrics do we explicitly skip?</strong>{' '}
              (named, not generic)
            </li>
          </ul>
          <p style={paragraphStyle}>
            Without a strategy, you end up with a 30-metric dashboard nobody
            looks at, instrumentation work that doesn&apos;t map to any
            decision, and a team that argues about gut feel because the data
            doesn&apos;t resolve anything.{' '}
            <strong>
              A 30-metric dashboard is not a strategy; it&apos;s a graveyard.
            </strong>
          </p>
        </section>

        <section>
          <h2 style={sectionTitleStyle}>
            Why founders skip analytics strategy (and pay for it later)
          </h2>
          <p style={paragraphStyle}>
            Most early-stage founders skip the strategy step and jump straight
            to &ldquo;let&apos;s set up Mixpanel.&rdquo; Six months in, they
            have:
          </p>
          <ul style={bulletListStyle}>
            <li style={bulletItemStyle}>
              <span style={bulletDashStyle} />A dashboard with{' '}
              <code style={monoInlineStyle}>DAU</code>,{' '}
              <code style={monoInlineStyle}>MAU</code>,{' '}
              <code style={monoInlineStyle}>signups</code>, and{' '}
              <code style={monoInlineStyle}>page_views</code> — none of which
              change what they ship next
            </li>
            <li style={bulletItemStyle}>
              <span style={bulletDashStyle} />
              Metrics that go up while the business goes sideways (no
              counter-metric to catch it)
            </li>
            <li style={bulletItemStyle}>
              <span style={bulletDashStyle} />
              Aggregate numbers that hide the segment where the real problem
              lives
            </li>
            <li style={bulletItemStyle}>
              <span style={bulletDashStyle} />
              Tracking debt built on top of a strategy that was never written
              down
            </li>
          </ul>
          <p style={paragraphStyle}>
            By the time you realize the numbers aren&apos;t actually helping you
            decide anything, you&apos;ve already shipped a dashboard the team
            doesn&apos;t trust — and you&apos;re back to gut feel.
          </p>
        </section>

        <section>
          <h2 style={sectionTitleStyle}>What this tool does</h2>
          <p style={paragraphStyle}>
            Once installed in Claude, you tell it the decision you&apos;re
            trying to make and give it your product URL. Then Claude:
          </p>
          <ol style={numberedListStyle}>
            <li style={numberedItemStyle}>
              <span style={numberBadgeStyle}>01</span>
              Pins down the specific decision before recommending any metric —
              and pushes back firmly if you answer with a vanity count or a
              vague category
            </li>
            <li style={numberedItemStyle}>
              <span style={numberBadgeStyle}>02</span>
              Researches your product by fetching your marketing site and
              relevant sub-pages so it understands what you actually do
            </li>
            <li style={numberedItemStyle}>
              <span style={numberBadgeStyle}>03</span>
              Asks a few sharp questions about stage, business model, and
              existing instrumentation
            </li>
            <li style={numberedItemStyle}>
              <span style={numberBadgeStyle}>04</span>
              Picks 3–5 primary metrics, each paired with a counter-metric and
              segmentation dimensions — and names the vanity metrics
              you&apos;re explicitly skipping
            </li>
            <li style={numberedItemStyle}>
              <span style={numberBadgeStyle}>05</span>
              Outputs a markdown strategy doc you can hand to your PM, eng
              team, or data person
            </li>
          </ol>
        </section>

        <section>
          <h2 style={sectionTitleStyle}>What you get</h2>
          <p style={paragraphStyle}>
            A markdown strategy doc with these sections, ready to share or
            paste into Notion / Linear / your wiki of choice:
          </p>
          <div
            style={{
              overflowX: 'auto',
              marginBottom: 'var(--space-5)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: 14,
                color: 'var(--text-secondary)',
                minWidth: 600,
              }}
            >
              <thead>
                <tr
                  style={{
                    background: 'var(--bg-surface)',
                  }}
                >
                  <th
                    style={{
                      textAlign: 'left',
                      padding: 'var(--space-3) var(--space-4)',
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: 11,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--text-muted)',
                      borderBottom: '1px solid var(--border-default)',
                      width: '30%',
                    }}
                  >
                    Section
                  </th>
                  <th
                    style={{
                      textAlign: 'left',
                      padding: 'var(--space-3) var(--space-4)',
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: 11,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--text-muted)',
                      borderBottom: '1px solid var(--border-default)',
                    }}
                  >
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  [
                    'The decision this informs',
                    '1–2 sentences naming the concrete action this strategy enables',
                  ],
                  [
                    'Product context',
                    'One paragraph so any reader can understand what the product does',
                  ],
                  [
                    'Primary metrics',
                    '3–5 metrics, each with counter-metric, segmentation, computation, cadence, and "what good looks like"',
                  ],
                  [
                    'Vanity metrics skipped',
                    '2–4 tempting-but-not-useful metrics named explicitly, with a one-line reason',
                  ],
                  [
                    'Instrumentation notes',
                    'Engineer-readable event + property list mapped to the primary metrics',
                  ],
                  [
                    'What to check first',
                    '2–3 concrete first actions to take this week',
                  ],
                  [
                    'When to revisit',
                    'Specific triggers and cadence for refreshing the strategy',
                  ],
                ].map(([col, desc], i, arr) => (
                  <tr key={col}>
                    <td
                      style={{
                        padding: 'var(--space-3) var(--space-4)',
                        fontFamily: 'var(--font-mono), monospace',
                        fontSize: 13,
                        color: 'var(--text-primary)',
                        borderBottom:
                          i === arr.length - 1
                            ? 'none'
                            : '1px solid var(--border-default)',
                        verticalAlign: 'top',
                      }}
                    >
                      {col}
                    </td>
                    <td
                      style={{
                        padding: 'var(--space-3) var(--space-4)',
                        borderBottom:
                          i === arr.length - 1
                            ? 'none'
                            : '1px solid var(--border-default)',
                        lineHeight: 1.5,
                      }}
                    >
                      {desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={paragraphStyle}>
            The doc is intentionally short — roughly 1–2 printed pages. If you
            want full instrumentation specs to hand to engineering, the output
            chains naturally into the{' '}
            <Link
              href="/tools/event-tracking-plan-generator"
              style={{ color: 'var(--accent)' }}
            >
              Event Tracking Plan Generator
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 style={sectionTitleStyle}>Installation</h2>
          <div style={calloutStyle}>
            You need <strong>Claude Pro, Max, or Team</strong> (skills
            aren&apos;t available on the free plan).
          </div>
          <p style={paragraphStyle}>Steps:</p>
          <ol style={numberedListStyle}>
            <li style={numberedItemStyle}>
              <span style={numberBadgeStyle}>01</span>
              Download the <code style={monoInlineStyle}>.skill</code> file
              from this page
            </li>
            <li style={numberedItemStyle}>
              <span style={numberBadgeStyle}>02</span>
              Open Claude → Settings → Capabilities → Skills
            </li>
            <li style={numberedItemStyle}>
              <span style={numberBadgeStyle}>03</span>
              Click &ldquo;Upload skill&rdquo; and select the file
            </li>
            <li style={numberedItemStyle}>
              <span style={numberBadgeStyle}>04</span>
              Open a new conversation. The skill activates automatically when
              you ask Claude what to measure for a product decision.
            </li>
          </ol>
        </section>

        <section>
          <h2 style={sectionTitleStyle}>How to use it</h2>
          <p style={paragraphStyle}>
            Start a new chat and say something like:
          </p>
          <blockquote style={blockquoteStyle}>
            &ldquo;I want an analytics strategy for{' '}
            <code style={monoInlineStyle}>https://app.yourproduct.com</code> —
            I&apos;m trying to decide [the specific decision].&rdquo;
          </blockquote>
          <p style={paragraphStyle}>
            Claude will then walk you through four short steps:
          </p>
          <ol style={numberedListStyle}>
            <li style={numberedItemStyle}>
              <span style={numberBadgeStyle}>01</span>
              <strong>Decision first</strong> — Claude pins down the specific
              decision you&apos;re making. If you answer with a vanity count
              (&ldquo;I want to track DAU&rdquo;) or a vague category
              (&ldquo;engagement&rdquo;), it&apos;ll push back until you have a
              real decision. The single test:{' '}
              <em>what would you do differently if the metric is good vs bad?</em>
            </li>
            <li style={numberedItemStyle}>
              <span style={numberBadgeStyle}>02</span>
              <strong>Product context</strong> — share your URL and a few
              sentences on what the product does, who uses it, and the core
              action. Claude fetches your site to fill in the rest, then
              recaps so you can correct anything off.
            </li>
            <li style={numberedItemStyle}>
              <span style={numberBadgeStyle}>03</span>
              <strong>Business context</strong> — stage (pre-PMF / early growth
              / scale), existing instrumentation (
              <code style={monoInlineStyle}>nothing yet</code> /{' '}
              <code style={monoInlineStyle}>GA4</code> /{' '}
              <code style={monoInlineStyle}>Mixpanel / PostHog / Amplitude</code>{' '}
              / full stack), and anything else worth knowing.
            </li>
            <li style={numberedItemStyle}>
              <span style={numberBadgeStyle}>04</span>
              <strong>Scope recap</strong> — Claude confirms the decision,
              product, stage, and stack before writing. Then it produces the
              markdown strategy doc.
            </li>
          </ol>
          <p style={paragraphStyle}>
            The whole run typically takes <strong>10–20 minutes</strong>,
            depending on how sharp your decision is going in. The markdown doc
            is delivered at the end — short, opinionated, and ready to share.
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
