import raw from './ask-answers.generated.json';
import { ASK_QUESTIONS, type AskQuestion } from './ask-questions';

// Reviewed answers for the /ask/[slug] pages.
//
// `reviewed: false` answers are DRAFTS and are filtered out here - they don't
// render, don't appear in the sitemap, and don't get pre-rendered. That's the
// review gate: the generator can only propose a page, never publish one.

export type AskAnswerSource = {
  docId: string;
  title: string;
  url: string | null;
  sourceType: string;
};

export type AskAnswer = {
  question: string;
  answer: string;
  sources: AskAnswerSource[];
  topScore: number;
  indexVersion: string | null;
  draftedAt: string;
  reviewed: boolean;
};

const answers = raw as Record<string, AskAnswer>;

export type PublishedAsk = AskQuestion & { answer: AskAnswer };

export const PUBLISHED_ASKS: PublishedAsk[] = ASK_QUESTIONS.flatMap((q) => {
  const answer = answers[q.slug];
  return answer?.reviewed ? [{ ...q, answer }] : [];
});

export function getPublishedAsk(slug: string): PublishedAsk | null {
  return PUBLISHED_ASKS.find((a) => a.slug === slug) ?? null;
}

/** Deterministic neighbours, so the internal-link graph is stable across builds. */
export function relatedAsks(slug: string, count = 4): PublishedAsk[] {
  const i = PUBLISHED_ASKS.findIndex((a) => a.slug === slug);
  if (i === -1) return PUBLISHED_ASKS.slice(0, count);
  return Array.from({ length: Math.min(count, PUBLISHED_ASKS.length - 1) }, (_, n) =>
    PUBLISHED_ASKS[(i + n + 1) % PUBLISHED_ASKS.length],
  );
}
