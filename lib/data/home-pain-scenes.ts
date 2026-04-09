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
    body: 'You spent $180K on paid acquisition last quarter. Your marketing dashboard says it drove 400 signups. Your product database says 260. Finance says 310. Nobody can tell you the real CAC. So you keep spending at the same level and hope the real number is somewhere close to the one you\'re reporting to investors.',
    costValue:
      "A CAC you don't actually know and a budget you can't defend.",
  },
  {
    number: '02',
    label: 'Time',
    title: 'The feature that ate the quarter',
    body: 'Your team shipped a feature based on funnel data showing a 40% drop-off at step three. Two months of engineering. A launch blog post. A campaign behind it. Then someone discovered the tracking had been misconfigured since March. The real drop-off was at step five. You optimized the wrong thing. The quarter is gone.',
    costValue: 'Two months of engineering, gone.',
  },
  {
    number: '03',
    label: 'Opportunity',
    title: 'The experiment you never ran',
    body: "You want to test a pricing change, but you can't get a clean baseline. Amplitude doesn't match Stripe. Stripe doesn't match the warehouse. Your analyst has spent three weeks reconciling data instead of analyzing it. So you guess. Or worse — you don't run the experiment at all. You'll never know what it would have unlocked.",
    costValue: "Every experiment you should have run but didn't.",
  },
];
