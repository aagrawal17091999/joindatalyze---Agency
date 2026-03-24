import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import mixpanel from '../utils/mixpanel';
import SEO from '../components/SEO';

const SERVICE_ICONS = [
  '/service-icons/product-analytics.svg',
  '/service-icons/data-modelling.svg',
  '/service-icons/growth-experimentation.svg',
];

export default function Services() {

  return (
    <section className="section surface" id="services">
      <Helmet>
        {SERVICE_ICONS.map((src) => (
          <link key={src} rel="preload" as="image" type="image/svg+xml" href={src} />
        ))}
      </Helmet>
      <SEO
        title="Services"
        description="Product analytics, data modeling, and growth experimentation services for tech companies. Set up reliable data and run experiments that move the needle."
        path="/services"
      />
      <div className="container">
        <div className="section-header">
          <h1>Ways we help</h1>
        </div>

        <div className="services-grid">
          <div className="service-card-horizontal">
            <div className="service-icon-box">
              <img
                src="/service-icons/product-analytics.svg"
                alt="Product Analytics"
                className="service-icon-img"
              />
            </div>
            <div className="service-copy">
              <h2>Product Analytics</h2>
              <p>We set up product analytics your team can actually use, starting with the basics, then going deeper into user behaviour and where revenue is being left on the table.</p>
              <p>This typically includes a clear tracking plan aligned to your goals, simple and reliable dashboards, and deep analysis to identify drop-offs and high-impact conversion opportunities.</p>
            </div>
          </div>

          <div className="service-card-horizontal">
            <div className="service-icon-box">
              <img
                src="/service-icons/data-modelling.svg"
                alt="Data sanity, consolidation and modelling"
                className="service-icon-img"
              />
            </div>
            <div className="service-copy">
              <h2>Data sanity, consolidation &amp; modelling</h2>
              <p>If your data feels unreliable or scattered, we bring order to it.</p>
              <p>We audit and fix gaps until the numbers make sense, consolidate fragmented sources into a single view with proper user mapping, and build data or AI model foundations for personalization, advanced analysis, or automation.</p>
            </div>
          </div>

          <div className="service-card-horizontal">
            <div className="service-icon-box">
              <img
                src="/service-icons/growth-experimentation.svg"
                alt="Growth and Experimentation"
                className="service-icon-img"
              />
            </div>
            <div className="service-copy">
              <h2>Growth &amp; Experimentation</h2>
              <p>We work with product teams to identify conversion opportunities, including UI and UX reviews to surface friction points.</p>
              <p>We then help design and run experiments, measure impact, and double down on what works, helping you uncover growth levers to move faster than competitors.</p>
            </div>
          </div>
        </div>

        <div className="services-cta">
          <Link className="btn primary px-6 py-3.5 text-base" to="/contact" onClick={() => mixpanel.track('CTA Clicked', { cta_text: 'Book your free 30 min Audit', location: 'services_page' })}>Book your free 30 min Audit</Link>
        </div>
      </div>
    </section>
  );
}
