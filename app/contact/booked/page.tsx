import type { Metadata } from 'next';
import Link from 'next/link';
import BookedTracker from './tracker';

export const metadata: Metadata = {
  title: "You're booked",
  description: 'Your call with Datalyze is confirmed.',
  alternates: { canonical: '/contact/booked' },
  robots: { index: false, follow: false },
};

export default function BookedPage() {
  return (
    <div className="page-shell">
      <BookedTracker />
      <div className="container">
        <header className="page-header page-header--center">
          <div className="eyebrow eyebrow--center">Confirmed</div>
          <h1 className="page-header__title">You&apos;re booked 🎉</h1>
          <p className="page-header__intro">
            Your call is confirmed - you&apos;ll get a calendar invite and a
            reminder by email. Come with your stack in mind; we&apos;ll dig in
            live.
          </p>
        </header>

        <section
          className="contact-expect"
          style={{ textAlign: 'center' }}
        >
          <p className="contact-expect__intro">
            Want a head start? Reply to the confirmation email with your current
            dashboards or tracking setup and we&apos;ll review them before we
            meet.
          </p>
          <p style={{ marginTop: 'var(--space-5)' }}>
            <Link href="/" className="btn-primary">
              Back to home
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
