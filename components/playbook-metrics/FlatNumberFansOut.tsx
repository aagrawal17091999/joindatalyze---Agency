// FlatNumberFansOut — Playbook 3, "you already have the first layer" section.
// Shows one blended layer-one number (60% checkout drop) fanning out into four
// segmented layer-two cuts, the worst/most-actionable highlighted. Lime on: the
// single segment that drives a decision (the 81% no-COD-pincode box + its arrow).
// Colors use the repo design tokens (var(--*)) via inline style — var() is not
// honored in SVG presentation attributes, so fills/strokes are set in style.

export default function FlatNumberFansOut() {
  return (
    <svg
      width="100%"
      viewBox="0 0 680 360"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>
        One descriptive number fanning out into the behavioural segments hiding
        underneath it
      </title>
      <desc>
        At the top, a single layer-one number: 60 percent drop at checkout. Lines
        fan down from it to four segmented breakdowns in one row: desktop 40
        percent, mobile 69 percent, mobile first-time 74 percent, and mobile
        first-time in no-COD pincodes 81 percent. The last, most specific and
        actionable segment is highlighted, showing that the flat number hides the
        one cut you can act on.
      </desc>
      <defs>
        <marker
          id="p3g1-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
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

      <rect x="0" y="0" width="680" height="360" style={{ fill: 'var(--bg-base)' }} />

      <text
        x="40"
        y="40"
        fontFamily="'JetBrains Mono', monospace"
        style={{ fontSize: 11, letterSpacing: '0.12em', fill: 'var(--text-muted)' }}
      >
        THE FLAT NUMBER HIDES THE ONE YOU CAN ACT ON
      </text>

      <rect
        x="250"
        y="58"
        width="180"
        height="74"
        strokeWidth="0.5"
        style={{ fill: 'var(--bg-surface)', stroke: 'var(--border-default)' }}
      />
      <text
        x="340"
        y="88"
        fontFamily="'JetBrains Mono', monospace"
        textAnchor="middle"
        style={{ fontSize: 30, fill: 'var(--text-primary)' }}
      >
        60%
      </text>
      <text
        x="340"
        y="113"
        fontFamily="'General Sans', sans-serif"
        textAnchor="middle"
        style={{ fontSize: 12, fill: 'var(--text-muted)' }}
      >
        drop at checkout
      </text>
      <text
        x="340"
        y="127"
        fontFamily="'JetBrains Mono', monospace"
        textAnchor="middle"
        style={{ fontSize: 9, letterSpacing: '0.1em', fill: 'var(--text-muted)' }}
      >
        LAYER ONE · BLENDED
      </text>

      <line x1="300" y1="132" x2="110" y2="226" strokeWidth="1" style={{ stroke: 'var(--border-strong)' }} />
      <line x1="325" y1="132" x2="285" y2="226" strokeWidth="1" style={{ stroke: 'var(--border-strong)' }} />
      <line x1="355" y1="132" x2="455" y2="226" strokeWidth="1" style={{ stroke: 'var(--border-strong)' }} />
      <line
        x1="380"
        y1="132"
        x2="615"
        y2="226"
        strokeWidth="1.5"
        markerEnd="url(#p3g1-arrow)"
        style={{ stroke: 'var(--accent)' }}
      />

      <text
        x="40"
        y="210"
        fontFamily="'JetBrains Mono', monospace"
        style={{ fontSize: 11, letterSpacing: '0.1em', fill: 'var(--text-muted)' }}
      >
        LAYER TWO · SEGMENTED
      </text>

      <rect
        x="40"
        y="228"
        width="142"
        height="96"
        strokeWidth="0.5"
        style={{ fill: 'var(--bg-surface)', stroke: 'var(--border-default)' }}
      />
      <text
        x="56"
        y="262"
        fontFamily="'JetBrains Mono', monospace"
        style={{ fontSize: 24, fill: 'var(--text-primary)' }}
      >
        40%
      </text>
      <text
        x="56"
        y="290"
        fontFamily="'General Sans', sans-serif"
        style={{ fontSize: 12, fill: 'var(--text-muted)' }}
      >
        desktop
      </text>

      <rect
        x="194"
        y="228"
        width="142"
        height="96"
        strokeWidth="0.5"
        style={{ fill: 'var(--bg-surface)', stroke: 'var(--border-default)' }}
      />
      <text
        x="210"
        y="262"
        fontFamily="'JetBrains Mono', monospace"
        style={{ fontSize: 24, fill: 'var(--text-primary)' }}
      >
        69%
      </text>
      <text
        x="210"
        y="290"
        fontFamily="'General Sans', sans-serif"
        style={{ fontSize: 12, fill: 'var(--text-muted)' }}
      >
        mobile
      </text>

      <rect
        x="348"
        y="228"
        width="142"
        height="96"
        strokeWidth="0.5"
        style={{ fill: 'var(--bg-surface)', stroke: 'var(--border-default)' }}
      />
      <text
        x="364"
        y="262"
        fontFamily="'JetBrains Mono', monospace"
        style={{ fontSize: 24, fill: 'var(--text-primary)' }}
      >
        74%
      </text>
      <text
        x="364"
        y="290"
        fontFamily="'General Sans', sans-serif"
        style={{ fontSize: 12, fill: 'var(--text-muted)' }}
      >
        mobile,
      </text>
      <text
        x="364"
        y="306"
        fontFamily="'General Sans', sans-serif"
        style={{ fontSize: 12, fill: 'var(--text-muted)' }}
      >
        first-time
      </text>

      <rect
        x="502"
        y="228"
        width="142"
        height="96"
        strokeWidth="1.5"
        style={{ fill: 'var(--accent-muted)', stroke: 'var(--accent)' }}
      />
      <text
        x="518"
        y="262"
        fontFamily="'JetBrains Mono', monospace"
        style={{ fontSize: 24, fill: 'var(--accent)' }}
      >
        81%
      </text>
      <text
        x="518"
        y="288"
        fontFamily="'General Sans', sans-serif"
        style={{ fontSize: 12, fill: 'var(--text-primary)' }}
      >
        mobile, first-time,
      </text>
      <text
        x="518"
        y="304"
        fontFamily="'General Sans', sans-serif"
        style={{ fontSize: 12, fill: 'var(--text-primary)' }}
      >
        no-COD pincode
      </text>
      <text
        x="518"
        y="319"
        fontFamily="'JetBrains Mono', monospace"
        style={{ fontSize: 9, letterSpacing: '0.08em', fill: 'var(--accent)' }}
      >
        FIX THIS FIRST
      </text>
    </svg>
  );
}
