// Graphic 5 — Four dashboards grid (static)
// Playbook #1, Section 4. A 2x2 grid naming the four dashboards and each one's job.
// Lime appears ONLY on the index numbers (01, 02, 03, 04).
// Colors use the repo design tokens (var(--*)) via inline style.

export default function GraphicDashboardsGrid() {
  return (
    <svg
      width="100%"
      viewBox="0 0 680 400"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>The four dashboards that matter for a D2C brand</title>
      <desc>
        A two by two grid. New Users covers who shows up and from where. Funnel
        Conversion covers where you lose people. Product Sold covers what gets bought.
        Retention covers whether people come back.
      </desc>

      <text x="340" y="44" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" style={{ fontSize: 11, letterSpacing: '0.1em', fill: 'var(--text-muted)' }}>
        FOUR DASHBOARDS, ONE HONEST BASE
      </text>

      {/* 01 New Users */}
      <rect x="60" y="70" width="270" height="130" strokeWidth="0.5" style={{ fill: 'var(--bg-surface)', stroke: 'var(--border-default)' }} />
      <text x="84" y="104" textAnchor="start" fontFamily="'JetBrains Mono', monospace" style={{ fontSize: 13, fontWeight: 500, fill: 'var(--accent)' }}>01</text>
      <text x="84" y="132" textAnchor="start" fontFamily="'General Sans', 'Inter', sans-serif" style={{ fontSize: 15, fontWeight: 500, fill: 'var(--text-primary)' }}>New Users</text>
      <text x="84" y="158" textAnchor="start" fontFamily="'General Sans', 'Inter', sans-serif" style={{ fontSize: 12, fill: 'var(--text-muted)' }}>who shows up, and from</text>
      <text x="84" y="176" textAnchor="start" fontFamily="'General Sans', 'Inter', sans-serif" style={{ fontSize: 12, fill: 'var(--text-muted)' }}>where</text>

      {/* 02 Funnel Conversion */}
      <rect x="350" y="70" width="270" height="130" strokeWidth="0.5" style={{ fill: 'var(--bg-surface)', stroke: 'var(--border-default)' }} />
      <text x="374" y="104" textAnchor="start" fontFamily="'JetBrains Mono', monospace" style={{ fontSize: 13, fontWeight: 500, fill: 'var(--accent)' }}>02</text>
      <text x="374" y="132" textAnchor="start" fontFamily="'General Sans', 'Inter', sans-serif" style={{ fontSize: 15, fontWeight: 500, fill: 'var(--text-primary)' }}>Funnel Conversion</text>
      <text x="374" y="158" textAnchor="start" fontFamily="'General Sans', 'Inter', sans-serif" style={{ fontSize: 12, fill: 'var(--text-muted)' }}>where you lose people,</text>
      <text x="374" y="176" textAnchor="start" fontFamily="'General Sans', 'Inter', sans-serif" style={{ fontSize: 12, fill: 'var(--text-muted)' }}>and for whom</text>

      {/* 03 Product Sold */}
      <rect x="60" y="216" width="270" height="130" strokeWidth="0.5" style={{ fill: 'var(--bg-surface)', stroke: 'var(--border-default)' }} />
      <text x="84" y="250" textAnchor="start" fontFamily="'JetBrains Mono', monospace" style={{ fontSize: 13, fontWeight: 500, fill: 'var(--accent)' }}>03</text>
      <text x="84" y="278" textAnchor="start" fontFamily="'General Sans', 'Inter', sans-serif" style={{ fontSize: 15, fontWeight: 500, fill: 'var(--text-primary)' }}>Product Sold</text>
      <text x="84" y="304" textAnchor="start" fontFamily="'General Sans', 'Inter', sans-serif" style={{ fontSize: 12, fill: 'var(--text-muted)' }}>what gets bought, and in</text>
      <text x="84" y="322" textAnchor="start" fontFamily="'General Sans', 'Inter', sans-serif" style={{ fontSize: 12, fill: 'var(--text-muted)' }}>what combinations</text>

      {/* 04 Retention */}
      <rect x="350" y="216" width="270" height="130" strokeWidth="0.5" style={{ fill: 'var(--bg-surface)', stroke: 'var(--border-default)' }} />
      <text x="374" y="250" textAnchor="start" fontFamily="'JetBrains Mono', monospace" style={{ fontSize: 13, fontWeight: 500, fill: 'var(--accent)' }}>04</text>
      <text x="374" y="278" textAnchor="start" fontFamily="'General Sans', 'Inter', sans-serif" style={{ fontSize: 15, fontWeight: 500, fill: 'var(--text-primary)' }}>Retention</text>
      <text x="374" y="304" textAnchor="start" fontFamily="'General Sans', 'Inter', sans-serif" style={{ fontSize: 12, fill: 'var(--text-muted)' }}>do people come back, and</text>
      <text x="374" y="322" textAnchor="start" fontFamily="'General Sans', 'Inter', sans-serif" style={{ fontSize: 12, fill: 'var(--text-muted)' }}>is it compounding</text>

      <text x="340" y="384" textAnchor="middle" fontFamily="'General Sans', 'Inter', sans-serif" style={{ fontSize: 12, fill: 'var(--text-muted)' }}>
        spend from platforms, conversions from your own stitched analytics
      </text>
    </svg>
  );
}
