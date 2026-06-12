// Graphic 2 — Attribution windows timeline (static)
// Playbook #1, Section 2. 1-day view window + 7-day click window; purchase on day 6
// gets credited despite the noise in between.
// Lime appears ONLY on the "Purchase" marker and the "Credited to the ad" verdict box.
// Colors use the repo design tokens (var(--*)) via inline style.

export default function GraphicAttributionWindows() {
  return (
    <svg
      width="100%"
      viewBox="0 0 680 420"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>How Meta&apos;s default attribution windows count conversions</title>
      <desc>
        A timeline showing a 1-day view-through window from an ad impression and a
        7-day click window from an ad click. A purchase six days later gets credited
        to the click even though other things happened in between.
      </desc>
      <defs>
        <marker
          id="aw-arrow"
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
            stroke="context-stroke"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </marker>
      </defs>

      <line x1="60" y1="120" x2="620" y2="120" strokeWidth="1" style={{ stroke: 'var(--border-strong)' }} />
      <text x="60" y="150" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" style={{ fontSize: 11, fill: 'var(--text-muted)' }}>
        DAY 0
      </text>
      <text x="620" y="150" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" style={{ fontSize: 11, fill: 'var(--text-muted)' }}>
        DAY 7
      </text>

      <line x1="140" y1="112" x2="140" y2="128" strokeWidth="1" style={{ stroke: 'var(--text-muted)' }} />
      <circle cx="140" cy="120" r="4" style={{ fill: 'var(--text-muted)' }} />
      <text x="140" y="100" textAnchor="middle" fontFamily="'General Sans', 'Inter', sans-serif" style={{ fontSize: 13, fill: 'var(--text-primary)' }}>
        Impression
      </text>
      <text x="140" y="170" textAnchor="middle" fontFamily="'General Sans', 'Inter', sans-serif" style={{ fontSize: 11, fill: 'var(--text-muted)' }}>
        ad seen, not clicked
      </text>

      <line x1="220" y1="112" x2="220" y2="128" strokeWidth="1" style={{ stroke: 'var(--text-muted)' }} />
      <circle cx="220" cy="120" r="4" style={{ fill: 'var(--text-muted)' }} />
      <text x="220" y="100" textAnchor="middle" fontFamily="'General Sans', 'Inter', sans-serif" style={{ fontSize: 13, fill: 'var(--text-primary)' }}>
        Click
      </text>

      <line x1="520" y1="108" x2="520" y2="132" strokeWidth="1.5" style={{ stroke: 'var(--accent)' }} />
      <circle cx="520" cy="120" r="5" style={{ fill: 'var(--accent)' }} />
      <text x="520" y="100" textAnchor="middle" fontFamily="'General Sans', 'Inter', sans-serif" style={{ fontSize: 13, fontWeight: 500, fill: 'var(--accent)' }}>
        Purchase
      </text>
      <text x="520" y="170" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" style={{ fontSize: 11, fill: 'var(--text-muted)' }}>
        day 6
      </text>

      <rect x="140" y="200" width="80" height="34" strokeWidth="0.5" style={{ fill: 'var(--bg-surface)', stroke: 'var(--border-default)' }} />
      <text x="180" y="222" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" style={{ fontSize: 11, fill: 'var(--text-muted)' }}>
        1-DAY VIEW
      </text>

      <rect x="220" y="246" width="300" height="34" strokeWidth="0.5" style={{ fill: 'var(--bg-surface)', stroke: 'var(--border-default)' }} />
      <text x="370" y="268" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" style={{ fontSize: 11, fill: 'var(--text-muted)' }}>
        7-DAY CLICK WINDOW
      </text>

      <path d="M520 280 L520 300 L370 300 L370 312" fill="none" stroke="#5F5E5A" strokeWidth="1" markerEnd="url(#aw-arrow)" />
      <rect x="250" y="318" width="240" height="60" strokeWidth="0.5" style={{ fill: 'var(--accent-muted)', stroke: 'var(--accent)' }} />
      <text x="370" y="344" textAnchor="middle" fontFamily="'General Sans', 'Inter', sans-serif" style={{ fontSize: 13, fontWeight: 500, fill: 'var(--accent)' }}>
        Credited to the ad
      </text>
      <text x="370" y="364" textAnchor="middle" fontFamily="'General Sans', 'Inter', sans-serif" style={{ fontSize: 12, fill: 'var(--text-muted)' }}>
        even with 6 days of noise in between
      </text>
    </svg>
  );
}
