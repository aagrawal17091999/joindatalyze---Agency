'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { HomeTestimonial } from '@/lib/data/home-testimonials';

type Props = {
  testimonials: HomeTestimonial[];
};

export default function TestimonialCarousel({ testimonials }: Props) {
  const [index, setIndex] = useState(0);
  const isPaused = useRef(false);
  const n = testimonials.length;

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReduced) return;

    const id = window.setInterval(() => {
      if (!isPaused.current) {
        setIndex((i) => (i + 1) % n);
      }
    }, 7000);
    return () => window.clearInterval(id);
  }, [n]);

  const current = testimonials[index];

  const next = () => setIndex((i) => (i + 1) % n);
  const prev = () => setIndex((i) => (i - 1 + n) % n);

  return (
    <div
      className="testimonial-wrapper"
      onMouseEnter={() => {
        isPaused.current = true;
      }}
      onMouseLeave={() => {
        isPaused.current = false;
      }}
    >
      <blockquote className="testimonial" key={index}>
        <p className="testimonial__quote">&ldquo;{current.text}&rdquo;</p>
        <footer className="testimonial__attribution">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '8px',
            }}
          >
            {current.avatar ? (
              <Image
                src={current.avatar}
                alt=""
                width={40}
                height={40}
                style={{
                  borderRadius: '50%',
                  border: '1px solid var(--border-default)',
                }}
              />
            ) : null}
            <div>
              <div className="testimonial__name">{current.name}</div>
              <div className="testimonial__role">{current.role}</div>
            </div>
          </div>
        </footer>
      </blockquote>

      <div className="testimonial-controls">
        <button
          type="button"
          className="testimonial-controls__btn"
          onClick={prev}
          aria-label="Previous testimonial"
        >
          ←
        </button>
        <div className="testimonial-controls__dots">
          {testimonials.map((t, i) => (
            <button
              key={t.name + i}
              type="button"
              className={`testimonial-controls__dot${
                i === index ? ' is-active' : ''
              }`}
              onClick={() => setIndex(i)}
              aria-label={`Testimonial ${i + 1} of ${n}: ${t.name}`}
              aria-current={i === index}
            />
          ))}
        </div>
        <button
          type="button"
          className="testimonial-controls__btn"
          onClick={next}
          aria-label="Next testimonial"
        >
          →
        </button>
      </div>
    </div>
  );
}
