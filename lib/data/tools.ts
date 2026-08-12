export type Tool = {
  id: string;
  type?: 'web';
  title: string;
  description: string;
  longDescription: string;
  features: string[];
  cta: string;
  fileType?: string;
  /** Rendered in the /tools comparison table. `useWhen` is the trigger, not a
   *  feature - it's what someone searching "which analytics tool do I need"
   *  actually matches on. */
  useWhen?: string;
  output?: string;
  // Optional longer-form prose + FAQ rendered below the download box. Added to
  // give otherwise-thin tool landing pages enough indexable context to rank.
  context?: {
    heading: string;
    body: string[];
    faqs?: { q: string; a: string }[];
  };
};

export const toolList: Tool[] = [
  {
    id: 'mixpanel-exporter',
    useWhen: 'You need raw Mixpanel events outside Mixpanel - warehouse, notebook, backup',
    output: 'One CSV, one row per event, one column per property',
    title: 'Mixpanel Event Exporter',
    description:
      'Export raw Mixpanel event data to a clean CSV with a free Jupyter notebook. Handles the Export API, pagination, and large date ranges - and runs locally.',
    longDescription:
      'Export your raw Mixpanel event data to a CSV file with just a few clicks. This Jupyter notebook connects directly to the Mixpanel API, handles pagination, and outputs a clean CSV ready for analysis in any tool.',
    features: [
      'Connects to Mixpanel Export API',
      'Handles pagination for large datasets',
      'Outputs clean CSV format',
      'Configurable date ranges and event filters',
    ],
    cta: 'Try the tool',
    fileType: 'Jupyter Notebook (.ipynb)',
    context: {
      heading: 'Why export raw Mixpanel event data?',
      body: [
        "Mixpanel's interface is built for exploring events inside Mixpanel - but sooner or later you need the raw data somewhere else. Maybe you want to join event data against revenue in a warehouse, build a model in a notebook, hand a clean CSV to a finance team, or keep a backup before a project migration. Mixpanel's native CSV exports are capped and awkward for anything beyond a single report, so most teams end up writing the same API script over and over.",
        "This Jupyter notebook does that work for you. It authenticates against the Mixpanel Export API with your project credentials, paginates through the full date range you specify - handling the rate limits and large result sets that break naive scripts - and writes a single clean CSV with one row per event and a column per property. Everything runs locally on your machine, so your raw event data and API secret never touch a third-party server.",
        'Drop in your project token and API secret, set your date range and the events you care about, and run the cells top to bottom. The output is analysis-ready for pandas, BigQuery, Snowflake, Excel, or whatever you load it into next.',
      ],
      faqs: [
        {
          q: 'Is it free, and is my data safe?',
          a: 'Yes - the notebook is completely free. It runs entirely on your own machine and talks directly to the Mixpanel API, so your events and credentials are never sent to Datalyze or any other third party.',
        },
        {
          q: 'What do I need to run it?',
          a: 'Python with Jupyter (or Google Colab), plus your Mixpanel project token and API secret from Project Settings. No paid plan or special access is required.',
        },
        {
          q: 'How large an export can it handle?',
          a: 'It paginates through the Export API, so it works for small tests and multi-million-event date ranges alike. Larger ranges simply take longer to download.',
        },
      ],
    },
  },
  {
    id: 'mixpanel-users-exporter',
    useWhen: 'You need every Mixpanel user profile out - CRM sync, enrichment, audit',
    output: 'One CSV, one row per user, one column per property',
    title: 'Mixpanel Users Exporter',
    description:
      'Export every Mixpanel user profile to a clean CSV with a free Jupyter notebook. Walks the Engage API, flattens properties, runs locally.',
    longDescription:
      'Export all your Mixpanel user profiles to a CSV file. This notebook handles the Engage API, iterates through all user profiles, and gives you a comprehensive dataset of user properties.',
    features: [
      'Connects to Mixpanel Engage API',
      'Iterates through all user profiles',
      'Exports all user properties to CSV',
      'Works with any Mixpanel project',
    ],
    cta: 'Try the tool',
    fileType: 'Jupyter Notebook (.ipynb)',
    context: {
      heading: 'Why export your Mixpanel user profiles?',
      body: [
        "Your Mixpanel user profiles hold everything you know about each person - plan tier, signup date, lifecycle stage, custom traits, and the computed properties you've layered on over time. That dataset is incredibly useful outside Mixpanel: for syncing audiences to your CRM or ad platforms, enriching a warehouse, running cohort analysis in a notebook, or auditing data quality before a migration. But the Engage API returns profiles in paginated batches behind a session-based cursor, which makes a one-off export surprisingly fiddly to get right.",
        'This notebook handles that for you. It connects to the Mixpanel Engage API, walks every page of profiles until the full set is retrieved, flattens nested properties, and writes one clean CSV with a row per user and a column per property. It runs locally against your own project, so user PII and your API secret stay on your machine and are never sent anywhere else.',
        'Add your project token and API secret, run the cells in order, and you get a complete, analysis-ready export of every user profile in your project - ready for pandas, your warehouse, a spreadsheet, or a reverse-ETL sync.',
      ],
      faqs: [
        {
          q: 'Does it export every user, or just a segment?',
          a: 'By default it iterates through every profile in the project. You can also pass a Mixpanel segmentation expression to export only the users that match a specific filter.',
        },
        {
          q: 'Where does my user data go?',
          a: 'Nowhere but your own machine. The notebook calls the Mixpanel API directly and writes the CSV locally - no profile data or credentials are sent to Datalyze.',
        },
        {
          q: 'What format is the output?',
          a: 'A standard CSV with one row per user and one column per profile property, ready to open in Excel or load into a warehouse or notebook.',
        },
      ],
    },
  },
  {
    id: 'event-tracking-plan-generator',
    useWhen: 'You know what you want to measure and need the events specced',
    output: 'CSV tracking plan in standard Mixpanel / PostHog / Amplitude / GA4 format',
    title: 'Event Tracking Plan Generator',
    description:
      'A Claude skill that walks your live product and generates a ready-to-implement event tracking plan as a CSV.',
    longDescription:
      'A Claude skill that generates a complete, ready-to-implement event tracking plan for your product - by actually opening your site, clicking through it, and figuring out what is worth tracking. Output is a CSV in the standard Mixpanel / PostHog / Amplitude / GA4 format. Free to download, free to use.',
    features: [
      'Drives your real Chrome browser via the Claude in Chrome extension',
      'Walks your authenticated app section by section and pauses for your input',
      'Outputs a CSV compatible with Mixpanel, PostHog, Amplitude, and GA4',
      'Groups events by user journey: acquisition → signup → core → engagement → errors',
      'Free - runs entirely inside Claude Pro / Max / Team',
    ],
    cta: 'Get the skill',
    fileType: 'Claude Skill (.skill)',
  },
  {
    id: 'analytics-strategy-creator',
    useWhen: 'You have a fuzzy \u201cI want to understand X\u201d and no idea which metrics answer it',
    output: 'Markdown doc: 3\u20135 primary metrics, each with a counter-metric and segmentation',
    title: 'Analytics Strategy Creator',
    description:
      'A Claude skill that turns a fuzzy product question into a tight, decision-driven analytics strategy.',
    longDescription:
      'A Claude skill that turns a fuzzy "I want to understand X" into a tight, decision-driven analytics strategy - five-or-fewer primary metrics paired with counter-metrics, segmentation, and instrumentation notes. Outputs a markdown doc you can hand to your PM, eng team, or data person. Free to download, free to use.',
    features: [
      'Pins down the specific decision before recommending any metric',
      'Researches your product directly from its URL',
      'Picks 3–5 primary metrics - each paired with a counter-metric and segmentation',
      'Calls out the vanity metrics worth explicitly skipping',
      'Chains naturally into the Event Tracking Plan Generator for full instrumentation',
      'Free - runs entirely inside Claude Pro / Max / Team',
    ],
    cta: 'Get the skill',
    fileType: 'Claude Skill (.skill)',
  },
  {
    id: 'analytics-maturity-grader',
    useWhen: 'You want an honest read on how bad your setup is before spending on fixing it',
    output: 'Letter grade across 5 dimensions, with prioritised recommendations',
    type: 'web',
    title: 'Analytics Maturity Grader',
    description:
      'Discover where your analytics stack stands and what to fix first.',
    longDescription:
      'Take a 2-minute quiz to get a personalized analytics maturity scorecard with actionable recommendations for each dimension of your data practice.',
    features: [
      'Score across 5 key analytics dimensions',
      'Get a letter grade with personalized recommendations',
      'Download a shareable scorecard image',
      'No setup required - runs in your browser',
    ],
    cta: 'Grade my analytics',
  },
];

export const toolById: Record<string, Tool> = Object.fromEntries(
  toolList.map((t) => [t.id, t]),
);
