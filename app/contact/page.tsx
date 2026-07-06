import type { Metadata } from 'next';
import ContactForm from './contact-form';

export const metadata: Metadata = {
  title: 'Book a Free 30-Minute Analytics Audit',
  description:
    "Book a free 30-minute analytics audit with Datalyze. Let's talk about how we can help grow your business with data.",
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <div className="page-shell">
      <div className="container">
        <header className="page-header page-header--center">
          <div className="eyebrow eyebrow--center">Book a call</div>
          <h1 className="page-header__title">Book a call with us</h1>
          <p className="page-header__intro">
            Get a free 30-minute audit to see how we can help grow your
            business. Bring your stack — in 30 minutes we&apos;ll show you
            where the money is hiding.
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
              <strong>A live audit of your stack</strong> — tracking,
              warehouse, dashboards, and attribution, reviewed on the call.
            </li>
            <li>
              <strong>The 2–3 highest-leverage fixes</strong> — the gaps
              quietly distorting your numbers and what it takes to close them.
            </li>
            <li>
              <strong>A clear next step</strong> — whether that&apos;s working
              with us or a plan you can hand to your own team. No obligation.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
