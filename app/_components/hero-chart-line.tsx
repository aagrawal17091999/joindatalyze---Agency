export default function HeroChartLine() {
  return (
    <svg
      className="hero__chart gfx"
      viewBox="0 0 900 500"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Baseline grid (very faint) */}
      <line
        x1="0"
        y1="380"
        x2="900"
        y2="380"
        className="gfx-path gfx-path--muted"
        strokeDasharray="2 6"
        opacity="0.3"
      />

      {/* Clean section of the line (left half) — solid, confident */}
      <path
        d="M 0 380 Q 80 360 160 320 T 320 250 T 480 200"
        className="gfx-path gfx-path--primary gfx-animate"
        pathLength={1}
      />

      {/* The "last known good" anchor dot */}
      <circle
        cx="480"
        cy="200"
        r="4"
        fill="var(--accent)"
        className="gfx-fade"
        style={{ '--fade-delay': 8 } as React.CSSProperties}
      />
      <text
        x="495"
        y="195"
        className="gfx-fade gfx-label--active"
        style={{ '--fade-delay': 8 } as React.CSSProperties}
      >
        last clean event
      </text>

      {/* The line starts fragmenting */}
      <path
        d="M 480 200 L 530 175 L 545 220 L 600 145"
        className="gfx-path"
        strokeDasharray="6 4"
      />

      {/* Worse fragmentation */}
      <path
        d="M 600 145 L 640 280 L 680 220"
        className="gfx-path"
        strokeDasharray="3 8"
      />

      {/* Completely broken end */}
      <path
        d="M 680 220 L 720 320 L 760 180 L 800 350"
        className="gfx-path"
        strokeDasharray="2 10"
      />

      {/* Stray dots showing noise */}
      <circle cx="600" cy="145" r="2" fill="var(--border-strong)" />
      <circle cx="680" cy="220" r="2" fill="var(--border-strong)" />
      <circle cx="760" cy="180" r="2" fill="var(--border-strong)" />
    </svg>
  );
}
