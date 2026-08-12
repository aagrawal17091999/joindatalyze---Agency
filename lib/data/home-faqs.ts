export type HomeFaq = {
  q: string;
  a: string;
};

export const homeFaqs: HomeFaq[] = [
  {
    q: 'How much does Datalyze cost?',
    a: 'Three tiers: a one-time audit from $1,000; infra setup at $1,500 to $3,000 per project; and embedded (ongoing) at $2,000 to $5,000 per month. Most teams start with the audit and scale from there.',
  },
  {
    q: 'How long until we see results?',
    a: 'Most teams see their first actionable insights within 2 to 3 weeks of kickoff. The audit itself takes 1 to 2 weeks.',
  },
  {
    q: 'Why not just hire a full-time analyst?',
    a: "A full-time analyst costs $100,000 to $150,000 loaded, takes 3 to 6 months to ramp, and brings experience from one or two companies. Datalyze brings senior operators who've seen the patterns across 150+ startups, starts within a day, and costs a fraction of a full-time salary. When you're ready for that hire, they'll inherit a clean, documented foundation instead of the mess they'd normally spend their first six months untangling.",
  },
  {
    q: 'We already have analytics tools. Why do we need you?',
    a: "The tool is rarely the problem. The implementation is. Whether you're running Mixpanel, Amplitude, PostHog, BigQuery, Snowflake, or some combination of all of them, most setups we audit have 20 to 40% of events, models, or pipelines that are misconfigured, missing, or quietly broken. Your tools work fine. The data flowing through them doesn't. We fix the foundation across your whole stack, then make it actually useful for decisions.",
  },
  {
    q: 'How fast can you actually start?',
    a: "Within a day of kickoff. We don't need a month to learn your stack or a week of onboarding meetings. Share access and we're auditing your data by tomorrow.",
  },
  {
    q: 'What if we already have some analytics setup?',
    a: "Most companies do. The question is whether anyone trusts it. We audit what you have, fix what's broken, fill what's missing, and build on what's working. We don't rip and replace, we make your current investment reliable.",
  },
  {
    q: 'What does a typical engagement look like?',
    a: 'Week one: full data audit. We identify what\'s broken, what\'s missing, and what\'s being tracked but never used. From there, we prioritize, fix critical tracking issues, unify data sources, build the reporting your team actually needs, and start identifying growth levers. Weekly syncs keep everything aligned.',
  },
  {
    q: 'How do you measure the 14% revenue lift?',
    a: 'We measure the before-and-after revenue impact of the specific changes made during each engagement: conversion improvements from tracking fixes, retention gains from product changes, revenue from experiments we design and run. The 14% is a weighted average across 150+ engagements, not a cherry-picked best case.',
  },
];

/**
 * The homepage shows a deliberate subset. /faqs is the canonical FAQ entity and
 * carries every question grouped into sections; if the homepage emitted
 * FAQPage schema over the same nine questions, the two pages would compete with
 * identical structured data. These five are the buying questions - the ones
 * worth answering before someone scrolls to the CTA.
 */
export const homepageFaqs: HomeFaq[] = [
  homeFaqs[0], // How much does Datalyze cost?
  homeFaqs[1], // How long until we see results?
  homeFaqs[4], // How fast can you actually start?
  homeFaqs[2], // Why not just hire a full-time analyst?
  homeFaqs[3], // We already have analytics tools. Why do we need you?
];
