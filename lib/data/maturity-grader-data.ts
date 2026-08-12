// ---------------------------------------------------------------------------
// Analytics Maturity Grader - Questions, Scoring & Recommendations
// ---------------------------------------------------------------------------

export type QuestionOption = {
  label: string;
  text: string;
  points: number;
};

export type Question = {
  id: string;
  text: string;
  options: QuestionOption[];
};

export type Dimension = {
  id: string;
  label: string;
  questions: Question[];
};

export type DimensionResult = {
  id: string;
  label: string;
  score: number;
  max: number;
  grade: string;
  color: string;
  recommendation: string;
};

export type Results = {
  overall: {
    score: number;
    max: number;
    grade: string;
    label: string;
    color: string;
  };
  dimensions: DimensionResult[];
};

export type Answers = Record<string, number>;

export const dimensions: Dimension[] = [
  {
    id: 'tracking-infrastructure',
    label: 'Tracking Infrastructure',
    questions: [
      {
        id: 'q1',
        text: 'How would you describe your current event tracking setup?',
        options: [
          {
            label: 'A',
            text: 'We have a documented tracking plan with named events, properties, and ownership - and it\u2019s maintained as part of our release process.',
            points: 25,
          },
          {
            label: 'B',
            text: 'We track key events in a tool like Mixpanel/Amplitude/PostHog, but there\u2019s no formal tracking plan or documentation.',
            points: 15,
          },
          {
            label: 'C',
            text: 'We mostly rely on Google Analytics (pageviews, sessions) and don\u2019t track in-product events in detail.',
            points: 8,
          },
          {
            label: 'D',
            text: 'We don\u2019t have analytics set up yet, or it\u2019s been set up but nobody really looks at it.',
            points: 2,
          },
        ],
      },
      {
        id: 'q2',
        text: 'When a new feature ships, what happens with tracking?',
        options: [
          {
            label: 'A',
            text: 'Tracking is part of the feature spec - events are defined before development starts, QA\u2019d before release, and documented.',
            points: 25,
          },
          {
            label: 'B',
            text: 'We usually add tracking after the feature ships, once someone asks "how is it performing?"',
            points: 15,
          },
          {
            label: 'C',
            text: 'It depends on the feature - sometimes we track it, sometimes we don\u2019t.',
            points: 8,
          },
          {
            label: 'D',
            text: 'We rarely add tracking for new features.',
            points: 2,
          },
        ],
      },
    ],
  },
  {
    id: 'data-governance',
    label: 'Data Governance',
    questions: [
      {
        id: 'q3',
        text: 'How confident are you that your analytics data is accurate right now?',
        options: [
          {
            label: 'A',
            text: 'Very confident. We audit our tracking regularly, catch issues quickly, and have a process to fix them.',
            points: 25,
          },
          {
            label: 'B',
            text: 'Mostly confident, but we\u2019ve found incorrect data a few times and we know there are gaps we haven\u2019t looked into.',
            points: 15,
          },
          {
            label: 'C',
            text: 'Not very confident. We suspect some numbers are off but haven\u2019t had time to investigate.',
            points: 8,
          },
          {
            label: 'D',
            text: 'We honestly don\u2019t know if the data is accurate. Nobody has checked.',
            points: 2,
          },
        ],
      },
      {
        id: 'q4',
        text: 'How many tracked events do you have, and how many are actually used for decisions?',
        options: [
          {
            label: 'A',
            text: 'We track a focused set of events (<100) and most of them map directly to metrics we review.',
            points: 25,
          },
          {
            label: 'B',
            text: 'We have a lot of events (100\u2013500+), but only a fraction are used regularly. The rest are legacy or unclear.',
            points: 15,
          },
          {
            label: 'C',
            text: 'We\u2019re not sure how many events we track. There\u2019s no central inventory.',
            points: 8,
          },
          {
            label: 'D',
            text: 'We don\u2019t track events, or we have a few set up that nobody looks at.',
            points: 2,
          },
        ],
      },
    ],
  },
  {
    id: 'metric-definitions',
    label: 'Metric Definitions',
    questions: [
      {
        id: 'q5',
        text: 'Do you have a documented list of your company\u2019s key metrics (north star, activation, retention, etc.) with clear definitions?',
        options: [
          {
            label: 'A',
            text: 'Yes. Our key metrics are documented, the definitions are shared across teams, and everyone calculates them the same way.',
            points: 25,
          },
          {
            label: 'B',
            text: 'We have key metrics, but definitions live in people\u2019s heads or in scattered docs. Different people sometimes calculate them differently.',
            points: 15,
          },
          {
            label: 'C',
            text: 'We track some numbers (MRR, signups) but haven\u2019t formally defined things like activation or retention metrics.',
            points: 8,
          },
          {
            label: 'D',
            text: 'We don\u2019t have defined metrics beyond basic revenue/signups.',
            points: 2,
          },
        ],
      },
      {
        id: 'q6',
        text: 'Could a new PM joining your team today find and understand your key metrics within their first week?',
        options: [
          {
            label: 'A',
            text: 'Yes - we have a metrics dictionary or dashboard with definitions that any new hire can reference.',
            points: 25,
          },
          {
            label: 'B',
            text: 'They could find the dashboards, but they\u2019d need to ask around to understand what the numbers actually mean.',
            points: 15,
          },
          {
            label: 'C',
            text: 'They\u2019d need to ask a specific person (the "data person") who holds the context.',
            points: 8,
          },
          {
            label: 'D',
            text: 'They\u2019d be pretty lost. We don\u2019t have centralized dashboards or definitions.',
            points: 2,
          },
        ],
      },
    ],
  },
  {
    id: 'team-data-literacy',
    label: 'Team Data Literacy',
    questions: [
      {
        id: 'q7',
        text: 'How does your product/growth team typically use data week-to-week?',
        options: [
          {
            label: 'A',
            text: 'PMs and growth leads self-serve - they build their own dashboards, run queries, and bring data to every decision.',
            points: 25,
          },
          {
            label: 'B',
            text: 'The team checks existing dashboards regularly, but any new analysis requires asking an analyst or data engineer.',
            points: 15,
          },
          {
            label: 'C',
            text: 'Data comes up in monthly reviews, but day-to-day decisions are mostly based on intuition and qualitative feedback.',
            points: 8,
          },
          {
            label: 'D',
            text: 'The team rarely uses data. Decisions are based on founder instinct or loudest voice in the room.',
            points: 2,
          },
        ],
      },
      {
        id: 'q8',
        text: 'When someone on the team says "the data shows X" - what happens next?',
        options: [
          {
            label: 'A',
            text: 'People ask clarifying questions - "which cohort?", "what\u2019s the sample size?", "is this stat sig?" The team is data-critical.',
            points: 25,
          },
          {
            label: 'B',
            text: 'People generally trust the number and move on. Occasionally someone will push back.',
            points: 15,
          },
          {
            label: 'C',
            text: 'Nobody really questions it. If it\u2019s on a dashboard, it\u2019s treated as fact.',
            points: 8,
          },
          {
            label: 'D',
            text: 'This doesn\u2019t happen often - data isn\u2019t really part of how decisions are discussed.',
            points: 2,
          },
        ],
      },
    ],
  },
  {
    id: 'decision-making-culture',
    label: 'Decision-Making Culture',
    questions: [
      {
        id: 'q9',
        text: 'Think about the last 3 major product or growth decisions your team made. How many were backed by data?',
        options: [
          {
            label: 'A',
            text: 'All 3. We framed the decision with data, tested where possible, and measured outcomes.',
            points: 25,
          },
          {
            label: 'B',
            text: '1\u20132 of them. We had some data, but the decision was ultimately driven by conviction or urgency.',
            points: 15,
          },
          {
            label: 'C',
            text: 'We looked at data after the decision to validate it, but the decision came first.',
            points: 8,
          },
          {
            label: 'D',
            text: 'None of them were data-driven. We moved fast and figured we\u2019d measure later.',
            points: 2,
          },
        ],
      },
      {
        id: 'q10',
        text: 'When an experiment or feature launch doesn\u2019t hit its target, what does your team do?',
        options: [
          {
            label: 'A',
            text: 'We dig into the data - segment by cohort, check the instrumentation, and figure out why before deciding next steps.',
            points: 25,
          },
          {
            label: 'B',
            text: 'We look at the top-level metric, discuss as a team, and make a judgment call on whether to iterate or move on.',
            points: 15,
          },
          {
            label: 'C',
            text: 'We usually move on to the next thing. Post-mortems don\u2019t happen often.',
            points: 8,
          },
          {
            label: 'D',
            text: 'We don\u2019t set targets for experiments or launches, so there\u2019s no clear "miss."',
            points: 2,
          },
        ],
      },
    ],
  },
];

