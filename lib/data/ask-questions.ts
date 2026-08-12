// Curated questions for the /ask/[slug] SEO pages.
//
// CURATED, NEVER AUTO-GENERATED. Mass-producing answer pages from the refused-
// query log is scaled content abuse and would put the whole domain at risk —
// including the /blog proxy this site depends on. Adding a question here is a
// deliberate act; the answer is then drafted by `npm run kb:pages`, reviewed by
// a human, and only then committed.
//
// Two rules for adding one:
//   1. The corpus must genuinely answer it. If the generator refuses, the
//      question doesn't become a page — it becomes a blog post first.
//   2. Phrase it the way a visitor would search, not the way a heading reads.

export type AskQuestion = {
  slug: string;
  question: string;
  /** Optional shorter <title>. Falls back to the question. */
  title?: string;
};

export const ASK_QUESTIONS: AskQuestion[] = [
  { slug: 'how-to-set-up-mixpanel-properly', question: 'How do I set up Mixpanel the right way?' },
  { slug: 'what-is-an-event-tracking-plan', question: 'What should be in an event tracking plan?' },
  { slug: 'how-to-measure-retention', question: 'How do I measure retention properly?' },
  { slug: 'what-is-lexicon-in-mixpanel', question: 'What is Lexicon in Mixpanel?' },
  { slug: 'incrementality-testing-for-d2c', question: 'How should I think about incrementality testing for a D2C brand?' },
  { slug: 'are-branded-search-conversions-real', question: 'Are my branded search conversions actually incremental?' },
  { slug: 'why-do-my-conversions-look-too-good', question: 'Why do my conversions look too good?' },
  { slug: 'what-is-marketing-mix-modeling', question: 'What is marketing mix modeling and when is it worth it?' },
  { slug: 'events-vs-properties-in-mixpanel', question: 'What is the difference between events and properties in Mixpanel?' },
  { slug: 'what-are-super-properties', question: 'What are super properties and when should I use them?' },
  { slug: 'client-vs-server-side-tracking', question: 'Should I track client-side or server-side?' },
  { slug: 'how-to-find-your-aha-moment', question: 'How do I find the aha moment for my product?' },
  { slug: 'why-nobody-trusts-our-data', question: 'Why does nobody on my team trust our analytics data?' },
  { slug: 'mixpanel-vs-ga4', question: 'Should I move from Google Analytics to Mixpanel?' },
  { slug: 'how-to-build-an-analytics-strategy', question: 'How do I build an analytics strategy for my product?' },
  { slug: 'what-is-analytics-debt', question: 'What is analytics debt and how do I know if I have it?' },
];
