'use client';

import { useEffect, useRef } from 'react';
import type { PainScene } from '@/lib/data/home-pain-scenes';

type Props = {
  scenes: PainScene[];
};

export default function PainScenes({ scenes }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const elements = container.querySelectorAll<HTMLElement>('.scene');
    if (!elements.length) return;

    // Show all immediately if user prefers reduced motion.
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
    <div ref={containerRef} className="pain__scenes">
      {scenes.map((scene) => (
        <article key={scene.number} className="scene">
          <div className="scene__number">
            {scene.number} / {scene.label}
          </div>
          <h3 className="scene__title">{scene.title}</h3>
          <p className="scene__body">{scene.body}</p>
          <div className="scene__cost">
            <span className="scene__cost-label">Real cost</span>
            <span className="scene__cost-value">{scene.costValue}</span>
          </div>
        </article>
      ))}
    </div>
  );
}
