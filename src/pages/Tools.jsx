import { Link } from 'react-router-dom';
import { toolList } from '../data/tools';
import mixpanel from '../utils/mixpanel';
import SEO from '../components/SEO';

export default function Tools() {
  return (
    <>
      <SEO
        title="Tools"
        description="Free analytics tools built by Datalyze. Export Mixpanel data, grade your analytics maturity, and more."
        path="/tools"
      />
      <section className="section surface">
        <div className="container">
          <div className="section-header">
            <h2>Tools built by Datalyze</h2>
          </div>
          <div className="tools-grid">
            {toolList.map((t) => (
              <article key={t.id} className="tool-card">
                <h3>{t.title}</h3>
                <p>{t.description}</p>
                <div className="tool-footer">
                  <Link className="btn primary" to={`/tools/${t.id}`} onClick={() => mixpanel.track('Tool Clicked', { tool_name: t.title, tool_id: t.id })}>
                    {t.cta}
                  </Link>
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
            <Link className="btn primary" to="/contact" onClick={() => mixpanel.track('CTA Clicked', { cta_text: 'Request a custom tool', location: 'tools_page' })}>Request a custom tool</Link>
          </div>
        </div>
      </section>
    </>
  );
}
