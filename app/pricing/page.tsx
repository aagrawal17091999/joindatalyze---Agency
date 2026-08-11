import type { Metadata } from 'next';
import { EngagementModel } from '@/components/engagement/EngagementModel';
import Faq from '../_components/faq';
import FinalCta from '../_components/final-cta';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbSchema, faqPageSchema, orgRef, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Analytics Consulting Pricing',
  description:
    'Datalyze pricing starts at $1k for an audit. Project work runs $1.5k–$4k; embedded engagements are $2k–$5k per month. See what each tier includes.',
  alternates: { canonical: '/pricing' },
  openGraph: {
    title: 'Datalyze Pricing',
    description:
      'What a Datalyze engagement costs, tier by tier — audit, infra setup, build, and embedded.',
    url: '/pricing',
    type: 'website',
  },
};

// Every answer below is drawn from the tier data rendered by <EngagementModel />
// and the homepage FAQ. Nothing here states a number that isn't already on the
// site — the schema and the visible copy come from the same source.
const PRICING_FAQS = [
  {
    q: 'How much does Datalyze cost?',
    a: 'Datalyze pricing starts at $1,000 for a one-time audit. Project work runs $1,500 to $4,000 depending on scope, and ongoing embedded engagements are $2,000 to $5,000 per month. Most engagements land between $2,000 and $5,000 per month, depending on the size of your stack and the scope of work.',
  },
  {
    q: 'What is the best first step?',
    a: "The audit. It runs one to two weeks from $1,000 and covers your product, marketing, revenue, and warehouse data, plus a review of your tracking plan and schema documentation. You get a diagnosis of what's working, what's drifting, and what's missing, and a roadmap of fixes ranked by revenue impact. Most teams identify 3 to 5 revenue leaks in the first audit.",
  },
  {
    q: 'Do I have to commit to a retainer?',
    a: 'No. The audit, infra setup, and build tiers are all scoped as one-time projects. Some clients start with a one-time audit and scale into a retainer; others go straight into ongoing work, and others take a project and run it themselves afterwards. Everything we build is owned by your team.',
  },
  {
    q: 'How long until we see results?',
    a: 'Most teams see their first actionable insights within 2 to 3 weeks of kickoff. The audit itself takes one to two weeks, and infra setup runs about 30 days.',
  },
  {
    q: 'Why not just hire a full-time analyst?',
    a: "A full-time analyst costs $100,000 to $150,000 loaded, takes 3 to 6 months to ramp, and brings experience from one or two companies. Datalyze brings senior operators who've seen the patterns across 150+ startups, starts within a day, and costs a fraction of a full-time salary. When you're ready for that hire, they'll inherit a clean, documented foundation instead of the mess they'd normally spend their first six months untangling.",
  },
];

export default function PricingPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Pricing', path: '/pricing' },
          ]),
          faqPageSchema(PRICING_FAQS),
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            '@id': `${SITE_URL}/pricing#service`,
            name: 'Analytics & growth consulting',
            serviceType: 'Analytics consulting',
            provider: orgRef,
            url: `${SITE_URL}/pricing`,
            areaServed: 'Worldwide',
            description:
              'Analytics audits, tracking infrastructure setup, analytics builds, and embedded fractional analytics teams for startups.',
            offers: [
              {
                '@type': 'Offer',
                name: 'Audit',
                description:
                  'Full audit across product, marketing, revenue, and warehouse, with a prioritized roadmap of fixes.',
                price: '1000',
                priceCurrency: 'USD',
                priceSpecification: {
                  '@type': 'PriceSpecification',
                  minPrice: '1000',
                  priceCurrency: 'USD',
                },
              },
              {
                '@type': 'Offer',
                name: 'Infra Setup',
                description:
                  'Tracking plan, implementation across web, mobile and server SDKs, multi-tool connection, and an initial dashboard suite.',
                priceCurrency: 'USD',
                priceSpecification: {
                  '@type': 'PriceSpecification',
                  minPrice: '1500',
                  maxPrice: '3000',
                  priceCurrency: 'USD',
                },
              },
              {
                '@type': 'Offer',
                name: 'Build',
                description:
                  'Retention and cohort analysis, dashboards, AI analytics agent setup, and migrations.',
                priceCurrency: 'USD',
                priceSpecification: {
                  '@type': 'PriceSpecification',
                  minPrice: '2000',
                  maxPrice: '4000',
                  priceCurrency: 'USD',
                },
              },
              {
                '@type': 'Offer',
                name: 'Embedded',
                description:
                  'Fractional analytics leadership, continuous experimentation, integration maintenance, and weekly insight delivery.',
                priceCurrency: 'USD',
                priceSpecification: {
                  '@type': 'UnitPriceSpecification',
                  minPrice: '2000',
                  maxPrice: '5000',
                  priceCurrency: 'USD',
                  unitCode: 'MON',
                },
              },
            ],
          },
        ]}
      />

      <div className="page-shell">
        <div className="container">
          {/* Answer-first: the direct answer to "what does this cost" sits in
              the first two sentences, before any narrative. */}
          <header className="page-header">
            <div className="eyebrow">Pricing</div>
            <h1 className="page-header__title">What Datalyze costs</h1>
            <p className="page-header__intro">
              Datalyze pricing starts at $1,000 for a one-time audit. Project
              work runs $1,500 to $4,000 depending on scope, and ongoing
              embedded engagements are $2,000 to $5,000 per month. Most teams
              start with an audit, then scale into a project or a retainer once
              they can see what&apos;s actually broken. Work begins within a day
              of kickoff.
            </p>
          </header>
        </div>
      </div>

      <EngagementModel />

      <Faq
        items={PRICING_FAQS}
        title="Pricing questions"
        eyebrow="Questions"
      />

      <FinalCta />
    </>
  );
}
