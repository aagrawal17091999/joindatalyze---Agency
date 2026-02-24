import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { resolve } from 'path';

let initialized = false;

function getCredential() {
  const cred = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (cred) {
    try {
      const json = JSON.parse(
        typeof cred === 'string' && cred.startsWith('{') ? cred : Buffer.from(cred, 'base64').toString('utf8')
      );
      return admin.credential.cert(json);
    } catch (e) {
      throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT_JSON: ' + e.message);
    }
  }
  const path = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (path) {
    try {
      const absPath = resolve(path);
      const json = JSON.parse(readFileSync(absPath, 'utf8'));
      return admin.credential.cert(json);
    } catch (e) {
      throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT_PATH or file: ' + e.message);
    }
  }
  throw new Error(
    'Set FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_SERVICE_ACCOUNT_PATH in .env (with FIREBASE_PROJECT_ID etc.) for Firebase Admin'
  );
}

function initFirebaseAdmin() {
  if (initialized) return admin;

  const credential = getCredential();
  const projectId = process.env.FIREBASE_PROJECT_ID || undefined;

  admin.initializeApp({
    credential,
    ...(projectId && { projectId }),
  });

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
