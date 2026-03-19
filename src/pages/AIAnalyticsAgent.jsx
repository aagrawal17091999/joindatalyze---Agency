import { useState, useEffect } from 'react';
import mixpanel from '../utils/mixpanel';
import SEO from '../components/SEO';

const CLIENT_LOGOS = [
  { file: 'AWeber.png', name: 'AWeber' },
  { file: 'AlgoTest.png', name: 'AlgoTest' },
  { file: 'CRED.png', name: 'CRED' },
  { file: 'CarAdvise.png', name: 'CarAdvise' },
  { file: 'College tools.png', name: 'College Tools' },
  { file: 'Copyfy.png', name: 'Copyfy' },
  { file: 'Creattie.png', name: 'Creattie' },
  { file: 'Delightree.png', name: 'Delightree' },
  { file: 'Drops.png', name: 'Drops', dark: true },
  { file: 'Endorhealth.png', name: 'EndorHealth' },
  { file: 'FireRecruitmentAustralia.png', name: 'Fire Recruitment Australia' },
  { file: 'Foriio.png', name: 'Foriio' },
  { file: 'Fraim.png', name: 'Fraim' },
  { file: 'GameTree.png', name: 'GameTree' },
  { file: 'GelatoPique.png', name: 'Gelato Pique' },
  { file: 'GrantMe.png', name: 'GrantMe' },
  { file: 'Inferless.png', name: 'Inferless' },
  { file: 'InfluencerMarketing.png', name: 'Influencer Marketing AI' },
  { file: 'Jabu.png', name: 'Jabu' },
  { file: 'KeywordInsights.png', name: 'Keyword Insights' },
  { file: 'Kliq.png', name: 'Kliq' },
  { file: 'Kryptos.png', name: 'Kryptos' },
  { file: 'Louper.png', name: 'Louper' },
  { file: 'Magma.png', name: 'Magma' },
  { file: 'Mask group.png', name: 'Mask Group', dark: true },
  { file: 'Mottiv.png', name: 'Mottiv' },
  { file: 'Mylance.png', name: 'Mylance' },
  { file: 'Nokio.png', name: 'Nokio' },
  { file: 'Oswal.png', name: 'Oswal' },
  { file: 'Patrimore.png', name: 'Patrimore' },
  { file: 'PetAcademy.png', name: 'PetAcademy' },
  { file: 'Phygital.png', name: 'Phygital' },
  { file: 'Pixis.png', name: 'Pixis' },
  { file: 'Ramped.png', name: 'Ramped' },
  { file: 'Sama.png', name: 'Sama' },
  { file: 'Sanaam.png', name: 'Sanaam' },
  { file: 'Sequens.png', name: 'Sequens' },
  { file: 'Serendipity.png', name: 'Serendipity' },
  { file: 'Silverfort.png', name: 'Silverfort' },
  { file: 'Sol.png', name: 'Sol' },
  { file: 'Sortme.png', name: 'Sortme' },
  { file: 'Sucasa.png', name: 'Sucasa' },
  { file: 'Tiun.png', name: 'Tiun' },
  { file: 'Uplers.png', name: 'Uplers' },
  { file: 'coursebox.png', name: 'Coursebox' },
  { file: 'digitap.png', name: 'Digitap' },
  { file: 'final round ai.png', name: 'Final Round AI' },
  { file: 'magnar.png', name: 'Magnar' },
  { file: 'superhote.png', name: 'Superhote' },
  { file: 'termplus.png', name: 'Termplus' },
  { file: 'wellness coach.png', name: 'Wellness Coach' },
].map((item) => ({
  src: `/logos/${encodeURIComponent(item.file)}`,
  name: item.name,
  ...(item.dark && { dark: true }),
}));

