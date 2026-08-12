export type HomeDifferentiator = {
  number: string;
  title: string;
  body: string;
  visual: 'senior-operators' | 'speed-timeline' | 'revenue-lift' | 'fix-checkboxes';
};

export const homeDifferentiators: HomeDifferentiator[] = [
  {
    number: '01',
    title: 'You work with the people who do the work',
    body: 'Every engagement includes senior operators. You talk directly to the people in your data.',
    visual: 'senior-operators',
  },
  {
    number: '02',
    title: 'We start in a day, not a quarter',
    body: "No 2-week onboarding. No discovery phase eating a month.",
    visual: 'speed-timeline',
  },
  {
    number: '03',
    title: 'We own the outcome, not the deliverable',
    body: "When an experiment doesn't move the needle, we tell you and run a better one.",
    visual: 'revenue-lift',
  },
  {
    number: '04',
    title: 'If we find it, we fix it',
    body: "When we find something broken, even if it wasn't in scope, we fix it. You hired us to make your data work.",
    visual: 'fix-checkboxes',
  },
];
