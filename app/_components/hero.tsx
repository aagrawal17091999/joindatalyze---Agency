import CtaButton from './cta-button';
import ReconciliationFlow from './reconciliation-flow';

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="container hero__inner">
        <div className="hero__text">
          <h1 className="hero__headline">
            The data team that rewires your tracking, ties your tools
            together, and finds the growth nobody could see.
          </h1>

          <p className="hero__subhead">
            Datalyze is the data team that 150+ startups, from Seed to Series
            C, bring in to fix broken tracking, unify their analytics, and
            turn raw data into decisions their teams actually trust.
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
          <ReconciliationFlow />
        </div>
      </div>
    </section>
  );
}
