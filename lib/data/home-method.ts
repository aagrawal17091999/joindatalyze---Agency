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
    body: 'We audit your entire data layer — product events, warehouse tables, pipelines, definitions. We fix what\'s broken, fill what\'s missing, and rebuild the parts that drift. Every team ends up pulling the same number for the same question. No more "it depends on which dashboard you check."',
  },
  {
    number: '02',
    eyebrow: 'Unification',
    title: 'Your tools start talking to each other',
    body: 'Product analytics, warehouses, pipelines, billing, CRM — we connect and model everything into a single source of truth. No more reconciliation. No more conflicting dashboards. One view of your customer from first touch to revenue.',
  },
  {
    number: '03',
    eyebrow: 'Visibility',
    title: "You see what's actually happening",
    body: 'We build the reporting layer your team will actually use — executive dashboards, product funnels, cohort analyses, whatever gets pulled in the Monday meeting. Not 47 dashboards nobody checks, the handful of views that change how you operate.',
  },
  {
    number: '04',
    eyebrow: 'Compounding',
    title: 'You grow with evidence, not intuition',
    body: "With trustworthy data and a unified view, we go find the answers — why users churn, why they don't convert, why some cohorts stick and others don't. Then we design and run the experiments that fix it. Each result you can defend. This is where the compounding starts.",
  },
];
