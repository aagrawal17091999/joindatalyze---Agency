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
          <h1>The Datalyze story</h1>
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
              <h2>What is Datalyze?</h2>
              <p>Datalyze is an analytics and growth partner for tech companies. We help you set up reliable data, understand user behaviour, and turn insights into better experiments and revenue decisions.</p>
              <p>We also unify data across sources and build data and AI models on top, so your team can move faster without second-guessing the numbers.</p>
              <p>Think of us as a fractional team covering analytics, data engineering, and growth.</p>
            </div>
            <div aria-hidden="true" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <img src="/datalyze logo small arrow transparent.svg" alt="" className="about-logo-img" />
              <span className="about-logo-label">Datalyze</span>
            </div>
          </article>

          {/* The Datalyze story — text LEFT, photo RIGHT */}
          <article className="about-block align-left">
            <div className="about-copy">
              <h2>The Datalyze story?</h2>
              <p>Datalyze was founded by Ansh Agrawal, who's worked with 90+ startups on analytics, user insights, and improving conversion and revenue. </p>
              <p>What started solo has grown into a small team of experienced operators working closely with product and growth teams.</p>
              <p>Our goal over the next five years: help 500 businesses build analytics systems they trust and use every day.</p>
            </div>
            <div className="about-visual about-visual-img-wrap">
              <img src="/Ansh.png" alt="Ansh Agrawal, Founder of Datalyze" className="about-visual-img" />
            </div>
          </article>
        </div>

        {/* Team */}
        <div className="team-section">
          <div className="section-header">
            <h1>Team</h1>
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
            <h1>Where we operate</h1>
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
