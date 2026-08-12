import styles from './MethodVisuals.module.css';

// Step 1 - Foundation
export function AuditReveal() {
  const events = [
    { name: 'signup_complete', status: 'ok', label: 'standardized' },
    { name: 'purchase_made', status: 'warn', label: 'name drift' },
    { name: 'page_viewed', status: 'error', label: 'missing user_id' },
    { name: 'feature_clicked', status: 'ok', label: 'standardized' },
    { name: 'session_started', status: 'warn', label: 'inconsistent props' },
  ];
  return (
    <div className={styles.audit}>
      <div className={styles.auditHeader}>events / schema audit</div>
      {events.map((e, i) => (
        <div
          key={e.name}
          className={styles.auditRow}
          style={{ animationDelay: `${i * 0.4}s` }}
        >
          <span className={styles.auditEvent}>{e.name}</span>
          <span
            className={`${styles.auditStatus} ${styles[`status-${e.status}`]}`}
          >
            <span className={styles.auditIcon}>
              {e.status === 'ok' ? '✓' : e.status === 'warn' ? '⚠' : '✗'}
            </span>
            <span className={styles.auditLabel}>{e.label}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

// Step 2 - Unification (mirrors hero Stage 3)
export function ConnectedStack() {
  return (
    <div className={styles.unified}>
      <div className={styles.unifiedTitle}>one source of truth</div>
      <div className={styles.unifiedRow}>
        <span className={styles.pill}>Product</span>
        <span className={styles.pillLink}>───</span>
        <span className={styles.pill}>Marketing</span>
      </div>
      <svg
        className={styles.unifiedBend}
        viewBox="0 0 200 28"
        fill="none"
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        <path
          d="M 130 0 V 14 H 70 V 28"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className={styles.unifiedRow}>
        <span className={styles.pill}>Revenue</span>
        <span className={styles.pillLink}>───</span>
        <span className={styles.pill}>Warehouse</span>
      </div>
      <div className={styles.unifiedSub}>queryable end-to-end</div>
    </div>
  );
}

// Step 3 - Visibility
export function DashboardMockup() {
  return (
    <div className={styles.dashboard}>
      <div className={styles.dashHeader}>monthly review</div>
      <div className={styles.statBlock}>
        <div className={styles.statTop}>
          <span className={styles.statLabel}>MRR</span>
          <span className={styles.statTrend}>+12%</span>
        </div>
        <div className={styles.statValue}>$84K</div>
      </div>
      <div className={styles.chartLabel}>retention by cohort · D30</div>
      <svg className={styles.cohortSvg} viewBox="0 0 240 56" fill="none">
        <polyline
          className={styles.cohortBg}
          points="6,44 36,40 66,38 96,34 126,32 156,29 186,27 216,26 234,25"
        />
        <polyline
          className={styles.cohortLine}
          points="6,44 36,40 66,38 96,34 126,32 156,29 186,27 216,26 234,25"
        />
      </svg>
    </div>
  );
}

// Step 4 - Compounding
export function GrowthCurve() {
  return (
    <div className={styles.growth}>
      <div className={styles.growthHeader}>experiments shipped</div>
      <svg className={styles.growthSvg} viewBox="0 0 280 140" fill="none">
        <line
          x1="0"
          y1="120"
          x2="280"
          y2="120"
          className={styles.growthAxis}
        />
        <polyline
          className={styles.growthLine}
          points="6,118 50,108 95,92 140,72 185,52 230,32 270,16"
        />
        <g className={styles.marker} style={{ animationDelay: '0.6s' }}>
          <circle cx="50" cy="108" r="3.5" />
          <text x="58" y="112" className={styles.markerText}>
            +8% activation
          </text>
        </g>
        <g className={styles.marker} style={{ animationDelay: '1.4s' }}>
          <circle cx="140" cy="72" r="3.5" />
          <text x="148" y="76" className={styles.markerText}>
            +12% retention
          </text>
        </g>
        <g className={styles.marker} style={{ animationDelay: '2.2s' }}>
          <circle cx="230" cy="32" r="3.5" />
          <text
            x="222"
            y="36"
            textAnchor="end"
            className={styles.markerText}
          >
            +5% conversion
          </text>
        </g>
      </svg>
      <div className={styles.growthSub}>each win funds the next</div>
    </div>
  );
}
