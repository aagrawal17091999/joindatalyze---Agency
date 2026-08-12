/**
 * Three 480×180 diagrams - one per AI agent failure card.
 * 01 - Hallucination: same question, two different answers
 * 02 - Wrong question answered: real question → wrong table
 * 03 - Abandonment: usage spike then crash
 */

const fadeDelay = (n: number) =>
  ({ '--fade-delay': n }) as React.CSSProperties;

function FailureHallucination() {
  return (
    <svg
      className="gfx failure__diagram"
      viewBox="0 0 480 180"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Input */}
      <rect
        x="10"
        y="70"
        width="120"
        height="40"
        rx="2"
        fill="none"
        className="gfx-path gfx-path--primary"
      />
      <text x="70" y="88" textAnchor="middle" fontSize="9">
        QUESTION
      </text>
      <text x="70" y="102" textAnchor="middle" fontSize="11" fill="#FAFAF9">
        &quot;MRR last month?&quot;
      </text>

      {/* Arrow to model */}
      <line
        x1="135"
        y1="90"
        x2="180"
        y2="90"
        className="gfx-path gfx-path--muted gfx-animate"
        pathLength={1}
      />
      <polyline
        points="175 85 180 90 175 95"
        className="gfx-path gfx-path--muted"
      />

      {/* Model box */}
      <rect
        x="185"
        y="65"
        width="110"
        height="50"
        rx="2"
        fill="none"
        className="gfx-path gfx-path--primary"
      />
      <text x="240" y="85" textAnchor="middle" fontSize="9">
        AI MODEL
      </text>
      <text x="240" y="103" textAnchor="middle" fontSize="11" fill="#FAFAF9">
        ?
      </text>

      {/* Two output branches */}
      <line
        x1="300"
        y1="80"
        x2="350"
        y2="50"
        className="gfx-path gfx-path--muted gfx-animate"
        pathLength={1}
      />
      <line
        x1="300"
        y1="100"
        x2="350"
        y2="130"
        className="gfx-path gfx-path--muted gfx-animate"
        pathLength={1}
      />

      {/* Output 1: Monday */}
      <rect
        x="355"
        y="30"
        width="110"
        height="40"
        rx="2"
        fill="none"
        stroke="#D4FF3F"
        strokeWidth="1.5"
      />
      <text x="410" y="48" textAnchor="middle" fontSize="9">
        MONDAY&apos;S ANSWER
      </text>
      <text
        x="410"
        y="62"
        textAnchor="middle"
        fontSize="12"
        fill="#D4FF3F"
        fontWeight="500"
      >
        $128K
      </text>

      {/* Output 2: Thursday */}
      <rect
        x="355"
        y="110"
        width="110"
        height="40"
        rx="2"
        fill="none"
        stroke="#D4FF3F"
        strokeWidth="1.5"
      />
      <text x="410" y="128" textAnchor="middle" fontSize="9">
        THURSDAY&apos;S ANSWER
      </text>
      <text
        x="410"
        y="142"
        textAnchor="middle"
        fontSize="12"
        fill="#D4FF3F"
        fontWeight="500"
      >
        $104K
      </text>

      {/* Discrepancy caption */}
      <text
        x="245"
        y="165"
        textAnchor="middle"
        fontSize="9"
        className="gfx-fade gfx-label--active"
        style={fadeDelay(10)}
      >
        SAME QUESTION. DIFFERENT NUMBERS.
      </text>
    </svg>
  );
}

