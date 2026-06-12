// Graphic 6 — Conversion funnel (static)
// Playbook #1, Section 4 (inside Dashboard 2). Five narrowing steps with drop-off,
// plus the caveat that a drop is only real if events are firing.
// Lime appears ONLY on the final "Order" step.
// Colors use the repo design tokens (var(--*)) via inline style.

export default function GraphicConversionFunnel() {
  return (
    <svg
      width="100%"
      viewBox="0 0 680 470"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>The D2C conversion funnel from new user to order</title>
      <desc>
        Five narrowing steps from new user to product view to add to cart to payment to
        order, with the count dropping at each. A note warns that a drop is only real if
        your events are firing.
      </desc>

      <text x="340" y="44" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" style={{ fontSize: 11, letterSpacing: '0.1em', fill: 'var(--text-muted)' }}>
        NEW USER TO ORDER
      </text>

      <rect x="120" y="64" width="440" height="48" strokeWidth="0.5" style={{ fill: 'var(--bg-surface)', stroke: 'var(--border-default)' }} />
      <text x="140" y="93" textAnchor="start" fontFamily="'General Sans', 'Inter', sans-serif" style={{ fontSize: 14, fill: 'var(--text-primary)' }}>New user</text>
      <text x="540" y="93" textAnchor="end" fontFamily="'JetBrains Mono', monospace" style={{ fontSize: 13, fill: 'var(--text-muted)' }}>10,000</text>

      <rect x="160" y="136" width="360" height="48" strokeWidth="0.5" style={{ fill: 'var(--bg-surface)', stroke: 'var(--border-default)' }} />
      <text x="180" y="165" textAnchor="start" fontFamily="'General Sans', 'Inter', sans-serif" style={{ fontSize: 14, fill: 'var(--text-primary)' }}>Product view</text>
      <text x="500" y="165" textAnchor="end" fontFamily="'JetBrains Mono', monospace" style={{ fontSize: 13, fill: 'var(--text-muted)' }}>5,200</text>

      <rect x="200" y="208" width="280" height="48" strokeWidth="0.5" style={{ fill: 'var(--bg-surface)', stroke: 'var(--border-default)' }} />
      <text x="220" y="237" textAnchor="start" fontFamily="'General Sans', 'Inter', sans-serif" style={{ fontSize: 14, fill: 'var(--text-primary)' }}>Add to cart</text>
      <text x="460" y="237" textAnchor="end" fontFamily="'JetBrains Mono', monospace" style={{ fontSize: 13, fill: 'var(--text-muted)' }}>1,400</text>

      <rect x="240" y="280" width="200" height="48" strokeWidth="0.5" style={{ fill: 'var(--bg-surface)', stroke: 'var(--border-default)' }} />
      <text x="260" y="309" textAnchor="start" fontFamily="'General Sans', 'Inter', sans-serif" style={{ fontSize: 14, fill: 'var(--text-primary)' }}>Payment</text>
      <text x="420" y="309" textAnchor="end" fontFamily="'JetBrains Mono', monospace" style={{ fontSize: 13, fill: 'var(--text-muted)' }}>520</text>

      <rect x="280" y="352" width="120" height="48" strokeWidth="0.5" style={{ fill: 'var(--accent-muted)', stroke: 'var(--accent)' }} />
      <text x="300" y="381" textAnchor="start" fontFamily="'General Sans', 'Inter', sans-serif" style={{ fontSize: 14, fontWeight: 500, fill: 'var(--accent)' }}>Order</text>
      <text x="380" y="381" textAnchor="end" fontFamily="'JetBrains Mono', monospace" style={{ fontSize: 13, fill: 'var(--accent)' }}>410</text>

      <line x1="120" y1="430" x2="120" y2="452" strokeWidth="0.5" style={{ stroke: 'var(--border-strong)' }} />
      <text x="134" y="438" textAnchor="start" fontFamily="'General Sans', 'Inter', sans-serif" style={{ fontSize: 12, fill: 'var(--text-muted)' }}>a drop is only real if your events are firing</text>
      <text x="134" y="456" textAnchor="start" fontFamily="'General Sans', 'Inter', sans-serif" style={{ fontSize: 12, fill: 'var(--text-muted)' }}>stitch and proxy first, then diagnose</text>
    </svg>
  );
}
