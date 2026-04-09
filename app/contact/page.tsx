import type { Metadata } from 'next';
import CalendlyWidget from './calendly-widget';

export const metadata: Metadata = {
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

        <CalendlyWidget />
      </div>
    </div>
  );
}
