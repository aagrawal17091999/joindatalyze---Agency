import type { Metadata } from 'next';
import Image from 'next/image';
import CtaButton from '../_components/cta-button';
import Faq from '../_components/faq';
import JsonLd from '@/components/seo/JsonLd';
import {
  breadcrumbSchema,
  faqPageSchema,
  orgRef,
  personRef,
  SITE_URL,
} from '@/lib/seo';

export const metadata: Metadata = {
  title: 'About Datalyze & Ansh Agrawal',
  description:
    'Datalyze is an analytics consultancy founded by Ansh Agrawal in 2019. Senior operators only - we rebuild data foundations, then find the growth.',
  alternates: { canonical: '/about' },
};

const TEAM = [
  {
    name: 'Ansh Agrawal',
    role: 'Founder',
    photo: '/Ansh.png',
    photoWidth: 1344,
    photoHeight: 768,
    bio: 'Built analytics infrastructure for 150+ startups since founding Datalyze in 2019. Specializes in product analytics, experimentation, and the messy first 90 days of fixing a broken stack. Mixpanel Certified Partner. Based in India.',
  },
  {
    name: 'Sara Maarouf',
    role: 'Product Growth',
    photo: '/sara-maarouf.jpg',
    photoWidth: 1200,
    photoHeight: 666,
    bio: 'Leads growth and experimentation engagements. Specializes in turning trustworthy data into the experiments that compound - pricing tests, onboarding flows, conversion paths.',
  },
];

// Entity-resolution questions: "who is Ansh Agrawal", "what is Datalyze".
// Every answer here restates a fact already published elsewhere on the site.
const ABOUT_FAQS = [
  {
    q: 'Who is Ansh Agrawal?',
    a: 'The founder of Datalyze. He started his analytics career at CRED, then spent several years freelancing analytics work for startups one at a time before founding Datalyze in 2019. Mixpanel Certified Partner, based in India.',
  },
  {
    q: 'What is Datalyze?',
    a: 'An analytics and growth consultancy for startups. We rebuild the data foundation - events, pipelines, definitions, models - then build the reporting and run the experiments on top of it. Engagements run from a $1,000 audit to $2,000\u2013$5,000 per month embedded work.',
  },
  {
    q: 'How big is the team?',
    a: 'Small and deliberately senior. Every person has built analytics foundations for dozens of companies before joining. You work directly with the people in your data - no account managers, no junior analysts learning on your budget.',
  },
  {
    q: 'Is Datalyze a Mixpanel partner?',
    a: 'Yes - Mixpanel Certified Partner, and a PostHog Implementation Specialist. We also work across Amplitude, Heap, BigQuery, Snowflake, dbt, Segment and the rest of the modern stack.',
  },
];

const NUMBERS = [
  { value: '150+', label: 'companies served' },
  { value: '14%', label: 'average revenue lift' },
  { value: '20+', label: 'tools we work fluently across' },
  { value: '7', label: 'years building foundations' },
];

