import { Link } from 'react-router-dom';
import { caseStudyList } from '../data/caseStudies';

export default function CaseStudies() {
  return (
    <section id="case-studies" className="section">
      <div className="container">
        <div className="section-header">
          <p className="eyebrow">Case studies</p>
          <h2>Proof in practice</h2>
          <p className="section-lead">
            A dedicated page for every story. Logos and final imagery will drop in next, but the structure and copy are
            ready to showcase wins.
          </p>
        </div>
        <div className="case-gallery">
          {caseStudyList.map((c) => (
            <article key={c.slug} className="case-card">
              <div className={`case-thumb ${c.thumbClass || ''}`.trim()}>
                <img src={c.logo} alt={c.alt} className="case-logo" />
              </div>
              <div className="case-meta">
                <p className="muted">{c.meta}</p>
                <h3>{c.title}</h3>
                <p>{c.description}</p>
                <div className="tags">
                  {c.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
                <Link className="btn soft" to={`/case-studies/${c.slug}`}>View page</Link>
              </div>
            </article>
          ))}
        </div>
        <div className="cta-row">
          <Link className="btn ghost" to="/contact">Request the full library</Link>
          <Link className="btn primary" to="/contact">Book a case study walkthrough</Link>
        </div>
      </div>
    </section>
  );
}