const PROCESS_STEPS = [
  {
    num: 1,
    title: 'We start with a call',
    description: 'We learn how your business actually works \u2014 what questions your team asks, what data you have, and what needs to flow into the agent to give useful answers.',
  },
  {
    num: 2,
    title: 'We clean and model your data for automated analysis',
    description: 'Raw data breaks AI. We fix inaccuracies, unify data from multiple sources, and structure it in a way the agent can reason over reliably \u2014 leaving you with clean, reusable tables as a bonus.',
  },
  {
    num: 3,
    title: 'We build your AI analytics agent\'s brain',
    description: 'This is what most tools skip. We create a deep knowledge base covering your business context, metric definitions, table relationships, and common use cases \u2014 so the agent understands your product, not just your schema.',
  },
  {
    num: 4,
    title: 'We build your data analyst AI or set up the right tool',
    description: 'With clean data and a solid knowledge base in place, we either build a custom AI agent tailored to your product or configure AI data analytics tools like Julius AI, DataGPT, or Vanna.ai on top of your data. Wired up and ready for your team to use.',
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
    q: 'How is this different from other AI data analytics tools?',
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
    q: 'Why do most AI data analytics agents give bad answers?',
    a: 'Because the problem isn\'t the AI - it\'s the data underneath it. Any agent pointed at raw, unmodeled data will struggle. What makes the difference is clean data, proper structure, and thorough documentation on how to use it. That\'s the work most tools skip. It\'s the work we do first.',
  },
  {
    q: 'Do I need SQL or technical skills to use this?',
    a: 'No. The whole point is that your team asks questions in plain English. No SQL, no code, no query builders. We handle all the technical setup so you don\'t have to.',
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
        window.gtag('event', 'conversion', {
          'send_to': 'AW-18010353889/q2vPCKXQkIccEOHhgIxD',
        });
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

  const scrollToProcess = (e) => {
    e.preventDefault();
    mixpanel.track('CTA Clicked', { cta_text: 'See How It Works', location: 'ai_agent_page' });
    document.getElementById('our-process')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <SEO
        title="Done-For-You AI Data Analytics"
        description="Done-for-you AI data analytics — we clean your data, build a custom knowledge base, and deliver an AI agent your team can query in plain English. No SQL needed."
        path="/ai-analytics-agent"
      />
      {/* Hero */}
      <section className="section ai-agent-hero">
        <div className="container">
          <div className="section-header center">
            <h1>Done-For-You AI Data Analytics</h1>
            <p className="section-lead">
              We clean your data, model it, and build a custom knowledge base. Then we either build you a custom AI data analytics agent or set up AI tools for data analytics like Julius AI, Vanna.ai, or DataGPT on top of it. No SQL needed. Your team asks questions in plain English.
            </p>
            <div className="ai-agent-hero-ctas">
              <button className="btn primary px-6 py-3.5 text-base" onClick={scrollToCalendly}>
                Want to set this up? Let's talk
              </button>
              <button className="btn secondary px-6 py-3.5 text-base" onClick={scrollToProcess}>
                See How It Works
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Logo Marquee */}
      <div className="ai-agent-logo-marquee">
        <div className="ai-agent-logo-track">
          <div className="ai-agent-logo-set">
            {CLIENT_LOGOS.map((logo) => (
              <div key={logo.name} className={`ai-agent-logo-cell${logo.dark ? ' ai-agent-logo-cell--dark' : ''}`}>
                <img src={logo.src} alt={logo.name} />
              </div>
            ))}
          </div>
          <div className="ai-agent-logo-set" aria-hidden="true">
            {CLIENT_LOGOS.map((logo) => (
              <div key={logo.name} className={`ai-agent-logo-cell${logo.dark ? ' ai-agent-logo-cell--dark' : ''}`}>
                <img src={logo.src} alt={logo.name} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video */}
      <div className="ai-agent-video-wrap">
        <div className="container">
          <div className="ai-agent-video">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster="/ai-agent-poster.jpg"
              style={{ playbackRate: 1.5 }}
              ref={(el) => { if (el) el.playbackRate = 1.5; }}
            >
              <source src="/ai-agent-video-new.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>

      {/* How we do this */}
      <section className="section ai-agent-process ai-agent-process--tight" id="our-process">
        <div className="container">
          <div className="section-header center">
            <h2>How we do this?</h2>
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
