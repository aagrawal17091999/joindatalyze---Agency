import type { Metadata } from 'next';
import Method from '../_components/method';
import { TechStack } from '@/components/tech-stack/TechStack';
import Faq from '../_components/faq';
import FinalCta from '../_components/final-cta';
import { InlineCTA } from '@/components/inline-cta/InlineCTA';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbSchema, faqPageSchema, orgRef, SITE_URL } from '@/lib/seo';
import { homeMethod } from '@/lib/data/home-method';

export const metadata: Metadata = {
  title: 'How Our Analytics Process Works',
  description:
    'The Datalyze process runs in four phases: foundation, unification, visibility, and compounding growth. Work starts within a day of kickoff.',
  alternates: { canonical: '/how-it-works' },
  openGraph: {
    title: 'How Datalyze Works',
    description:
      'The four phases of a Datalyze engagement — foundation, unification, visibility, and compounding growth.',
    url: '/how-it-works',
    type: 'website',
  },
};

// Answers assembled from the method steps rendered by <Method /> and the
// homepage FAQ. No claim here that isn't already stated elsewhere on the site.
const PROCESS_FAQS = [
  {
    q: 'How does the Datalyze process work?',
    a: 'It runs in four phases. First, foundation: we audit your entire data layer — product events, warehouse tables, pipelines, definitions — and fix what\'s broken. Second, unification: we connect and model product analytics, warehouses, pipelines, billing, and CRM into a single source of truth. Third, visibility: we build the reporting layer your team will actually use. Fourth, compounding: we find why users churn or fail to convert, then design and run the experiments that fix it.',
  },
  {
    q: 'How long does onboarding take?',
    a: "Less than a day. We've done this 100+ times, so we don't need a month to learn your stack or a week of onboarding meetings. Share access and we're auditing your data by tomorrow. Most teams see their first actionable insights within 2 to 3 weeks of kickoff.",
  },
  {
    q: 'What does a typical engagement look like?',
    a: "Week one: full data audit. We identify what's broken, what's missing, and what's being tracked but never used. From there, we prioritize, fix critical tracking issues, unify data sources, build the reporting your team actually needs, and start identifying growth levers. Weekly syncs keep everything aligned.",
  },
  {
    q: 'What if we already have an analytics setup?',
    a: "Most companies do. The question is whether anyone trusts it. We audit what you have, fix what's broken, fill what's missing, and build on what's working. We don't rip and replace, we make your current investment reliable.",
  },
  {
    q: 'Which tools do you work with?',
    a: "Whatever you're already running. Mixpanel, Amplitude, PostHog, BigQuery, Snowflake, Databricks, Postgres, and the pipelines and modeling layers around them — dbt, Fivetran, Segment, Rudderstack. If your data lives somewhere unusual, mention it on the first call and we'll tell you straight whether we can handle it.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'How It Works', path: '/how-it-works' },
          ]),
          faqPageSchema(PROCESS_FAQS),
          // HowTo describes the engagement as an ordered set of phases, built
          // from the same homeMethod array <Method /> renders below.
          {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            '@id': `${SITE_URL}/how-it-works#howto`,
            name: 'The Datalyze Method',
            description:
              'How Datalyze takes a startup from untrustworthy data to compounding, evidence-led growth.',
            url: `${SITE_URL}/how-it-works`,
            publisher: orgRef,
            step: homeMethod.map((phase, i) => ({
              '@type': 'HowToStep',
              position: i + 1,
              name: phase.title,
              text: phase.body,
            })),
          },
        ]}
      />

      <div className="page-shell">
        <div className="container">
          {/* Answer-first: the four phases are named in the opening sentences
              so an answer engine can lift the process without reading on. */}
          <header className="page-header">
            <div className="eyebrow">How it works</div>
            <h1 className="page-header__title">How a Datalyze engagement works</h1>
            <p className="page-header__intro">
              The Datalyze process has four phases: foundation, unification,
              visibility, and compounding. We start by making your existing data
              trustworthy, connect your tools into one source of truth, build the
              reporting your team will actually use, then run the experiments
              that turn those insights into revenue. Onboarding takes less than a
              day, and most teams see their first actionable insights within 2 to
              3 weeks.
            </p>
          </header>
        </div>
      </div>

      <Method />

      <InlineCTA
        href="/contact?source=how-it-works"
        heading="Curious how this would work on your stack?"
        buttonLabel="Book a call"
      />

      <TechStack />

      <Faq
        items={PROCESS_FAQS}
        title="Process questions"
        eyebrow="Questions"
      />

      <FinalCta />
    </>
  );
}
