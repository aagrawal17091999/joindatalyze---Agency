'use client';

import { useEffect, useRef, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function MethodScroll({ children }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const stepsEl = wrapper.querySelector<HTMLElement>('.method__steps');
    if (!stepsEl) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReduced) {
      stepsEl.style.setProperty('--scroll-progress', '1');
      stepsEl.querySelectorAll('.method-step').forEach((s) =>
        s.classList.add('is-active'),
      );
      return;
    }

    const stepEls = Array.from(
      stepsEl.querySelectorAll<HTMLElement>('.method-step'),
    );

    const update = () => {
      const rect = stepsEl.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const start = viewportH * 0.6;
      const end = -rect.height + viewportH * 0.4;
      const progress = Math.max(
        0,
        Math.min(1, (start - rect.top) / (start - end)),
      );
      stepsEl.style.setProperty('--scroll-progress', String(progress));

      stepEls.forEach((step) => {
        const stepRect = step.getBoundingClientRect();
        if (stepRect.top < viewportH * 0.5) {
          step.classList.add('is-active');
        } else {
          step.classList.remove('is-active');
        }
      });
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return <div ref={wrapperRef}>{children}</div>;
}
