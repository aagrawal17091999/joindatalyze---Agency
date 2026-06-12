// Graphic 4 — Proxy architecture (static)
// Playbook #1, Section 3. Standard setup loses ~30% to blockers; first-party proxy
// routes through your own domain so events survive.
// Lime appears ONLY on the "your own domain" node + its arrow, and the bottom eyebrow.
// Colors use the repo design tokens (var(--*)) via inline style.

export default function GraphicProxyArchitecture() {
  return (
    <svg
      width="100%"
      viewBox="0 0 680 480"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Direct third-party tracking versus a first-party proxy</title>
      <desc>
        The standard setup sends events from the browser straight to third-party
        vendor domains, where ad blockers and ITP block a large share. Routing events
        through your own subdomain first makes them first-party, so they survive and
        forward on to analytics and the ad platform APIs.
      </desc>
      <defs>
        <marker
          id="pa-arrow"
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

      <text x="60" y="46" textAnchor="start" fontFamily="'JetBrains Mono', monospace" style={{ fontSize: 11, letterSpacing: '0.1em', fill: 'var(--text-muted)' }}>
        STANDARD SETUP
      </text>

      <rect x="60" y="58" width="150" height="56" strokeWidth="0.5" style={{ fill: 'var(--bg-surface)', stroke: 'var(--border-default)' }} />
      <text x="135" y="90" textAnchor="middle" fontFamily="'General Sans', 'Inter', sans-serif" style={{ fontSize: 13, fill: 'var(--text-primary)' }}>Browser</text>

      <line x1="210" y1="86" x2="320" y2="86" strokeWidth="1" markerEnd="url(#pa-arrow)" style={{ stroke: '#5F5E5A' }} />

      <rect x="320" y="58" width="170" height="56" strokeWidth="0.5" style={{ fill: 'var(--bg-surface)', stroke: 'var(--border-default)' }} />
      <text x="405" y="82" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" style={{ fontSize: 11, fill: 'var(--text-muted)' }}>3rd-party vendor</text>
      <text x="405" y="100" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" style={{ fontSize: 11, fill: 'var(--text-muted)' }}>domain</text>

      <text x="265" y="138" textAnchor="middle" fontFamily="'General Sans', 'Inter', sans-serif" style={{ fontSize: 12, fill: 'var(--text-muted)' }}>blocked here</text>
      <line x1="240" y1="150" x2="290" y2="150" strokeWidth="1" style={{ stroke: 'var(--text-muted)' }} />
      <line x1="248" y1="144" x2="248" y2="156" strokeWidth="1" style={{ stroke: 'var(--text-muted)' }} />
      <line x1="258" y1="144" x2="258" y2="156" strokeWidth="1" style={{ stroke: 'var(--text-muted)' }} />
      <line x1="268" y1="144" x2="268" y2="156" strokeWidth="1" style={{ stroke: 'var(--text-muted)' }} />
      <text x="405" y="138" textAnchor="middle" fontFamily="'General Sans', 'Inter', sans-serif" style={{ fontSize: 12, fill: 'var(--text-muted)' }}>~30% lost</text>

      <line x1="340" y1="190" x2="620" y2="190" strokeWidth="0.5" style={{ stroke: 'var(--border-default)' }} />

      <text x="60" y="228" textAnchor="start" fontFamily="'JetBrains Mono', monospace" style={{ fontSize: 11, letterSpacing: '0.1em', fill: 'var(--accent)' }}>
        WITH A FIRST-PARTY PROXY
      </text>

      <rect x="60" y="244" width="150" height="56" strokeWidth="0.5" style={{ fill: 'var(--bg-surface)', stroke: 'var(--border-default)' }} />
      <text x="135" y="276" textAnchor="middle" fontFamily="'General Sans', 'Inter', sans-serif" style={{ fontSize: 13, fill: 'var(--text-primary)' }}>Browser</text>

      <line x1="210" y1="272" x2="285" y2="272" strokeWidth="1" markerEnd="url(#pa-arrow)" style={{ stroke: 'var(--accent)' }} />

      <rect x="285" y="244" width="170" height="56" strokeWidth="0.5" style={{ fill: 'var(--accent-muted)', stroke: 'var(--accent)' }} />
      <text x="370" y="268" textAnchor="middle" fontFamily="'General Sans', 'Inter', sans-serif" style={{ fontSize: 13, fontWeight: 500, fill: 'var(--accent)' }}>your own domain</text>
      <text x="370" y="286" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" style={{ fontSize: 11, fill: 'var(--text-muted)' }}>data.yourbrand.com</text>

      <path d="M455 260 L500 260 L500 360 L520 360" fill="none" stroke="#5F5E5A" strokeWidth="1" markerEnd="url(#pa-arrow)" />
      <path d="M455 284 L500 284 L500 420 L520 420" fill="none" stroke="#5F5E5A" strokeWidth="1" markerEnd="url(#pa-arrow)" />

      <rect x="520" y="338" width="120" height="44" strokeWidth="0.5" style={{ fill: 'var(--bg-surface)', stroke: 'var(--border-default)' }} />
      <text x="580" y="365" textAnchor="middle" fontFamily="'General Sans', 'Inter', sans-serif" style={{ fontSize: 13, fill: 'var(--text-primary)' }}>Analytics</text>

      <rect x="520" y="398" width="120" height="44" strokeWidth="0.5" style={{ fill: 'var(--bg-surface)', stroke: 'var(--border-default)' }} />
      <text x="580" y="419" textAnchor="middle" fontFamily="'General Sans', 'Inter', sans-serif" style={{ fontSize: 13, fill: 'var(--text-primary)' }}>Ad platform</text>
      <text x="580" y="434" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" style={{ fontSize: 11, fill: 'var(--text-muted)' }}>CAPI / server-side</text>

      <text x="290" y="334" textAnchor="start" fontFamily="'General Sans', 'Inter', sans-serif" style={{ fontSize: 12, fill: 'var(--text-muted)' }}>
        first-party, so it survives the blockers
      </text>
    </svg>
  );
}
