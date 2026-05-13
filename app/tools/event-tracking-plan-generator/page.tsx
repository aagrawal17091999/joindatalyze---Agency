import type { Metadata } from 'next';
import Link from 'next/link';
import { toolById } from '@/lib/data/tools';
import ToolDownloadForm from '@/app/_components/tool-download-form';
import CtaButton from '@/app/_components/cta-button';

const tool = toolById['event-tracking-plan-generator'];

export const metadata: Metadata = {
  title: 'Free Event Tracking Plan Generator — Claude Skill | Datalyze',
  description:
    'Generate a complete event tracking plan for your product in under an hour. Free Claude skill. Outputs a Mixpanel/PostHog/Amplitude/GA4-compatible CSV. Built by Datalyze.',
  alternates: { canonical: '/tools/event-tracking-plan-generator' },
  openGraph: {
    title: 'Free Event Tracking Plan Generator — Claude Skill',
    description:
      'Generate a complete event tracking plan for your product in under an hour. Free Claude skill.',
    url: '/tools/event-tracking-plan-generator',
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

export default function EventTrackingPlanGeneratorPage() {
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
              Format: ZIP (.skill + reference .md)
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
          <h2 style={sectionTitleStyle}>What is an event tracking plan?</h2>
          <p style={paragraphStyle}>
            An event tracking plan is a structured document listing every user
            interaction in your product that should be tracked, along with the
            data (properties) sent with each event. It&apos;s the single source
            of truth your engineering team uses to instrument analytics — and
            the document your data team uses to know what&apos;s actually being
            captured.
          </p>
          <p style={paragraphStyle}>
            A good plan answers four questions for every event:
          </p>
          <ul style={bulletListStyle}>
            <li style={bulletItemStyle}>
              <span style={bulletDashStyle} />
              <strong>When does it fire?</strong> (e.g., &ldquo;When a user
              successfully publishes a post&rdquo;)
            </li>
            <li style={bulletItemStyle}>
              <span style={bulletDashStyle} />
              <strong>What&apos;s it called?</strong> (e.g.,{' '}
              <code style={monoInlineStyle}>post_published</code>)
            </li>
            <li style={bulletItemStyle}>
              <span style={bulletDashStyle} />
              <strong>What data goes with it?</strong> (e.g.,{' '}
              <code style={monoInlineStyle}>post_id</code>,{' '}
              <code style={monoInlineStyle}>word_count</code>,{' '}
              <code style={monoInlineStyle}>has_cover_image</code>)
            </li>
            <li style={bulletItemStyle}>
              <span style={bulletDashStyle} />
              <strong>What type is each property?</strong> (e.g., string,
              numeric, boolean)
            </li>
          </ul>
          <p style={paragraphStyle}>
            Without a tracking plan, you end up with inconsistent event names,
            missing properties, duplicate instrumentation, and dashboards
            nobody trusts.{' '}
            <strong>Tracking debt compounds faster than tech debt.</strong>
          </p>
        </section>

        <section>
          <h2 style={sectionTitleStyle}>
            Why founders skip tracking plans (and pay for it later)
          </h2>
          <p style={paragraphStyle}>
            Most early-stage founders skip the tracking plan entirely and just
            instrument events as they go. Six months in, they have:
          </p>
          <ul style={bulletListStyle}>
            <li style={bulletItemStyle}>
              <span style={bulletDashStyle} />
              Three different events for &ldquo;user signed up&rdquo; (
              <code style={monoInlineStyle}>signup</code>,{' '}
              <code style={monoInlineStyle}>signup_completed</code>,{' '}
              <code style={monoInlineStyle}>Sign Up</code>)
            </li>
            <li style={bulletItemStyle}>
              <span style={bulletDashStyle} />
              Critical events (like{' '}
              <code style={monoInlineStyle}>payment_failed</code>) not tracked
              at all
            </li>
            <li style={bulletItemStyle}>
              <span style={bulletDashStyle} />
              Funnels that don&apos;t add up because event timing is
              inconsistent
            </li>
            <li style={bulletItemStyle}>
              <span style={bulletDashStyle} />A data warehouse full of garbage
              that takes months to untangle
            </li>
          </ul>
          <p style={paragraphStyle}>
            By the time you realize you need a tracking plan, you&apos;ve
            already shipped a thousand events into production and you&apos;re
            playing catch-up.
          </p>
        </section>

        <section>
          <h2 style={sectionTitleStyle}>What this tool does</h2>
          <p style={paragraphStyle}>
            Once installed in Claude, you give it your product URL and answer
            three quick questions. Then Claude:
          </p>
          <ol style={numberedListStyle}>
            <li style={numberedItemStyle}>
              <span style={numberBadgeStyle}>01</span>
              Opens your product in your real Chrome browser (via the Claude in
              Chrome extension)
            </li>
            <li style={numberedItemStyle}>
              <span style={numberBadgeStyle}>02</span>
              Walks through your authenticated app section by section —
              clicking, exploring, decoding what&apos;s a meaningful event vs.
              what&apos;s noise
            </li>
            <li style={numberedItemStyle}>
              <span style={numberBadgeStyle}>03</span>
              Asks you to sign in when it hits a login wall, then keeps going
            </li>
            <li style={numberedItemStyle}>
              <span style={numberBadgeStyle}>04</span>
              Pauses periodically to show you what it&apos;s logged so far, so
              you can redirect
            </li>
            <li style={numberedItemStyle}>
              <span style={numberBadgeStyle}>05</span>
              Outputs a CSV tracking plan in the standard format you can hand
              to your engineering team
            </li>
          </ol>
        </section>

        <section>
          <h2 style={sectionTitleStyle}>What you get</h2>
          <p style={paragraphStyle}>
            A CSV file with these columns, ready to import or share:
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
                    Column
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
                    'Event',
                    'Plain-English trigger (e.g., "When a user publishes a post")',
                  ],
                  [
                    'Event Name',
                    'Lowercase snake_case event name (e.g., post_published)',
                  ],
                  [
                    'Properties to track',
                    'Property names (e.g., post_id, word_count)',
                  ],
                  ['Property Type', 'Event / Super / Profile'],
                  ['Example Property Values', 'Realistic example value'],
                  [
                    'Data / Property Type',
                    'string / numeric / boolean / array / datetime',
                  ],
                  [
                    'Has this been implemented?',
                    'Empty — for your engineers to fill in',
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
            Rows are grouped by event and ordered to mirror the user journey:
            acquisition → signup → onboarding → core feature events → state
            transitions → engagement → errors.
          </p>
        </section>

        <section>
          <h2 style={sectionTitleStyle}>Installation</h2>
          <div style={calloutStyle}>
            You need <strong>Claude Pro, Max, or Team</strong> (skills
            aren&apos;t available on the free plan), plus the{' '}
            <strong>Claude in Chrome browser extension</strong> installed and
            connected.
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
              you ask Claude to create a tracking plan.
            </li>
          </ol>
        </section>

        <section>
          <h2 style={sectionTitleStyle}>How to use it</h2>
          <p style={paragraphStyle}>
            Start a new chat and say something like:
          </p>
          <blockquote style={blockquoteStyle}>
            &ldquo;I want to create a tracking plan for my product. The URL is{' '}
            <code style={monoInlineStyle}>https://app.yourproduct.com</code> —
            it&apos;s a [one-line description].&rdquo;
          </blockquote>
          <p style={paragraphStyle}>
            Claude will then ask you three questions:
          </p>
          <ol style={numberedListStyle}>
            <li style={numberedItemStyle}>
              <span style={numberBadgeStyle}>01</span>
              <strong>Product context</strong> — who uses it, what&apos;s the
              core &ldquo;aha&rdquo; moment, what&apos;s the monetization
              model. A few sentences is enough; the more context you give, the
              better the event names will be.
            </li>
            <li style={numberedItemStyle}>
              <span style={numberBadgeStyle}>02</span>
              <strong>Detail level</strong> —{' '}
              <code style={monoInlineStyle}>Detailed</code> (every meaningful
              step in multi-step flows) or{' '}
              <code style={monoInlineStyle}>Simple</code> (only the most
              important events). Pick{' '}
              <code style={monoInlineStyle}>Detailed</code> for a first plan if
              you have the engineering bandwidth to instrument it all; pick{' '}
              <code style={monoInlineStyle}>Simple</code> if you want to start
              narrow.
            </li>
            <li style={numberedItemStyle}>
              <span style={numberBadgeStyle}>03</span>
              <strong>Sections to cover</strong> —{' '}
              <code style={monoInlineStyle}>all</code> for the entire
              authenticated product, or list specific sections like{' '}
              <code style={monoInlineStyle}>
                dashboard, billing, store creation
              </code>
              .
            </li>
          </ol>
          <p style={paragraphStyle}>
            Then it starts driving your browser. You&apos;ll see Claude
            navigate, click, scroll, and explore each section in real time.
            When it hits a login screen, it pauses and asks you to sign in.
            When it finishes a section, it pauses and shows you what it&apos;s
            added — you can ask it to remove, rename, or add events before it
            moves on.
          </p>
          <p style={paragraphStyle}>
            The full run typically takes{' '}
            <strong>20–60 minutes</strong>, depending on how complex your
            product is. The CSV is delivered at the end.
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
