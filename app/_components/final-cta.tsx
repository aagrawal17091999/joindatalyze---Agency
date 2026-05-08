import CtaButton from './cta-button';

export default function FinalCta() {
  return (
    <section className="final-cta" id="book">
      <div className="container">
        <div className="final-cta__inner">
          <div className="eyebrow eyebrow--center">Final Step</div>
          <h2 className="final-cta__title">
            <em>See</em> what your data
            <br />
            is hiding from you
          </h2>
          <p className="final-cta__subhead">
            Most teams are sitting on revenue they can&apos;t see — broken
            tracking, misattributed spend, drop-offs nobody&apos;s caught. Bring
            us your stack, and in 30 minutes we&apos;ll show you where yours is.
          </p>
          <CtaButton
            href="/contact"
            location="home_final_cta"
            className="btn-primary final-cta__btn"
          >
            Book a Call
          </CtaButton>
        </div>
      </div>

      <svg
        className="final-cta__chart"
        viewBox="0 0 1200 180"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M 0 150 Q 200 140 400 110 T 800 50 T 1200 15"
          stroke="#D4FF3F"
          strokeWidth="2"
          fill="none"
          opacity="0.35"
        />
      </svg>
    </section>
  );
}
