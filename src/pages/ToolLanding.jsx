import { useParams, Link } from 'react-router-dom';
import { toolById } from '../data/tools';
import ToolDownloadForm from '../components/ToolDownloadForm';

export default function ToolLanding() {
  const { toolId } = useParams();
  const tool = toolId ? toolById[toolId] : null;

  if (!tool) {
    return (
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Tool not found</h2>
            <p className="section-lead">
              This tool could not be found.{' '}
              <Link to="/tools">Browse all tools</Link>
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="section surface">
        <div className="container">
          <div className="tool-landing">
            <div className="tool-landing-info">
              <h1>{tool.title}</h1>
              <p className="tool-landing-description">{tool.longDescription}</p>
              {tool.features && (
                <ul className="tool-landing-features">
                  {tool.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              )}
              {tool.fileType && (
                <p className="tool-landing-filetype">Format: {tool.fileType}</p>
              )}
            </div>

            <div className="tool-landing-form-wrapper">
              <div className="tool-landing-form-card">
                <h3>Get the {tool.title}</h3>
                <p>Enter your email and we&apos;ll start the download immediately.</p>
                <ToolDownloadForm tool={tool} autoFocus />
              </div>
            </div>
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
    </>
  );
}
