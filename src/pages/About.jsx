import { Link } from 'react-router-dom';

export default function About() {
  return (
    <section className="section surface" id="about">
      <div className="container">
        <div className="section-header">
          <p className="eyebrow">About</p>
          <h2>The Datalyze story</h2>
          <p className="section-lead">
            We're a fractional analytics, data engineering, and growth team that builds the foundations, insights, and
            experiments that move the needle.
          </p>
        </div>

        <div className="about-stack">
          <article className="about-block align-left">
            <div className="about-copy">
              <h3>What is Datalyze?</h3>
              <p>Datalyze is an analytics and growth partner for tech companies. We help you set up reliable data, understand how users behave, and turn those insights into better experiments and revenue decisions.</p>
              <p>We also help unify data from different sources and build data and AI models on top of it, so your team can move faster without second-guessing the numbers.</p>
              <p>Think of Datalyze as a fractional team covering analytics, data engineering, and growth.</p>
            </div>
            <div className="about-visual orbit-visual" aria-hidden="true">
              <div className="orbiter">
                <span className="glow glow-primary"></span>
                <span className="glow glow-secondary"></span>
                <div className="orbit-track">
                  <span className="orbit-dot"></span>
                  <span className="orbit-dot delayed"></span>
                </div>
              </div>
            </div>
          </article>

          <article className="about-block align-right">
            <div className="about-copy">
              <h3>The Datalyze story</h3>
              <p>Datalyze was founded by Ansh Agrawal, who has worked with over 90 startups to set up analytics, uncover user insights, and improve conversion and revenue metrics.</p>
              <p>What started as a solo effort has grown into a small team of experienced operators who work closely with product and growth teams.</p>
              <p>At its core, Datalyze exists to help tech companies reach their next stage of growth with data they can trust. Over the next five years, our goal is to support 500 businesses in building analytics systems they're confident using every day.</p>
            </div>
            <div className="about-visual beam-visual" aria-hidden="true">
              <div className="beam"></div>
              <div className="beam trail"></div>
              <div className="beam flare"></div>
            </div>
          </article>

          <article className="about-block align-left">
            <div className="about-copy">
              <h3>Team</h3>
              <p>We're a growing crew of strategists, engineers, and analysts.</p>
              <ul className="list">
                <li>Ansh Agrawal</li>
                <li>Shubhangi Bansal</li>
                <li>Sara Maroouf</li>
              </ul>
            </div>
            <div className="about-visual pulse-visual" aria-hidden="true">
              <div className="pulse-ring"></div>
              <div className="pulse-ring"></div>
              <div className="pulse-ring"></div>
            </div>
          </article>

          <article className="about-block align-right">
            <div className="about-copy">
              <h3>Where we operate</h3>
              <p>We partner with teams globally, bringing localized context with a consistent, high-velocity delivery model.</p>
            </div>
            <div className="about-visual map-visual" role="img" aria-label="World map showing Datalyze reach">
              <div className="map-frame">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg"
                  alt="World map"
                  loading="lazy"
                />
                <span className="map-marker" style={{ '--x': '24%', '--y': '37%' }} aria-hidden="true"><span>UK</span></span>
                <span className="map-marker" style={{ '--x': '30%', '--y': '55%' }} aria-hidden="true"><span>UAE</span></span>
                <span className="map-marker" style={{ '--x': '36%', '--y': '52%' }} aria-hidden="true"><span>India</span></span>
                <span className="map-marker" style={{ '--x': '17%', '--y': '46%' }} aria-hidden="true"><span>US</span></span>
                <span className="map-marker" style={{ '--x': '50%', '--y': '40%' }} aria-hidden="true"><span>Switzerland</span></span>
              </div>
              <p className="map-caption">Clients served across the US, India, UK, Switzerland, and UAE.</p>
            </div>
          </article>
        </div>

        <div className="cta-row">
          <Link className="btn primary" to="/contact">Book your free 30 minute audit</Link>
        </div>
      </div>
    </section>
  );
}
