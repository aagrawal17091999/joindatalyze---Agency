import { useState } from 'react';
import { Link } from 'react-router-dom';
import ToolDownloadModal from '../components/ToolDownloadModal';

const tools = [
  { id: 'mixpanel-exporter', title: 'Mixpanel Event Exporter', description: 'Download raw Mixpanel data from your project in a CSV.', cta: 'Try the tool' },
  { id: 'mixpanel-users-exporter', title: 'Mixpanel Users Exporter', description: 'Download raw Mixpanel user profile data from your project in a CSV.', cta: 'Try the tool' },
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
