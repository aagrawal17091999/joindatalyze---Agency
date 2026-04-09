export default function ProofBar() {
  return (
    <section className="proof-bar" aria-label="Key stats">
      <div className="container">
        <div className="proof-bar__inner">
          <div className="proof-bar__item">
            <span className="proof-bar__number">150+</span>
            <span className="proof-bar__label">Companies Served</span>
          </div>
          <div className="proof-bar__divider" />
          <div className="proof-bar__item">
            <span className="proof-bar__number">14%</span>
            <span className="proof-bar__label">Avg. Revenue Lift</span>
          </div>
          <div className="proof-bar__divider" />
          <div className="proof-bar__item">
            <span className="proof-bar__number">1-Day</span>
            <span className="proof-bar__label">Kickoff</span>
          </div>
        </div>
      </div>
    </section>
  );
}
