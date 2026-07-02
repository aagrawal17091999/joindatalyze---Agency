'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { HomeTestimonial } from '@/lib/data/home-testimonials';
import styles from './wall-of-love.module.css';

type Props = {
  testimonials: HomeTestimonial[];
};

export default function WallOfLove({ testimonials }: Props) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!isMobile) return;
    const el = trackRef.current;
    if (!el) return;
    const cards = Array.from(el.querySelectorAll<HTMLElement>(`.${styles.card}`));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const idx = cards.indexOf(visible.target as HTMLElement);
          if (idx >= 0) setActiveIndex(idx);
        }
      },
      { root: el, threshold: [0.5, 0.75, 1] }
    );
    cards.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, [isMobile, testimonials.length]);

  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelectorAll<HTMLElement>(`.${styles.card}`)[i];
    if (card) card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.masonry} ref={trackRef}>
        {testimonials.map((t, i) => {
          const attribution = [t.name, t.title, t.company]
            .filter(Boolean)
            .join(', ');
          return (
            <div key={t.name + i} className={styles.card}>
              <p className={styles.quote}>{t.text}</p>
              <div className={styles.author}>
                {t.avatar ? (
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    width={36}
                    height={36}
                    className={styles.avatar}
                  />
                ) : null}
                <div className={styles.authorMeta}>
                  <span className={styles.authorName}>{attribution}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.dots} aria-hidden={!isMobile}>
        {testimonials.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ''}`}
            aria-label={`Show testimonial ${i + 1}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
}
