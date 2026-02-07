export default function Services() {
  return (
    <section className="section surface" id="services">
      <div className="container">
        <div className="section-header">
          <p className="eyebrow">Services</p>
          <h2>Ways we help</h2>
        </div>

        <div className="service-bands">
          <div className="service-block">
            <div className="service-visual" aria-hidden="true"></div>
            <div className="service-copy">
              <h3>Product Analytics</h3>
              <p>
                We help you set up product analytics that your team can actually use. This starts with getting the basics right and then going deeper into how users behave and where revenue is being left on the table.
              </p>
              <p>This typically includes:</p>
              <ul>
                <li>Creating a clear tracking plan aligned to your product and business goals</li>
                <li>Building simple, reliable reports and dashboards</li>
                <li>Deep analysis to understand user behavior, identify drop-offs, and highlight high-impact opportunities to improve conversion</li>
              </ul>
            </div>
          </div>

          <div className="service-block">
            <div className="service-copy">
              <h3>Data sanity, consolidation &amp; modelling</h3>
              <p>If your data feels unreliable or scattered across tools, we help bring order to it.</p>
              <p>If you don't trust your data, we run a thorough audit and work with your team to fix gaps and inconsistencies until the numbers make sense again.</p>
              <p>If your data is fragmented, we consolidate it into a single view with proper user mapping so you can see the full user journey end to end.</p>
              <p>If you want to build data or AI models for personalization, advanced analysis, or automation, we design and implement those foundations for you.</p>
            </div>
            <div className="service-visual" aria-hidden="true"></div>
          </div>

          <div className="service-block">
            <div className="service-visual" aria-hidden="true"></div>
            <div className="service-copy">
              <h3>Growth &amp; Experimentation</h3>
              <p>We work closely with product teams to identify clear opportunities to improve conversion. This includes UI and UX reviews to surface friction points that slow users down or cause drop-offs.</p>
              <p>We then help design and run experiments, measure their impact, and double down on what works. Along the way, we help you uncover growth levers and practical advantages you can use to move faster than competitors.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
