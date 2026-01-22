export const firebaseConfig = {
  apiKey: 'AIzaSyBUu5V6NxY2LogRQ5d9vZTAxAKkqUwtvqo',
  authDomain: 'datalyze-agency.firebaseapp.com',
  projectId: 'datalyze-agency',
  appId: '1:714301365208:web:3fd05a8ef1f5ab028370ad'
};

export const cloudFunctionsBaseUrl =
  'https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net';

export const isFirebaseConfigured = (config) => {
  return Boolean(config?.apiKey) && config.apiKey !== 'YOUR_FIREBASE_API_KEY';
};
