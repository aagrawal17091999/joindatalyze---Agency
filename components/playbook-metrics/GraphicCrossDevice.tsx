'use client';

// Graphic 3 — Cross-device break & stitch (INTERACTIVE)
// Playbook #1, Section 3. Phone sees ad, laptop buys; to analytics they're two
// strangers. Capturing the same email on both stitches them into one person.
// Lime appears ONLY on the stitch resolution (arrows + "same email" box).
// Toggle reveals the stitch; reversible; respects prefers-reduced-motion.
// Colors use the repo design tokens (var(--*)) via inline style.

import { useState } from 'react';

export default function GraphicCrossDevice() {
  const [stitched, setStitched] = useState(false);

  return (
    <div>
      <style>{`
        .cd-stitch { transition: opacity 0.6s ease; }
        .cd-stitch path { stroke-dasharray: 220; stroke-dashoffset: 220; transition: stroke-dashoffset 0.7s ease; }
        .cd-stitch.on path { stroke-dashoffset: 0; }
        .cd-broken { transition: opacity 0.4s ease; }
        @media (prefers-reduced-motion: reduce) {
          .cd-stitch, .cd-stitch path, .cd-broken { transition: none; }
        }
      `}</style>

      <svg
        width="100%"
        viewBox="0 0 680 460"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Cross-device attribution break and how email stitches it</title>
        <desc>
          A phone sees the Meta ad and a laptop makes the purchase. To analytics they
          are two different anonymous people, so the ad gets no credit. Capturing an
          email on both devices stitches them into one person.
        </desc>
        <defs>
          <marker
            id="cd-arrow"
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

        {/* Mobile device */}
        <rect x="70" y="60" width="150" height="200" strokeWidth="0.5" style={{ fill: 'var(--bg-surface)', stroke: 'var(--border-default)' }} />
        <rect x="92" y="84" width="106" height="120" strokeWidth="0.5" style={{ fill: 'var(--bg-base)', stroke: 'var(--border-default)' }} />
        <text x="145" y="50" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" style={{ fontSize: 11, fill: 'var(--text-muted)' }}>MOBILE</text>
        <text x="145" y="148" textAnchor="middle" fontFamily="'General Sans', 'Inter', sans-serif" style={{ fontSize: 13, fill: 'var(--text-primary)' }}>Sees Meta ad</text>
        <text x="145" y="232" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" style={{ fontSize: 11, fill: 'var(--text-muted)' }}>anon_id: a1b2</text>

        {/* Desktop device */}
        <rect x="460" y="60" width="150" height="200" strokeWidth="0.5" style={{ fill: 'var(--bg-surface)', stroke: 'var(--border-default)' }} />
        <rect x="478" y="84" width="114" height="100" strokeWidth="0.5" style={{ fill: 'var(--bg-base)', stroke: 'var(--border-default)' }} />
        <text x="535" y="50" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" style={{ fontSize: 11, fill: 'var(--text-muted)' }}>DESKTOP</text>
        <text x="535" y="140" textAnchor="middle" fontFamily="'General Sans', 'Inter', sans-serif" style={{ fontSize: 13, fill: 'var(--text-primary)' }}>Buys</text>
        <text x="535" y="232" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" style={{ fontSize: 11, fill: 'var(--text-muted)' }}>anon_id: x9y8</text>

        {/* Broken state: no connection */}
        <g className="cd-broken" style={{ opacity: stitched ? 0.25 : 1 }}>
          <line x1="220" y1="160" x2="455" y2="160" strokeWidth="1" strokeDasharray="4 4" style={{ stroke: '#5F5E5A' }} />
          <text x="340" y="150" textAnchor="middle" fontFamily="'General Sans', 'Inter', sans-serif" style={{ fontSize: 12, fill: 'var(--text-muted)' }}>no connection</text>
          <text x="340" y="180" textAnchor="middle" fontFamily="'General Sans', 'Inter', sans-serif" style={{ fontSize: 12, fill: 'var(--text-muted)' }}>ad gets zero credit</text>
        </g>

        <text x="340" y="300" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" style={{ fontSize: 11, letterSpacing: '0.1em', fill: 'var(--text-muted)' }}>
          THE FIX: CAPTURE EMAIL ON BOTH
        </text>

        {/* Stitched state: lime resolution */}
        <g className={`cd-stitch${stitched ? ' on' : ''}`} style={{ opacity: stitched ? 1 : 0.2 }}>
          <path d="M145 260 L145 340 L300 340" fill="none" strokeWidth="1" markerEnd="url(#cd-arrow)" style={{ stroke: 'var(--accent)' }} />
          <path d="M535 260 L535 340 L380 340" fill="none" strokeWidth="1" markerEnd="url(#cd-arrow)" style={{ stroke: 'var(--accent)' }} />
          <rect x="250" y="322" width="180" height="60" strokeWidth="0.5" style={{ fill: 'var(--accent-muted)', stroke: 'var(--accent)' }} />
          <text x="340" y="348" textAnchor="middle" fontFamily="'General Sans', 'Inter', sans-serif" style={{ fontSize: 13, fontWeight: 500, fill: 'var(--accent)' }}>same email</text>
          <text x="340" y="368" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" style={{ fontSize: 12, fill: 'var(--text-muted)' }}>one person</text>
          <text x="340" y="418" textAnchor="middle" fontFamily="'General Sans', 'Inter', sans-serif" style={{ fontSize: 12, fill: 'var(--text-muted)' }}>now the ad connects to the sale</text>
        </g>
      </svg>

      <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center' }}>
        <button
          type="button"
          onClick={() => setStitched((s) => !s)}
          aria-pressed={stitched}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            letterSpacing: '0.05em',
            color: stitched ? 'var(--text-inverse)' : 'var(--accent)',
            background: stitched ? 'var(--accent)' : 'var(--accent-muted)',
            border: '0.5px solid var(--accent)',
            padding: '10px 18px',
            cursor: 'pointer',
            borderRadius: 0,
          }}
        >
          {stitched ? 'Email captured — reset' : 'Capture email on both devices'}
        </button>
      </div>
    </div>
  );
}
