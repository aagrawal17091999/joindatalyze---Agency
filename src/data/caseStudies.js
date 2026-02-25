import { caseStudyContent } from './caseStudyContent.js';

export const caseStudyList = [
  { slug: 'copyfy', logo: '/logos-svg/Copyfy.svg', alt: 'Copyfy logo', meta: 'AI Website Builder · Analytics', title: 'Copyfy', description: 'Built end-to-end Mixpanel, unified identities, and doubled onboarding conversion.', tags: ['Mixpanel', 'Conversion', 'Data quality'], thumbClass: '' },
  { slug: 'foriio', logo: '/logos-svg/Foriio.svg', alt: 'Foriio logo', meta: 'Portfolio Platform · Activation', title: 'Foriio', description: 'Drove uploads with behaviour-based nudges and a streamlined add-work flow.', tags: ['Activation', 'Lifecycle', 'UX'], thumbClass: 'alt' },
  { slug: 'cred', logo: '/logos-svg/CRED.svg', alt: 'CRED logo', meta: 'Fintech · Monetization', title: 'CRED', description: 'Optimized routing with LP models, outage detection, and uplifted rent payment success.', tags: ['Optimization', 'Reliability', 'Fintech'], thumbClass: 'gradient' },
  { slug: 'sama', logo: '/logos-svg/Sama.svg', alt: 'Sama.io logo', meta: 'Coaching SaaS · Retention', title: 'Sama.io', description: 'Elevated Notes to drive return visits and strengthen coaching impact.', tags: ['Retention', 'UX', 'Engagement'], thumbClass: 'bold' },
  { slug: 'gametree', logo: '/logos-svg/GameTree.svg', alt: 'GameTree logo', meta: 'Social · Activation', title: 'GameTree', description: 'Localized onboarding and fixed early errors to lift Day 0 activation.', tags: ['Localization', 'Error reduction', 'Activation'], thumbClass: '' },
  { slug: 'petcademy', logo: '/logos-svg/PetAcademy.svg', alt: 'Petcademy logo', meta: 'Pet Tech · Messaging', title: 'Petcademy', description: 'Cut SMS spend while keeping engagement through pruning and personalization.', tags: ['Messaging', 'Cost', 'Personalization'], thumbClass: 'alt' },
  { slug: 'stealth', logo: '/logos-svg/Mask%20group.svg', alt: 'Confidential Startup logo', meta: 'Stealth · Activation', title: 'Confidential Startup', description: 'Raised free-plan limits to surface value sooner and boost activation.', tags: ['Activation', 'Pricing', 'Engagement'], thumbClass: 'gradient' },
  { slug: 'videotap', logo: null, alt: 'VideoTap logo', meta: 'AI Video · Activation', title: 'VideoTap', description: 'Streamlined onboarding and uploads to drive dramatic completion gains.', tags: ['Onboarding', 'Activation', 'UX'], thumbClass: 'bold' },
  { slug: 'zeroone', logo: null, alt: 'zeroone logo', meta: 'Web3 Social · Engagement', title: 'zeroone', description: 'Early uploads, habit loops, and tracking rebuilds that improved activation and retention.', tags: ['Activation', 'Habit loops', 'Analytics'], thumbClass: '' },
  { slug: 'speedyloans', logo: '/logos-svg/FlexLoans.svg', alt: 'Speedyloans logo', meta: 'Lending · Lifecycle', title: 'Speedyloans', description: 'Built scoring and association models to trim email costs and sharpen targeting.', tags: ['Segmentation', 'Cost', 'Modeling'], thumbClass: 'alt' },
  { slug: 'wellness-coach', logo: '/logos-svg/wellness%20coach.svg', alt: 'Wellness Coach logo', meta: 'Wellbeing · Analytics', title: 'Wellness Coach', description: 'Rebuilt taxonomy and guardrails to restore trust in retention metrics.', tags: ['Taxonomy', 'Data quality', 'Retention'], thumbClass: 'gradient' },
  { slug: 'sol', logo: '/logos-svg/Sol.svg', alt: 'Sol logo', meta: 'Productivity · Analytics', title: 'Sol', description: 'Designed a minimalist, property-led Mixpanel framework for weekly releases.', tags: ['Mixpanel', 'Governance', 'Scalability'], thumbClass: 'bold' },
  { slug: 'answering-agent', logo: null, alt: 'Answering Agent logo', meta: 'AI Voice · Quality', title: 'Answering Agent', description: 'Built AI call-quality scoring with clear metrics and failure reasons.', tags: ['AI', 'Quality', 'Measurement'], thumbClass: '' },
  { slug: 'termplus', logo: '/logos-svg/termplus.svg', alt: 'TermPlus logo', meta: 'Finserv · Analytics', title: 'TermPlus', description: 'Completed PostHog setup, unified sources, and delivered usable funnels.', tags: ['Tracking', 'Dashboards', 'Data unification'], thumbClass: 'alt' },
  { slug: 'frai', logo: '/logos-svg/final%20round%20ai.svg', alt: 'FRAI logo', meta: 'Interview Prep · Conversion', title: 'FRAI', description: 'Behaviour deep-dives and experiments that doubled paid conversion rate.', tags: ['Experiments', 'Conversion', 'Insights'], thumbClass: 'gradient' },
  { slug: 'anyip', logo: null, alt: 'AnyIP logo', meta: 'Infrastructure · Marketing', title: 'AnyIP', description: 'Owned analytics to clean data, build ROI dashboards, and cut wasted spend.', tags: ['Marketing analytics', 'CAC', 'Dashboards'], thumbClass: 'bold' },
];

