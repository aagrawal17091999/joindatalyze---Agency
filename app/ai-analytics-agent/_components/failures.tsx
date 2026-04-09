'use client';

import { useEffect, useRef } from 'react';

type Failure = {
  number: string;
  label: string;
  title: string;
  body: string;
  problem: string;
};

const FAILURES: Failure[] = [
  {
    number: '01',
    label: 'Hallucination',
    title: 'It hallucinates numbers that look right',
    body: "You ask it for last month's MRR. It returns a number. The number sounds reasonable. You paste it into a board update. Three days later, finance pulls the same metric and gets something different. Turns out the AI joined the wrong tables, used a stale event, and confidently invented a number that was off by 18%. The worst part is you didn't know to question it.",
    problem:
      'No validation layer. The model doesn\u2019t know what "MRR" actually means in your business — only what it looks like in random examples from its training data.',
  },
  {
    number: '02',
    label: 'Wrong Questions',
    title: "It can't answer the questions that matter",
    body: 'Your team asks: "Why did paid conversion drop in the EU last week?" The AI either says "I don\u2019t have enough information," or it generates a SQL query against the wrong table and returns a number that\u2019s technically correct but answers a completely different question.',
    problem:
      'No business context. The agent has no idea which table holds the right version of the data, what "paid conversion" means in your funnel, or how to think about geography in your schema.',
  },
  {
    number: '03',
    label: 'Abandonment',
    title: 'It works for two weeks, then your team stops using it',
    body: "Onboarding goes well. The first few queries land. Then the team hits the third or fourth wrong answer in a row — and just goes back to asking the analyst directly. Six months later, the tool is still in your stack, and nobody\u2019s logged in since March.",
    problem:
      'No feedback loop. Nobody validated the answers in the early weeks, nobody refined the knowledge base when the model got it wrong, and trust eroded faster than the team had patience for.',
  },
];

export default function Failures() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const elements = container.querySelectorAll<HTMLElement>('.failure');
    if (!elements.length) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReduced) {
      elements.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 },
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="failures" id="failures">
      <div className="container">
        <div className="failures__grid">
          <header className="failures__header">
            <div className="eyebrow">Why It Fails</div>
            <h2 className="failures__title">
              You&apos;ve probably tried this already.
              <br />
              <em>Here&apos;s why it didn&apos;t work.</em>
            </h2>
            <p className="failures__subhead">
              Every &ldquo;AI analyst&rdquo; demo looks magical for the first
              ten minutes. Then someone asks a real question, and the wheels
              come off.
            </p>
          </header>

          <div ref={containerRef} className="failures__list">
            {FAILURES.map((failure) => (
              <article key={failure.number} className="failure">
                <div className="failure__number">
                  {failure.number} / {failure.label}
                </div>
                <h3 className="failure__title">{failure.title}</h3>
                <p className="failure__body">{failure.body}</p>
                <div className="failure__problem">
                  <span className="failure__problem-label">Real Problem</span>
                  <p className="failure__problem-text">{failure.problem}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
