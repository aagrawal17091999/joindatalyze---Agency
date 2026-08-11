import type { Metadata } from 'next';
import Image from 'next/image';
import CtaButton from '../_components/cta-button';
import { caseStudyList } from '@/lib/data/case-studies';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Analytics Case Studies',
  description:
    'See how Datalyze has helped 17+ startups improve activation, retention, and conversion with better analytics and experimentation.',
  alternates: { canonical: '/case-studies' },
};

export default function CaseStudiesPage() {
  return (
    <div className="page-shell">
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Case Studies', path: '/case-studies' },
        ])}
      />
      <div className="container">
        <header className="page-header">
          <div className="eyebrow">Case Studies</div>
          <h1 className="page-header__title">Results we&apos;ve shipped</h1>
          <p className="page-header__intro">
            A selection of the companies we&apos;ve worked with, what they
            asked us to solve, and what we shipped. Pick one to read the full
            story.
          </p>
        </header>

        <h2 className="visually-hidden">
          Client analytics case studies
        </h2>
        <div className="card-grid">
          {caseStudyList.map((cs) => (
            <a
              key={cs.slug}
              href={cs.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="card"
            >
              <div className="card__tag">{cs.meta}</div>
              {cs.logo ? (
                <div className="card__logo-plate">
                  <Image
                    src={cs.logo}
                    alt={cs.alt}
                    width={140}
                    height={40}
                    className="card__logo-img"
                  />
                </div>
              ) : (
                <div className="card__logo-fallback">{cs.title}</div>
              )}
              <p className="card__body">{cs.description}</p>
              <span className="card__cta">Read the case study</span>
            </a>
          ))}
        </div>

        <div
          style={{
            marginTop: 'var(--space-10)',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <CtaButton href="/contact" location="case_studies_page">
            Book a free 30 min audit
          </CtaButton>
        </div>
      </div>
    </div>
  );
}
