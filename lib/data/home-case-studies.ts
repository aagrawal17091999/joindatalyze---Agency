export type HomeCaseStudy = {
  slug: string;
  tag: string;
  metricValue: string;
  metricLabel: string;
  body: string;
  impactLabel: string;
  impactValue: string;
};

// Three featured case studies for the homepage — FRAI, CRED, VideoTap.
// Each card links out to the full write-up on blog.joindatalyze.com via the
// matching entry in lib/data/case-studies.ts.
export const homeCaseStudies: HomeCaseStudy[] = [
  {
    slug: 'frai',
    tag: 'Interview Prep · Conversion',
    metricValue: '2×',
    metricLabel: 'paid conversion rate',
    body: 'FRAI had no clarity on which user segments converted, why others dropped off, or whether new experiments worked. We ran deep behavioural analysis, gave the team pointed recommendations on what to fix, and designed the A/B tests. Paid conversion doubled — with a repeatable experimentation process left behind.',
    impactLabel: 'Revenue lift',
    impactValue: '2× conversion',
  },
  {
    slug: 'cred',
    tag: 'Fintech · Reliability',
    metricValue: '−93%',
    metricLabel: 'provider outages',
    body: "CRED's payment routing was losing money in two ways: success rate that could be higher, and cost that should be lower. We built a linear-programming routing engine plus a real-time outage-detection model. Success rate up 7%, cost down 12%, provider outages down 93% month-over-month.",
    impactLabel: 'Cost reduction',
    impactValue: '−12% routing cost',
  },
  {
    slug: 'videotap',
    tag: 'AI Video · Activation',
    metricValue: '+52pt',
    metricLabel: 'onboarding completion',
    body: 'Most VideoTap signups never reached the dashboard. We audited the onboarding flow, removed the friction, and rebuilt the upload UX from 4 steps to 2. Onboarding completion went from 28% → 80%. Activation (first video uploaded) went from 7% → 19%.',
    impactLabel: 'Activation lift',
    impactValue: '7% → 19%',
  },
];
