export type Tool = {
  id: string;
  type?: 'web';
  title: string;
  description: string;
  longDescription: string;
  features: string[];
  cta: string;
  fileType?: string;
};

export const toolList: Tool[] = [
  {
    id: 'mixpanel-exporter',
    title: 'Mixpanel Event Exporter',
    description: 'Download raw Mixpanel data from your project in a CSV.',
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
  },
  {
    id: 'mixpanel-users-exporter',
    title: 'Mixpanel Users Exporter',
    description:
      'Download raw Mixpanel user profile data from your project in a CSV.',
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
  },
  {
    id: 'event-tracking-plan-generator',
    title: 'Event Tracking Plan Generator',
    description:
      'A Claude skill that walks your live product and generates a ready-to-implement event tracking plan as a CSV.',
    longDescription:
      'A Claude skill that generates a complete, ready-to-implement event tracking plan for your product — by actually opening your site, clicking through it, and figuring out what is worth tracking. Output is a CSV in the standard Mixpanel / PostHog / Amplitude / GA4 format. Free to download, free to use.',
    features: [
      'Drives your real Chrome browser via the Claude in Chrome extension',
      'Walks your authenticated app section by section and pauses for your input',
      'Outputs a CSV compatible with Mixpanel, PostHog, Amplitude, and GA4',
      'Groups events by user journey: acquisition → signup → core → engagement → errors',
      'Free — runs entirely inside Claude Pro / Max / Team',
    ],
    cta: 'Get the skill',
    fileType: 'Claude Skill (.skill)',
  },
  {
    id: 'analytics-maturity-grader',
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
      'No setup required — runs in your browser',
    ],
    cta: 'Grade my analytics',
  },
];

export const toolById: Record<string, Tool> = Object.fromEntries(
  toolList.map((t) => [t.id, t]),
);
