import { useState } from 'react';
import { Link } from 'react-router-dom';
import ToolDownloadModal from '../components/ToolDownloadModal';

const tools = [
  { id: 'event-cleanup', title: 'Event Cleanup Assistant', description: 'Upload raw events and get a normalized tracking plan with naming conventions, payload fixes, and missing properties.', cta: 'Try the tool' },
  { id: 'activation-doctor', title: 'Activation Funnel Doctor', description: 'Diagnose drop-offs across onboarding steps and receive prioritized recommendations to improve activation rate.', cta: 'Try the tool' },
  { id: 'cohort-health', title: 'Cohort Health Monitor', description: 'Visualize weekly retention, churn risk, and feature adoption so you can pinpoint the cohorts that need immediate attention.', cta: 'Try the tool' },
];

export default function Tools() {
  const [activeTool, setActiveTool] = useState(null);

  return (
    <>
      <section className="section surface">
        <div className="container">
          <div className="section-header">
            <h2>Tools built by Datalyze</h2>
          </div>
          <div className="tools-grid">
            {tools.map((t) => (
              <article key={t.id} className="tool-card">
                <h3>{t.title}</h3>
                <p>{t.description}</p>
                <div className="tool-footer">
                  <button
                    className="btn primary"
                    onClick={() => setActiveTool(t)}
                  >
                    {t.cta}
                  </button>
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
                Tell us about your analytics workflow and we can build a custom tool tailored to your
                team.
              </p>
            </div>
            <Link className="btn primary" to="/contact">Request a custom tool</Link>
          </div>
        </div>
      </section>

      {activeTool && (
        <ToolDownloadModal
          tool={activeTool}
          onClose={() => setActiveTool(null)}
        />
      )}
    </>
  );
}