export default function AboutPage() {
  // The Person and Organization are declared once site-wide (lib/seo.ts) and
  // referenced by @id here, so this page describes itself as the founder's
  // profile page rather than minting a second, competing Person entity.
  const aboutPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${SITE_URL}/about#page`,
    url: `${SITE_URL}/about`,
    name: 'About Datalyze',
    about: orgRef,
    mainEntity: personRef,
  };
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about' },
          ]),
          aboutPageSchema,
          faqPageSchema(ABOUT_FAQS),
        ]}
      />
      {/* Section 1 - Founder note. This is the page's lead content, so its
          title carries the h1; the hero above it only said the same thing in
          third person. */}
      <section className="founder-note page-lead" id="founder-note">
        <div className="container">
          <div className="founder-note__inner">
            <div className="founder-note__header">
              <div className="eyebrow">Why We Exist</div>

              <figure className="founder-note__photo-wrap">
                <Image
                  src="/Ansh.png"
                  alt="Ansh Agrawal, founder of Datalyze"
                  width={840}
                  height={480}
                  sizes="(max-width: 768px) 90vw, 420px"
                  className="founder-note__photo"
                  priority
                />
              </figure>

              <div className="founder-note__caption">
                Ansh Agrawal · Founder
              </div>

              <h1 className="founder-note__title">A note from the founder</h1>
            </div>

            <div className="founder-note__body">
              <p>
                I started my analytics career at CRED. After that, I spent a
                few years freelancing - one startup at a time, fixing
                tracking, unblocking data teams, surfacing insights buried
                under broken foundations.
              </p>
              <p>
                By engagement 30 or 40, I&apos;d seen the same pattern at
                every company: three tools, four dashboards, zero confidence
                in any of the numbers. The fix wasn&apos;t more tools. It was
                the foundation underneath them - the events, pipelines,
                definitions, and models that nobody had time to fix.
              </p>
              <p>
                In 2019, I started Datalyze to do this at scale. Senior
                operators only. No account managers, no junior analysts
                learning on the client&apos;s budget. We fix the foundation
                first, then turn it into the kind of insights that actually
                move revenue.
              </p>
              <p>
                If your data has been telling you three different stories,
                we&apos;d like to help.
              </p>
            </div>

            <div className="founder-note__signature">
              <span className="founder-note__signature-name">
                - Ansh Agrawal
              </span>
              <span className="founder-note__signature-role">
                Founder, Datalyze
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 - Team */}
      <section className="team" id="team">
        <div className="container">
          <header className="team__header">
            <div className="eyebrow eyebrow--center">The Team</div>
            <h2 className="team__title">Who actually does the work?</h2>
            <p className="team__intro">
              Small team. Senior operators only. Every person here has built
              analytics foundations for dozens of companies before joining
              Datalyze.
            </p>
          </header>

          <div className="team__list">
            {TEAM.map((member) => (
              <article key={member.name} className="team-member">
                <figure className="team-member__photo-wrap">
                  <Image
                    src={member.photo}
                    alt={member.name}
                    width={member.photoWidth}
                    height={member.photoHeight}
                    sizes="(max-width: 768px) 100vw, 420px"
                    className="team-member__photo"
                  />
                </figure>
                <h3 className="team-member__name">{member.name}</h3>
                <div className="team-member__role">{member.role}</div>
                <p className="team-member__bio">{member.bio}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5 - Numbers */}
      <section className="numbers" id="numbers">
        <div className="container">
          <div className="numbers__header">
            <div className="eyebrow eyebrow--center">By the Numbers</div>
            <h2 className="numbers__title">
              Seven years. One bet. Repeated 150+ times.
            </h2>
          </div>

          <div className="numbers__grid">
            {NUMBERS.map((stat) => (
              <div key={stat.label} className="number-stat">
                <div className="number-stat__value">{stat.value}</div>
                <div className="number-stat__label">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* An unexplained "14%" is a claim an answer engine hedges or drops.
              One sentence makes it quotable. */}
          <p className="numbers__note">
            The 14% is before-and-after revenue impact of changes we shipped,
            weighted across every engagement - not a best case.
          </p>
        </div>
      </section>

      {/* Section 5b - FAQ. Targets the entity queries ("who is Ansh Agrawal",
          "what is Datalyze") that the site answered nowhere. */}
      <Faq items={ABOUT_FAQS} title="About Datalyze" eyebrow="Questions" />

      {/* Section 6 - Final CTA */}
      <section className="about-cta" id="book">
        <div className="container">
          <div className="about-cta__inner">
            <h2 className="about-cta__title">Want to work with us?</h2>
            <p className="about-cta__subhead">
              Book a 30-minute call. We&apos;ll look at your stack, find the
              gaps, and tell you exactly what we&apos;d fix first. No pitch
              deck, no follow-up unless you ask for one.
            </p>
            <CtaButton
              href="/contact"
              location="about_final_cta"
              className="btn-primary about-cta__btn"
            >
              Book a Call
            </CtaButton>
          </div>
        </div>
      </section>
    </>
  );
}
