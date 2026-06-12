// AttributionWindows.tsx — Playbook 2, Section 3 ("They use different time windows").
// One click on day 0, one purchase on day 9. Lime on: the purchase marker (outside Meta's window).
// Colors use the repo design tokens (var(--*)).
export default function AttributionWindows() {
  return (
    <svg viewBox="0 0 680 256" width="100%" role="img" xmlns="http://www.w3.org/2000/svg">
      <title>The same purchase, caught or missed depending on the window</title>
      <desc>
        A timeline with an ad click on day zero and a purchase on day nine. Meta&apos;s seven-day click
        window closes before the purchase and misses it, while GA4&apos;s longer lookback still catches
        the same sale.
      </desc>

      <text x="0" y="20" fontFamily="'JetBrains Mono',monospace" fontSize="11" letterSpacing="1.3" fill="var(--text-muted)">
        ONE CLICK, ONE PURCHASE 9 DAYS LATER
      </text>
      <line x1="0" y1="32" x2="680" y2="32" stroke="var(--border-default)" strokeWidth="0.5" />

      {/* axis */}
      <line x1="40" y1="150" x2="660" y2="150" stroke="var(--border-strong)" strokeWidth="1" />
      <g fontFamily="'JetBrains Mono',monospace" fontSize="9.5" fill="var(--text-muted)">
        <line x1="40" y1="146" x2="40" y2="154" stroke="var(--border-strong)" strokeWidth="1" />
        <text x="40" y="170" textAnchor="middle">d0</text>
        <line x1="164" y1="146" x2="164" y2="154" stroke="var(--border-strong)" strokeWidth="1" />
        <text x="164" y="170" textAnchor="middle">d2</text>
        <line x1="288" y1="146" x2="288" y2="154" stroke="var(--border-strong)" strokeWidth="1" />
        <text x="288" y="170" textAnchor="middle">d4</text>
        <line x1="412" y1="146" x2="412" y2="154" stroke="var(--border-strong)" strokeWidth="1" />
        <text x="412" y="170" textAnchor="middle">d6</text>
        <line x1="474" y1="146" x2="474" y2="154" stroke="var(--border-strong)" strokeWidth="1" />
        <text x="474" y="170" textAnchor="middle">d7</text>
        <line x1="598" y1="146" x2="598" y2="154" stroke="var(--border-strong)" strokeWidth="1" />
        <text x="598" y="170" textAnchor="middle">d9</text>
      </g>

      {/* Meta 7-day click window band */}
      <rect x="40" y="58" width="434" height="30" fill="var(--bg-surface)" stroke="var(--border-default)" strokeWidth="0.5" />
      <text x="52" y="77" fontFamily="'JetBrains Mono',monospace" fontSize="11" fill="var(--text-muted)">Meta · 7-day click window</text>
      <line x1="474" y1="58" x2="474" y2="150" stroke="var(--border-strong)" strokeWidth="1" strokeDasharray="3 3" />
      <text x="474" y="104" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="9" fill="var(--text-muted)">closes</text>

      {/* GA4 lookback band */}
      <rect x="40" y="100" width="620" height="30" fill="var(--bg-surface)" stroke="var(--border-default)" strokeWidth="0.5" />
      <text x="52" y="119" fontFamily="'JetBrains Mono',monospace" fontSize="11" fill="var(--text-muted)">GA4 · 30-day lookback (still open)</text>

      {/* click marker d0 */}
      <circle cx="40" cy="150" r="4" fill="var(--text-muted)" />
      <text x="40" y="200" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="10" fill="var(--text-muted)">ad click</text>

      {/* purchase marker d9, lime */}
      <circle cx="598" cy="150" r="5" fill="var(--accent)" />
      <text x="598" y="200" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="10" fill="var(--accent)">purchase</text>
      <text x="598" y="214" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="9" fill="var(--accent)">Meta misses it</text>

      <line x1="0" y1="238" x2="680" y2="238" stroke="var(--border-default)" strokeWidth="0.5" />
      <text x="0" y="254" fontFamily="'JetBrains Mono',monospace" fontSize="9.5" fill="var(--text-muted)">
        SAME SALE · META CREDITS NOTHING · GA4 STILL COUNTS IT
      </text>
    </svg>
  );
}
