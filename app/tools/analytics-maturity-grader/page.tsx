'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { track, identify } from '@/lib/mixpanel';
import { toolById } from '@/lib/data/tools';
import {
  allQuestions,
  computeResults,
  type Answers,
} from '@/lib/data/maturity-grader-data';

const tool = toolById['analytics-maturity-grader'];
const RESULTS_KEY = 'datalyze:maturity-results';

type Status = 'idle' | 'loading' | 'error';

export default function MaturityGraderQuizPage() {
  const router = useRouter();

  const [unlocked, setUnlocked] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const [answers, setAnswers] = useState<Answers>({});
  const allAnswered = Object.keys(answers).length === allQuestions.length;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [unlocked]);

  useEffect(() => {
    if (!unlocked) inputRef.current?.focus();
  }, [unlocked]);

  const handleEmailSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/tool-downloads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed, toolId: tool.id }),
      });

      const data = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) {
        setErrorMsg(data.error || 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }

      identify(trimmed);
      track('Email Submitted', { tool_id: tool.id, email: trimmed });
      setStatus('idle');
      setUnlocked(true);
    } catch {
      setErrorMsg(
        'Network error. Please check your connection and try again.',
      );
      setStatus('error');
    }
  };

  const handleQuizSubmit = () => {
    if (!allAnswered) return;
    const results = computeResults(answers);
    track('Maturity Grader Submitted', {
      overall_score: results.overall.score,
      overall_grade: results.overall.grade,
    });
    sessionStorage.setItem(RESULTS_KEY, JSON.stringify(results));
    router.push('/tools/analytics-maturity-grader/results');
  };

  const selectOption = (questionId: string, points: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: points }));
  };

  if (!unlocked) {
    return (
      <div className="page-shell">
        <div className="container">
          <header className="page-header">
            <div className="eyebrow">Analytics Maturity Grader</div>
            <h1 className="page-header__title">
              How mature is your analytics setup?
            </h1>
            <p className="page-header__intro">
              Most startups are flying blind on bad data. Find out where you
              actually stand — in 2 minutes.
            </p>
          </header>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.4fr) minmax(320px, 1fr)',
              gap: 'var(--space-8)',
              alignItems: 'start',
            }}
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
                What you&apos;ll get
              </h2>
              <ul
                style={{
                  marginTop: 'var(--space-4)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-3)',
                  color: 'var(--text-secondary)',
                }}
              >
                {tool.features.map((f) => (
                  <li
                    key={f}
                    style={{
                      position: 'relative',
                      paddingLeft: 'var(--space-5)',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: '0.75em',
                        width: 8,
                        height: 1,
                        background: 'var(--accent)',
                      }}
                    />
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
                Built by a team that&apos;s audited analytics at 150+ startups
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
                Grade my analytics
              </h3>
              <p
                style={{
                  marginTop: 'var(--space-3)',
                  color: 'var(--text-secondary)',
                  marginBottom: 'var(--space-5)',
                }}
              >
                Enter your email to start the quiz — takes less than 2 minutes.
              </p>
              <form
                onSubmit={handleEmailSubmit}
                noValidate
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-4)',
                }}
              >
                <div className="form-field">
                  <label htmlFor="grader-email" className="form-label">
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
                    className="form-input"
                  />
                </div>
                {status === 'error' ? (
                  <p className="form-error">{errorMsg}</p>
                ) : null}
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={status === 'loading'}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {status === 'loading' ? 'Starting…' : 'Grade my analytics'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="container">
        <header className="page-header">
          <div className="eyebrow">Analytics Maturity Grader</div>
          <h1 className="page-header__title">
            Answer 10 questions. See your scorecard.
          </h1>
          <p className="page-header__intro">
            Be honest — the point is to see where the real gaps are.
          </p>
        </header>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-8)',
          }}
        >
          {allQuestions.map((q, idx) => (
            <article
              key={q.id}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-6)',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: 11,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                }}
              >
                Question {idx + 1} of {allQuestions.length}
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-display), serif',
                  fontSize: 24,
                  fontWeight: 400,
                  color: 'var(--text-primary)',
                  marginTop: 'var(--space-3)',
                  marginBottom: 'var(--space-5)',
                }}
              >
                {q.text}
              </h3>
              <div
                style={{
                  display: 'grid',
                  gap: 'var(--space-3)',
                }}
              >
                {q.options.map((opt) => {
                  const isSelected = answers[q.id] === opt.points;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => selectOption(q.id, opt.points)}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 'var(--space-4)',
                        padding: 'var(--space-4) var(--space-5)',
                        background: isSelected
                          ? 'var(--accent-muted)'
                          : 'var(--bg-base)',
                        border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border-default)'}`,
                        borderRadius: 'var(--radius-sm)',
                        textAlign: 'left',
                        color: isSelected
                          ? 'var(--text-primary)'
                          : 'var(--text-secondary)',
                        fontFamily: 'var(--font-body), sans-serif',
                        fontSize: 15,
                        lineHeight: 1.55,
                        transition: 'all var(--duration-base) var(--ease-out)',
                        cursor: 'pointer',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-mono), monospace',
                          fontSize: 12,
                          color: 'var(--accent)',
                          fontWeight: 500,
                          flexShrink: 0,
                          marginTop: 2,
                        }}
                      >
                        {opt.label}
                      </span>
                      <span>{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            </article>
          ))}
        </div>

        <div
          style={{
            marginTop: 'var(--space-8)',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <button
            type="button"
            className="btn-primary"
            disabled={!allAnswered}
            onClick={handleQuizSubmit}
            style={{
              padding: '20px 32px',
              fontSize: 16,
              opacity: allAnswered ? 1 : 0.5,
              cursor: allAnswered ? 'pointer' : 'not-allowed',
            }}
          >
            See my results
          </button>
        </div>
      </div>
    </div>
  );
}
