import { useEffect } from 'react';

export default function Contact() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <section id="contact" className="section callout">
      <div className="container">
        <div className="section-header center">
          <h1>Book a call with us</h1>
          <h3>Get a free 30 minute audit to see how we can help grow your business</h3>
        </div>
        <div
          className="calendly-inline-widget"
          data-url="https://calendly.com/anshagrawal17091999/chat?hide_event_type_details=1&hide_gdpr_banner=1"
          style={{ minWidth: '320px', height: '700px' }}
        />
      </div>
    </section>
  );
}
