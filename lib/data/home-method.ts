export type MethodStep = {
  number: string;
  eyebrow: string;
  title: string;
  body: string;
};

export const homeMethod: MethodStep[] = [
  {
    number: '01',
    eyebrow: 'Foundation',
    title: 'Your data becomes trustworthy',
    body: 'We audit your entire data layer - product events, warehouse tables, pipelines, definitions. We fix what\'s broken. Every team pulls the same number for the same question.',
  },
  {
    number: '02',
    eyebrow: 'Unification',
    title: 'Your tools start talking to each other',
    body: 'Product analytics, warehouses, pipelines, billing, CRM - we connect and model everything into a single source of truth. One view of your customer from first touch to revenue.',
  },
  {
    number: '03',
    eyebrow: 'Visibility',
    title: "You see what's actually happening",
    body: 'We build the reporting layer your team will actually use - executive dashboards, product funnels, cohort analyses.',
  },
  {
    number: '04',
    eyebrow: 'Compounding',
    title: 'You grow with evidence, not intuition',
    body: "We go find the answers - why users churn, why they don't convert, why some cohorts stick and others don't. Then we design and run the experiments that fix it.",
  },
];
