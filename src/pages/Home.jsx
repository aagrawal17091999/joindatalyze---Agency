import { useState } from 'react';
import { Link } from 'react-router-dom';

const TECH_STACK_CELLS = 16;

const WHY_ITEMS = [
  {
    title: 'Data consolidation',
    description: 'We bring your data from multiple sources into one reliable view so you can see the full picture and make decisions with confidence.',
    icon: (
      <svg className="home-why-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM16 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM16 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    title: 'The team',
    description: 'A small team of experts focused on analytics, data engineering, and growth. We work alongside your product and growth teams with no unnecessary layers.',
    icon: (
      <svg className="home-why-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    title: 'Responsiveness',
    description: 'We move fast and stay aligned. Clear communication, quick turnaround on insights, and a partnership that adapts to your priorities.',
    icon: (
      <svg className="home-why-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 12h8M8 16h8M8 8h4M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5" />
      </svg>
    ),
  },
];

const TESTIMONIALS = [
  {
    name: 'John Doe',
    role: 'CEO, Company Name',
    text: 'Datalyze helped us turn scattered data into a single source of truth. Our team now makes decisions in hours, not days. Highly recommend.',
    avatar: null,
  },
  {
    name: 'Jane Smith',
    role: 'Head of Growth, Startup Co',
    text: 'The analytics foundation they built has been a game-changer. We finally have clean funnels and reliable metrics we can trust.',
    avatar: null,
  },
  {
    name: 'Alex Chen',
    role: 'Product Lead, Tech Inc',
    text: 'Professional, responsive, and deeply knowledgeable. They integrated with our stack seamlessly and delivered exactly what we needed.',
    avatar: null,
  },
];

const GROWTH_STEPS = [
  { num: 1, title: 'Set up your data for accuracy', description: 'We audit your tracking and data pipelines so your numbers are reliable and consistent.' },
  { num: 2, title: 'Consolidate and unify sources', description: 'Bring product, marketing, and revenue data into one view with clear user mapping.' },
  { num: 3, title: 'Build dashboards and reports', description: 'Create simple, actionable reports your team can use every day.' },
  { num: 4, title: 'Uncover insights and opportunities', description: 'Deep analysis to understand behavior, find drop-offs, and spot high-impact levers.' },
  { num: 5, title: 'Design and run experiments', description: 'Turn insights into tests—we help you design, measure, and scale what works.' },
  { num: 6, title: 'Scale what works', description: 'Double down on winning experiments and build systems that compound growth over time.' },
];

const HOME_FAQS = [
  { q: 'How do you get started?', a: 'We typically begin with a short discovery call to understand your goals and data landscape. From there we propose a scope and timeline.' },
  { q: 'What is Datalyze?', a: 'Datalyze is an analytics and growth partner. We help you set up your data correctly, understand how users behave, and use those insights to run experiments and improve revenue.' },
  { q: 'How fast can you get started?', a: 'We can usually start within a day once you decide to work with us.' },
  { q: 'Who will I work with?', a: "You'll work with a small, focused team based on your needs—product analyst, analytics engineer, growth strategist—with no unnecessary layers." },
];

function HeroDataIcon() {
  return (
    <svg className="home-hero-center-icon" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <circle cx="32" cy="20" r="4" fill="currentColor" opacity="0.9" />
      <circle cx="20" cy="40" r="4" fill="currentColor" opacity="0.7" />
      <circle cx="44" cy="40" r="4" fill="currentColor" opacity="0.7" />
      <path d="M32 24v8M32 32l-8 8M32 32l8 8" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
    </svg>
  );
}

function HeroGridIcon() {
  return (
    <svg className="home-hero-grid-cell-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <rect x="4" y="4" width="16" height="16" rx="2" opacity="0.5" />
      <path d="M9 12h6M12 9v6" opacity="0.8" />
    </svg>
  );
}

export default function Home() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  return (
    <>
      {/* Hero */}
      <section className="home-hero section" id="hero">
        <div className="container">
          <div className="home-hero-inner">
            <div className="home-hero-left">
              <div className="home-hero-icon-wrap">
                <HeroDataIcon />
              </div>
              <h1 className="home-hero-title">
                Turn user behavior into measurable growth and revenue with Datalyze
              </h1>
              <p className="home-hero-lead">
                We help teams collect clean data, unlock insights, and run experiments that compound.
                From tracking and dashboards to deep analysis and experimentation—we're your fractional analytics and growth partner.
              </p>
              <div className="home-hero-ctas">
                <Link className="btn primary" to="/contact">Get Started</Link>
                <Link className="btn ghost home-btn-outline" to="/about">Learn More</Link>
              </div>
            </div>
            <div className="home-hero-right">
              <div className="home-hero-grid">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="home-hero-grid-cell">
                    <HeroGridIcon />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why work with us */}
      <section className="section home-why" id="why-work-with-us">
        <div className="container">
          <div className="section-header">
            <h2>Why work with us</h2>
          </div>
          <div className="home-why-grid">
            {WHY_ITEMS.map((item) => (
              <div key={item.title} className="feature-card home-why-card">
                <div className="home-why-icon-wrap">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section home-testimonials" id="testimonials">
        <div className="container">
          <div className="section-header">
            <h2>Testimonials</h2>
            <p className="section-lead">What our partners say about working with us.</p>
          </div>
          <div className="home-testimonials-inner">
            <div className="home-testimonials-avatars">
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className="home-testimonial-avatar" aria-hidden="true">
                  {(t.name || '?').charAt(0)}
                </div>
              ))}
            </div>
            <div className="home-testimonial-content">
              <span className="home-testimonial-quote" aria-hidden="true">"</span>
              <p className="home-testimonial-text">{TESTIMONIALS[0].text}</p>
              <p className="home-testimonial-meta">{TESTIMONIALS[0].name}, {TESTIMONIALS[0].role}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="section home-tech" id="tech-stack">
        <div className="container">
          <div className="section-header">
            <h2>Tech Stack</h2>
            <p className="section-lead">Tools and platforms we work with every day.</p>
          </div>
          <div className="home-tech-grid">
            {Array.from({ length: TECH_STACK_CELLS }).map((_, i) => (
              <div key={i} className="home-tech-cell" />
            ))}
          </div>
        </div>
      </section>

      {/* Our Growth model */}
      <section className="section home-growth" id="growth-model">
        <div className="container">
          <div className="section-header">
            <h2>Our Growth model</h2>
            <p className="section-lead">A clear path from messy data to measurable growth.</p>
          </div>
          <div className="home-growth-list">
            {GROWTH_STEPS.map((step) => (
              <div key={step.num} className="home-growth-item">
                <div className="home-growth-num">{step.num}</div>
                <div className="home-growth-icon-wrap">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 3v18h18M18 9l-5 5-4-4-3 3" />
                  </svg>
                </div>
                <div className="home-growth-copy">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section home-faq" id="faq">
        <div className="container">
          <div className="section-header">
            <h2>Frequently Asked Questions</h2>
          </div>
          <div className="faq-list home-faq-list">
            {HOME_FAQS.map((faq, i) => (
              <details
                key={faq.q}
                className="faq-item"
                open={openFaqIndex === i}
              >
                <summary onClick={(e) => { e.preventDefault(); setOpenFaqIndex((prev) => (prev === i ? null : i)); }}>{faq.q}</summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
