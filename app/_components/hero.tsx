import CtaButton from './cta-button';

const BEFORE_TOOLS = [
  'Mixpanel',
  'PostHog',
  'GA4',
  'Amplitude',
  'Stripe',
  'Segment',
];

const AFTER_CHIPS = ['Product', 'Marketing', 'Revenue', 'Retention'];

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="container hero__inner">
        <div className="hero__text">
          <h1 className="hero__headline">
            Find the revenue your data is hiding.
          </h1>

          <p className="hero__accent">We fix your tracking in 30 days.</p>

          <p className="hero__subhead">
            The analytics partner for 150+ SaaS teams. We rebuild your data
            foundation, connect every tool, and show you where growth is
            leaking.
          </p>

          <div className="hero__buttons">
            <CtaButton href="/contact" location="home_hero">
              Book a strategy call
            </CtaButton>
            <CtaButton
              href="/contact"
              location="home_hero"
              className="btn-secondary"
            >
              Get a free audit
            </CtaButton>
          </div>

          <div className="hero__proof">
            <div className="hero__proof-item">
              <span className="hero__proof-number">150+</span>
              <span className="hero__proof-label">Companies served</span>
            </div>
            <div className="hero__proof-divider" />
            <div className="hero__proof-item">
              <span className="hero__proof-number">14%</span>
              <span className="hero__proof-label">Avg revenue lift</span>
            </div>
            <div className="hero__proof-divider" />
            <div className="hero__proof-item">
              <span className="hero__proof-number">1-day</span>
              <span className="hero__proof-label">Kickoff</span>
            </div>
          </div>
        </div>

        <div className="hero__visual">
          <figure className="ba">
            <div className="ba__box ba__box--before">
              <span className="ba__tag">Before</span>
              <div className="ba__tools">
                {BEFORE_TOOLS.map((tool, i) => (
                  <span key={tool} className={`ba__tool ba__tool--${i % 3}`}>
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div className="ba__arrow" aria-hidden="true">
              ↓
            </div>

            <div className="ba__box ba__box--after">
              <span className="ba__tag ba__tag--after">After Datalyze</span>
              <div className="ba__after-title">One source of truth</div>
              <div className="ba__chips">
                {AFTER_CHIPS.map((chip) => (
                  <span key={chip} className="ba__chip">
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            <figcaption className="ba__caption">
              Before: data scattered across 6+ tools. After: one source of
              truth.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
