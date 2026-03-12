import { useEffect } from 'react';
import mixpanel from '../utils/mixpanel';
import SEO from '../components/SEO';

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

  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data.event === 'calendly.date_and_time_selected') {
        mixpanel.track('Calendly Date and Time Selected', { location: 'contact_page' });
      }
      if (e.data.event === 'calendly.event_scheduled') {
        mixpanel.track('Calendly Event Scheduled', { location: 'contact_page' });
        window.gtag('event', 'conversion', {
          'send_to': 'AW-18010353889/q2vPCKXQkIccEOHhgIxD',
        });
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <section id="contact" className="section callout">
      <SEO
        title="Contact"
        description="Book a free 30-minute analytics audit with Datalyze. Let's talk about how we can help grow your business with data."
        path="/contact"
      />
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
