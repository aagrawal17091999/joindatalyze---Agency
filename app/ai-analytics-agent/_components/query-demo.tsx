'use client';

import { useEffect, useRef } from 'react';

const QUESTION =
  'What was our paid conversion rate in Germany last week, and how does it compare to the rest of EU?';

export default function QueryDemo() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const typedEl = root.querySelector<HTMLElement>('.query-demo__typed');
    const responseEl = root.querySelector<HTMLElement>('.query-demo__response');
    if (!typedEl || !responseEl) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (prefersReduced) {
      typedEl.textContent = QUESTION;
      responseEl.classList.add('is-visible');
      return;
    }

    let cancelled = false;

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => setTimeout(resolve, ms));

    const run = async () => {
      while (!cancelled) {
        typedEl.textContent = '';
        responseEl.classList.remove('is-visible');
        await sleep(800);
        if (cancelled) return;

        for (let i = 0; i <= QUESTION.length; i++) {
          if (cancelled) return;
          typedEl.textContent = QUESTION.slice(0, i);
          await sleep(35);
        }

        await sleep(600);
        if (cancelled) return;

        responseEl.classList.add('is-visible');
        await sleep(5000);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div ref={rootRef} className="query-demo" aria-hidden="true">
      <div className="query-demo__header">
        <div className="query-demo__dot" />
        <div className="query-demo__dot" />
        <div className="query-demo__dot" />
        <span className="query-demo__title">
          datalyze · ai analytics agent
        </span>
      </div>
      <div className="query-demo__body">
        <div className="query-demo__question">
          <span className="query-demo__prompt">›</span>
          <span className="query-demo__typed" />
          <span className="query-demo__cursor">▍</span>
        </div>
        <div className="query-demo__response">
          <div className="query-demo__metric">
            <span className="query-demo__metric-label">
              Germany · Last 7 days
            </span>
            <span className="query-demo__metric-value">3.84%</span>
          </div>
          <div className="query-demo__metric">
            <span className="query-demo__metric-label">EU avg (excl. DE)</span>
            <span className="query-demo__metric-value">2.91%</span>
          </div>
          <p className="query-demo__note">
            Germany is converting 32% above EU average, driven primarily by
            paid search. The lift started around Tuesday.
          </p>
        </div>
      </div>
    </div>
  );
}
