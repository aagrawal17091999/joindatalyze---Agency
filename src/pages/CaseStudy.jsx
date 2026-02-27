import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { caseStudyBySlug } from '../data/caseStudies';
import LogoImg from '../components/LogoImg';
import { preloadImages } from '../utils/preloadImages';

export default function CaseStudy() {
  const { slug } = useParams();
  const data = slug ? caseStudyBySlug[slug] : null;

  useEffect(() => {
    if (!data) return;
    const urls = [];
    if (data.logo) urls.push(data.logo);
    if (data.sections) {
      data.sections.forEach((s) => {
        if (s.blocks) {
          s.blocks.forEach((b) => {
            if (b.type === 'image' && b.src) urls.push(b.src);
          });
        }
      });
    }
    if (urls.length) preloadImages(urls);
  }, [data]);

  if (!data) {
    return (
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Not found</h2>
            <p className="section-lead">This case study could not be found.</p>
          </div>
        </div>
      </section>
    );
  }

  const leadLine = [data.lead, data.subtitle].filter(Boolean).join(' · ');

  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
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
            {data.logo
              ? <LogoImg src={data.logo} name={data.lead} />
              : <span className="case-thumb-name">{data.lead}</span>}
          </div>
          <div className="case-content">
            <h3>{data.title}</h3>
            {data.intro && <p dangerouslySetInnerHTML={{ __html: data.intro }} />}
            {data.sections && data.sections.length > 0 ? (
              data.sections.map((section, i) => (
                <div key={i} className="case-detail">
                  {section.heading && <h4>{section.heading}</h4>}
                  {section.blocks ? (
                    section.blocks.map((block, j) => {
                      if (block.type === 'p') return <p key={j}>{block.text}</p>;
                      if (block.type === 'ul') return <ul key={j} className="list">{block.items.map((item, k) => <li key={k} dangerouslySetInnerHTML={{ __html: item }} />)}</ul>;
                      if (block.type === 'ol') return <ol key={j} className="list">{block.items.map((item, k) => <li key={k} dangerouslySetInnerHTML={{ __html: item }} />)}</ol>;
                      if (block.type === 'h5') return <h5 key={j}>{block.text}</h5>;
                      if (block.type === 'blockquote') return <blockquote key={j}><p>{block.text}</p></blockquote>;
                      if (block.type === 'image') return <div key={j} className="case-gallery-inline"><img src={block.src} alt={block.alt || ''} className="case-image" /></div>;
                      return null;
                    })
                  ) : section.body ? (
                    <p>{section.body}</p>
                  ) : null}
                </div>
              ))
            ) : (
              <p>Case study content is available on the full site. Full copy can be added to <code>src/data/caseStudies.js</code> or loaded from CMS.</p>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
