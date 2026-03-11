import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toolById } from '../data/tools';
import { allQuestions, computeResults } from '../data/maturityGraderData';
import { useMaturityGrader } from '../context/MaturityGraderContext';
import { apiBaseUrl } from '../config';
import mixpanel from '../utils/mixpanel';

const tool = toolById['analytics-maturity-grader'];

export default function MaturityGraderQuiz() {
  const navigate = useNavigate();
  const { setResults } = useMaturityGrader();

  // Email gate state
  const [unlocked, setUnlocked] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const inputRef = useRef(null);

  // Quiz state
  const [answers, setAnswers] = useState({});
  const allAnswered = Object.keys(answers).length === allQuestions.length;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [unlocked]);

  useEffect(() => {
    if (!unlocked) inputRef.current?.focus();
  }, [unlocked]);

  // ---- Email gate submit ----
  const handleEmailSubmit = async (e) => {
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

  // ---- Quiz submit ----
  const handleQuizSubmit = () => {
    if (!allAnswered) return;
    const results = computeResults(answers);
    mixpanel.track('Maturity Grader Submitted', { overall_score: results.overall.score, overall_grade: results.overall.grade });
    setResults(results);
    navigate('/tools/analytics-maturity-grader/results');
  };

  // ---- Select option ----
  const selectOption = (questionId, points) => {
    setAnswers((prev) => ({ ...prev, [questionId]: points }));
  };

  // ========== LOCKED: Email gate ==========
  if (!unlocked) {
    return (
      <>
        <section className="section surface">
          <div className="container">
            <div className="tool-landing">
              <div className="tool-landing-info">
                <h1>How Mature Is Your Analytics Setup?</h1>
                <p className="tool-landing-description">
                  Most startups are flying blind on bad data. Find out where you
                  actually stand — in 2 minutes.
                </p>
                <ul className="tool-landing-features">
                  {tool.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
                <p className="quiz-social-proof">
                  Built by a team that&apos;s audited analytics at 90+ startups
                </p>
              </div>

              <div className="tool-landing-form-wrapper">
                <div className="tool-landing-form-card">
                  <h3>Grade My Analytics</h3>
                  <p>
                    Enter your email to start the quiz — takes less than 2
                    minutes.
                  </p>
                  <form
                    onSubmit={handleEmailSubmit}
                    noValidate
                    className="tool-download-form"
                  >
                    <label
                      htmlFor="grader-email"
                      className="tool-download-label"
                    >
                      Email address
                    </label>
                    <input
                      ref={inputRef}
                      id="grader-email"
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
                      {status === 'loading'
                        ? 'Starting\u2026'
                        : 'Grade My Analytics'}
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
              <Link className="btn primary" to="/contact" onClick={() => mixpanel.track('CTA Clicked', { cta_text: 'Request a custom tool', location: 'maturity_grader_quiz' })}>
                Request a custom tool
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  // ========== UNLOCKED: Quiz ==========
  return (
    <section className="section surface">
      <div className="container">
        <div className="section-header">
          <h1>Analytics Maturity Grader</h1>
          <p className="section-lead">
            Answer all 10 questions below, then see your personalized scorecard.
          </p>
        </div>

        <div className="quiz-questions">
          {allQuestions.map((q, idx) => (
            <div key={q.id} className="quiz-question-card">
              <p className="quiz-question-number">Question {idx + 1}</p>
              <h3 className="quiz-question-text">{q.text}</h3>
              <div className="quiz-options-grid">
                {q.options.map((opt) => {
                  const isSelected = answers[q.id] === opt.points;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      className={`quiz-option${isSelected ? ' selected' : ''}`}
                      onClick={() => selectOption(q.id, opt.points)}
                    >
                      <span className="quiz-option-label">{opt.label}</span>
                      <span className="quiz-option-text">{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="quiz-submit-bar">
          <button
            type="button"
            className="btn primary"
            disabled={!allAnswered}
            onClick={handleQuizSubmit}
          >
            See My Results
          </button>
        </div>
      </div>
    </section>
  );
}
