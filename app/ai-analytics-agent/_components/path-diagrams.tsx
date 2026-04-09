/**
 * Two 280×160 architectural diagrams for the AI agent "Two paths" section.
 * Path A: Custom AI agent sitting between team and data warehouse.
 * Path B: Team → third-party tool (Julius/Vanna/DataGPT) → Datalyze foundation.
 */

export function PathADiagram() {
  return (
    <svg
      className="gfx path-card__diagram"
      viewBox="0 0 280 160"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="40"
        y="10"
        width="200"
        height="30"
        rx="2"
        fill="none"
        className="gfx-path gfx-path--primary"
      />
      <text x="140" y="29" textAnchor="middle" fontSize="10">
        YOUR TEAM
      </text>

      <line
        x1="140"
        y1="40"
        x2="140"
        y2="60"
        className="gfx-path gfx-path--accent"
      />
      <polyline
        points="135 55 140 60 145 55"
        className="gfx-path gfx-path--accent"
      />

      <rect
        x="40"
        y="60"
        width="200"
        height="35"
        rx="2"
        fill="none"
        stroke="#D4FF3F"
        strokeWidth="1.5"
      />
      <text
        x="140"
        y="80"
        textAnchor="middle"
        fontSize="10"
        className="gfx-label--active"
      >
        CUSTOM AI AGENT
      </text>
      <text x="140" y="92" textAnchor="middle" fontSize="8">
        (YOU OWN THE CODE)
      </text>

      <line
        x1="140"
        y1="95"
        x2="140"
        y2="115"
        className="gfx-path gfx-path--accent"
      />
      <polyline
        points="135 110 140 115 145 110"
        className="gfx-path gfx-path--accent"
      />

      <rect
        x="40"
        y="115"
        width="200"
        height="35"
        rx="2"
        fill="none"
        className="gfx-path gfx-path--primary"
      />
      <text x="140" y="134" textAnchor="middle" fontSize="10">
        YOUR DATA WAREHOUSE
      </text>
      <text x="140" y="145" textAnchor="middle" fontSize="8">
        + KNOWLEDGE BASE
      </text>
    </svg>
  );
}

export function PathBDiagram() {
  return (
    <svg
      className="gfx path-card__diagram"
      viewBox="0 0 280 160"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="40"
        y="10"
        width="200"
        height="30"
        rx="2"
        fill="none"
        className="gfx-path gfx-path--primary"
      />
      <text x="140" y="29" textAnchor="middle" fontSize="10">
        YOUR TEAM
      </text>

      <line
        x1="140"
        y1="40"
        x2="140"
        y2="55"
        className="gfx-path gfx-path--accent"
      />
      <polyline
        points="135 50 140 55 145 50"
        className="gfx-path gfx-path--accent"
      />

      <rect
        x="40"
        y="55"
        width="200"
        height="30"
        rx="2"
        fill="none"
        className="gfx-path gfx-path--primary"
      />
      <text x="140" y="74" textAnchor="middle" fontSize="10">
        JULIUS / VANNA / DATAGPT
      </text>

      <line
        x1="140"
        y1="85"
        x2="140"
        y2="100"
        className="gfx-path gfx-path--accent"
      />
      <polyline
        points="135 95 140 100 145 95"
        className="gfx-path gfx-path--accent"
      />

      <rect
        x="40"
        y="100"
        width="200"
        height="50"
        rx="2"
        fill="none"
        stroke="#D4FF3F"
        strokeWidth="1.5"
      />
      <text
        x="140"
        y="120"
        textAnchor="middle"
        fontSize="10"
        className="gfx-label--active"
      >
        DATALYZE FOUNDATION
      </text>
      <text x="140" y="135" textAnchor="middle" fontSize="8">
        CLEAN DATA + KNOWLEDGE BASE
      </text>
      <text x="140" y="146" textAnchor="middle" fontSize="8">
        ON YOUR WAREHOUSE
      </text>
    </svg>
  );
}

export default function PathDiagram({ label }: { label: string }) {
  if (label === 'Path A') return <PathADiagram />;
  if (label === 'Path B') return <PathBDiagram />;
  return null;
}