function FailureWrongQuestion() {
  return (
    <svg
      className="gfx failure__diagram"
      viewBox="0 0 480 180"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Real question */}
      <rect
        x="10"
        y="20"
        width="200"
        height="40"
        rx="2"
        fill="none"
        className="gfx-path gfx-path--primary"
      />
      <text x="20" y="38" fontSize="9">
        QUESTION ASKED
      </text>
      <text x="20" y="52" fontSize="11" fill="#FAFAF9">
        Why did EU paid convert drop?
      </text>

      {/* Arrow down */}
      <line
        x1="110"
        y1="65"
        x2="110"
        y2="90"
        className="gfx-path gfx-path--muted gfx-animate"
        pathLength={1}
      />
      <polyline
        points="105 85 110 90 115 85"
        className="gfx-path gfx-path--muted"
      />

      {/* SQL translation */}
      <rect
        x="10"
        y="95"
        width="200"
        height="38"
        rx="2"
        fill="none"
        className="gfx-path"
        strokeDasharray="3 4"
      />
      <text x="20" y="113" fontSize="9">
        AI TRANSLATED TO
      </text>
      <text x="20" y="127" fontSize="10" fill="#A8A8AD">
        SELECT * FROM events_v2...
      </text>

      {/* Divider */}
      <line
        x1="230"
        y1="20"
        x2="230"
        y2="160"
        className="gfx-path gfx-path--muted"
        strokeDasharray="2 4"
      />

      {/* Question answered */}
      <rect
        x="260"
        y="20"
        width="210"
        height="40"
        rx="2"
        fill="none"
        stroke="#D4FF3F"
        strokeWidth="1.5"
      />
      <text x="270" y="38" fontSize="9">
        QUESTION ANSWERED
      </text>
      <text x="270" y="52" fontSize="11" fill="#D4FF3F">
        Total EU signups this month
      </text>

      <line
        x1="360"
        y1="65"
        x2="360"
        y2="90"
        className="gfx-path gfx-path--muted gfx-animate"
        pathLength={1}
      />
      <polyline
        points="355 85 360 90 365 85"
        className="gfx-path gfx-path--muted"
      />

      {/* Wrong table */}
      <rect
        x="260"
        y="95"
        width="210"
        height="38"
        rx="2"
        fill="none"
        className="gfx-path"
      />
      <text x="270" y="113" fontSize="9">
        USED WRONG TABLE
      </text>
      <text x="270" y="127" fontSize="10" fill="#D4FF3F">
        events_v1 (deprecated)
      </text>

      {/* Bottom label */}
      <text
        x="240"
        y="165"
        textAnchor="middle"
        fontSize="9"
        className="gfx-fade gfx-label--active"
        style={fadeDelay(10)}
      >
        TECHNICALLY CORRECT. ACTUALLY USELESS.
      </text>
    </svg>
  );
}

function FailureAbandonment() {
  return (
    <svg
      className="gfx failure__diagram"
      viewBox="0 0 480 180"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Axes */}
      <line
        x1="40"
        y1="20"
        x2="40"
        y2="140"
        className="gfx-path gfx-path--muted"
      />
      <line
        x1="40"
        y1="140"
        x2="460"
        y2="140"
        className="gfx-path gfx-path--muted"
      />

      {/* Y labels */}
      <text x="34" y="24" textAnchor="end" fontSize="9">
        HIGH
      </text>
      <text x="34" y="144" textAnchor="end" fontSize="9">
        0
      </text>

      {/* X labels */}
      <text x="40" y="158" fontSize="9">
        WEEK 1
      </text>
      <text x="250" y="158" textAnchor="middle" fontSize="9">
        WEEK 6
      </text>
      <text x="460" y="158" textAnchor="end" fontSize="9">
        WEEK 12
      </text>

      {/* Usage line */}
      <path
        d="M 40 40 L 80 30 L 120 35 L 160 70 L 200 110 L 240 128 L 280 135 L 320 138 L 360 139 L 400 140 L 460 140"
        className="gfx-path gfx-path--accent gfx-animate"
        pathLength={1}
      />

      {/* Peak annotation */}
      <circle
        cx="80"
        cy="30"
        r="3"
        fill="#D4FF3F"
        className="gfx-fade"
        style={fadeDelay(6)}
      />
      <text
        x="88"
        y="26"
        fontSize="9"
        className="gfx-fade"
        style={fadeDelay(6)}
      >
        PEAK USAGE
      </text>

      {/* Abandonment annotation */}
      <circle
        cx="320"
        cy="138"
        r="3"
        fill="#D4FF3F"
        className="gfx-fade"
        style={fadeDelay(8)}
      />
      <text
        x="328"
        y="132"
        fontSize="9"
        className="gfx-fade gfx-label--active"
        style={fadeDelay(8)}
      >
        TEAM STOPPED USING
      </text>
    </svg>
  );
}

export default function FailureDiagram({ number }: { number: string }) {
  switch (number) {
    case '01':
      return <FailureHallucination />;
    case '02':
      return <FailureWrongQuestion />;
    case '03':
      return <FailureAbandonment />;
    default:
      return null;
  }
}
