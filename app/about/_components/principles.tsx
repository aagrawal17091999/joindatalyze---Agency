'use client';

import { useEffect, useRef } from 'react';

const PRINCIPLES = [
  {
    number: '01',
    title: 'We start with the foundation, not the dashboards',
    body: 'Most analytics engagements start by building reports on top of broken data. We start by fixing the data - instrumentation, pipelines, definitions, models - because every dashboard built on bad inputs is a dashboard that lies to you. By the time we get to reporting, the numbers actually mean something.',
  },
  {
    number: '02',
    title: 'We measure what we ship',
    body: 'Every fix, every recommendation, every experiment gets tracked against revenue impact. That\u2019s how the 14% average across 150+ engagements gets earned, engagement by engagement. If something doesn\u2019t move the number, we tell you and try a different approach. We don\u2019t hide behind "deliverables."',
  },
  {
    number: '03',
    title: 'Senior operators only. No middle layer.',
    body: 'You don\u2019t get an account manager who routes messages to a junior analyst. You get the people who are actually in your data every day, fixing the problems and finding the answers. We\u2019ve kept the team small on purpose. Growth would mean hiring people who\u2019ve done this less - and that\u2019s a tradeoff we\u2019re not interested in making.',
  },
  {
    number: '04',
    title: 'We go beyond the SOW',
    body: 'When we find something outside the original scope that\u2019s costing you revenue, we fix it. You hired us to make your data work - that\u2019s what we do, even when it means doing more than the contract says. Most agencies hand you a change order. We hand you a fix.',
  },
];

export default function Principles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const elements = container.querySelectorAll<HTMLElement>('.principle');
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
    <section className="principles" id="principles">
      <div className="container">
        <header className="principles__header">
          <div className="eyebrow eyebrow--center">How We Work</div>
          <h2 className="principles__title">
            Four things we believe about data and growth
          </h2>
          <p className="principles__intro">
            Every engagement is built on these. When something goes wrong,
            it&apos;s usually because one of them got skipped.
          </p>
        </header>

        <div ref={containerRef} className="principles__list">
          {PRINCIPLES.map((principle) => (
            <article key={principle.number} className="principle">
              <div className="principle__number">{principle.number}</div>
              <h3 className="principle__title">{principle.title}</h3>
              <p className="principle__body">{principle.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
