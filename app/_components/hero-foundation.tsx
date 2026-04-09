/**
 * Hero foundation stack.
 *
 * Four layers (Dashboards → Tools → Analyst → Foundation) stacked on top of
 * each other. The top three look intact; the foundation underneath is cracked
 * and broken, with a lime fault line running across one segment. Visualizes
 * the headline's metaphor: "dashboards look fine, but the foundation isn't."
 *
 * Every label sits ABOVE its box. The tools row embeds the actual tech-stack
 * logos from /public/tech-stack-svg/ via <image href="..."/>.
 */

const LABEL_Y_OFFSET = -10;

const TOOL_LOGOS = [
  { src: '/tech-stack-svg/mixpanel.svg', name: 'mixpanel' },
  { src: '/tech-stack-svg/amplitude.svg', name: 'amplitude' },
  { src: '/tech-stack-svg/posthog.svg', name: 'posthog' },
  { src: '/tech-stack-svg/bigquery.svg', name: 'bigquery' },
] as const;

export default function HeroFoundation() {
  return (
    <svg
      className="hero__foundation gfx"
      viewBox="0 0 640 560"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* === LAYER 1: DASHBOARDS === */}
      <g
        className="gfx-fade"
        style={{ '--fade-delay': 2 } as React.CSSProperties}
      >
        <text x="60" y={30 + LABEL_Y_OFFSET} fontSize="11">
          DASHBOARDS
        </text>

        <rect
          x="60"
          y="30"
          width="520"
          height="100"
          rx="3"
          fill="none"
          className="gfx-path gfx-path--primary"
        />

        {/* Widget 1: bar chart */}
        <rect x="90" y="75" width="8" height="30" fill="#6a6a72" />
        <rect x="104" y="62" width="8" height="43" fill="#6a6a72" />
        <rect x="118" y="68" width="8" height="37" fill="#6a6a72" />
        <rect x="132" y="55" width="8" height="50" fill="#6a6a72" />

        {/* Widget 2: line chart */}
        <polyline
          points="190,98 220,85 250,90 280,65 310,72"
          className="gfx-path gfx-path--primary"
          strokeWidth="2"
        />

        {/* Widget 3: donut */}
        <circle
          cx="380"
          cy="80"
          r="24"
          fill="none"
          className="gfx-path gfx-path--primary"
          strokeWidth="2"
        />
        <circle
          cx="380"
          cy="80"
          r="24"
          fill="none"
          stroke="#D4FF3F"
          strokeWidth="4"
          strokeDasharray="75 150"
          strokeLinecap="round"
        />

        {/* Widget 4: number callout */}
        <text x="460" y="75" fontSize="11">
          MRR
        </text>
        <text x="460" y="100" fontSize="22" fill="#FAFAF9" fontWeight="500">
          $84K
        </text>
      </g>

      {/* Connector 1 */}
      <line
        x1="320"
        y1="130"
        x2="320"
        y2="160"
        className="gfx-path gfx-path--muted gfx-animate"
        pathLength={1}
      />

      {/* === LAYER 2: TOOLS === */}
      <g
        className="gfx-fade"
        style={{ '--fade-delay': 4 } as React.CSSProperties}
      >
        <text x="60" y={180 + LABEL_Y_OFFSET} fontSize="11">
          TOOLS
        </text>

        <rect
          x="60"
          y="180"
          width="520"
          height="85"
          rx="3"
          fill="none"
          className="gfx-path gfx-path--primary"
        />

        {/* Tool logo tiles — 4 real logos + "+16 more".
            White background so the dark wordmark logos stay legible. */}
        {TOOL_LOGOS.map((tool, i) => {
          const x = 82 + i * 100;
          return (
            <g key={tool.name}>
              <rect
                x={x}
                y="200"
                width="88"
                height="44"
                rx="4"
                fill="#ffffff"
                stroke="none"
              />
              <image
                href={tool.src}
                x={x + 10}
                y="210"
                width="68"
                height="24"
                preserveAspectRatio="xMidYMid meet"
              />
            </g>
          );
        })}

        <text x="490" y="228" fontSize="11">
          + 16 more
        </text>
      </g>

      {/* Connector 2 */}
      <line
        x1="320"
        y1="265"
        x2="320"
        y2="295"
        className="gfx-path gfx-path--muted gfx-animate"
        pathLength={1}
      />

      {/* === LAYER 3: ANALYST === */}
      <g
        className="gfx-fade"
        style={{ '--fade-delay': 6 } as React.CSSProperties}
      >
        <text x="60" y={315 + LABEL_Y_OFFSET} fontSize="11">
          ANALYST
        </text>

        <rect
          x="60"
          y="315"
          width="520"
          height="75"
          rx="3"
          fill="none"
          className="gfx-path gfx-path--primary"
        />

        {/* Abstract person: head + body */}
        <circle
          cx="100"
          cy="352"
          r="13"
          fill="none"
          className="gfx-path gfx-path--primary"
          strokeWidth="2"
        />
        <line
          x1="120"
          y1="352"
          x2="220"
          y2="352"
          className="gfx-path gfx-path--primary"
          strokeWidth="2"
        />

        {/* Query lines */}
        <line
          x1="250"
          y1="338"
          x2="350"
          y2="338"
          className="gfx-path gfx-path--muted"
        />
        <line
          x1="250"
          y1="352"
          x2="390"
          y2="352"
          className="gfx-path gfx-path--muted"
        />
        <line
          x1="250"
          y1="366"
          x2="320"
          y2="366"
          className="gfx-path gfx-path--muted"
        />

        {/* Running indicator */}
        <circle cx="540" cy="352" r="4" fill="#6a6a72" />
        <text x="460" y="356" fontSize="11">
          reconciling...
        </text>
      </g>

      {/* Connector 3 — dashed, unreliable */}
      <line
        x1="320"
        y1="390"
        x2="320"
        y2="420"
        className="gfx-path gfx-path--muted"
        strokeDasharray="3 4"
      />

      {/* === LAYER 4: FOUNDATION (BROKEN) === */}
      <g
        className="gfx-fade"
        style={{ '--fade-delay': 8 } as React.CSSProperties}
      >
        <text
          x="60"
          y={440 + LABEL_Y_OFFSET}
          fontSize="11"
          className="gfx-label--active"
        >
          FOUNDATION
        </text>

        {/* Segment 1: partially broken */}
        <rect
          x="60"
          y="440"
          width="115"
          height="60"
          rx="3"
          fill="none"
          className="gfx-path"
          strokeWidth="1.5"
        />
        <line
          x1="78"
          y1="460"
          x2="95"
          y2="478"
          className="gfx-path"
          strokeDasharray="2 2"
        />
        <line
          x1="105"
          y1="455"
          x2="122"
          y2="482"
          className="gfx-path"
          strokeDasharray="2 2"
        />
        <line
          x1="132"
          y1="462"
          x2="150"
          y2="486"
          className="gfx-path"
          strokeDasharray="2 2"
        />

        {/* Gap 1 */}
        <text
          x="185"
          y="478"
          fontSize="18"
          className="gfx-label--active"
          fontWeight="300"
        >
          ⤬
        </text>

        {/* Segment 2: intact-looking with lime fault line */}
        <rect
          x="210"
          y="440"
          width="155"
          height="60"
          rx="3"
          fill="none"
          className="gfx-path"
          strokeWidth="1.5"
        />
        <line
          x1="220"
          y1="472"
          x2="355"
          y2="472"
          stroke="#D4FF3F"
          strokeWidth="2"
          strokeDasharray="5 4"
        />

        {/* Gap 2 */}
        <text
          x="375"
          y="478"
          fontSize="18"
          className="gfx-label--active"
          fontWeight="300"
        >
          ⤬
        </text>

        {/* Segment 3: heavily cracked */}
        <rect
          x="400"
          y="440"
          width="115"
          height="60"
          rx="3"
          fill="none"
          className="gfx-path"
          strokeWidth="1.5"
        />
        <line
          x1="412"
          y1="450"
          x2="430"
          y2="490"
          className="gfx-path"
          strokeDasharray="2 2"
        />
        <line
          x1="442"
          y1="453"
          x2="460"
          y2="495"
          className="gfx-path"
          strokeDasharray="2 2"
        />
        <line
          x1="472"
          y1="448"
          x2="490"
          y2="488"
          className="gfx-path"
          strokeDasharray="2 2"
        />

        {/* Missing final segment */}
        <rect
          x="525"
          y="440"
          width="55"
          height="60"
          rx="3"
          fill="none"
          stroke="#26262c"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
        <text x="552" y="478" textAnchor="middle" fontSize="14">
          ?
        </text>
      </g>

      {/* Caption */}
      <text
        x="320"
        y="538"
        textAnchor="middle"
        fontSize="11"
        className="gfx-fade"
        style={{ '--fade-delay': 12 } as React.CSSProperties}
      >
        EVERYTHING ABOVE DEPENDS ON THE LAYER BELOW
      </text>
    </svg>
  );
}
