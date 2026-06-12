'use client';

// Section 1 centerpiece — Reported vs Real toggle.
// One switch flips the same ₹10,00,000 in ad spend between what the platforms
// report and what your own analytics would show. Numbers are hardcoded and
// internally consistent (AOV held at ₹1,200; ROAS = revenue / spend); they must
// not drift and they intentionally mirror Graphic 1 (1,400 / 1,000 / 140%).

import { useState } from 'react';
import styles from './ReportedVsRealToggle.module.css';

type Tile = { value: string; label: string };

type MetricState = {
  tiles: Tile[];
  callout: { pre: string; lime: string; post: string };
};

const REPORTED: MetricState = {
  tiles: [
    { value: '₹10,00,000', label: 'Ad spend' },
    { value: '1,400', label: 'Orders claimed' },
    { value: '₹16,80,000', label: 'Revenue claimed' },
    { value: '1.68x', label: 'Reported ROAS' },
  ],
  callout: {
    pre: 'Meta and Google each counted the same customers. Together they claim ',
    lime: '140%',
    post: ' of the orders that actually happened.',
  },
};

const REAL: MetricState = {
  tiles: [
    { value: '₹10,00,000', label: 'Ad spend' },
    { value: '1,000', label: 'Real orders' },
    { value: '₹12,00,000', label: 'Real revenue' },
    { value: '1.20x', label: 'Real ROAS' },
  ],
  callout: {
    pre: 'De-duplicated against your own analytics. The real number is ',
    lime: '1.20x',
    post: ', not 1.68x.',
  },
};

export default function ReportedVsRealToggle() {
  const [real, setReal] = useState(false);
  const state = real ? REAL : REPORTED;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.spendLabel}>Same ₹10,00,000 in spend</span>

        <div className={styles.toggle} role="group" aria-label="Choose which numbers to show">
          <button
            type="button"
            className={styles.toggleBtn}
            aria-pressed={!real}
            onClick={() => setReal(false)}
          >
            What they report
          </button>
          <button
            type="button"
            className={styles.toggleBtn}
            aria-pressed={real}
            onClick={() => setReal(true)}
          >
            What actually happened
          </button>
        </div>
      </div>

      <div className={styles.tiles}>
        {state.tiles.map((tile, i) => (
          <div className={styles.tile} key={tile.label}>
            {/* key on state replays the fade when the value swaps */}
            <span className={styles.tileValue} key={`${real}-${i}`}>
              {tile.value}
            </span>
            <span className={styles.tileLabel}>{tile.label}</span>
          </div>
        ))}
      </div>

      <p className={styles.callout} key={`callout-${real}`}>
        {state.callout.pre}
        <span className={styles.calloutLime}>{state.callout.lime}</span>
        {state.callout.post}
      </p>

      <p className={styles.disclaimer}>
        Illustrative example, not a specific account. The gap is real; the exact
        figures vary by brand.
      </p>
    </div>
  );
}
