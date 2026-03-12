import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { preloadImages } from '../utils/preloadImages';
import mixpanel from '../utils/mixpanel';
import SEO from '../components/SEO';

const TEAM = [
  { name: 'Ansh Agrawal', role: 'Founder', photo: '/Ansh.png' },
  { name: 'Sara Maarouf', role: 'Product Growth', photo: '/sara-maarouf.jpg' },
];

export default function About() {
  useEffect(() => {
    preloadImages([
      ...TEAM.filter((m) => m.photo).map((m) => m.photo),
      '/datalyze logo small arrow transparent.svg',
      '/world map.svg',
    ]);
  }, []);

  return (
    <section className="section surface" id="about">
      <SEO
        title="About"
        description="Datalyze is a fractional analytics, data engineering, and growth team that builds the foundations, insights, and experiments that move the needle."
        path="/about"
      />
      <div className="container">
        {/* Hero */}
        <div className="section-header">
          <h2>The Datalyze story</h2>
          <p className="section-lead" style={{ color: 'white' }}>
            We're a fractional analytics, data engineering, and growth team that builds the foundations, insights, and
            experiments that move the needle.
          </p>
        </div>

        {/* What is Datalyze + Story panels */}
        <div className="about-stack">
          {/* What is Datalyze — logo LEFT, text RIGHT */}
          <article className="about-block align-right">
            <div className="about-copy" style={{ textAlign: 'left' }}>
              <h3>What is Datalyze?</h3>
              <p>Datalyze is an analytics and growth partner for tech companies. We help you set up reliable data, understand how users behave, and turn those insights into better experiments and revenue decisions.</p>
              <p>We also help unify data from different sources and build data and AI models on top of it, so your team can move faster without second-guessing the numbers.</p>
              <p>Think of Datalyze as a fractional team covering analytics, data engineering, and growth.</p>
            </div>
            <div aria-hidden="true" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <img src="/datalyze logo small arrow transparent.svg" alt="" className="about-logo-img" />
              <span className="about-logo-label">Datalyze</span>
            </div>
          </article>

          {/* The Datalyze story — text LEFT, photo RIGHT */}
          <article className="about-block align-left">
            <div className="about-copy">
              <h3>The Datalyze story?</h3>
              <p>Datalyze was founded by Ansh Agrawal, who has worked with over 90 startups to set up analytics, uncover user insights, and improve conversion and revenue metrics.</p>
              <p>What started as a solo effort has grown into a small team of experienced operators who work closely with product and growth teams.</p>
              <p>At its core, Datalyze exists to help tech companies reach their next stage of growth with data they can trust. Over the next five years, our goal is to support 500 businesses in building analytics systems they're confident using every day.</p>
            </div>
            <div className="about-visual about-visual-img-wrap">
              <img src="/Ansh.png" alt="Ansh Agrawal, Founder of Datalyze" className="about-visual-img" />
            </div>
          </article>
        </div>

        {/* Team */}
        <div className="team-section">
          <div className="section-header">
            <h2>Team</h2>
            <p className="section-lead" style={{ color: 'white' }}>We're a growing crew of strategists, engineers, and analysts.</p>
          </div>
          <div className="team-grid">
            {TEAM.map((member, i) => (
              <div className="team-card" key={i}>
                {member.photo ? (
                  <img src={member.photo} alt={member.name} className="team-photo" />
                ) : (
                  <div className="team-photo-placeholder" />
                )}
                <div className="team-card-info">
                  <p className="team-card-name">{member.name}</p>
                  {member.role && <p className="team-card-role">{member.role}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Where we operate */}
        <div className="where-we-operate">
          <div className="section-header">
            <h2>Where we operate</h2>
            <p className="section-lead" style={{ color: 'white' }}>
              We partner with teams globally, bringing localized context with a consistent,
              high-velocity delivery model.
            </p>
          </div>
          <div className="world-map-wrap">
            <img
              src="/world map.svg"
              alt="World map showing Datalyze reach"
              className="world-map-img"
            />
          </div>
        </div>

        {/* CTA */}
        <div className="cta-row">
          <Link className="btn primary" to="/contact" onClick={() => mixpanel.track('CTA Clicked', { cta_text: 'Book your free 30 min Audit', location: 'about_page' })}>Book your free 30 min Audit</Link>
        </div>
      </div>
    </section>
  );
}
