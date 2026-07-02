'use client';
import { useState } from 'react';
import styles from './EngagementModel.module.css';

type Tier = {
  id: string;
  number: string;
  name: string;
  timeframe: string;
  // PLACEHOLDER PRICING — these figures are provisional and MUST be confirmed
  // with the team before launch.
  price: string;
  badge?: string;
  subline?: string;
  buyerState: string;
  included: string[];
  outcome: string;
  ctaLabel: string;
  ctaQuery: string;
};

const tiers: Tier[] = [
  {
    id: 'audit',
    number: '01',
    name: 'AUDIT',
    timeframe: '1-2 weeks',
    price: 'From $1k',
    badge: 'Best first step',
    subline: 'Most teams identify 3-5 revenue leaks in the first audit.',
    buyerState: "For teams that suspect something's broken but can't pinpoint where.",
    included: [
      'Full audit across product, marketing, revenue, and warehouse',
      'Tracking plan and schema documentation review',
      "Stack health diagnosis: what's working, what's drifting, what's missing",
      'Prioritized roadmap of fixes ranked by revenue impact',
    ],
    outcome: 'clarity on what to fix and what to build next.',
    ctaLabel: 'Start with an audit',
    ctaQuery: 'audit',
  },
  {
    id: 'infra',
    number: '02',
    name: 'INFRA SETUP',
    timeframe: '30 days',
    price: '$1.5k-3k, project',
    buyerState: 'For teams laying a foundation they can actually trust.',
    included: [
      'Tracking plan designed around the questions you need to answer',
      'Implementation across web, mobile, and server SDKs, with verification',
      'Multi-tool connection (product analytics, warehouse, ad platforms, CRM)',
      'Initial dashboard suite (executive, product, growth) owned by your team',
    ],
    outcome: 'a foundation that survives every future question.',
    ctaLabel: 'Scope the setup',
    ctaQuery: 'infra',
  },
  {
    id: 'build',
    number: '03',
    name: 'BUILD',
    timeframe: '4-8 weeks',
    price: '$2-4k, project',
    buyerState: 'For teams who know what they need built.',
    included: [
      'Retention analysis or cohort studies',
      'Executive, product, and growth dashboards',
      'Custom AI Analytics Agent setup',
      'Migrations and rebuilds (e.g. GA4 to Mixpanel, or onto a warehouse)',
    ],
    outcome: 'a working system, fully owned by your team.',
    ctaLabel: 'Scope a build',
    ctaQuery: 'build',
  },
  {
    id: 'embedded',
    number: '04',
    name: 'EMBEDDED',
    timeframe: 'ongoing, monthly',
    price: '$2-5k / mo',
    buyerState: 'For teams that need a data team without hiring one.',
    included: [
      'Fractional analytics leadership',
      'Continuous experimentation design and measurement',
      'Cross-tool integration maintenance',
      'Weekly insight delivery and monthly reviews',
    ],
    outcome: 'a senior data function that compounds.',
    ctaLabel: 'Talk about embedded',
    ctaQuery: 'embedded',
  },
];

export function EngagementModel() {
  const [active, setActive] = useState(0);
  const tier = tiers[active];
  const dotPosition = 12.5 + active * 25;

  return (
    <section className={styles.section} id="pricing">
      <div className={styles.container}>
        <div className={styles.eyebrow}>Pricing</div>
        <h2 className={styles.heading}>How we work</h2>

        <div className={styles.selector}>
          <div className={styles.selectorLine} aria-hidden="true" />
          <div
            className={styles.dot}
            style={{ left: `${dotPosition}%` }}
            aria-hidden="true"
          />
          <div className={styles.tabs} role="tablist" aria-label="Engagement tiers">
            {tiers.map((t, i) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={i === active}
                aria-controls={`tier-panel-${t.id}`}
                onClick={() => setActive(i)}
                className={`${styles.tab} ${i === active ? styles.tabActive : ''}`}
              >
                <span className={styles.tabAnchor} aria-hidden="true" />
                <span className={styles.tabNumber}>{t.number}</span>
                <span className={styles.tabName}>{t.name}</span>
                <span className={styles.tabTime}>{t.timeframe}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.panelWrap}>
          <div
            key={tier.id}
            id={`tier-panel-${tier.id}`}
            role="tabpanel"
            className={styles.panel}
          >
            <div className={styles.panelHead}>
              <span className={styles.panelName}>{tier.name}</span>
              <span className={styles.panelTime}>{tier.timeframe}</span>
              {tier.badge ? (
                <span className={styles.badge}>{tier.badge}</span>
              ) : null}
            </div>
            <div className={styles.panelPrice}>{tier.price}</div>
            <p className={styles.panelBuyer}>{tier.buyerState}</p>
            <div className={styles.panelDivider} />
            <div className={styles.panelIncludedLabel}>What&apos;s included</div>
            <ul className={styles.panelList}>
              {tier.included.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className={styles.panelOutcome}>
              <span className={styles.panelOutcomeLabel}>Outcome:</span> {tier.outcome}
            </p>
            {tier.id === 'audit' ? (
              <>
                <a href="/contact" className={styles.ctaFill}>
                  {tier.ctaLabel} <span aria-hidden="true">→</span>
                </a>
                {tier.subline ? (
                  <p className={styles.subline}>{tier.subline}</p>
                ) : null}
              </>
            ) : (
              <a href="/contact" className={styles.cta}>
                {tier.ctaLabel} <span aria-hidden="true">→</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
