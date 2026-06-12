'use client';

// TwoLayerDashboard — Playbook 3 centerpiece.
// Six baseline (layer-one) metric tiles. Tapping any tile flips it to reveal the
// behavioural (layer-two) question hiding underneath, the segmented reality, and
// the decision it changes. Lime appears ONLY on the flipped layer-two state; the
// front dashboard stays neutral so the punchline is reserved for the reveal.
// All numbers tie to one illustrative demo brand (50k sessions, 1,200 orders,
// AOV ₹1,200) and are internally consistent. Numbers are hardcoded, never computed.

import { useState } from 'react';
import styles from './TwoLayerDashboard.module.css';

type Tile = {
  eyebrow: string;
  base: string;
  baseLabel: string;
  question: string;
  detail: string;
  decision: string;
};

const TILES: readonly Tile[] = [
  {
    eyebrow: 'CHECKOUT',
    base: '60%',
    baseLabel: 'drop at checkout',
    question: 'Where exactly are people dropping?',
    detail:
      "Mobile drops at 69% vs 40% on desktop. Worst among first-time buyers in pincodes where COD isn't offered (81%). Fix the COD flow on mobile for new users first.",
    decision: 'What you fix first',
  },
  {
    eyebrow: 'SPEND',
    base: '2.0x',
    baseLabel: 'best ROAS · Meta',
    question: 'Which source brings buyers who come back?',
    detail:
      "Meta wins on first-order ROAS (2.0x). But Meta buyers repeat at 18% over 90 days while Google's 'worse' 1.8x brings buyers who repeat at 31%. The cheaper first order isn't the better customer.",
    decision: 'Where the next rupee goes',
  },
  {
    eyebrow: 'RETENTION',
    base: '24%',
    baseLabel: 'repeat rate · blended',
    question: 'What turns a first buyer into a repeat one?',
    detail:
      'Blended hides the trigger. Buyers who join the list repeat at 42%, starter-SKU buyers at 39%, those who do neither at 15%. Now activation has a target.',
    decision: 'Where retention effort goes',
  },
  {
    eyebrow: 'CATALOG',
    base: 'Product A',
    baseLabel: 'top seller · by units',
    question: 'Which products actually create repeaters?',
    detail:
      'Product A tops the bestseller list but its first-time buyers repeat at 16%. Product C sells less, same category and price, yet its first-time buyers repeat at 38%. C is the gateway, A just sells.',
    decision: 'What you feature and push on q-comm',
  },
  {
    eyebrow: 'BEHAVIOUR',
    base: '3.3',
    baseLabel: 'avg products viewed',
    question: 'Does browsing depth cause conversion?',
    detail:
      'Sessions with 5+ product views convert ~4x higher than 1-2 views. But is depth causing it, or do high-intent buyers just browse more? Only a nudge test, not the correlation, tells you whether to invest in discovery.',
    decision: 'Whether to build discovery',
  },
  {
    eyebrow: 'CONVERSION',
    base: '2.4%',
    baseLabel: 'conversion · blended',
    question: 'Whose conversion are you actually looking at?',
    detail:
      'Blended across sources is a vanity number. Email converts at ~8%, Google at ~3%, cold social at ~1%. The average describes no real visitor and hides which traffic is worth more.',
    decision: 'How you read every other number',
  },
] as const;

function TileCard({ tile }: { tile: Tile }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      aria-pressed={flipped}
      onClick={() => setFlipped((s) => !s)}
      className={styles.tile}
      data-flipped={flipped ? '1' : '0'}
    >
      {flipped ? (
        <>
          <div className={`${styles.eyebrow} ${styles.lime}`}>
            {tile.eyebrow} · LAYER TWO
          </div>
          <div className={styles.question}>{tile.question}</div>
          <div className={styles.detail}>{tile.detail}</div>
          <div className={styles.decision}>
            CHANGES → {tile.decision.toUpperCase()}
          </div>
        </>
      ) : (
        <>
          <div className={styles.eyebrow}>{tile.eyebrow}</div>
          <div className={styles.base}>{tile.base}</div>
          <div className={styles.baseLabel}>{tile.baseLabel}</div>
          <div className={styles.hint}>TAP TO SEE WHAT IT HIDES →</div>
        </>
      )}
    </button>
  );
}

export default function TwoLayerDashboard() {
  // Remount all tiles to reset them to the front face.
  const [resetKey, setResetKey] = useState(0);

  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <span className={styles.headLabel}>
          DEMO BRAND · ONE MONTH · TAP A TILE
        </span>
        <button
          type="button"
          className={styles.reset}
          onClick={() => setResetKey((k) => k + 1)}
        >
          reset all
        </button>
      </div>

      <div className={styles.grid} key={resetKey}>
        {TILES.map((tile) => (
          <TileCard key={tile.eyebrow} tile={tile} />
        ))}
      </div>

      <p className={styles.note}>
        Illustrative example, not a specific account. The flat numbers and the
        segments all tie to one demo brand. The gap is real; the exact figures vary
        by brand.
      </p>
    </div>
  );
}
