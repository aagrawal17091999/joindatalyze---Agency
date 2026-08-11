import type { Metadata } from 'next';
import AskChat from './ask-chat';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbSchema, orgRef } from '@/lib/seo';

export const metadata: Metadata = {
  title: "Ask Ansh's AI",
  description:
    "Ask any analytics question, answered only from Ansh Agrawal's own writing on tracking, attribution and retention. Not covered? You get a straight no.",
  alternates: { canonical: '/ask' },
  openGraph: {
    title: "Ask Ansh's AI",
    description:
      'Answers grounded strictly in Ansh’s published writing. No answer beats a wrong one.',
  },
};

// Fully static. Nothing here depends on the visitor: identity is a cookie the
// chat endpoint reads, and the transcript lives in the browser.
export default function AskPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Ask', path: '/ask' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: "Ask Ansh's AI",
            applicationCategory: 'BusinessApplication',
            url: 'https://www.joindatalyze.com/ask',
            description:
              "Answers analytics questions strictly from Ansh Agrawal's published writing, and refuses when the answer isn't there.",
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            publisher: orgRef,
          },
        ]}
      />

      <AskChat />
    </>
  );
}
