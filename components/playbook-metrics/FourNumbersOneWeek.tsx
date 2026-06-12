'use client';
// FourNumbersOneWeek.tsx — Playbook 2, Section 1 (centerpiece interactive).
// Four sources reporting the same week of 500 real orders. Click/keyboard-select a source row to
// highlight its bar in lime and pull its revenue + ROAS into the detail strip.
// Lime on: the selected bar and its value (exactly one element-group at a time).
// Numbers are hardcoded and internally consistent (see build brief for the relating logic).
// Colors use the repo design tokens (var(--*)).
import { useState } from 'react';

type SourceKey = 'meta' | 'google' | 'ga4' | 'shopify';

interface SourceRow {
  key: SourceKey;
  name: string;
  conv: number; // conversions reported
  barPct: number; // bar width as % of the 500 baseline (Shopify = 100%)
  rev: string; // attributed/recorded revenue, Indian lakh grouping
  roas: string; // reported ROAS, or em-dash for Shopify
}

const SOURCES: readonly SourceRow[] = [
  { key: 'meta', name: 'Meta', conv: 380, barPct: 76, rev: '₹4,56,000', roas: '2.3x' },
  { key: 'google', name: 'Google Ads', conv: 220, barPct: 44, rev: '₹2,64,000', roas: '2.6x' },
  { key: 'ga4', name: 'GA4', conv: 410, barPct: 82, rev: '₹4,92,000', roas: '1.6x' },
  { key: 'shopify', name: 'Shopify', conv: 500, barPct: 100, rev: '₹6,00,000', roas: '—' },
];

const LIME = 'var(--accent)';
const CREAM = 'var(--text-primary)';
const MUTED = 'var(--text-muted)';

export default function FourNumbersOneWeek() {
  const [selected, setSelected] = useState<SourceKey>('meta');
  const active = SOURCES.find((s) => s.key === selected) ?? SOURCES[0];

  return (
    <div style={{ fontFamily: "'General Sans', sans-serif", background: 'var(--bg-base)', padding: '28px 22px' }}>
      <style>{`
        .fn-row { display:grid; grid-template-columns:90px 1fr 46px; align-items:center; gap:12px; cursor:pointer; }
        .fn-name { font-family:'JetBrains Mono',monospace; font-size:12px; color:${MUTED}; transition:color .2s ease; text-align:right; }
        .fn-track { height:26px; background:var(--bg-surface); position:relative; }
        .fn-bar { height:100%; background:var(--border-default); transition:background .2s ease; }
        .fn-val { font-family:'JetBrains Mono',monospace; font-size:13px; color:${MUTED}; transition:color .2s ease; }
        .fn-row.on .fn-bar { background:${LIME}; }
        .fn-row.on .fn-name { color:${CREAM}; }
        .fn-row.on .fn-val { color:${LIME}; }
        .fn-row:focus-visible { outline:1px solid ${LIME}; outline-offset:3px; }
        @media (max-width:420px){ .fn-row{ grid-template-columns:72px 1fr 40px; gap:8px; } }
        @media (prefers-reduced-motion: reduce){ .fn-bar,.fn-name,.fn-val{ transition:none; } }
      `}</style>

      <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
        Four sources reporting the same week of 500 real orders: Meta claims 380 conversions, Google
        220, GA4 410, and Shopify the true 500. Selecting a source shows its reported revenue and ROAS.
      </span>

      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.12em', color: MUTED, marginBottom: 6 }}>
        THE SAME WEEK · 500 REAL ORDERS
      </div>
      <div style={{ height: '0.5px', background: 'var(--border-default)', marginBottom: 20 }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 22 }}>
        {SOURCES.map((s) => (
          <div
            key={s.key}
            className={s.key === selected ? 'fn-row on' : 'fn-row'}
            role="button"
            tabIndex={0}
            aria-pressed={s.key === selected}
            aria-label={`${s.name}: ${s.conv} conversions reported`}
            onClick={() => setSelected(s.key)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setSelected(s.key);
              }
            }}
          >
            <div className="fn-name">{s.name}</div>
            <div className="fn-track">
              <div className="fn-bar" style={{ width: `${s.barPct}%` }} />
            </div>
            <div className="fn-val">{s.conv}</div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          letterSpacing: '0.06em',
          color: MUTED,
          marginBottom: 22,
        }}
      >
        <span>CONVERSIONS REPORTED →</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', border: '0.5px solid var(--border-default)' }}>
        <div style={{ padding: '14px', borderRight: '0.5px solid var(--border-default)' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.06em', color: MUTED, marginBottom: 8 }}>SOURCE</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 17, color: LIME }}>{active.name}</div>
        </div>
        <div style={{ padding: '14px', borderRight: '0.5px solid var(--border-default)' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.06em', color: MUTED, marginBottom: 8 }}>REVENUE</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 17, color: CREAM }}>{active.rev}</div>
        </div>
        <div style={{ padding: '14px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.06em', color: MUTED, marginBottom: 8 }}>ROAS</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 17, color: CREAM }}>{active.roas}</div>
        </div>
      </div>

      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, lineHeight: 1.5, letterSpacing: '0.03em', color: MUTED, marginTop: 16 }}>
        ILLUSTRATIVE. THE GAP IS REAL; FIGURES VARY BY BRAND. ONLY SHOPIFY COUNTS ACTUAL ORDERS. REAL BLENDED ROAS: 2.0x.
      </div>
    </div>
  );
}
