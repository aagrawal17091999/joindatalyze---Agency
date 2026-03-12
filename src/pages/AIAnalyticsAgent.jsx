import { useState, useEffect } from 'react';
import mixpanel from '../utils/mixpanel';
import SEO from '../components/SEO';

const PROCESS_STEPS = [
  {
    num: 1,
    title: 'We start with a call',
    description: 'We learn how your business actually works \u2014 what questions your team asks, what data you have, and what needs to flow into the agent to give useful answers.',
  },
  {
    num: 2,
    title: 'We clean and model your data',
    description: 'Raw data breaks AI. We fix inaccuracies, unify data from multiple sources, and structure it in a way the agent can reason over reliably \u2014 leaving you with clean, reusable tables as a bonus.',
  },
  {
    num: 3,
    title: 'We build your agent\'s brain',
    description: 'This is what most tools skip. We create a deep knowledge base covering your business context, metric definitions, table relationships, and common use cases \u2014 so the agent understands your product, not just your schema.',
  },
  {
    num: 4,
    title: 'We build and configure your agent',
    description: 'With clean data and a solid knowledge base in place, we build the agent tailored to your product \u2014 wired up and ready for your team to use.',
  },
  {
    num: 5,
    title: 'Two weeks of real-world testing',
    description: 'Your team uses the agent on real questions. We track where it\'s right, where it\'s off, collect feedback, and sharpen responses until it\'s genuinely trustworthy.',
  },
  {
    num: 6,
    title: 'We keep it sharp over time',
    description: 'Your data changes. We keep the agent up to date \u2014 maintaining the data model, expanding the knowledge base, and retraining when needed.',
  },
];

const AGENT_FAQS = [
  {
    q: 'How is this different from other AI analytics tools?',
    a: 'Most tools hand you an agent and leave you to figure out the rest. We don\'t. We do the hard work that actually makes agents accurate - cleaning your data, modeling it properly, and building a knowledge base tailored to your business. Every client also gets a fully custom implementation, not a generic setup with your logo on it.',
  },
  {
    q: 'How much does this cost?',
    a: 'Setup is typically between $3,000 and $20,000, depending on how much data you have and how much work it needs before the agent can use it reliably. We scope this on the call, so there are no surprises.',
  },
  {
    q: 'Why should we work with you?',
    a: 'We\'ve worked with 150+ startups and sit at the intersection of two things most teams don\'t have in one place - deep expertise in AI agents, and serious experience in data modeling and documentation. Getting an agent to work well needs both. Most vendors only bring one.',
  },
  {
    q: 'Why do most AI analytics agents give bad answers?',
    a: 'Because the problem isn\'t the AI - it\'s the data underneath it. Any agent pointed at raw, unmodeled data will struggle. What makes the difference is clean data, proper structure, and thorough documentation on how to use it. That\'s the work most tools skip. It\'s the work we do first.',
  },
];

export default function AIAnalyticsAgent() {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

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
        mixpanel.track('Calendly Date and Time Selected', { location: 'ai_agent_page' });
      }
      if (e.data.event === 'calendly.event_scheduled') {
        mixpanel.track('Calendly Event Scheduled', { location: 'ai_agent_page' });
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const scrollToCalendly = (e) => {
    e.preventDefault();
    mixpanel.track('CTA Clicked', { cta_text: "Want to set this up? Let's talk", location: 'ai_agent_page' });
    document.getElementById('calendly')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <SEO
        title="AI Analytics Agent"
        description="Done-for-you AI analytics — we clean your data, build a custom knowledge base, and deliver an AI agent your team can query in plain English."
        path="/ai-analytics-agent"
      />
      {/* Hero */}
      <section className="section ai-agent-hero">
        <div className="container">
          <div className="section-header center">
            <h1>Done-For-You AI Analytics</h1>
            <p className="section-lead">
              We handle everything your data needs to work - cleaning, modeling, and a custom knowledge base - then build and maintain an AI analytics agent your team can query in plain English.
            </p>
          </div>
        </div>
      </section>

      {/* Video */}
      <div className="ai-agent-video-wrap">
        <div className="container">
          <div className="ai-agent-video">
            <video
              autoPlay
              muted
              loop
              playsInline
              style={{ playbackRate: 1.5 }}
              ref={(el) => { if (el) el.playbackRate = 1.5; }}
            >
              <source src="/ai-agent-video-new.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>

      {/* CTA #1 */}
      <div className="ai-agent-cta">
        <button className="btn primary px-6 py-3.5 text-base" onClick={scrollToCalendly}>
          Want to set this up? Let's talk
        </button>
      </div>

      {/* Our Process */}
      <section className="section ai-agent-process" id="our-process">
        <div className="container">
          <div className="section-header center">
            <h2>Our Process</h2>
          </div>
          <div className="ai-agent-steps">
            {PROCESS_STEPS.map((step) => (
              <div key={step.num} className="ai-agent-step">
                <div className="ai-agent-step-num">{step.num}</div>
                <div className="ai-agent-step-content">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section ai-agent-faq" id="faq">
        <div className="container">
          <div className="section-header center">
            <h2>Frequently Asked Questions</h2>
          </div>
          <div className="faq-list">
            {AGENT_FAQS.map((faq, i) => (
              <details
                key={faq.q}
                className="faq-item"
                open={openFaqIndex === i}
              >
                <summary onClick={(e) => { e.preventDefault(); setOpenFaqIndex((prev) => (prev === i ? null : i)); }}>
                  <img src="/datalyze logo updated.svg" alt="" className="faq-arrow-icon" aria-hidden="true" />
                  <span className="faq-question">{faq.q}</span>
                  <span className="faq-toggle">{openFaqIndex === i ? '−' : '+'}</span>
                </summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Calendly */}
      <section id="calendly" className="section callout">
        <div className="container">
          <div className="section-header center">
            <h1>Book a call with us</h1>
            <h3>Let's talk how we can get the AI agent up and running for your business</h3>
          </div>
          <div
            className="calendly-inline-widget"
            data-url="https://calendly.com/anshagrawal17091999/chat?hide_event_type_details=1&hide_gdpr_banner=1"
            style={{ minWidth: '320px', height: '700px' }}
          />
        </div>
      </section>
    </>
  );
}