export const caseStudyBySlug = {
  copyfy: {
    title: 'Full-funnel analytics and conversion lifts for an AI site builder',
    lead: 'Copyfy',
    subtitle: 'AI Website Builder',
    website: 'https://copyfy.io/',
    logo: '/logos-svg/Copyfy.svg',
    sections: [
      {
        heading: 'The challenge',
        body: 'Copyfy is an AI-powered website builder helping users create and launch sites quickly. The product team needed a single source of truth for user behaviour from signup through activation and ongoing usage. Events were scattered, identities were inconsistent across touchpoints, and the team couldn’t reliably measure onboarding conversion or attribute improvements to specific changes.',
      },
      {
        heading: 'What we did',
        body: 'We designed and implemented an end-to-end Mixpanel setup tailored to Copyfy’s funnel. We defined a clear event taxonomy and unified user identity across web and product so that every touchpoint could be tied to one user journey. We built funnels for signup, first-site creation, and key activation milestones, and added property-level governance so new events would stay consistent. We also ran a focused analysis on drop-off in the onboarding flow and recommended UX and instrumentation fixes.',
      },
      {
        heading: 'Results',
        body: 'Copyfy gained full visibility into the funnel and reliable conversion metrics. After implementing the recommended changes and cleaning up identity resolution, onboarding conversion doubled. The team now uses the same Mixpanel foundation for ongoing experiments and prioritization, with high confidence in data quality.',
      },
      {
        heading: 'Tags',
        body: 'Mixpanel · Conversion · Data quality',
      },
    ],
  },
  foriio: { title: 'Foriio', lead: 'Foriio', subtitle: '', website: 'https://www.foriio.com/', logo: '/logos-svg/Foriio.svg' },
  cred: { title: 'Payment routing optimization and rent success lift', lead: 'CRED', subtitle: 'Fintech', website: 'https://cred.club/', logo: '/logos-svg/CRED.svg' },
  sama: { title: 'Sama.io', lead: 'Sama.io', subtitle: '', website: 'https://sama.io/', logo: '/logos-svg/Sama.svg' },
  gametree: { title: 'Localized Day 0 onboarding that lifts activation', lead: 'GameTree', subtitle: '', website: '', logo: '/logos-svg/GameTree.svg' },
  petcademy: { title: 'Cost-efficient SMS engagement for a pet training platform', lead: 'Petcademy', subtitle: 'Pet Training', website: 'https://petcademy.org/', logo: '/logos-svg/PetAcademy.svg' },
  stealth: { title: 'Stealth Startup (Name Confidential)', lead: 'Stealth Startup', subtitle: 'Product Growth', website: '', logo: '/logos-svg/Mask%20group.svg' },
  videotap: { title: 'Onboarding and upload flows that drive activation', lead: 'VideoTap', subtitle: 'AI Video Repurposing', website: 'https://videotap.com/', logo: null },
  zeroone: { title: 'Activation, engagement, and analytics for a Web3 creator network', lead: 'zeroone', subtitle: 'Web3 Social', website: 'https://zeroone.art/', logo: null },
  speedyloans: { title: 'Speedyloans', lead: 'Speedyloans', subtitle: '', website: 'https://speedyloanadvance.com/', logo: '/logos-svg/FlexLoans.svg' },
  'wellness-coach': { title: 'Wellness Coach', lead: 'Wellness Coach', subtitle: '', website: 'https://www.wellnesscoach.live/', logo: '/logos-svg/wellness%20coach.svg' },
  sol: { title: 'Minimalist, property-driven tracking for a fast-moving product', lead: 'Sol', subtitle: 'Productivity & Collaboration', website: 'https://sol.app/', logo: '/logos-svg/Sol.svg' },
  'answering-agent': { title: 'AI call quality evaluation and scoring', lead: 'Answering Agent', subtitle: 'AI Voice', website: 'https://answeringagent.com/', logo: null },
  termplus: { title: 'Analytics foundation and unified data for TermPlus', lead: 'TermPlus', subtitle: '', website: '', logo: '/logos-svg/termplus.svg' },
  frai: { title: 'Insight-led experiments that doubled paid conversion', lead: 'FRAI', subtitle: '', website: '', logo: '/logos-svg/final%20round%20ai.svg' },
  anyip: { title: 'Analytics ownership and ROI visibility for AnyIP', lead: 'AnyIP', subtitle: 'Infrastructure', website: 'https://anyip.io/', logo: null },
};

// Merge full content from docs (intro + sections with blocks)
Object.keys(caseStudyContent).forEach((slug) => {
  if (caseStudyBySlug[slug]) {
    Object.assign(caseStudyBySlug[slug], caseStudyContent[slug]);
  }
});

// Add thumbClass from list so detail page can show contrasting logo background (light bg for dark logos)
caseStudyList.forEach((item) => {
  if (caseStudyBySlug[item.slug]) {
    caseStudyBySlug[item.slug].thumbClass = item.thumbClass || '';
  }
});
