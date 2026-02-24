import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const toolConfig = {
  'event-cleanup': { name: 'Event Cleanup Assistant' },
  'activation-doctor': { name: 'Activation Funnel Doctor' },
  'cohort-health': { name: 'Cohort Health Monitor' },
  'growth-forecast': { name: 'Growth Forecast Builder' },
  'ads-roi': { name: 'Paid Ads ROI Snapshot' },
  'pricing-lab': { name: 'Pricing Experiment Lab' },
};

export default function SignIn() {
  const [searchParams] = useSearchParams();
  const toolId = searchParams.get('tool');
  const toolMeta = toolId && toolConfig[toolId] ? toolConfig[toolId] : null;
  const toolName = toolMeta ? toolMeta.name : 'Datalyze tools';
  const toolQuery = toolId ? `?tool=${toolId}` : '';

  const { signIn, syncUserToBackend, postEvent } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState({ message: '', type: 'info' });
  const [loading, setLoading] = useState(false);

  const redirectAfterAuth = () => {
    if (toolMeta?.url) {
      window.location.href = toolMeta.url;
      return;
    }
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    setLoading(true);
    setStatus({ message: 'Signing you in…', type: 'info' });
    try {
      const result = await signIn(email, password);
      await syncUserToBackend(result.user);
      await postEvent('login', result.user, { toolId, toolName: toolMeta?.name });
      setStatus({ message: 'Signed in. Taking you home…', type: 'success' });
      setTimeout(redirectAfterAuth, 1200);
    } catch (error) {
      setStatus({ message: error.message || 'Unable to sign in. Try again.', type: 'error' });
      setLoading(false);
    }
  };

  return (
    <section className="section">
      <div className="container auth-shell">
        <div className="auth-card">
          <div className="auth-logo" aria-hidden="true">
            <span></span>
          </div>
          <p className="eyebrow">Account access</p>
          <h1>Sign in to your account</h1>
          <p className="section-lead">
            Access Datalyze tools with your email and password.
          </p>
          <p className="tool-access-note">
            Accessing <span className="tool-access-name">{toolName}</span>
          </p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label" htmlFor="signin-email">Email address</label>
              <input
                className="auth-input"
                id="signin-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@company.com"
                required
              />
            </div>
            <div className="auth-field">
              <label className="auth-label" htmlFor="signin-password">Password</label>
              <input
                className="auth-input"
                id="signin-password"
                type="password"
                name="password"
                autoComplete="current-password"
                required
              />
            </div>
            {status.message && (
              <div className="auth-status" role="status" aria-live="polite" data-state={status.type}>
                {status.message}
              </div>
            )}
            <button className="btn auth-cta" type="submit" disabled={loading}>Sign in</button>
            <p className="auth-switch">
              New to Datalyze? <Link to={`/signup${toolQuery}`}>Create an account</Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
