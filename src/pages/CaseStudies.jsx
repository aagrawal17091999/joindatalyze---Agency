import { Link } from 'react-router-dom';
import { caseStudyList } from '../data/caseStudies';

export default function CaseStudies() {
  return (
    <section id="case-studies" className="section">
      <div className="container">
        <div className="section-header">
          <h2>Case Studies</h2>
        </div>
        <div className="case-gallery">
          {caseStudyList.map((c) => (
            <article key={c.slug} className="case-card">
              <div className={`case-thumb${c.darkThumb ? ' case-thumb--dark' : ''}`}>
                {c.logo
                  ? <img src={c.logo} alt={c.alt} loading="lazy" />
                  : <span className="case-thumb-name">{c.title}</span>}
              </div>
              <div className="case-meta">
                <h3>{c.title}</h3>
                <p>{c.description}</p>
                <a className="btn primary" href={c.externalUrl} target="_blank" rel="noreferrer">View case study</a>
              </div>
            </article>
          ))}
        </div>
        <div className="cta-row">
          <Link className="btn primary" to="/contact">Book a free 30 min audit</Link>
        </div>
      </div>
    </section>
  );
}
