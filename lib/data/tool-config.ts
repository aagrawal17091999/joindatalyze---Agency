export type ToolConfig = {
  filename?: string;
  label: string;
  description: string;
  webOnly?: boolean;
};

export const TOOL_CONFIG: Record<string, ToolConfig> = {
  'mixpanel-exporter': {
    filename: 'mixpanel-event-exporter.ipynb',
    label: 'Mixpanel Event Exporter',
    description: 'Download raw Mixpanel data from your project in a CSV.',
  },
  'mixpanel-users-exporter': {
    filename: 'mixpanel-users-exporter.ipynb',
    label: 'Mixpanel Users Exporter',
    description:
      'Download raw Mixpanel user profile data from your project in a CSV.',
  },
  'analytics-maturity-grader': {
    label: 'Analytics Maturity Grader',
    description:
      'A 2-minute quiz to grade your analytics maturity across 5 dimensions.',
    webOnly: true,
  },
};
