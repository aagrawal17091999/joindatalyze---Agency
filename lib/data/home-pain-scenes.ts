export type PainScene = {
  number: string;
  label: string;
  title: string;
  body: string;
  costValue: string;
};

export const homePainScenes: PainScene[] = [
  {
    number: '01',
    label: 'Money',
    title: "The money you're already spending wrong",
    body: "You spent $180K on paid acquisition last quarter. Your marketing dashboard says it drove 400 signups. Your product database says 260. Finance says 310. Nobody can tell you the real CAC.",
    costValue: "A CAC you don't actually know and a budget you can't defend.",
  },
  {
    number: '02',
    label: 'Time',
    title: 'Three weeks to answer one question',
    body: 'A board member asks what LTV looks like by acquisition channel. Stripe, Mixpanel, and your CRM each hold part of the answer; none of them talk. Three weeks of engineering produces a brittle integration. Stripe ships an API change. Three more weeks. By the third break, you stop asking questions that require multiple tools.',
    costValue:
      'Decisions shrinking to whatever lives in a single tool, because the cross-tool questions got too expensive to keep asking.',
  },
  {
    number: '03',
    label: 'Team',
    title: 'What your PM did last Tuesday',
    body: "Your PM wrote SQL in BigQuery on Tuesday, trying to pull cohort retention. Your senior engineer spent Wednesday debugging a tracking event that's been wrong since March. Your head of growth reconciled MRR across Stripe and the warehouse on Sunday. None of them shipped a feature, ran an experiment, or talked to a customer.",
    costValue:
      "Senior people on plumbing, and the product features, customer calls, and experiments that didn't happen because of it.",
  },
  {
    number: '04',
    label: 'Growth',
    title: 'The growth lever in plain sight',
    body: "Your retention dashboard is accurate. It's been accurate for months. Nobody opens it. Six months in, you finally dig and find that users who adopted your March feature retain 40% better than those who didn't. You shipped that feature quietly as a side project. The data was sitting there the whole time.",
    costValue:
      "Insights buried in clean data, and the growth you'd already have captured if anyone was looking, every day.",
  },
];
