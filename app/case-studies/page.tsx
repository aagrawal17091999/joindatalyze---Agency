import type { Metadata } from 'next';
import Image from 'next/image';
import CtaButton from '../_components/cta-button';
import { caseStudyList } from '@/lib/data/case-studies';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Analytics Case Studies',
  description:
    '17 analytics engagements with numbers: 2\u00d7 paid conversion, 28%\u219280% onboarding, \u221293% payment outages, +15% Week 2 retention.',
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
        {/* Answer-first: the headline numbers are in the opening sentence, so
            the page can be cited without following any of the card links. */}
        <header className="page-header">
          <div className="eyebrow">Case Studies</div>
          <h1 className="page-header__title">Results we&apos;ve shipped</h1>
        </header>

        <h2 className="visually-hidden">
          Client analytics case studies
        </h2>
        <div className="card-grid">
          {caseStudyList.map((cs) => (
            <a key={cs.slug} href={cs.externalUrl} className="card">
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
