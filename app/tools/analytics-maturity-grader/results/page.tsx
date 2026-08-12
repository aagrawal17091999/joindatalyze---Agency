'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { track } from '@/lib/mixpanel';
import type { Results } from '@/lib/data/maturity-grader-data';
import CtaButton from '@/app/_components/cta-button';

const RESULTS_KEY = 'datalyze:maturity-results';

export default function MaturityGraderResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<Results | null>(null);
  const scorecardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const raw = sessionStorage.getItem(RESULTS_KEY);
    if (!raw) {
      router.replace('/tools/analytics-maturity-grader');
      return;
    }
    try {
      setResults(JSON.parse(raw) as Results);
    } catch {
      router.replace('/tools/analytics-maturity-grader');
    }
  }, [router]);

  const handleShare = async () => {
    if (!scorecardRef.current || !results) return;
    const html2canvas = (await import('html2canvas')).default;
    try {
      const canvas = await html2canvas(scorecardRef.current, {
        backgroundColor: '#0a0a0b',
        scale: 2,
      });
      const link = document.createElement('a');
      link.download = 'analytics-maturity-scorecard.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      track('Maturity Scorecard Downloaded', {
        overall_grade: results.overall.grade,
        overall_score: results.overall.score,
      });
    } catch {
      // Silently fail - user can screenshot instead
    }
  };

  if (!results) {
    return null;
  }

  const { overall, dimensions } = results;

  return (
    <div className="page-shell">
      <div className="container">
        <header className="page-header page-header--center">
          <div className="eyebrow eyebrow--center">Your Results</div>
          <h1 className="page-header__title">Analytics Maturity Grade</h1>
        </header>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-4)',
            marginBottom: 'var(--space-10)',
          }}
        >
          <div
            style={{
              width: 180,
              height: 180,
              borderRadius: '50%',
              border: `4px solid ${overall.color}`,
              color: overall.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-display), serif',
              fontSize: 96,
              lineHeight: 1,
              letterSpacing: '-0.04em',
              boxShadow: `0 0 32px ${overall.color}33`,
            }}
          >
            {overall.grade}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 14,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: overall.color,
            }}
          >
            {overall.label}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 18,
              color: 'var(--text-muted)',
            }}
          >
            {overall.score} / {overall.max}
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'var(--space-5)',
          }}
        >
          {dimensions.map((dim) => {
            const pct = Math.round((dim.score / dim.max) * 100);
            return (
              <article
                key={dim.id}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-6)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-4)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 'var(--space-3)',
                  }}
                >
                  <h3
                    style={{
                      fontFamily: 'var(--font-display), serif',
                      fontSize: 20,
                      fontWeight: 400,
                      color: 'var(--text-primary)',
                    }}
                  >
                    {dim.label}
                  </h3>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: 13,
                      fontWeight: 500,
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: dim.color,
                      color: 'var(--text-inverse)',
                    }}
                  >
                    {dim.grade}
                  </span>
                </div>

                <div
                  style={{
                    height: 4,
                    background: 'var(--border-subtle)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${pct}%`,
                      height: '100%',
                      background: dim.color,
                      transition: 'width var(--duration-slow) var(--ease-out)',
                    }}
                  />
                </div>

                <div
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: 12,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                  }}
                >
                  {dim.score} / {dim.max}
                </div>

                {dim.recommendation ? (
                  <div
                    style={{
                      paddingLeft: 'var(--space-4)',
                      borderLeft: `2px solid ${dim.color}`,
                      marginTop: 'auto',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--font-mono), monospace',
                        fontSize: 10,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        color: 'var(--text-muted)',
                        marginBottom: 'var(--space-2)',
                      }}
                    >
                      Do this first
                    </div>
                    <p
                      style={{
                        fontSize: 14,
                        color: 'var(--text-secondary)',
                        lineHeight: 1.55,
                      }}
                    >
                      {dim.recommendation}
                    </p>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'var(--space-4)',
            marginTop: 'var(--space-10)',
            flexWrap: 'wrap',
          }}
        >
          <button
            type="button"
            className="btn-secondary"
            onClick={handleShare}
          >
            Download scorecard
          </button>
          <CtaButton
            href="/contact"
            location="maturity_grader_results"
          >
            Book a free audit
          </CtaButton>
        </div>

        {/* Offscreen scorecard for html2canvas */}
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            left: -9999,
            top: -9999,
            pointerEvents: 'none',
          }}
        >
          <div
            ref={scorecardRef}
            style={{
              width: 720,
              padding: 48,
              background: '#0a0a0b',
              color: '#fafaf9',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            <p
              style={{
                fontSize: 14,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#8f8f97',
                marginBottom: 16,
              }}
            >
              Analytics Maturity Scorecard
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 24,
                marginBottom: 32,
                paddingBottom: 24,
                borderBottom: '1px solid #26262c',
              }}
            >
              <span
                style={{
                  fontSize: 96,
                  fontWeight: 700,
                  color: overall.color,
                  lineHeight: 1,
                }}
              >
                {overall.grade}
              </span>
              <span style={{ fontSize: 20, color: '#c4c4cb' }}>
                {overall.score} / {overall.max}
              </span>
            </div>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: 14,
              }}
            >
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', paddingBottom: 12 }}>
                    Dimension
                  </th>
                  <th style={{ paddingBottom: 12 }}>Grade</th>
                  <th style={{ paddingBottom: 12 }}>Score</th>
                </tr>
              </thead>
              <tbody>
                {dimensions.map((dim) => (
                  <tr key={dim.id}>
                    <td
                      style={{
                        textAlign: 'left',
                        padding: '8px 0',
                        color: '#fafaf9',
                      }}
                    >
                      {dim.label}
                    </td>
                    <td
                      style={{
                        padding: '8px 0',
                        color: dim.color,
                        fontWeight: 700,
                        textAlign: 'center',
                      }}
                    >
                      {dim.grade}
                    </td>
                    <td
                      style={{
                        padding: '8px 0',
                        color: '#c4c4cb',
                        textAlign: 'center',
                      }}
                    >
                      {dim.score} / {dim.max}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ marginTop: 32, color: '#8f8f97', fontSize: 12 }}>
              joindatalyze.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
