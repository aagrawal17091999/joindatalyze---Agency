import CtaButton from './cta-button';
import HeroFoundation from './hero-foundation';

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="container hero__inner">
        <div className="hero__text">
          <div className="eyebrow hero__eyebrow">
            Analytics &amp; Growth Partner
          </div>

          <h1 className="hero__headline">
            You&apos;ve built the dashboards.
            <br />
            Hired the analyst.
            <br />
            Bought the tools.
            <br />
            <em>Why does nothing line up?</em>
          </h1>

          <p className="hero__subhead">
            We&apos;ve seen this across 150+ startups. The fix isn&apos;t
            another dashboard or another tool — it&apos;s a foundation that
            actually works. Datalyze rebuilds it, then shows you the growth
            your data has been hiding.
          </p>

          <div className="hero__buttons">
            <CtaButton href="/contact" location="home_hero">
              Book a Call
            </CtaButton>
            <CtaButton
              href="/case-studies"
              location="home_hero"
              className="btn-secondary"
            >
              See Case Studies
            </CtaButton>
          </div>

          <div className="hero__proof">
            <div className="hero__proof-item">
              <span className="hero__proof-number">150+</span>
              <span className="hero__proof-label">Companies Served</span>
            </div>
            <div className="hero__proof-divider" />
            <div className="hero__proof-item">
              <span className="hero__proof-number">14%</span>
              <span className="hero__proof-label">Avg. Revenue Lift</span>
            </div>
            <div className="hero__proof-divider" />
            <div className="hero__proof-item">
              <span className="hero__proof-number">1-Day</span>
              <span className="hero__proof-label">Kickoff</span>
            </div>
          </div>
        </div>

        <div className="hero__visual">
          <HeroFoundation />
        </div>
      </div>
    </section>
  );
}
