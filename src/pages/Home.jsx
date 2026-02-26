import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

function LogoImg({ src, name }) {
  return <img src={src} alt={name} loading="lazy" />;
}

const CLIENT_LOGOS = [
  { file: 'AWeber.png', name: 'AWeber' },
  { file: 'AlgoTest.png', name: 'AlgoTest' },
  { file: 'CRED.png', name: 'CRED' },
  { file: 'CarAdvise.png', name: 'CarAdvise' },
  { file: 'College tools.png', name: 'College Tools' },
  { file: 'Copyfy.png', name: 'Copyfy' },
  { file: 'Creattie.png', name: 'Creattie' },
  { file: 'Delightree.png', name: 'Delightree' },
  { file: 'Drops.png', name: 'Drops', dark: true},
  { file: 'Endorhealth.png', name: 'EndorHealth' },
  { file: 'FireRecruitmentAustralia.png', name: 'Fire Recruitment Australia'},
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
  { file: 'Sortme.png', name: 'Sortme'},
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

// Split logos into 4 columns for vertical marquee
const COL_SIZE = Math.ceil(CLIENT_LOGOS.length / 4);
const LOGO_COLUMNS = [
  CLIENT_LOGOS.slice(0, COL_SIZE),
  CLIENT_LOGOS.slice(COL_SIZE, COL_SIZE * 2),
  CLIENT_LOGOS.slice(COL_SIZE * 2, COL_SIZE * 3),
  CLIENT_LOGOS.slice(COL_SIZE * 3),
];

function LogoMarquee() {
  return (
    <div className="logo-marquee-box">
      {LOGO_COLUMNS.map((col, colIdx) => (
        <div
          key={colIdx}
          className="logo-marquee-col"
          style={{ animationDelay: `${colIdx * -2}s` }}
        >
          <div className="logo-marquee-track">
            {[...col, ...col].map((logo, i) => (
              <div key={i} className={`logo-marquee-cell${logo.dark ? ' logo-marquee-cell--dark' : ''}`}>
                <LogoImg src={logo.src} name={logo.name} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const TECH_STACK_IMAGES = [
  'amplitude.svg',
  'bigquery.svg',
  'databricks.svg',
  'fivetran.svg',
  'google analytics.svg',
  'google tag manager.svg',
  'growthbook.svg',
  'hubspot.svg',
  'looker studio.svg',
  'metabase.svg',
  'mixpanel.svg',
  'optimizely.svg',
  'posthog.svg',
  'power BI.svg',
  'redash.svg',
  'rudderstack.svg',
  'segment.svg',
  'slack.svg',
  'snowflake.svg',
  'statsig.svg',
  'tableau.svg',
  'vwo.svg',
].map((file) => ({
  src: `/tech-stack-svg/${encodeURIComponent(file)}`,
  name: file.replace(/\.svg$/i, '').replace(/\b\w/g, (c) => c.toUpperCase()),
}));

const WHY_ITEMS = [
  {
    title: 'Data consolidation',
    image: '/why-work-with-us-icons/data-consolidation.svg',
    body: [
      'Fragmented data makes it hard to understand how users actually move through your product. When events, tools, and sources don\'t talk to each other, insights break down and decisions become guesswork.',
    ],
    emphasis: 'We bring everything together into one clean, reliable view so you can see the full user journey and build on it with confidence.',
  },
  {
    title: 'The team',
    image: '/why-work-with-us-icons/the-team.svg',
    body: [
      'We\'re a small, flexible team of senior consultants with deep experience in tech and product analytics. Collectively, we\'ve worked with over 150 companies, including brands like Wellness Coach, CRED, and Final Round AI.',
    ],
    emphasis: 'You work directly with experienced operators, not layers of account managers.',
  },
  {
    title: 'Response time',
    image: '/why-work-with-us-icons/fast-response-times.svg',
    body: [
      'Most agencies move slowly and stick rigidly to what\'s written in the contract. That often means delays, handoffs, and limited support.',
      'We work differently. We respond fast, take ownership, and do what\'s needed to help you grow, even if it goes beyond the original scope.',
    ],
    emphasis: 'That\'s how we think about partnerships.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Sandeep',
    role: 'Founder, Marketing Strategy Labs',
    text: 'Ansh is an absolute pleasure to work with. Throughout the project, he was extremely professional, came up with suggestions, took initiative to recommend best practices, and made a tough project look easy. In the end, we were absolutely thrilled at having found him and are excited that our project ended so well, all because Ansh took ownership and delivered with absolute perfection. Highly recommended, will definitely work with him again!',
    avatar: '/testimonials/Sandeep.jpeg',
    rating: 5,
  },
  {
    name: 'Nick',
    role: 'Product Owner, Sama',
    text: 'Ansh was incredibly helpful in three main ways: first his detailed technical knowledge of MixPanel helped me solve specific implementation problems and needs quickly, usually within a few minutes. Second, he pushed me to frame my thinking about why I wanted a certain piece of analysis. This helped me get far clearer on my goals - sometimes leading to me running different analysis, dropping a piece altogether and always helping me think more strategically. Finally, Ansh has a lot more to offer than just MixPanel advice - he\'s able to think strategically about north star and second level metrics, helping me figure out the why behind the work I was doing.',
    avatar: null,
    rating: 5,
  },
  {
    name: 'Christian',
    role: 'Founder, Tiun',
    text: 'Ansh was extremely helpful in developing our V2 analytics strategy and in setting up our Mixpanel dashboards accordingly. He was not only proactive in bringing his expertise but also highly adaptable to our specific needs. Ansh played a key role in identifying effective solutions where standard approaches were insufficient, delivering all his tasks with great professionalism and impressive speed. Looking forward to future projects with you, Ansh!',
    avatar: '/testimonials/Christian.jpeg',
    rating: 5,
  },
  {
    name: 'Moshe',
    role: 'SEO Consultant',
    text: 'Had the pleasure of working with Ansh on a Mixpanel project for our client, where we aimed to implement Mixpanel to deepen our understanding of customer interactions and drive data-driven decision-making. From the outset, Ansh demonstrated an exceptional grasp of Mixpanel\'s capabilities and an insightful approach to leveraging this tool to meet our unique business needs. I am impressed with the level of professionalism, dedication, and insight Ansh brought to this project. I highly recommend Ansh to any organization looking to leverage Mixpanel or any other analytics platform to its fullest extent.',
    avatar: '/testimonials/Moshe.jpeg',
    rating: 5,
  },
  {
    name: 'Srinivas',
    role: 'Founder, Phygital',
    text: 'Ansh helped us in implementing mixpanel analytics to our system. He has been very knowledgeable w.r.t to mixpanel as a tool and prompt with his deliverables. We faced some data loss issues while integrating wordpress with webapp but it appears to be a limitation of the tool. We appreciate his support.',
    avatar: null,
    rating: 5,
  },
  {
    name: 'Raghav',
    role: 'Founder, AlgoTest',
    text: 'Ansh has been excellent with setting up our mixpanel pipeline and providing insightful analytics. He\'s always available, humble, and always ready to learn more about the product!',
    avatar: '/testimonials/Raghav.jpeg',
    rating: 5,
  },
  {
    name: 'Robby',
    role: 'Founder, Influencer Marketing',
    text: 'Ansh is smart, talented, organized, and great to work with. He\'s a very technical expert and we would highly recommend his mind to help solve complex business problems.',
    avatar: null,
    rating: 5,
  },
  {
    name: 'Ben',
    role: 'Founder, Kliq',
    text: 'Working with Ansh made our data flow seamless. He helped us set up a pipeline from Google Analytics and BigQuery to Mixpanel, ensuring we could easily track and analyze user behavior. The dashboards he created have become an essential tool for our team\'s decision-making. Would definitely work with him again and highly recommend him to anyone looking to overcome analytics challenges.',
    avatar: '/testimonials/Ben.jpeg',
    rating: 5,
  },
  {
    name: 'Chris',
    role: 'Founder, VideoTap',
    text: 'Ansh gets straight to work and gives value to you very quickly. His process is very thorough and his knowledge of how people flow through an app is impressive. He immediately found places that our site needed improvements and gave us actionable dashboards that we could watch weekly.',
    avatar: '/testimonials/Chris.jpeg',
    rating: 5,
  },
  {
    name: 'Kaivan',
    role: 'Founder, FRAI',
    text: 'Ansh has been a fantastic partner on our BI work. He built much of our Amplitude setup and consistently delivers accurate, trustworthy data. More importantly, he turns that data into clear, actionable insights that drive real decisions. Highly reliable and easy to work with.',
    avatar: '/testimonials/Kaivan.jpeg',
    rating: 5,
  },
  {
    name: 'Ryan',
    role: 'Product Growth, Termplus',
    text: 'Ansh partnered with our fintech in a very short time-frame to set up advanced tracking and integrated data and analytics that align with every stage of our customer journey. His work has already helped us drive product growth and understand the impact of our marketing and user behaviour. Ansh is incredibly understanding, flexible, and easy to work with. He delivers smart, practical solutions and is a true professional, always taking the time to understand our unique business and provide meaningful tools, insights, and results. We\'re excited to continue partnering with him.',
    avatar: '/testimonials/Ryan.jpeg',
    rating: 5,
  },
];

function StarRating({ rating, active = false, max = 5 }) {
  return (
    <span className="testimonial-stars" aria-label={`${rating} out of ${max} stars`}>
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={`testimonial-star ${i < rating ? 'filled' : 'empty'} ${active ? 'active' : ''}`}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </span>
  );
}

const SLIDER_POS_COORDS = {
  top:    { left: '150px', top: '118px' },
  middle: { left: '200px', top: '225px' },
  bottom: { left: '150px', top: '332px' },
};

function TestimonialSlider({ testimonials, activeIndex, onSelect }) {
  const n = testimonials.length;
  const [wrapIndex, setWrapIndex] = useState(null);
  const prevActiveRef = useRef(activeIndex);

  useEffect(() => {
    const prev = prevActiveRef.current;
    if (prev !== activeIndex) {
      // When rotating downward (decrement), the item at bottom wraps up to top
      const wrapping = (prev + 1) % n;
      setWrapIndex(wrapping);
      const t = setTimeout(() => setWrapIndex(null), 50);
      prevActiveRef.current = activeIndex;
      return () => clearTimeout(t);
    }
  }, [activeIndex, n]);

  const getPos = (i) => {
    const offset = (i - activeIndex + n) % n;
    if (offset === 0) return 'middle';
    if (offset === n - 1) return 'top';
    if (offset === 1) return 'bottom';
    return null;
  };

  return (
    <div className="testimonial-slider-wrap">
      {/* Arc SVG — direct child of wrap so it sits behind items */}
      <svg
        viewBox="0 0 320 450"
        className="testimonial-slider-arcs"
        aria-hidden="true"
      >
        <path
          d="M 60 85 A 140 140 0 0 1 60 365"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>

      {/* Items are direct children of wrap — unambiguous absolute positioning */}
      {testimonials.map((t, i) => {
        const pos = getPos(i);
        if (!pos) return null;
        const isActive = pos === 'middle';
        return (
          <div
            key={i}
            className={`testimonial-slider-pos testimonial-slider-pos-${pos}${wrapIndex === i ? ' wrapping' : ''}`}
            style={SLIDER_POS_COORDS[pos]}
          >
            <button
              type="button"
              className={`testimonial-slider-row ${isActive ? 'active' : 'inactive'}`}
              onClick={() => !isActive && onSelect(i)}
              aria-pressed={isActive}
              aria-label={isActive ? `Current: ${t.name}` : `Show testimonial by ${t.name}`}
            >
              <span className="testimonial-slider-avatar">
                {t.avatar ? <img src={t.avatar} alt="" /> : (t.name || '?').charAt(0)}
              </span>
              <span className="testimonial-slider-info">
                <span className="testimonial-slider-name">{t.name}</span>
                <StarRating rating={isActive ? (t.rating ?? 5) : 5} active={isActive} />
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}

const GROWTH_STEPS = [
  {
    num: 1,
    title: 'Set up your data for accuracy',
    description: [
      "Most startups struggle with one core problem: they don't fully trust their data. Events break, definitions drift, and numbers don't line up across tools.",
      "We start by fixing this. We audit your setup, clean up what's broken, and put checks in place so your team can rely on the data again.",
    ],
    icon: '/growth-model-icons/accurate-data.svg',
  },
  {
    num: 2,
    title: 'Data fragmentation',
    description: [
      "Data often lives across multiple tools, each showing only part of the story. While individual reports are useful, they don't show how users move end to end through your product.",
      "We consolidate your data into a single, consistent view so you can clearly see what's happening and make decisions that actually impact growth and revenue.",
    ],
    icon: '/growth-model-icons/data-fragmentation.svg',
  },
  {
    num: 3,
    title: 'User behavioural insights & reporting',
    description: [
      "Once the foundation is solid, we build clear reports and dashboards that show how users behave, where they drop off, and what's working versus what isn't.",
      "These dashboards are designed for daily use, giving your team a simple way to monitor product health and spot issues early.",
    ],
    icon: '/growth-model-icons/insights-reporting.svg',
  },
  {
    num: 4,
    title: 'Alerting',
    description: [
      "Data breaks often go unnoticed until it's too late. A small tracking issue can quietly affect weeks of analysis.",
      "We set up alerts that flag problems as soon as they happen, so issues are caught early and fixed fast.",
    ],
    icon: '/growth-model-icons/alerting.svg',
  },
  {
    num: 5,
    title: 'Ongoing Analysis & experimentation',
    description: [
      "With the basics in place, we work with you on continuous analysis. We help track new features, uncover insights, suggest experiments to run, and measure their impact over time.",
      "In short, we take ownership of analytics so your team can focus on building and shipping.",
    ],
    icon: '/growth-model-icons/analysis-experimentation.svg',
  },
  {
    num: 6,
    title: 'Models to support growth & enabling the team to do quick analytics',
    description: [
      "We go beyond dashboards. We help you build data models that combine full user journeys and unlock deeper analysis.",
      "This includes models for use cases like identifying users at risk of churn and understanding their attributes to personalize retention strategies. These foundations also enable your team to answer questions quickly without waiting on complex analysis.",
    ],
    icon: '/growth-model-icons/growth-analytics.svg',
  },
];

const HOME_FAQS = [
  { q: 'What is Datalyze?', a: 'Datalyze is an analytics and growth partner. We help you set up your data correctly, understand how users behave, and use those insights to run experiments and improve revenue.' },
  { q: 'How fast can you get started?', a: 'We can usually start within a day once you decide to work with us.' },
  { q: 'Who will I work with?', a: "You'll work with a small, focused team based on your needs. This may include a product analyst, analytics engineer, growth strategist, and developer. There are no unnecessary layers." },
  { q: 'How is pricing structured?', a: 'Pricing is either one-time or monthly, depending on the scope and duration of the work.' },
  { q: 'What do you need from our team?', a: 'We may need light developer support to implement tracking, add events, or help with data foundations for modeling.' },
  { q: 'What does a typical engagement look like?', a: 'We usually have at least one call per week to review progress, share insights, and align on priorities for the coming week.' },
];


export default function Home() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const isPaused = useRef(false);
  const [activeStep, setActiveStep] = useState(0);
  const [hoveredStep, setHoveredStep] = useState(null);
  const growthSectionRef = useRef(null);
  const growthListRef = useRef(null);

  useEffect(() => {
    const id = setInterval(() => {
      if (!isPaused.current) {
        setTestimonialIndex(i => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
      }
    }, 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    function handleScroll() {
      const section = growthSectionRef.current;
      if (!section) return;
      const scrolledIn = -section.getBoundingClientRect().top;
      if (scrolledIn < 0) { setActiveStep(0); return; }
      const scrollTravel = section.offsetHeight - window.innerHeight;
      const newStep = Math.max(0, Math.min(GROWTH_STEPS.length - 1, Math.floor((scrolledIn / scrollTravel) * GROWTH_STEPS.length)));
      setActiveStep(newStep);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="home-hero section" id="hero">
        <div className="container">
            <div className="home-hero-logo-wrap">
            <img src="/datalyze logo updated.svg" alt="Datalyze" className="home-hero-logo" />
          </div>
          <div className="home-hero-inner">
            <div className="home-hero-left">
              <h1 className="home-hero-title">
                Turn user behavior<br />
                into measurable<br />
                <span style={{whiteSpace: 'nowrap'}}>growth and revenue</span><br />
                with Datalyze
              </h1>
              <p className="home-hero-lead">
                We help teams collect clean data, unlock insights, and run experiments that compound.
                From tracking and dashboards to deep analysis and experimentation—we're your fractional analytics and growth partner.
              </p>
              <div className="home-hero-ctas">
                <Link className="btn primary" to="/contact">Get a Free 30 min Audit</Link>
                <Link className="btn ghost home-btn-outline" to="/case-studies">See Case Studies</Link>
              </div>
            </div>
            <div className="home-hero-right">
              <LogoMarquee />
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
              <div key={item.title} className="home-why-card">
                <div className="home-why-card-header">
                  <img src="/datalyze logo updated.svg" alt="" className="home-why-arrow-logo" aria-hidden="true" />
                  <h3 className="home-why-card-title">{item.title}</h3>
                </div>
                <div className="home-why-image-wrap">
                  <img src={item.image} alt={item.title} className="home-why-image" />
                </div>
                <div className="home-why-card-body">
                  {item.body.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                  <p className="home-why-emphasis">{item.emphasis}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        className="section home-testimonials"
        id="testimonials"
        onMouseEnter={() => { isPaused.current = true; }}
        onMouseLeave={() => { isPaused.current = false; }}
      >
        <div className="container">
          <div className="section-header">
            <h2>Testimonials</h2>
            <p className="section-lead">What our partners say about working with us.</p>
          </div>
          <div className="home-testimonials-inner">
            <div className="home-testimonials-slider-col">
              <TestimonialSlider
                testimonials={TESTIMONIALS}
                activeIndex={testimonialIndex}
                onSelect={setTestimonialIndex}
              />
            </div>
            <div className="home-testimonial-content" key={testimonialIndex}>
              <span className="home-testimonial-quote" aria-hidden="true">"</span>
              <p className="home-testimonial-text">{TESTIMONIALS[testimonialIndex].text}</p>
              <p className="home-testimonial-meta">
                {TESTIMONIALS[testimonialIndex].name}, {TESTIMONIALS[testimonialIndex].role}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA after Testimonials */}
      <div className="home-section-cta">
        <Link className="btn primary" to="/contact">Get a Free 30 min Audit</Link>
      </div>

      {/* Tech Stack - 6 columns, images only */}
      <section className="section home-tech" id="tech-stack">
        <div className="container">
          <div className="section-header">
            <h2>Tech Stack</h2>
            <p className="section-lead">Tools and platforms we work with every day.</p>
          </div>
          <div className="home-tech-grid">
            {TECH_STACK_IMAGES.map((item, i) => (
              <div key={i} className="home-tech-cell" title={item.name}>
                <img src={item.src} alt={item.name} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Growth model */}
      <div className="home-growth-outer" ref={growthSectionRef} id="growth-model">
        {/* Heading scrolls away normally — not part of the sticky panel */}
        <div className="home-growth-heading">
          <div className="container">
            <div className="section-header">
              <h2>Our Growth Model</h2>
              <p className="section-lead">A clear path from messy data to measurable growth.</p>
            </div>
          </div>
        </div>
        <div className="home-growth-sticky">
          <div className="container">
            <div className="home-growth-list-wrap">
              <div
                className="home-growth-list"
                ref={growthListRef}
              >
                <div className="home-growth-line" aria-hidden="true" />
                {GROWTH_STEPS.map((step, idx) => (
                  <div
                    key={step.num}
                    className={`home-growth-item${idx === (hoveredStep ?? activeStep) ? ' is-active' : ''}`}
                    onMouseEnter={() => setHoveredStep(idx)}
                    onMouseLeave={() => setHoveredStep(null)}
                  >
                    <div className="home-growth-num">{step.num}</div>
                    <div className="home-growth-icon-box">
                      <img src={step.icon} alt="" aria-hidden="true" className="home-growth-icon-img" />
                    </div>
                    <div className="home-growth-copy">
                      <h3 className="home-growth-title">{step.title}</h3>
                      {step.description.map((para, i) => (
                        <p key={i} className="home-growth-desc">{para}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA after Growth Model */}
      <div className="home-section-cta">
        <Link className="btn primary" to="/contact">Get a Free 30 min Audit</Link>
      </div>

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
    </>
  );
}
