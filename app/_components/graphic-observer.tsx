'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Activates every `.gfx` SVG on the page once it scrolls into view.
 * Adds `is-visible` so the `.gfx-animate` / `.gfx-fade` CSS transitions fire.
 * Re-runs after client navigation so graphics on new routes get observed.
 */
export default function GfxObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const elements =
      document.querySelectorAll<HTMLElement>('.gfx:not(.is-visible)');
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
      // 0.01 fires as soon as any pixel is visible. 0.3 was too high for
      // large above-the-fold graphics that extend outside the initial viewport.
      { threshold: 0.01 },
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
