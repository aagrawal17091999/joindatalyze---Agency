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

export default function SignUp() {
  const [searchParams] = useSearchParams();
  const toolId = searchParams.get('tool');
  const toolMeta = toolId && toolConfig[toolId] ? toolConfig[toolId] : null;
  const toolName = toolMeta ? toolMeta.name : 'Datalyze tools';
  const toolQuery = toolId ? `?tool=${toolId}` : '';

  const { signUp, syncUserToBackend, postEvent } = useAuth();
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
    setStatus({ message: 'Creating your account…', type: 'info' });
    try {
      const result = await signUp(email, password);
      await syncUserToBackend(result.user);
      await postEvent('signup', result.user, { toolId, toolName: toolMeta?.name });
      setStatus({ message: 'Account created. Taking you home…', type: 'success' });
      setTimeout(redirectAfterAuth, 1200);
    } catch (error) {
      setStatus({ message: error.message || 'Unable to create account. Try again.', type: 'error' });
      setLoading(false);
    }
  };

  return (
    <section className="section auth-section">
      <div className="container auth-shell">
        <div className="auth-card auth-card--signup">
          <p className="auth-eyebrow">ACCOUNT ACCESS</p>
          <h1 className="auth-title">Create your account</h1>
          <p className="auth-subtitle">Accessing <span className="auth-subtitle-name">{toolName}</span></p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label" htmlFor="signup-full-name">Full Name</label>
              <input
                className="auth-input"
                id="signup-full-name"
                type="text"
                name="fullName"
                autoComplete="name"
                placeholder="John Doe"
                required
              />
            </div>
            <div className="auth-field">
              <label className="auth-label" htmlFor="signup-email">Email address</label>
              <input
                className="auth-input"
                id="signup-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@company.com"
                required
              />
            </div>
            <div className="auth-field">
              <label className="auth-label" htmlFor="signup-password">Password</label>
              <input
                className="auth-input"
                id="signup-password"
                type="password"
                name="password"
                autoComplete="new-password"
                placeholder="••••••••"
                required
              />
            </div>
            {status.message && (
              <div id="auth-status" className="auth-status" role="status" aria-live="polite" data-state={status.type}>
                {status.message}
              </div>
            )}
            <button className="btn auth-cta" type="submit" disabled={loading}>Create account</button>
            <p className="auth-switch">
              Already have an account? <Link to={`/signin${toolQuery}`}>Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
