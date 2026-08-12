export type HomeCaseStudy = {
  slug: string;
  metricValue: string;
  metricLabel: string;
  body: string;
};

// Three featured case studies for the homepage - FRAI, CRED, VideoTap.
// Each card links out to the full write-up on blog.joindatalyze.com via the
// matching entry in lib/data/case-studies.ts.
export const homeCaseStudies: HomeCaseStudy[] = [
  {
    slug: 'frai',
    metricValue: '2×',
    metricLabel: 'paid conversion rate',
    body: 'FRAI had no clarity on which user segments converted or why others dropped off. We ran deep behavioural analysis and designed the A/B tests, and paid conversion doubled, with a repeatable experimentation process left behind.',
  },
  {
    slug: 'cred',
    metricValue: '−93%',
    metricLabel: 'provider outages',
    body: "CRED's payment routing was leaking money on both success rate and cost. We built a linear-programming routing engine plus a real-time outage-detection model, taking success rate up 7%, cost down 12%, and provider outages down 93% month over month.",
  },
  {
    slug: 'videotap',
    metricValue: '+52pt',
    metricLabel: 'onboarding completion',
    body: 'Most VideoTap signups never reached the dashboard. We rebuilt the upload UX from 4 steps to 2, taking onboarding completion from 28% to 80% and activation from 7% to 19%.',
  },
];
