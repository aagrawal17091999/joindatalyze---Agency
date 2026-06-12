import type { Metadata } from 'next';
import Link from 'next/link';
import { PLAYBOOKS } from '@/lib/data/playbooks';

export const metadata: Metadata = {
  title: 'The Indian D2C Founder’s Playbook',
  description:
    'A 12-part playbook on analytics, attribution, tracking, and data infrastructure for Indian D2C founders — from trusting your numbers to MMM.',
  alternates: { canonical: '/indian-d2c-playbook' },
};

export default function PlaybookPage() {
  return (
    <div className="page-shell">
      <div className="container">
        <header className="page-header">
          <div className="eyebrow">Playbook</div>
          <h1 className="page-header__title">
            The Indian D2C Founder’s Playbook
          </h1>
          <p className="page-header__intro">
            Twelve plain-spoken guides to making your numbers trustworthy — from
            why you shouldn’t trust ad platform conversions, through clean
            tracking and a single source of truth, all the way to incrementality
            and marketing mix modelling. Built for founders selling across their
            own site, marketplaces, and quick commerce.
          </p>
        </header>

        <div className="card-grid">
          {PLAYBOOKS.map((p) =>
            p.status === 'released' && p.slug ? (
              <Link
                key={p.number}
                href={`/indian-d2c-playbook/${p.slug}`}
                className="card"
              >
                <div className="card__tag">
                  {String(p.number).padStart(2, '0')} · Available now
                </div>
                <h3 className="card__title">{p.title}</h3>
                <p className="card__body">{p.description}</p>
                <span className="card__cta">Read the playbook</span>
              </Link>
            ) : (
              <div
                key={p.number}
                className="card card--soon"
                aria-disabled="true"
              >
                <div className="card__tag">
                  {String(p.number).padStart(2, '0')} · Coming soon
                </div>
                <h3 className="card__title">{p.title}</h3>
                <p className="card__body">{p.description}</p>
                <span className="card__cta card__cta--soon">Coming soon</span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
