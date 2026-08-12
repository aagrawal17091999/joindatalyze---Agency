import type { Metadata } from 'next';
import ContactForm from './contact-form';
import Faq from '../_components/faq';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbSchema, faqPageSchema, orgRef, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Book a Free 30-Minute Analytics Audit',
  description:
    'Book a free 30-minute call. A senior analyst reviews your tracking, warehouse and attribution live, and names the 2\u20133 fixes that matter most.',
  alternates: { canonical: '/contact' },
};

const CONTACT_FAQS = [
  {
    q: 'Is the call really free?',
    a: 'Yes. Thirty minutes, no charge, no obligation. You leave with the fixes we would prioritise whether or not you work with us.',
  },
  {
    q: 'Who will be on the call?',
    a: 'A senior analyst from the team - the person who would actually do the work, not an account manager.',
  },
  {
    q: 'What do I need to prepare?',
    a: 'Access to your analytics tool (or a screen-share), and the questions your team keeps asking the data. That is it.',
  },
  {
    q: 'How soon can we start after the call?',
    a: "Within a day of kickoff. We don't need a discovery phase.",
  },
];

export default function ContactPage() {
  return (
    <div className="page-shell">
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Contact', path: '/contact' },
          ]),
          faqPageSchema(CONTACT_FAQS),
          // Declares the free audit as an actual offer, so an answer engine can
          // learn it exists rather than inferring it from CTA copy.
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            '@id': `${SITE_URL}/contact#audit-call`,
            name: 'Free 30-minute analytics audit call',
            serviceType: 'Analytics consulting',
            provider: orgRef,
            url: `${SITE_URL}/contact`,
            areaServed: 'Worldwide',
            description:
              'A free 30-minute call in which a senior analyst reviews your tracking, warehouse, dashboards and attribution live, and names the two or three highest-leverage fixes.',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
          },
        ]}
      />
      <div className="container">
        <header className="page-header page-header--center">
          <div className="eyebrow eyebrow--center">Book a call</div>
          <h1 className="page-header__title">Book a call with us</h1>
          <p className="page-header__intro">
            A free 30-minute working session, not a sales pitch. A senior
            analyst reviews your stack live - tracking, warehouse,
            dashboards, attribution - and shows you the two or three
            things quietly distorting your numbers.
          </p>
        </header>

        <ContactForm />

        <section className="contact-expect">
          <h2 className="contact-expect__title">What you&apos;ll get on the call</h2>
          <p className="contact-expect__intro">
            A working session, not a sales pitch. In 30 minutes a senior
            analyst reviews your setup live and shows you where the data is
            costing you money.
          </p>
          <ul className="contact-expect__list">
            <li>
              <strong>A live audit of your stack</strong> - tracking,
              warehouse, dashboards, and attribution, reviewed on the call.
            </li>
            <li>
              <strong>The 2–3 highest-leverage fixes</strong> - the gaps
              quietly distorting your numbers and what it takes to close them.
            </li>
            <li>
              <strong>A clear next step</strong> - whether that&apos;s working
              with us or a plan you can hand to your own team. No obligation.
            </li>
          </ul>
        </section>

        {/* What to bring - asked for on the AI-agent page's CTA and nowhere
            else, though it applies to every call. */}
        <section className="contact-expect">
          <h2 className="contact-expect__title">What to bring</h2>
          <ul className="contact-expect__list">
            <li>Access to, or a screen-share of, your analytics tool.</li>
            <li>
              The top 3&ndash;5 questions your team asks the data every week.
            </li>
            <li>Any numbers that currently disagree between two systems.</li>
          </ul>
          <p className="contact-expect__intro">
            You don&apos;t need to prepare a deck. Bring the mess.
          </p>
        </section>

        <Faq
          items={CONTACT_FAQS}
          title="Before you book"
          eyebrow="Questions"
        />
      </div>
    </div>
  );
}
