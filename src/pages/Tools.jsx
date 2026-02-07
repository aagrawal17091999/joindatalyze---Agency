import { Link } from 'react-router-dom';

const tools = [
  { id: 'event-cleanup', chip: 'Data quality', status: 'Live', title: 'Event Cleanup Assistant', description: 'Upload raw events and get a normalized tracking plan with naming conventions, payload fixes, and missing properties.', cta: 'Try the tool', meta: '~2 min setup', ghost: false },
  { id: 'activation-doctor', chip: 'Growth', status: 'Live', title: 'Activation Funnel Doctor', description: 'Diagnose drop-offs across onboarding steps and receive prioritized recommendations to improve activation rate.', cta: 'Try the tool', meta: 'Starter dataset included', ghost: false },
  { id: 'cohort-health', chip: 'Retention', status: 'Beta', title: 'Cohort Health Monitor', description: 'Visualize weekly retention, churn risk, and feature adoption so you can pinpoint the cohorts that need immediate attention.', cta: 'Try the tool', meta: 'Beta access', ghost: false },
  { id: 'growth-forecast', chip: 'Forecasting', status: 'Coming soon', title: 'Growth Forecast Builder', description: 'Build a 90-day growth forecast with traffic, conversion, and revenue scenarios you can share with stakeholders.', cta: 'Join the waitlist', meta: 'Launch Q4', ghost: true },
  { id: 'ads-roi', chip: 'Marketing', status: 'Coming soon', title: 'Paid Ads ROI Snapshot', description: 'Combine ad spend and revenue data to get a daily ROI snapshot and budget recommendations.', cta: 'Join the waitlist', meta: 'Launch Q4', ghost: true },
  { id: 'pricing-lab', chip: 'Pricing', status: 'Coming soon', title: 'Pricing Experiment Lab', description: 'Model pricing experiments and understand revenue sensitivity across your plan tiers.', cta: 'Join the waitlist', meta: 'Launch Q1', ghost: true },
];

export default function Tools() {
  return (
    <>
      <section className="section surface">
        <div className="container">
          <div className="section-header">
            <p className="eyebrow">Python tools</p>
            <h1>Analytics tools built by Datalyze</h1>
            <p className="section-lead">
              Explore our growing toolkit of Streamlit-powered analytics utilities. Each tool is
              designed to plug into your growth workflow with clean data and clear actions.
            </p>
          </div>
          <div className="tools-grid">
            {tools.map((t) => (
              <article key={t.id} className="tool-card">
                <div className="tool-header">
                  <span className="tool-chip">{t.chip}</span>
                  <span className="tool-status">{t.status}</span>
                </div>
                <h3>{t.title}</h3>
                <p>{t.description}</p>
                <div className="tool-footer">
                  <Link className={t.ghost ? 'btn ghost' : 'btn primary'} to={`/signup?tool=${t.id}`}>{t.cta}</Link>
                  <span className="tool-meta">{t.meta}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="callout-card tools-callout">
            <div>
              <h2>Want a custom tool?</h2>
              <p>
                Tell us about your analytics workflow and we can build a Streamlit tool tailored to your
                team.
              </p>
            </div>
            <Link className="btn primary" to="/contact">Request a custom tool</Link>
          </div>
        </div>
      </section>
    </>
  );
}
