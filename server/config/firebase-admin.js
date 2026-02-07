import admin from 'firebase-admin';

let initialized = false;

function initFirebaseAdmin() {
  if (initialized) return admin;

  const cred = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (cred) {
    try {
      const json = JSON.parse(
        typeof cred === 'string' && cred.startsWith('{') ? cred : Buffer.from(cred, 'base64').toString('utf8')
      );
      admin.initializeApp({ credential: admin.credential.cert(json) });
    } catch (e) {
      throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT_JSON: ' + e.message);
    }
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    admin.initializeApp({ credential: admin.credential.applicationDefault() });
  } else {
    throw new Error('Set GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_SERVICE_ACCOUNT_JSON for Firebase Admin');
  }

  initialized = true;
  return admin;
}

export function getAuth() {
  initFirebaseAdmin();
  return admin.auth();
}

export async function verifyIdToken(idToken) {
  const auth = getAuth();
  return auth.verifyIdToken(idToken);
}
