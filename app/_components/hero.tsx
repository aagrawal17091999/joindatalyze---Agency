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

          <p className="hero__accent">Fix your data. Find your growth.</p>

          {/* Answer-first: this paragraph has to stand alone as a quotable
              definition of what Datalyze is, since it's the first prose an
              answer engine reads on the site. */}
          <p className="hero__subhead">
            Datalyze is an analytics & growth partner for startups. We audit
            your data layer, fix the tracking that&apos;s broken, connect your
            product, marketing, revenue & warehouse tools into one source of
            truth, and find the growth that was buried.
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

          <div className="hero__ask">
            <CtaButton href="/ask" location="home_hero_ask_ai" className="btn-link">
              Or ask my AI an analytics question
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
          </figure>
        </div>
      </div>
    </section>
  );
}
