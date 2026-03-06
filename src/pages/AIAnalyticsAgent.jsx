import { useState, useEffect } from 'react';

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
    q: 'How is this different from other AI analytics agents/tools out there?',
    a: 'We\'re not selling you an AI agent—we\'re helping you get the right data and knowledge base to the agent, which is what makes the difference. Additionally, we do a separate agent implementation for every client, which means we can customize it any way you\'d like for your business.',
  },
  {
    q: 'How much does this cost?',
    a: 'The setup cost varies anywhere between $3,000 to $20,000 depending on how extensive your data is and how clunky or messy it is.',
  },
  {
    q: 'Why should we hire you to do this?',
    a: 'We\'re a team of folks that have worked with 150+ startups and have deep expertise in how AI agents work, along with how best to model data and create documentation for it.',
  },
  {
    q: 'Why do most AI agents do a horrible job?',
    a: 'AI agents just added on top of any data will always do a horrible job. It\'s not the AI, it\'s the data. For agents to do a good job, you need to have good, clean data and extensive documentation on how to use it.',
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

  const scrollToCalendly = (e) => {
    e.preventDefault();
    document.getElementById('calendly')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
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
              <source src="/ai-agent-video.mp4" type="video/mp4" />
              <source src="/AI%20agent%20video.mov" type="video/quicktime" />
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
