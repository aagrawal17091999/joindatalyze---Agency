import type { Metadata } from 'next';
import Faq from '../_components/faq';
import { homeFaqs } from '@/lib/data/home-faqs';
import JsonLd from '@/components/seo/JsonLd';
import { faqPageSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description:
    'Frequently asked questions about working with Datalyze — pricing, team, engagement, and what to expect.',
  alternates: { canonical: '/faqs' },
};

const EXTRA_FAQS = [
  {
    q: 'Who will I work with?',
    a: "You'll work with a small, focused team based on your needs. This may include a product analyst, analytics engineer, growth strategist, and developer. No unnecessary layers — you talk directly to the people doing the work.",
  },
  {
    q: 'What do you need from our team?',
    a: 'We may need light developer support to implement tracking, add events, or help with data foundations for modeling.',
  },
];

const FAQ_ITEMS = [...homeFaqs, ...EXTRA_FAQS];

export default function FaqsPage() {
  return (
    <div className="page-shell">
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />
      <div className="container">
        <Faq
          items={FAQ_ITEMS}
          title="Frequently Asked Questions"
          eyebrow="FAQs"
          headingLevel="h1"
        />
      </div>
    </div>
  );
}
