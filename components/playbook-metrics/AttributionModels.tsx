// AttributionModels.tsx — Playbook 2, Section 3 ("They use different attribution models").
// One customer journey credited three ways. Lime on: the credited touchpoint(s) in each row.
// Colors use the repo design tokens (var(--*)).
export default function AttributionModels() {
  return (
    <svg viewBox="0 0 680 360" width="100%" role="img" xmlns="http://www.w3.org/2000/svg">
      <title>The same journey credited three different ways</title>
      <desc>
        One customer journey from Instagram ad to Google search to direct visit to purchase, shown
        under three attribution models. Last-click credits the direct visit, data-driven splits
        credit across touches, and Meta self-attribution claims the Instagram ad.
      </desc>
      <defs>
        <marker
          id="am-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path
            d="M2 1L8 5L2 9"
            fill="none"
            stroke="var(--border-strong)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </marker>
      </defs>

      <text x="0" y="20" fontFamily="'JetBrains Mono',monospace" fontSize="11" letterSpacing="1.3" fill="var(--text-muted)">
        ONE JOURNEY · ONE ₹1,200 ORDER · THREE MODELS
      </text>
      <line x1="0" y1="32" x2="680" y2="32" stroke="var(--border-default)" strokeWidth="0.5" />

      <text x="70" y="64" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="10.5" fill="var(--text-muted)">Instagram</text>
      <text x="70" y="78" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="10.5" fill="var(--text-muted)">ad</text>
      <text x="250" y="64" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="10.5" fill="var(--text-muted)">Google</text>
      <text x="250" y="78" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="10.5" fill="var(--text-muted)">search</text>
      <text x="430" y="64" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="10.5" fill="var(--text-muted)">Direct</text>
      <text x="430" y="78" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="10.5" fill="var(--text-muted)">visit</text>
      <text x="610" y="64" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="10.5" fill="var(--text-muted)">Purchase</text>

      {/* row 1: last-click */}
      <text x="0" y="118" fontFamily="'General Sans',sans-serif" fontSize="12" fontWeight="500" fill="var(--text-primary)">last-click</text>
      <text x="0" y="133" fontFamily="'JetBrains Mono',monospace" fontSize="9.5" fill="var(--text-muted)">100% to final touch</text>
      <g>
        <rect x="28" y="146" width="84" height="34" fill="var(--bg-surface)" stroke="var(--border-default)" strokeWidth="0.5" />
        <rect x="208" y="146" width="84" height="34" fill="var(--bg-surface)" stroke="var(--border-default)" strokeWidth="0.5" />
        <rect x="388" y="146" width="84" height="34" fill="var(--accent-muted)" stroke="var(--accent)" strokeWidth="1.5" />
        <line x1="112" y1="163" x2="206" y2="163" stroke="var(--border-strong)" strokeWidth="1" markerEnd="url(#am-arrow)" />
        <line x1="292" y1="163" x2="386" y2="163" stroke="var(--border-strong)" strokeWidth="1" markerEnd="url(#am-arrow)" />
        <line x1="472" y1="163" x2="566" y2="163" stroke="var(--border-strong)" strokeWidth="1" markerEnd="url(#am-arrow)" />
        <text x="70" y="167" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="11" fill="var(--text-muted)">0%</text>
        <text x="250" y="167" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="11" fill="var(--text-muted)">0%</text>
        <text x="430" y="167" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="12" fill="var(--accent)">100%</text>
        <text x="610" y="167" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="13" fill="var(--text-muted)">₹1,200</text>
      </g>

      {/* row 2: data-driven */}
      <text x="0" y="216" fontFamily="'General Sans',sans-serif" fontSize="12" fontWeight="500" fill="var(--text-primary)">data-driven</text>
      <text x="0" y="231" fontFamily="'JetBrains Mono',monospace" fontSize="9.5" fill="var(--text-muted)">split across touches</text>
      <text x="0" y="245" fontFamily="'JetBrains Mono',monospace" fontSize="9.5" fill="var(--text-muted)">(GA4 default)</text>
      <g>
        <rect x="28" y="244" width="84" height="34" fill="var(--accent-muted)" stroke="var(--accent)" strokeWidth="1.5" />
        <rect x="208" y="244" width="84" height="34" fill="var(--accent-muted)" stroke="var(--accent)" strokeWidth="1.5" />
        <rect x="388" y="244" width="84" height="34" fill="var(--accent-muted)" stroke="var(--accent)" strokeWidth="1.5" />
        <line x1="112" y1="261" x2="206" y2="261" stroke="var(--border-strong)" strokeWidth="1" markerEnd="url(#am-arrow)" />
        <line x1="292" y1="261" x2="386" y2="261" stroke="var(--border-strong)" strokeWidth="1" markerEnd="url(#am-arrow)" />
        <line x1="472" y1="261" x2="566" y2="261" stroke="var(--border-strong)" strokeWidth="1" markerEnd="url(#am-arrow)" />
        <text x="70" y="265" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="12" fill="var(--accent)">40%</text>
        <text x="250" y="265" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="12" fill="var(--accent)">35%</text>
        <text x="430" y="265" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="12" fill="var(--accent)">25%</text>
        <text x="610" y="265" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="13" fill="var(--text-muted)">₹1,200</text>
      </g>

      {/* row 3: meta self-attribution */}
      <text x="0" y="314" fontFamily="'General Sans',sans-serif" fontSize="12" fontWeight="500" fill="var(--text-primary)">Meta says</text>
      <text x="0" y="329" fontFamily="'JetBrains Mono',monospace" fontSize="9.5" fill="var(--text-muted)">claims the impression</text>
      <g>
        <rect x="28" y="328" width="84" height="34" fill="var(--accent-muted)" stroke="var(--accent)" strokeWidth="1.5" />
        <rect x="208" y="328" width="84" height="34" fill="var(--bg-surface)" stroke="var(--border-default)" strokeWidth="0.5" />
        <rect x="388" y="328" width="84" height="34" fill="var(--bg-surface)" stroke="var(--border-default)" strokeWidth="0.5" />
        <line x1="112" y1="345" x2="206" y2="345" stroke="var(--border-strong)" strokeWidth="1" markerEnd="url(#am-arrow)" />
        <line x1="292" y1="345" x2="386" y2="345" stroke="var(--border-strong)" strokeWidth="1" markerEnd="url(#am-arrow)" />
        <line x1="472" y1="345" x2="566" y2="345" stroke="var(--border-strong)" strokeWidth="1" markerEnd="url(#am-arrow)" />
        <text x="70" y="349" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="12" fill="var(--accent)">100%</text>
        <text x="250" y="349" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="11" fill="var(--text-muted)">0%</text>
        <text x="430" y="349" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="11" fill="var(--text-muted)">0%</text>
        <text x="610" y="349" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="13" fill="var(--text-muted)">₹1,200</text>
      </g>
    </svg>
  );
}
