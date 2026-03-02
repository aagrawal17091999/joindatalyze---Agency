export const toolList = [
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
    description: 'Download raw Mixpanel user profile data from your project in a CSV.',
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
];

export const toolById = Object.fromEntries(toolList.map((t) => [t.id, t]));
