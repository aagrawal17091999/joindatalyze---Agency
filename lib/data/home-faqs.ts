export type HomeFaq = {
  q: string;
  a: string;
};

export const homeFaqs: HomeFaq[] = [
  {
    q: 'What does it cost, and how long until we see results?',
    a: 'Most engagements run between $2,000 and $5,000 per month, depending on the size of your stack and the scope of work. Some clients start with a one-time audit and scale into a retainer; others go straight into ongoing work. Most teams see their first actionable insights within 2 to 3 weeks of kickoff.',
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
    a: "Within a day of kickoff. We've done this 100+ times. We don't need a month to learn your stack or a week of onboarding meetings. Share access and we're auditing your data by tomorrow.",
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
