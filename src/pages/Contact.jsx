import { Link } from 'react-router-dom';

export default function Contact() {
  return (
    <section id="contact" className="section callout">
      <div className="container">
        <div className="section-header center">
          <p className="eyebrow">Let's talk</p>
          <h1>Book a call with us</h1>
          <h2>Get a free 30 minute audit to see how we can help grow your business</h2>
          <p className="section-lead">
            We'll dig into your goals, share fast opportunities, and outline how Datalyze can support your growth.
          </p>
        </div>
        <div className="cta-group center">
          <Link className="btn primary" to="/contact">Schedule your audit</Link>
          <p className="muted">We will later have a form here to book a call.</p>
        </div>
      </div>
    </section>
  );
}
