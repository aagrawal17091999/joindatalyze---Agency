'use client';
import { useState } from 'react';
import styles from './EngagementModel.module.css';

type Tier = {
  id: string;
  number: string;
  name: string;
  price: string;
  badge?: string;
  subline?: string;
  /** One-sentence definition of the thing being bought. This is what gets
   *  extracted for "what is an analytics audit"-style queries; the `included`
   *  bullets never will be. */
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
    price: 'From $1k',
    badge: 'Best first step',
    subline: 'Most teams identify 3-5 revenue leaks in the first audit.',
    buyerState: "For teams that suspect something's broken but can't pinpoint where.",
    included: [
      'Full audit across product, marketing, revenue, and warehouse',
      'Tracking plan and schema documentation review',
      "Stack health diagnosis: what's working, what's drifting, what's missing",
    ],
    outcome: 'clarity on what to fix and what to build next',
    ctaLabel: 'Start with an audit',
    ctaQuery: 'audit',
  },
  {
    id: 'infra',
    number: '02',
    name: 'INFRA SETUP',
    price: '$1.5k-3k, project',
    buyerState: 'For teams laying a foundation they can actually trust.',
    included: [
      'Tracking plan designed around the questions you need to answer',
      'Implementation across web, mobile, and server SDKs, with verification',
      'Multi-tool connection (product analytics, warehouse, ad platforms, CRM)',
      'Initial dashboard suite (executive, product, growth) owned by your team',
    ],
    outcome: 'a solid product analytics foundation',
    ctaLabel: 'Scope the setup',
    ctaQuery: 'infra',
  },
  {
    id: 'embedded',
    number: '03',
    name: 'EMBEDDED',
    price: '$2-5k / mo',
    buyerState: 'For teams that need a data team without hiring one.',
    included: [
      'Fractional analytics leadership',
      'Continuous experimentation design and measurement',
      'Cross-tool integration maintenance',
      'Weekly insight delivery and monthly reviews',
    ],
    outcome: 'accurate data and insights on where to focus',
    ctaLabel: 'Talk about embedded',
    ctaQuery: 'embedded',
  },
];

/** The section title is an h2 on the homepage, where the hero owns the h1, and
 *  an h1 on /pricing, where this section is the page's lead content. */
export function EngagementModel({
  headingAs: Heading = 'h2',
}: {
  headingAs?: 'h1' | 'h2';
}) {
  const [active, setActive] = useState(0);
  const tier = tiers[active];
  // Tabs are equal-width columns, so the dot sits at the centre of the active
  // one and the dashed line spans centre-to-centre. Both derive from the tier
  // count so adding or removing a tier keeps them aligned.
  const halfColumn = 100 / (tiers.length * 2);
  const dotPosition = halfColumn * (active * 2 + 1);

  return (
    <section className={styles.section} id="pricing">
      <div className={styles.container}>
        <div className={styles.eyebrow}>Pricing</div>
        <Heading className={styles.heading}>How much does Datalyze cost?</Heading>
        <p className={styles.summary}>
          From $1k for a one-time audit, up to $2&ndash;5k/month embedded. Most
          teams start with the audit.
        </p>

        <div className={styles.selector}>
          <div
            className={styles.selectorLine}
            style={{ left: `${halfColumn}%`, right: `${halfColumn}%` }}
            aria-hidden="true"
          />
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