// Flat list for quiz rendering (no dimension labels shown)
export const allQuestions = dimensions.flatMap((d) =>
  d.questions.map((q) => ({ ...q, dimensionId: d.id }))
);

// ---------------------------------------------------------------------------
// Grade scales
// ---------------------------------------------------------------------------

const dimensionGradeScale: Array<{ min: number; grade: string }> = [
  { min: 45, grade: 'A' },
  { min: 35, grade: 'B' },
  { min: 22, grade: 'C' },
  { min: 10, grade: 'D' },
  { min: 0, grade: 'F' },
];

const overallGradeScale: Array<{ min: number; grade: string; label: string }> =
  [
    { min: 225, grade: 'A+', label: 'Analytics Leader' },
    { min: 200, grade: 'A', label: 'Analytics Leader' },
    { min: 175, grade: 'B+', label: 'On The Right Track' },
    { min: 150, grade: 'B', label: 'On The Right Track' },
    { min: 120, grade: 'C+', label: 'Foundation Gaps' },
    { min: 100, grade: 'C', label: 'Foundation Gaps' },
    { min: 70, grade: 'D', label: 'Flying Blind' },
    { min: 0, grade: 'F', label: 'Data Emergency' },
  ];

// ---------------------------------------------------------------------------
// Recommendations (keyed by dimension id → grade letter)
// ---------------------------------------------------------------------------

