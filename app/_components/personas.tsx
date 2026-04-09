import { homePersonas } from '@/lib/data/home-personas';

export default function Personas() {
  return (
    <section className="section" id="personas">
      <div className="container">
        <header className="audience__header">
          <div className="eyebrow eyebrow--center">For Operators</div>
          <h2 className="audience__title">
            If your job depends on numbers
            <br />
            you can&apos;t fully trust, this is for you
          </h2>
          <p className="audience__intro">
            For founders, heads of growth, and product leads at startups from
            Seed to Series B.
          </p>
        </header>

        <div className="persona-grid">
          {homePersonas.map((persona) => (
            <article key={persona.role} className="persona">
              <h3 className="persona__role">{persona.role}</h3>
              <p className="persona__pain">{persona.pain}</p>
              <div className="persona__outcome">
                <span className="persona__outcome-arrow" aria-hidden="true">
                  →
                </span>
                <p>{persona.outcome}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
