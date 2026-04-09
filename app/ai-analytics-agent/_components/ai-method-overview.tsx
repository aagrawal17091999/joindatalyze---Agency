/**
 * Wide horizontal overview of the AI analytics agent data transformation arc.
 * Five stages: raw data → clean → unified → contextualized → agent.
 * Hidden on screens below 1024px (see .ai-method__overview CSS).
 */

const fadeDelay = (n: number) =>
  ({ '--fade-delay': n }) as React.CSSProperties;

export default function AIMethodOverview() {
  return (
    <svg
      className="gfx ai-method__overview"
      viewBox="0 0 1080 200"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* === Stage 1: Raw data === */}
      <g className="gfx-fade" style={fadeDelay(1)}>
        <text x="100" y="20" textAnchor="middle" fontSize="10">
          RAW DATA
        </text>

        <rect
          x="40"
          y="40"
          width="30"
          height="8"
          fill="none"
          className="gfx-path"
          strokeDasharray="2 2"
        />
        <rect
          x="80"
          y="55"
          width="40"
          height="8"
          fill="none"
          className="gfx-path"
          strokeDasharray="2 2"
        />
        <rect
          x="130"
          y="48"
          width="25"
          height="8"
          fill="none"
          className="gfx-path"
        />
        <rect
          x="60"
          y="72"
          width="35"
          height="8"
          fill="none"
          className="gfx-path"
          strokeDasharray="2 2"
        />
        <rect
          x="105"
          y="88"
          width="50"
          height="8"
          fill="none"
          className="gfx-path"
        />
        <rect
          x="40"
          y="105"
          width="30"
          height="8"
          fill="none"
          className="gfx-path"
          strokeDasharray="2 2"
        />
        <rect
          x="80"
          y="122"
          width="40"
          height="8"
          fill="none"
          className="gfx-path"
        />
        <rect
          x="130"
          y="115"
          width="25"
          height="8"
          fill="none"
          className="gfx-path"
          strokeDasharray="2 2"
        />
        <rect
          x="50"
          y="140"
          width="45"
          height="8"
          fill="none"
          className="gfx-path"
        />

        <text x="100" y="170" textAnchor="middle" fontSize="9">
          Events, tables, pipelines
        </text>
      </g>

      {/* Arrow 1 */}
      <line
        x1="175"
        y1="90"
        x2="215"
        y2="90"
        className="gfx-path gfx-path--accent gfx-animate"
        pathLength={1}
      />
      <polyline
        points="210 85 215 90 210 95"
        className="gfx-path gfx-path--accent"
      />

      {/* === Stage 2: Clean === */}
      <g className="gfx-fade" style={fadeDelay(3)}>
        <text x="275" y="20" textAnchor="middle" fontSize="10">
          CLEAN
        </text>

        {[40, 55, 70, 85, 100, 115, 130, 145].map((y) => (
          <rect
            key={y}
            x="220"
            y={y}
            width="110"
            height="8"
            fill="none"
            className="gfx-path"
          />
        ))}

        <circle cx="215" cy="44" r="1.5" fill="#D4FF3F" />
        <circle cx="215" cy="59" r="1.5" fill="#D4FF3F" />
        <circle cx="215" cy="74" r="1.5" fill="#D4FF3F" />
        <circle cx="215" cy="89" r="1.5" fill="#D4FF3F" />

        <text x="275" y="180" textAnchor="middle" fontSize="9">
          Fixed, validated
        </text>
      </g>

      {/* Arrow 2 */}
      <line
        x1="340"
        y1="90"
        x2="380"
        y2="90"
        className="gfx-path gfx-path--accent gfx-animate"
        pathLength={1}
      />
      <polyline
        points="375 85 380 90 375 95"
        className="gfx-path gfx-path--accent"
      />

      {/* === Stage 3: Unified === */}
      <g className="gfx-fade" style={fadeDelay(5)}>
        <text x="440" y="20" textAnchor="middle" fontSize="10">
          UNIFIED
        </text>

        <circle
          cx="440"
          cy="95"
          r="22"
          fill="none"
          className="gfx-path gfx-path--primary"
        />
        <circle cx="440" cy="95" r="6" fill="#D4FF3F" />

        <line
          x1="395"
          y1="50"
          x2="425"
          y2="85"
          className="gfx-path gfx-path--accent"
        />
        <line
          x1="485"
          y1="50"
          x2="455"
          y2="85"
          className="gfx-path gfx-path--accent"
        />
        <line
          x1="395"
          y1="140"
          x2="425"
          y2="105"
          className="gfx-path gfx-path--accent"
        />
        <line
          x1="485"
          y1="140"
          x2="455"
          y2="105"
          className="gfx-path gfx-path--accent"
        />

        <circle cx="395" cy="50" r="4" fill="none" className="gfx-path" />
        <circle cx="485" cy="50" r="4" fill="none" className="gfx-path" />
        <circle cx="395" cy="140" r="4" fill="none" className="gfx-path" />
        <circle cx="485" cy="140" r="4" fill="none" className="gfx-path" />

        <text x="440" y="180" textAnchor="middle" fontSize="9">
          One source of truth
        </text>
      </g>

      {/* Arrow 3 */}
      <line
        x1="505"
        y1="90"
        x2="545"
        y2="90"
        className="gfx-path gfx-path--accent gfx-animate"
        pathLength={1}
      />
      <polyline
        points="540 85 545 90 540 95"
        className="gfx-path gfx-path--accent"
      />

      {/* === Stage 4: Contextualized === */}
      <g className="gfx-fade" style={fadeDelay(7)}>
        <text x="615" y="20" textAnchor="middle" fontSize="10">
          CONTEXTUALIZED
        </text>

        <rect
          x="560"
          y="40"
          width="110"
          height="130"
          rx="2"
          fill="none"
          className="gfx-path gfx-path--primary"
        />

        <line
          x1="570"
          y1="55"
          x2="660"
          y2="55"
          className="gfx-path gfx-path--muted"
        />
        <line
          x1="570"
          y1="70"
          x2="640"
          y2="70"
          className="gfx-path gfx-path--muted"
        />
        <line
          x1="570"
          y1="85"
          x2="655"
          y2="85"
          className="gfx-path gfx-path--muted"
        />
        <line
          x1="570"
          y1="100"
          x2="645"
          y2="100"
          className="gfx-path gfx-path--accent"
        />
        <line
          x1="570"
          y1="115"
          x2="650"
          y2="115"
          className="gfx-path gfx-path--muted"
        />
        <line
          x1="570"
          y1="130"
          x2="635"
          y2="130"
          className="gfx-path gfx-path--accent"
        />
        <line
          x1="570"
          y1="145"
          x2="660"
          y2="145"
          className="gfx-path gfx-path--muted"
        />

        <text x="615" y="185" textAnchor="middle" fontSize="9">
          Business knowledge
        </text>
      </g>

      {/* Arrow 4 */}
      <line
        x1="680"
        y1="90"
        x2="720"
        y2="90"
        className="gfx-path gfx-path--accent gfx-animate"
        pathLength={1}
      />
      <polyline
        points="715 85 720 90 715 95"
        className="gfx-path gfx-path--accent"
      />

      {/* === Stage 5: Agent === */}
      <g className="gfx-fade" style={fadeDelay(9)}>
        <text
          x="850"
          y="20"
          textAnchor="middle"
          fontSize="10"
          className="gfx-label--active"
        >
          AI AGENT
        </text>

        <rect
          x="740"
          y="40"
          width="220"
          height="130"
          rx="2"
          fill="none"
          className="gfx-path gfx-path--primary"
        />
        <line
          x1="740"
          y1="58"
          x2="960"
          y2="58"
          className="gfx-path gfx-path--primary"
        />
        <circle cx="750" cy="49" r="2" fill="#3A3A42" />
        <circle cx="760" cy="49" r="2" fill="#3A3A42" />
        <circle cx="770" cy="49" r="2" fill="#3A3A42" />

        <text x="750" y="80" fontSize="9" fill="#D4FF3F">
          &#x203A;
        </text>
        <line
          x1="760"
          y1="78"
          x2="900"
          y2="78"
          className="gfx-path gfx-path--muted"
        />
        <line
          x1="760"
          y1="88"
          x2="870"
          y2="88"
          className="gfx-path gfx-path--muted"
        />

        <line
          x1="750"
          y1="108"
          x2="950"
          y2="108"
          className="gfx-path gfx-path--muted"
        />
        <text x="750" y="125" fontSize="9">
          ANSWER:
        </text>
        <text
          x="950"
          y="125"
          textAnchor="end"
          fontSize="14"
          fill="#D4FF3F"
          fontWeight="500"
        >
          3.84%
        </text>

        <line
          x1="750"
          y1="135"
          x2="950"
          y2="135"
          className="gfx-path gfx-path--muted"
          strokeDasharray="2 3"
        />
        <text x="750" y="150" fontSize="8">
          Confidence: verified
        </text>

        <text x="850" y="185" textAnchor="middle" fontSize="9">
          Trustworthy answers
        </text>
      </g>
    </svg>
  );
}