const recommendations: Record<string, Record<string, string>> = {
  'tracking-infrastructure': {
    A: 'Your tracking foundation is solid. Focus on maintaining it - add tracking plan reviews to your sprint cycle.',
    B: 'You\u2019re tracking the right things but without structure. Create a tracking plan document this week - list every event, its definition, and who owns it.',
    C: 'You\u2019re sitting on pageview-level data, which can\u2019t tell you what users actually do in your product. Set up event tracking in Mixpanel, Amplitude, or PostHog - start with your top 3 user flows.',
    D: 'You\u2019re making decisions with zero visibility. Before anything else, instrument your core signup \u2192 activation \u2192 retention flow with basic event tracking. This is day-one infrastructure.',
    F: 'You\u2019re making decisions with zero visibility. Before anything else, instrument your core signup \u2192 activation \u2192 retention flow with basic event tracking. This is day-one infrastructure.',
  },
  'data-governance': {
    A: 'Your data hygiene is strong. Consider adding automated data quality alerts to catch drift before humans notice.',
    B: 'You\u2019ve got data debt accumulating. Schedule a tracking audit - delete unused events, fix broken ones, and document what\u2019s left. A focused set of 30\u201350 events you trust beats 300 you don\u2019t.',
    C: 'You don\u2019t know what you\u2019re tracking or if it\u2019s right. Start with an event inventory - export your tracked events list, mark which ones map to actual business metrics, and archive the rest.',
    D: 'Your data is unreliable or nonexistent. Nothing you build on top of this will be trustworthy. Start from scratch with a clean, minimal tracking plan built around your 5 most important business questions.',
    F: 'Your data is unreliable or nonexistent. Nothing you build on top of this will be trustworthy. Start from scratch with a clean, minimal tracking plan built around your 5 most important business questions.',
  },
  'metric-definitions': {
    A: 'Your metric definitions are tight and shared. Keep evolving them - add benchmarks and targets to each metric so the team knows what \u201Cgood\u201D looks like.',
    B: 'Your metrics exist but aren\u2019t formalized. Create a one-page metrics dictionary with exact definitions (e.g., \u201CActivation = user completes first project within 7 days of signup\u201D). Share it company-wide.',
    C: 'You\u2019re tracking vanity metrics without defining the ones that matter. Define your North Star Metric, plus activation, retention, and revenue metrics - with exact formulas.',
    D: 'You have no shared language for measuring success. Before setting goals or running experiments, define the 3\u20135 metrics your company lives or dies by. Get the leadership team to agree on these definitions in a single meeting.',
    F: 'You have no shared language for measuring success. Before setting goals or running experiments, define the 3\u20135 metrics your company lives or dies by. Get the leadership team to agree on these definitions in a single meeting.',
  },
  'team-data-literacy': {
    A: 'Your team is self-sufficient with data. Invest in tooling that accelerates them - saved reports, shared dashboards, and automated weekly metric summaries.',
    B: 'Your team consumes data but can\u2019t create analysis. Run a \u201Cdata for PMs\u201D workshop - teach them to build their own funnels and cohort analyses in your analytics tool. Self-serve unlocks speed.',
    C: 'Data is an afterthought in your team\u2019s workflow. Start a weekly 15-minute \u201Cmetrics check-in\u201D where the team reviews 3 key numbers together. Build the habit before building the skill.',
    D: 'Your team operates on gut feel. The fastest fix: create one shared dashboard with 5 numbers the team checks every Monday. Make data visible before trying to make it sophisticated.',
    F: 'Your team operates on gut feel. The fastest fix: create one shared dashboard with 5 numbers the team checks every Monday. Make data visible before trying to make it sophisticated.',
  },
  'decision-making-culture': {
    A: 'You\u2019re data-informed without being data-paralyzed. Protect this culture as you scale - it\u2019s your competitive advantage.',
    B: 'Data shows up in decisions sometimes but not systematically. Add a \u201Cwhat does the data say?\u201D checkpoint to your product review process. Make it a habit, not a hero effort.',
    C: 'You use data to confirm decisions you\u2019ve already made. Flip the order - start decisions with \u201Cwhat do we know?\u201D before \u201Cwhat do we think?\u201D Even asking the question changes behavior.',
    D: 'Data isn\u2019t part of your decision-making process. This isn\u2019t a tooling problem - it\u2019s a culture problem. Start by requiring one metric as justification for every product decision. Just one. Build from there.',
    F: 'Data isn\u2019t part of your decision-making process. This isn\u2019t a tooling problem - it\u2019s a culture problem. Start by requiring one metric as justification for every product decision. Just one. Build from there.',
  },
};

