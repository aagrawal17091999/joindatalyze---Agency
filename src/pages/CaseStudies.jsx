import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { caseStudyList } from '../data/caseStudies';
import { preloadImages } from '../utils/preloadImages';
import mixpanel from '../utils/mixpanel';
import SEO from '../components/SEO';

export default function CaseStudies() {
  useEffect(() => {
    preloadImages(caseStudyList.filter((c) => c.logo).map((c) => c.logo));
  }, []);

  return (
    <section id="case-studies" className="section">
      <SEO
        title="Case Studies"
        description="See how Datalyze has helped startups improve activation, retention, and conversion with better analytics and experimentation."
        path="/case-studies"
      />
      <div className="container">
        <div className="section-header">
          <h2>Case Studies</h2>
        </div>
        <div className="case-gallery">
          {caseStudyList.map((c) => (
            <article key={c.slug} className="case-card">
              <div className={`case-thumb${c.darkThumb ? ' case-thumb--dark' : ''}`}>
                {c.logo
                  ? <img src={c.logo} alt={c.alt} />
                  : <span className="case-thumb-name">{c.title}</span>}
              </div>
              <div className="case-meta">
                <h3>{c.title}</h3>
                <p>{c.description}</p>
                <a className="btn primary" href={c.externalUrl} target="_blank" rel="noreferrer" onClick={() => mixpanel.track('Case Study Clicked', { case_study_title: c.title, case_study_slug: c.slug })}>View case study</a>
              </div>
            </article>
          ))}
        </div>
        <div className="cta-row">
          <Link className="btn primary" to="/contact" onClick={() => mixpanel.track('CTA Clicked', { cta_text: 'Book a free 30 min audit', location: 'case_studies_page' })}>Book a free 30 min audit</Link>
        </div>
      </div>
    </section>
  );
}
