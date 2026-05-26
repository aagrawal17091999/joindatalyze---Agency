export type ToolConfig = {
  filename?: string;
  bundleFiles?: string[];
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
  'event-tracking-plan-generator': {
    filename: 'event-tracking-plan-generator.zip',
    bundleFiles: [
      'event-tracking-plan-creator.skill',
      'event-tracking-plan-generator-page.md',
    ],
    label: 'Event Tracking Plan Generator',
    description:
      'Free Claude skill that generates a full event tracking plan for your product.',
  },
  'analytics-strategy-creator': {
    filename: 'analytics-strategy-creator.skill',
    label: 'Analytics Strategy Creator',
    description:
      'Free Claude skill that turns a product decision into a tight analytics strategy.',
  },
  'analytics-maturity-grader': {
    label: 'Analytics Maturity Grader',
    description:
      'A 2-minute quiz to grade your analytics maturity across 5 dimensions.',
    webOnly: true,
  },
};
