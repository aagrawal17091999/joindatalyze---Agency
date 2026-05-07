import styles from './WhyVisuals.module.css';

// Card 01
export function SeniorOperators() {
  return (
    <div className={styles.operators}>
      <div className={`${styles.opRow} ${styles.opStrike}`} style={{ animationDelay: '0.6s' }}>
        <span>ACCOUNT MGR</span>
      </div>
      <div className={`${styles.opRow} ${styles.opStrike}`} style={{ animationDelay: '1.4s' }}>
        <span>JUNIOR ANALYST</span>
      </div>
      <div className={`${styles.opRow} ${styles.opActive}`}>
        <span>SENIOR OPERATOR</span>
        <span className={styles.opYou}>↳ you</span>
      </div>
    </div>
  );
}

// Card 02
export function SpeedTimeline() {
  return (
    <div className={styles.timeline}>
      <svg className={styles.timelineSvg} viewBox="0 0 280 60" fill="none">
        <line x1="20" y1="34" x2="260" y2="34" className={styles.timelineLine} />
        <circle cx="20" cy="34" r="5" className={styles.timelineDotActive} />
        <circle cx="260" cy="34" r="4" className={styles.timelineDotMuted} />
        <text x="20" y="18" className={styles.timelineLabelActive} textAnchor="middle">24 HRS</text>
        <text x="20" y="54" className={styles.timelineSubActive} textAnchor="middle">Datalyze</text>
        <text x="260" y="18" className={styles.timelineLabelMuted} textAnchor="middle">2 WEEKS</text>
        <text x="260" y="54" className={styles.timelineSubMuted} textAnchor="middle">industry avg</text>
      </svg>
    </div>
  );
}

// Card 03
export function RevenueLift() {
  return (
    <div className={styles.lift}>
      <svg className={styles.liftSvg} viewBox="0 0 280 80" fill="none">
        <line x1="0" y1="65" x2="280" y2="65" className={styles.liftAxis} />
        <polyline
          className={styles.liftLine}
          points="6,60 50,52 100,42 150,30 200,18 250,10"
        />
        <circle cx="250" cy="10" r="3.5" className={styles.liftDot} />
        <text x="240" y="6" className={styles.liftLabel} textAnchor="end">+14%</text>
      </svg>
    </div>
  );
}

// Card 04
export function FixCheckboxes() {
  const items = ['broken pipeline', 'leaking funnel', 'wrong metric'];
  return (
    <div className={styles.fix}>
      {items.map((item, i) => (
        <div
          key={item}
          className={styles.fixRow}
          style={{ '--check-delay': `${0.4 + i * 0.5}s` } as React.CSSProperties}
        >
          <span className={styles.fixCheck} />
          <span className={styles.fixLabel}>{item}</span>
          <span className={styles.fixStatus}>fixed</span>
        </div>
      ))}
    </div>
  );
}
