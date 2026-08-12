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
