import { caseStudyBySlug } from '@/lib/data/case-studies';
import { homeCaseStudies } from '@/lib/data/home-case-studies';
import CtaButton from './cta-button';

export default function CaseCards() {
  return (
    <section className="section" id="work">
      <div className="container">
        <header className="page-header page-header--center">
          <div className="eyebrow eyebrow--center">Results</div>
          <h2 className="page-header__title">
            What happens after Datalyze gets involved
          </h2>
        </header>

        <div className="case-grid">
          {homeCaseStudies.map((cs) => (
            <a
              key={cs.slug}
              href={caseStudyBySlug[cs.slug].externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="case-card"
            >
              <div className="case-card__metric">
                <span className="case-card__metric-value">
                  {cs.metricValue}
                </span>
                <span className="case-card__metric-label">
                  {cs.metricLabel}
                </span>
              </div>
              <p className="case-card__body">{cs.body}</p>
              <span className="case-card__link">Read the case study</span>
            </a>
          ))}
        </div>

        <div className="results-cta">
          <p className="results-cta__line">
            These are real results from teams like yours.
          </p>
          <CtaButton href="/contact" location="home_results">
            See how we did it
          </CtaButton>
        </div>
      </div>
    </section>
  );
}
