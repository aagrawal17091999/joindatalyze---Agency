import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import JsonLd from '@/components/seo/JsonLd';
import { InlineCTA } from '@/components/inline-cta/InlineCTA';
import { PUBLISHED_ASKS, getPublishedAsk, relatedAsks } from '@/lib/data/ask-answers';
import { breadcrumbSchema, personRef } from '@/lib/seo';
import styles from '../Ask.module.css';

// Pre-rendered Q&A pages.
//
// /ask itself can never rank - it's an input box behind an email gate, and
// Googlebot can't fill a form. These pages carry the SEO: real question, real
// answer, real internal links to the posts they cite, all static HTML.
//
// Fully static. The answer is read from a reviewed, committed file - there is
// no model call at request time, so these cost nothing to serve, can't be
// gated, and can't drift.

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  // Only reviewed answers get a route at all.
  return PUBLISHED_ASKS.map((a) => ({ slug: a.slug }));
}

// Unknown slugs 404 rather than being generated on demand - a page that
// nobody reviewed must never appear just because someone guessed a URL.
export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const ask = getPublishedAsk(slug);
  if (!ask) return {};

  const description = `${ask.answer.answer.replace(/\s+/g, ' ').slice(0, 150).trim()}…`;

  return {
    // Absolute: these titles are the question verbatim, which is the whole
    // point of the page. Appending "| Datalyze" spent 11 characters of a
    // ~60-character SERP budget on branding the question can't afford.
    title: { absolute: ask.title ?? ask.question },
    description,
    alternates: { canonical: `/ask/${ask.slug}` },
    openGraph: { title: ask.question, description, type: 'article' },
  };
}

export default async function AskAnswerPage({ params }: Params) {
  const { slug } = await params;
  const ask = getPublishedAsk(slug);
  if (!ask) notFound();

  const related = relatedAsks(slug);
  const cited = ask.answer.sources.filter((s) => s.url);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Ask', path: '/ask' },
            { name: ask.question, path: `/ask/${ask.slug}` },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'QAPage',
            mainEntity: {
              '@type': 'Question',
              name: ask.question,
              answerCount: 1,
              acceptedAnswer: {
                '@type': 'Answer',
                text: ask.answer.answer,
                author: personRef,
                ...(cited[0]?.url ? { url: cited[0].url } : {}),
              },
            },
          },
        ]}
      />

      <article className={styles.shell}>
        <div className="eyebrow">Ask Ansh</div>
        <h1 className={styles.title}>{ask.question}</h1>

        <div className={styles.answer} style={{ marginTop: 'var(--space-5)' }}>
          {ask.answer.answer.split('\n\n').map((para, i) => (
            <p key={i} style={{ marginBottom: 'var(--space-4)' }}>
              {para}
            </p>
          ))}
        </div>

        {cited.length > 0 && (
          <section style={{ marginTop: 'var(--space-6)' }}>
            <div className="eyebrow">Sources</div>
            <div className={styles.sources}>
              {cited.map((s) => (
                <a key={s.docId} href={s.url as string} className={styles.chip}>
                  <span className={styles.chipLabel}>{s.title}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        <section style={{ marginTop: 'var(--space-7)' }}>
          <div className="eyebrow">Ask your own</div>
          <p className={styles.lede} style={{ marginBottom: 'var(--space-4)' }}>
            This is one of a handful of questions I&apos;ve answered in advance.{' '}
            <Link href="/ask" className="btn-link">
              Ask me your own
            </Link>
          </p>
        </section>

        {related.length > 0 && (
          <section style={{ marginTop: 'var(--space-6)' }}>
            <div className="eyebrow">Related</div>
            <div className={styles.starters}>
              {related.map((r) => (
                <Link key={r.slug} href={`/ask/${r.slug}`} className={styles.starter}>
                  {r.question}
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>

      <InlineCTA
        href="/contact?source=ask_answer"
        heading="Want this applied to your stack?"
        buttonLabel="Book a call"
      />
    </>
  );
}
