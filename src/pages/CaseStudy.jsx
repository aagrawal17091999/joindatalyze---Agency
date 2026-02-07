import { useParams, Link } from 'react-router-dom';
import { caseStudyBySlug } from '../data/caseStudies';

export default function CaseStudy() {
  const { slug } = useParams();
  const data = slug ? caseStudyBySlug[slug] : null;

  if (!data) {
    return (
      <section className="section">
        <div className="container">
          <div className="section-header">
            <p className="eyebrow">Case study</p>
            <h2>Not found</h2>
            <p className="section-lead">This case study could not be found.</p>
          </div>
          <Link className="btn primary" to="/case-studies">Back to case studies</Link>
        </div>
      </section>
    );
  }

  const leadLine = [data.lead, data.subtitle].filter(Boolean).join(' · ');

  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <p className="eyebrow">Case study</p>
          <h1>{data.title}</h1>
          <p className="section-lead">
            {data.website ? (
              <a href={data.website} target="_blank" rel="noreferrer">{leadLine}</a>
            ) : (
              leadLine
            )}
          </p>
        </div>
        <article className="case-page">
          <div className="case-visual">
            <img src={data.logo} alt="" className="case-logo case-logo-large" />
          </div>
          <div className="case-content">
            <div className="page-label">
              {data.website ? (
                <a href={data.website} target="_blank" rel="noreferrer">{leadLine}</a>
              ) : (
                leadLine
              )}
            </div>
            <h3>{data.title}</h3>
            <p>Case study content is available on the full site. This React app shows the structure; full copy can be added to <code>src/data/caseStudies.js</code> or loaded from CMS.</p>
            <div className="cta-row">
              <Link className="btn primary" to="/case-studies">Back to case studies</Link>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
