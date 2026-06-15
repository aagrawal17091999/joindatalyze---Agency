import type { Metadata } from 'next';
import Image from 'next/image';
import CtaButton from '../_components/cta-button';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Datalyze is an analytics consultancy founded by Ansh Agrawal. We\u2019ve helped 150+ startups fix their data foundations and grow revenue by 14% on average.',
  alternates: { canonical: '/about' },
};

const TEAM = [
  {
    name: 'Ansh Agrawal',
    role: 'Founder',
    photo: '/Ansh.png',
    photoWidth: 1344,
    photoHeight: 768,
    bio: 'Built analytics infrastructure for 90+ startups before founding Datalyze in 2025. Specializes in product analytics, experimentation, and the messy first 90 days of fixing a broken stack. Mixpanel Certified. Based in India.',
  },
  {
    name: 'Sara Maarouf',
    role: 'Product Growth',
    photo: '/sara-maarouf.jpg',
    photoWidth: 1200,
    photoHeight: 666,
    bio: 'Leads growth and experimentation engagements. Specializes in turning trustworthy data into the experiments that compound — pricing tests, onboarding flows, conversion paths.',
  },
];

const NUMBERS = [
  { value: '150+', label: 'companies served' },
  { value: '14%', label: 'average revenue lift' },
  { value: '20+', label: 'tools we work fluently across' },
  { value: '7', label: 'years building foundations' },
];

export default function AboutPage() {
  return (
    <>
      {/* Section 1 — Hero */}
      <section className="about-hero" id="about-hero">
        <div className="container about-hero__inner">
          <div className="eyebrow about-hero__eyebrow">About Datalyze</div>
          <h1 className="about-hero__headline">
            We don't sell dashboards. We build <span className="about-hero__headline-accent">foundations</span>.
          </h1>
          <p className="about-hero__subhead">
            Datalyze was started by operators who'd spent years watching companies pour money into analytics tools that produced charts nobody trusted.
          </p>
        </div>
      </section>

      {/* Section 2 — Founder note */}
      <section className="founder-note" id="founder-note">
        <div className="container">
          <div className="founder-note__inner">
            <div className="founder-note__header">
              <div className="eyebrow">Why We Exist</div>

              <figure className="founder-note__photo-wrap">
                <Image
                  src="/Ansh.png"
                  alt="Ansh Agrawal, founder of Datalyze"
                  width={1344}
                  height={768}
                  sizes="(max-width: 768px) 100vw, 420px"
                  className="founder-note__photo"
                  priority
                />
              </figure>

              <div className="founder-note__caption">
                Ansh Agrawal · Founder
              </div>

              <h2 className="founder-note__title">A note from the founder</h2>
            </div>

            <div className="founder-note__body">
              <p>
                I started my analytics career at CRED. After that, I spent a
                few years freelancing — one startup at a time, fixing
                tracking, unblocking data teams, surfacing insights buried
                under broken foundations.
              </p>
              <p>
                By engagement 30 or 40, I&apos;d seen the same pattern at
                every company: three tools, four dashboards, zero confidence
                in any of the numbers. The fix wasn&apos;t more tools. It was
                the foundation underneath them — the events, pipelines,
                definitions, and models that nobody had time to fix.
              </p>
              <p>
                In 2025, I started Datalyze to do this at scale. Senior
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
                — Ansh Agrawal
              </span>
              <span className="founder-note__signature-role">
                Founder, Datalyze
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 — Team */}
      <section className="team" id="team">
        <div className="container">
          <header className="team__header">
            <div className="eyebrow eyebrow--center">The Team</div>
            <h2 className="team__title">The people in your data</h2>
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

      {/* Section 5 — Numbers */}
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
        </div>
      </section>

      {/* Section 6 — Final CTA */}
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
