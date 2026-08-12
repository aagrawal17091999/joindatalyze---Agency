import type { Metadata } from 'next';
import Faq from '../_components/faq';
import { homeFaqs } from '@/lib/data/home-faqs';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbSchema, faqPageSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Datalyze FAQs - Pricing, Process, Team',
  description:
    'What Datalyze costs, how fast we start, who does the work, what we need from your team, and what happens when an engagement ends.',
  alternates: { canonical: '/faqs' },
};

// /faqs is the canonical FAQ entity for the site: it carries every question,
// grouped, and it's the only page whose FAQPage schema covers all of them. The
// homepage emits its own, smaller FAQPage over the buying questions only - the
// two used to overlap on nine identical questions, which is duplicate
// structured data competing with itself.
//
// Grouping matters for extraction: each section is self-contained, so an answer
// engine can lift "Timing and process" without dragging in pricing.
const SECTIONS: { title: string; items: { q: string; a: string }[] }[] = [
  {
    title: 'Pricing and commitment',
    items: [
      homeFaqs[0], // How much does Datalyze cost?
      {
        q: 'Do I have to commit to a retainer?',
        a: 'No. The audit and infra setup tiers are both one-time projects. Some clients start with an audit and scale into a retainer; others take a project and run it themselves afterwards.',
      },
      homeFaqs[2], // Why not just hire a full-time analyst?
    ],
  },
  {
    title: 'Timing and process',
    items: [
      homeFaqs[4], // How fast can you actually start?
      homeFaqs[1], // How long until we see results?
      homeFaqs[6], // What does a typical engagement look like?
      {
        q: 'What happens when an engagement ends?',
        a: 'Everything we built - tracking plans, models, dashboards, documentation - is in your tools and owned by your team.',
      },
    ],
  },
  {
    title: 'The team',
    items: [
      {
        q: 'Who will I work with?',
        a: "You'll work with a small, focused team based on your needs. This may include a product analyst, analytics engineer, growth strategist, and developer. No unnecessary layers - you talk directly to the people doing the work.",
      },
      {
        q: 'What do you need from our team?',
        a: 'We may need light developer support to implement tracking, add events, or help with data foundations for modeling.',
      },
    ],
  },
  {
    title: 'Tools and setup',
    items: [
      homeFaqs[3], // We already have analytics tools. Why do we need you?
      homeFaqs[5], // What if we already have some analytics setup?
      {
        q: 'Which tools do you work with?',
        a: "Whatever you're already running: Mixpanel (Certified Partner), PostHog (Implementation Specialist), Amplitude, Heap, GA4, Google Tag Manager, Google Ads, Meta Ads, HubSpot, Stripe, Chargebee, Recurly, RevenueCat, BigQuery, Snowflake, Postgres, Looker Studio, Metabase, Databricks, Segment, dbt, Fivetran, Hightouch and Airbyte.",
      },
    ],
  },
  {
    title: 'Results',
    items: [
      homeFaqs[7], // How do you measure the 14% revenue lift?
      {
        q: 'What if the work does not move the numbers?',
        a: "When an experiment doesn't move the needle, we tell you and run a better one. We measure revenue impact on every change we ship.",
      },
    ],
  },
];

const ALL_FAQS = SECTIONS.flatMap((s) => s.items);

export default function FaqsPage() {
  return (
    <div className="page-shell">
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'FAQs', path: '/faqs' },
          ]),
          faqPageSchema(ALL_FAQS),
        ]}
      />
      <div className="container">
        <header className="page-header page-header--center">
          <div className="eyebrow eyebrow--center">FAQs</div>
          <h1 className="page-header__title">Frequently Asked Questions</h1>
          <p className="page-header__intro">
            What it costs, how fast we start, who does the work, and what we
            need from you. If your question isn&apos;t here,{' '}
            <a href="/ask">ask my AI</a>.
          </p>
        </header>

        {SECTIONS.map((section) => (
          <Faq
            key={section.title}
            items={section.items}
            title={section.title}
            eyebrow="Good to know"
            headingLevel="h2"
            group={section.title}
            defaultOpen={false}
          />
        ))}
      </div>
    </div>
  );
}
