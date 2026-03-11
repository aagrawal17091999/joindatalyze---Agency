import { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toolById } from '../data/tools';
import { apiBaseUrl } from '../config';
import mixpanel from '../utils/mixpanel';

export default function WebToolLanding() {
  const { toolId } = useParams();
  const tool = toolId ? toolById[toolId] : null;
  const [unlocked, setUnlocked] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      const base = apiBaseUrl || '';
      const res = await fetch(`${base}/api/tool-downloads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), toolId: tool.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg =
          data?.details?.[0]?.message ||
          data?.error ||
          'Something went wrong. Please try again.';
        setErrorMsg(msg);
        setStatus('error');
        return;
      }

      mixpanel.identify(email.trim());
      mixpanel.people.set({ $email: email.trim() });
      mixpanel.track('Email Submitted', { tool_id: tool.id, email: email.trim() });
      setStatus('success');
      setUnlocked(true);
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.');
      setStatus('error');
    }
  };

  if (unlocked) {
    return (
      <>
        <section className="section surface">
          <div className="container">
            <div className="section-header">
              <h1>{tool.title}</h1>
              <p className="section-lead">{tool.longDescription}</p>
            </div>

            {/* ---- Tool content goes here ---- */}
            <div className="web-tool-content">
              <div className="web-tool-placeholder">
                <p>Tool content goes here.</p>
                <p>Replace this placeholder with the actual tool interface.</p>
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
                  Tell us about your analytics workflow and we can build a custom
                  tool tailored to your team.
                </p>
              </div>
              <Link className="btn primary" to="/contact" onClick={() => mixpanel.track('CTA Clicked', { cta_text: 'Request a custom tool', location: 'web_tool_landing_page' })}>
                Request a custom tool
              </Link>
            </div>
          </div>
        </section>
      </>
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
            </div>

            <div className="tool-landing-form-wrapper">
              <div className="tool-landing-form-card">
                <h3>Access {tool.title}</h3>
                <p>Enter your email to use the tool instantly — no download required.</p>
                <form onSubmit={handleSubmit} noValidate className="tool-download-form">
                  <label htmlFor="tool-email" className="tool-download-label">
                    Email address
                  </label>
                  <input
                    ref={inputRef}
                    id="tool-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                    disabled={status === 'loading'}
                    className="tool-download-input"
                  />

                  {status === 'error' && (
                    <p className="tool-download-error">{errorMsg}</p>
                  )}

                  <button
                    type="submit"
                    className="btn primary"
                    disabled={status === 'loading'}
                    style={{ width: '100%' }}
                  >
                    {status === 'loading' ? 'Unlocking\u2026' : 'Get instant access'}
                  </button>
                </form>
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
                Tell us about your analytics workflow and we can build a custom
                tool tailored to your team.
              </p>
            </div>
            <Link className="btn primary" to="/contact">
              Request a custom tool
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
