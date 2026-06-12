export type Playbook = {
  number: number;
  title: string;
  description: string;
  /** Present only when the playbook is released. */
  slug?: string;
  status: 'released' | 'coming-soon';
};

export const PLAYBOOKS: Playbook[] = [
  {
    number: 1,
    title: 'The Metrics That Lie',
    slug: 'metrics-that-lie',
    status: 'released',
    description:
      'What to actually measure for a D2C brand, and why your ad dashboard is wrong. The four dashboards that matter, and the plumbing to make them honest.',
  },
  {
    number: 2,
    title: 'Why your numbers never match',
    slug: 'why-your-numbers-never-match',
    status: 'released',
    description:
      'The attribution reality check. Why every platform reports a different number, which one to actually trust, and how to stop chasing a reconciliation that will never come.',
  },
  {
    number: 3,
    title: 'The questions your data has to answer',
    slug: 'questions-your-data-must-answer',
    status: 'released',
    description:
      'Analytics questions come in two layers, and almost every brand is stuck on the first one. Telling them apart, and climbing from the layer you have to the layer that actually changes what you do.',
  },
  {
    number: 4,
    title: 'Tracking & event taxonomy before you scale spend',
    status: 'coming-soon',
    description:
      'Clean, well-named events are what make every later question answerable. Fix your tracking foundation before you pour more money into ads.',
  },
  {
    number: 5,
    title: 'The tool stack for Indian D2C',
    status: 'coming-soon',
    description:
      'What to actually buy at each stage — analytics, attribution, warehousing, activation — without overbuying or duct-taping tools you’ll outgrow in a quarter.',
  },
  {
    number: 6,
    title: 'Your single source of truth',
    status: 'coming-soon',
    description:
      'Graduating from scattered tools to a D2C data warehouse: why one trusted source changes how you operate, and how to stand it up.',
  },
  {
    number: 7,
    title: 'Cohort & retention analysis done right',
    status: 'coming-soon',
    description:
      'Measure repeat behaviour and payback period the way they actually behave — cohort by cohort — instead of trusting blended averages that hide the truth.',
  },
  {
    number: 8,
    title: 'Inventory & demand forecasting across channels',
    status: 'coming-soon',
    description:
      'Forecast demand across your website, marketplaces, and quick commerce so you stop stocking out on winners and over-ordering on everything else.',
  },
  {
    number: 9,
    title: 'Stitching website, Blinkit & Swiggy data',
    status: 'coming-soon',
    description:
      'The hardest data problem in Indian D2C: building a customer-level view across your own site and quick-commerce platforms that deliberately hide the customer from you.',
  },
  {
    number: 10,
    title: 'RFM segmentation → WhatsApp & email',
    status: 'coming-soon',
    description:
      'Turn your warehouse into revenue: segment customers by recency, frequency, and value, then activate each segment on WhatsApp and email.',
  },
  {
    number: 11,
    title: 'Incrementality testing',
    status: 'coming-soon',
    description:
      'Prove which spend actually drives extra sales — and which would have happened anyway — with tests that hold up to scrutiny.',
  },
  {
    number: 12,
    title: 'Marketing mix modelling (MMM)',
    status: 'coming-soon',
    description:
      'The most advanced way to measure what your marketing really delivers across every channel — and the one you’ll most likely want a partner for.',
  },
];
