import { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { firebaseConfig, cloudFunctionsBaseUrl, apiBaseUrl, isFirebaseConfigured } from '../config';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u ?? null);
      setLoading(false);
      if (u && apiBaseUrl) {
        try {
          const token = await u.getIdToken();
          await fetch(`${apiBaseUrl}/api/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (e) {
          console.warn('Sync user to backend failed', e);
        }
      }
    });
    return () => unsub();
  }, []);

  const signUp = (email, password) => createUserWithEmailAndPassword(auth, email, password);
  const signIn = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const signOut = () => firebaseSignOut(auth);

  const postEvent = async (eventName, userObj, payload = {}) => {
    if (!cloudFunctionsBaseUrl || cloudFunctionsBaseUrl.includes('YOUR_REGION')) return;
    try {
      const token = await userObj.getIdToken();
      await fetch(`${cloudFunctionsBaseUrl}/recordToolEvent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventName, ...payload }),
      });
    } catch (e) {
      console.warn('postEvent failed', e);
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    postEvent,
    isFirebaseConfigured: isFirebaseConfigured(firebaseConfig),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
