// Graphic 1 — Double-count (static)
// Playbook #1, Section 2. Meta claims 800, Google claims 600, you got 1,000.
// Lime appears ONLY on the "140% claimed" punchline box.
// Colors use the repo design tokens (var(--*)) via inline style — var() is not
// honored in SVG presentation attributes, so fills/strokes are set in style.

export default function GraphicDoubleCount() {
  return (
    <svg
      width="100%"
      viewBox="0 0 680 440"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>The same order claimed by two ad platforms</title>
      <desc>
        One real order of 1,000 units. Meta claims 800, Google claims 600.
        Together they claim 1,400, which is 140 percent of the orders that
        actually happened.
      </desc>
      <defs>
        <marker
          id="dc-arrow"
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

      <text
        x="150"
        y="58"
        textAnchor="middle"
        fontFamily="'JetBrains Mono', monospace"
        style={{ fontSize: 12, letterSpacing: '0.1em', fill: 'var(--text-muted)' }}
      >
        META CLAIMS
      </text>
      <rect x="60" y="72" width="180" height="64" strokeWidth="0.5" style={{ fill: 'var(--bg-surface)', stroke: 'var(--border-default)' }} />
      <text
        x="150"
        y="112"
        textAnchor="middle"
        fontFamily="'JetBrains Mono', monospace"
        style={{ fontSize: 30, fontWeight: 500, fill: 'var(--text-primary)' }}
      >
        800
      </text>

      <text
        x="530"
        y="58"
        textAnchor="middle"
        fontFamily="'JetBrains Mono', monospace"
        style={{ fontSize: 12, letterSpacing: '0.1em', fill: 'var(--text-muted)' }}
      >
        GOOGLE CLAIMS
      </text>
      <rect x="440" y="72" width="180" height="64" strokeWidth="0.5" style={{ fill: 'var(--bg-surface)', stroke: 'var(--border-default)' }} />
      <text
        x="530"
        y="112"
        textAnchor="middle"
        fontFamily="'JetBrains Mono', monospace"
        style={{ fontSize: 30, fontWeight: 500, fill: 'var(--text-primary)' }}
      >
        600
      </text>

      <path d="M150 142 L150 210 L335 210 L335 250" fill="none" stroke="#5F5E5A" strokeWidth="1" markerEnd="url(#dc-arrow)" />
      <path d="M530 142 L530 210 L345 210 L345 250" fill="none" stroke="#5F5E5A" strokeWidth="1" markerEnd="url(#dc-arrow)" />

      <rect x="250" y="256" width="180" height="72" strokeWidth="0.5" style={{ fill: 'var(--bg-surface)', stroke: 'var(--border-strong)' }} />
      <text
        x="340"
        y="284"
        textAnchor="middle"
        fontFamily="'JetBrains Mono', monospace"
        style={{ fontSize: 11, letterSpacing: '0.1em', fill: 'var(--text-muted)' }}
      >
        YOU ACTUALLY GOT
      </text>
      <text
        x="340"
        y="314"
        textAnchor="middle"
        fontFamily="'JetBrains Mono', monospace"
        style={{ fontSize: 26, fontWeight: 500, fill: 'var(--text-primary)' }}
      >
        1,000
      </text>

      <text
        x="340"
        y="360"
        textAnchor="middle"
        fontFamily="'General Sans', 'Inter', sans-serif"
        style={{ fontSize: 13, fill: 'var(--text-muted)' }}
      >
        800 + 600 = 1,400 orders claimed against 1,000 real
      </text>

      <rect x="250" y="378" width="180" height="44" strokeWidth="0.5" style={{ fill: 'var(--accent-muted)', stroke: 'var(--accent)' }} />
      <text
        x="340"
        y="406"
        textAnchor="middle"
        fontFamily="'JetBrains Mono', monospace"
        style={{ fontSize: 20, fontWeight: 500, fill: 'var(--accent)' }}
      >
        140% claimed
      </text>
    </svg>
  );
}
