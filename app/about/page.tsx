import type { Metadata } from 'next';
import Image from 'next/image';
import CtaButton from '../_components/cta-button';
import Principles from './_components/principles';

export const metadata: Metadata = {
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
            Most analytics work doesn&apos;t change anything.{' '}
            <em>We&apos;re trying to fix that.</em>
          </h1>
          <p className="about-hero__subhead">
            Datalyze was started by operators who&apos;d spent years watching
            companies pour money into analytics tools that produced charts
            nobody trusted. We don&apos;t sell dashboards. We sell foundations
            that turn data into decisions — and decisions into revenue.
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
                I started my analytics career at CRED. That&apos;s where I
                learned what good analytics actually looks like — the
                discipline of it, the craft of it, the difference between a
                chart that&apos;s technically correct and a chart someone can
                make a decision on.
              </p>
              <p>
                After that, I started freelancing. One startup at a time,
                helping founders set up their analytics from scratch,
                unblocking their data teams, surfacing the insights that had
                been buried under broken tracking. By engagement 30 or 40, I
                started seeing the same thing at every company I walked into.
              </p>
              <p>
                A company would have three analytics tools, four dashboards,
                and zero confidence in any of the numbers. Marketing would
                report one figure, product would report another, finance a
                third. Every important decision would come down to a debate
                about whose data was right — and the actual question, the
                one that mattered, never got answered.
              </p>
              <p>
                The strange part was that most of these companies had already
                paid for the fix. They had the tools. They had the warehouse.
                Some of them had even hired full-time analysts. But the
                foundation underneath all of it — the events, the pipelines,
                the definitions, the models — was quietly broken in ways
                nobody had time to find.
              </p>
              <p>
                The industry&apos;s answer was usually to sell them another
                tool, another dashboard, another report. I thought that was
                backwards. The problem was never the tools. It was the
                foundation.
              </p>
              <p>
                For a long time, I fixed this one startup at a time as a
                freelancer. But freelance work has a ceiling — I could only
                be in one codebase, one problem, one company at a time. And
                the pattern I kept seeing was too common to keep fixing one
                founder at a time.
              </p>
              <p>
                So in 2025, I started Datalyze. Same bet, bigger team: fix
                the foundation first, then turn it into the kind of insights
                that actually move revenue. No account managers. No junior
                analysts learning on the client&apos;s budget. Just senior
                operators who&apos;d done this enough times to know where to
                look first.
              </p>
              <p>
                We measure the revenue impact of every change we ship. Across
                the engagements we&apos;ve run so far, we&apos;ve helped
                companies grow revenue by 14% on average. Not because
                we&apos;re magicians. Because we start by fixing what nobody
                else wants to touch.
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

      {/* Section 3 — Four principles */}
      <Principles />

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
