import { Link } from 'react-router-dom';
import { caseStudyList } from '../data/caseStudies';
import LogoImg from '../components/LogoImg';

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
              <div className="case-thumb">
                {c.logo
                  ? <LogoImg src={c.logo} name={c.alt} />
                  : <span className="case-thumb-name">{c.title}</span>}
              </div>
              <div className="case-meta">
                <h3>{c.title}</h3>
                <p>{c.description}</p>
                <Link className="btn primary" to={`/case-studies/${c.slug}`}>View page</Link>
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