// ---------------------------------------------------------------------------
// Pure scoring functions
// ---------------------------------------------------------------------------

export function getDimensionGrade(score: number): string {
  for (const { min, grade } of dimensionGradeScale) {
    if (score >= min) return grade;
  }
  return 'F';
}

export function getOverallGrade(score: number): {
  min: number;
  grade: string;
  label: string;
} {
  for (const entry of overallGradeScale) {
    if (score >= entry.min) return entry;
  }
  return overallGradeScale[overallGradeScale.length - 1];
}

export function gradeColor(grade: string): string {
  const base = grade.replace('+', '');
  const map: Record<string, string> = {
    A: '#D4FF3F',
    B: '#60A5FA',
    C: '#FBBF24',
    D: '#F97316',
    F: '#EF4444',
  };
  return map[base] || map.F;
}

/**
 * Compute full results from answers map.
 */
export function computeResults(answers: Answers): Results {
  const dimResults: DimensionResult[] = dimensions.map((dim) => {
    const score = dim.questions.reduce(
      (sum, q) => sum + (answers[q.id] || 0),
      0,
    );
    const grade = getDimensionGrade(score);
    return {
      id: dim.id,
      label: dim.label,
      score,
      max: 50,
      grade,
      color: gradeColor(grade),
      recommendation: recommendations[dim.id]?.[grade] || '',
    };
  });

  const totalScore = dimResults.reduce((sum, d) => sum + d.score, 0);
  const overall = getOverallGrade(totalScore);

  return {
    overall: {
      score: totalScore,
      max: 250,
      grade: overall.grade,
      label: overall.label,
      color: gradeColor(overall.grade),
    },
    dimensions: dimResults,
  };
}
