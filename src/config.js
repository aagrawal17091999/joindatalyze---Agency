export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBUu5V6NxY2LogRQ5d9vZTAxAKkqUwtvqo",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "datalyze-agency.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "datalyze-agency",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "datalyze-agency.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "714301365208",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:714301365208:web:3fd05a8ef1f5ab028370ad",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-HLPH3ZNZ9M"
};

export const cloudFunctionsBaseUrl =
  import.meta.env.VITE_CLOUD_FUNCTIONS_BASE_URL || 'https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net';

/** Backend API base URL (no trailing slash). Used for /api/users/me sync. */
export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';

export const isFirebaseConfigured = (config) => {
  return Boolean(config?.apiKey) && config.apiKey !== 'AIzaSyBUu5V6NxY2LogRQ5d9vZTAxAKkqUwtvq';
};
