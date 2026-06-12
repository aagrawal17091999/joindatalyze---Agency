// DecisionFramework.tsx — Playbook 2, Section 4 ("So which one do you believe?").
// Four questions paired with the source closest to truth. Lime on: the bottom through-line bar.
// Colors use the repo design tokens (var(--*)).
export default function DecisionFramework() {
  return (
    <svg viewBox="0 0 680 372" width="100%" role="img" xmlns="http://www.w3.org/2000/svg">
      <title>Which source to trust for which question</title>
      <desc>
        A table pairing four common D2C questions with the data source closest to the truth for each.
        Revenue comes from your database, orders from your commerce system, user source from your
        product analytics tool, and budget decisions from platform spend mapped to your own
        conversions. The recurring through-line is sources you can model.
      </desc>

      <text x="0" y="20" fontFamily="'JetBrains Mono',monospace" fontSize="11" letterSpacing="1.3" fill="var(--text-muted)">
        THE QUESTION → THE SOURCE CLOSEST TO TRUTH
      </text>
      <line x1="0" y1="32" x2="680" y2="32" stroke="var(--border-default)" strokeWidth="0.5" />

      {/* row 1 */}
      <g>
        <rect x="0" y="48" width="318" height="58" fill="var(--bg-surface)" stroke="var(--border-default)" strokeWidth="0.5" />
        <rect x="338" y="48" width="342" height="58" fill="var(--bg-surface)" stroke="var(--border-default)" strokeWidth="0.5" />
        <text x="18" y="74" fontFamily="'General Sans',sans-serif" fontSize="13.5" fill="var(--text-primary)">How much revenue did we make?</text>
        <text x="18" y="93" fontFamily="'JetBrains Mono',monospace" fontSize="9.5" fill="var(--text-muted)">absolute money</text>
        <text x="356" y="74" fontFamily="'JetBrains Mono',monospace" fontSize="13" fill="var(--text-primary)">Stripe / your database</text>
        <text x="356" y="93" fontFamily="'JetBrains Mono',monospace" fontSize="9.5" fill="var(--text-muted)">the system that captured payment</text>
      </g>

      {/* row 2 */}
      <g>
        <rect x="0" y="114" width="318" height="58" fill="var(--bg-surface)" stroke="var(--border-default)" strokeWidth="0.5" />
        <rect x="338" y="114" width="342" height="58" fill="var(--bg-surface)" stroke="var(--border-default)" strokeWidth="0.5" />
        <text x="18" y="140" fontFamily="'General Sans',sans-serif" fontSize="13.5" fill="var(--text-primary)">How many orders?</text>
        <text x="18" y="159" fontFamily="'JetBrains Mono',monospace" fontSize="9.5" fill="var(--text-muted)">count of sales</text>
        <text x="356" y="140" fontFamily="'JetBrains Mono',monospace" fontSize="13" fill="var(--text-primary)">Shopify / commerce system</text>
        <text x="356" y="159" fontFamily="'JetBrains Mono',monospace" fontSize="9.5" fill="var(--text-muted)">counts every captured order</text>
      </g>

      {/* row 3 */}
      <g>
        <rect x="0" y="180" width="318" height="58" fill="var(--bg-surface)" stroke="var(--border-default)" strokeWidth="0.5" />
        <rect x="338" y="180" width="342" height="58" fill="var(--bg-surface)" stroke="var(--border-default)" strokeWidth="0.5" />
        <text x="18" y="206" fontFamily="'General Sans',sans-serif" fontSize="13.5" fill="var(--text-primary)">Where did this user come from?</text>
        <text x="18" y="225" fontFamily="'JetBrains Mono',monospace" fontSize="9.5" fill="var(--text-muted)">attribution</text>
        <text x="356" y="206" fontFamily="'JetBrains Mono',monospace" fontSize="13" fill="var(--text-primary)">your product analytics tool</text>
        <text x="356" y="225" fontFamily="'JetBrains Mono',monospace" fontSize="9.5" fill="var(--text-muted)">not the ad platform&apos;s self-report</text>
      </g>

      {/* row 4 */}
      <g>
        <rect x="0" y="246" width="318" height="58" fill="var(--bg-surface)" stroke="var(--border-default)" strokeWidth="0.5" />
        <rect x="338" y="246" width="342" height="58" fill="var(--bg-surface)" stroke="var(--border-default)" strokeWidth="0.5" />
        <text x="18" y="272" fontFamily="'General Sans',sans-serif" fontSize="13.5" fill="var(--text-primary)">Worth more budget?</text>
        <text x="18" y="291" fontFamily="'JetBrains Mono',monospace" fontSize="9.5" fill="var(--text-muted)">channel decisions</text>
        <text x="356" y="272" fontFamily="'JetBrains Mono',monospace" fontSize="13" fill="var(--text-primary)">platform spend → your conversions</text>
        <text x="356" y="291" fontFamily="'JetBrains Mono',monospace" fontSize="9.5" fill="var(--text-muted)">spend is the one thing they don&apos;t inflate</text>
      </g>

      {/* through-line, lime */}
      <rect x="0" y="320" width="680" height="40" fill="var(--accent-muted)" stroke="var(--accent)" strokeWidth="1.5" />
      <text x="18" y="345" fontFamily="'General Sans',sans-serif" fontSize="13.5" fill="var(--accent)">
        The trustworthy number always comes from a source you can model.
      </text>
    </svg>
  );
}
