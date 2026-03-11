import { useRef, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useMaturityGrader } from '../context/MaturityGraderContext';
import html2canvas from 'html2canvas';

export default function MaturityGraderResults() {
  const { results } = useMaturityGrader();
  const scorecardRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Redirect if no results (direct URL access)
  if (!results) {
    return <Navigate to="/tools/analytics-maturity-grader" replace />;
  }

  const { overall, dimensions } = results;

  const handleShare = async () => {
    if (!scorecardRef.current) return;
    try {
      const canvas = await html2canvas(scorecardRef.current, {
        backgroundColor: '#0a0a0a',
        scale: 2,
      });
      const link = document.createElement('a');
      link.download = 'analytics-maturity-scorecard.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch {
      // Silently fail — user can screenshot instead
    }
  };

  return (
    <>
      {/* ===== Hero: Overall Grade ===== */}
      <section className="section surface">
        <div className="container">
          <div className="results-hero">
            <p className="results-hero-label">Your Analytics Maturity Grade</p>
            <div
              className="grade-circle"
              style={{ borderColor: overall.color, color: overall.color }}
            >
              {overall.grade}
            </div>
            <p className="results-hero-tag" style={{ color: overall.color }}>
              {overall.label}
            </p>
            <p className="results-hero-score">
              {overall.score} / {overall.max}
            </p>
          </div>

          {/* ===== Dimension Breakdown ===== */}
          <div className="dimension-cards">
            {dimensions.map((dim) => {
              const pct = Math.round((dim.score / dim.max) * 100);
              return (
                <div key={dim.id} className="dimension-card">
                  <div className="dimension-card-header">
                    <h3 className="dimension-card-title">{dim.label}</h3>
                    <span
                      className="dimension-grade-badge"
                      style={{ backgroundColor: dim.color }}
                    >
                      {dim.grade}
                    </span>
                  </div>

                  <div className="dimension-bar-track">
                    <div
                      className="dimension-bar-fill"
                      style={{ width: `${pct}%`, backgroundColor: dim.color }}
                    />
                  </div>
                  <p className="dimension-score-label">
                    {dim.score} / {dim.max}
                  </p>

                  {dim.recommendation && (
                    <div
                      className="dimension-recommendation"
                      style={{ borderLeftColor: dim.color }}
                    >
                      <p className="dimension-recommendation-heading">
                        Do This First
                      </p>
                      <p>{dim.recommendation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ===== Share Button ===== */}
          <div className="results-share-bar">
            <button
              type="button"
              className="btn primary"
              onClick={handleShare}
            >
              Download Scorecard
            </button>
          </div>
        </div>
      </section>

      {/* ===== Shareable Scorecard (captured by html2canvas) ===== */}
      <div className="scorecard-capture-wrapper" aria-hidden="true">
        <div ref={scorecardRef} className="scorecard-capture">
          <p className="scorecard-capture-title">Analytics Maturity Scorecard</p>
          <div className="scorecard-capture-overall">
            <span className="scorecard-capture-overall-grade" style={{ color: overall.color }}>
              {overall.grade}
            </span>
            <span className="scorecard-capture-overall-score">
              {overall.score} / {overall.max}
            </span>
          </div>
          <table className="scorecard-capture-table">
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Dimension</th>
                <th>Grade</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {dimensions.map((dim) => (
                <tr key={dim.id}>
                  <td style={{ textAlign: 'left' }}>{dim.label}</td>
                  <td style={{ color: dim.color, fontWeight: 700 }}>
                    {dim.grade}
                  </td>
                  <td>{dim.score} / {dim.max}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="scorecard-capture-watermark">joindatalyze.com</p>
        </div>
      </div>

      {/* ===== CTA ===== */}
      <section className="section">
        <div className="container">
          <div className="callout-card tools-callout">
            <div>
              <h2>Want to fix this?</h2>
              <p>
                Book a free analytics audit with Datalyze — we&apos;ll help you
                close the gaps and build a data practice you can trust.
              </p>
            </div>
            <Link className="btn primary" to="/contact">
              Book a free audit
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
