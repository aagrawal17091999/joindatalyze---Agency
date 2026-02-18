import { verifyIdToken } from '../config/firebase-admin.js';

/**
 * Expects: Authorization: Bearer <Firebase ID token>
 * Attaches req.user = { uid, email, name } on success.
 */
export async function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header. Use: Bearer <token>' });
  }

  const token = header.slice(7).trim();
  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }

  try {
    const decoded = await verifyIdToken(token);
    req.user = {
      uid: decoded.uid,
      email: decoded.email || null,
      name: decoded.name || null,
    };
    next();
  } catch (err) {
    const isDev = process.env.NODE_ENV !== 'production';
    const code = err.code || err.errorInfo?.code || err.message || '';
    const msg = err.message || '';

    if (isDev) {
      console.error('[auth] Token verification failed:', code, msg);
    }

    if (code.includes('auth/id-token-expired')) {
      return res.status(401).json({ error: 'Token expired' });
    }
    if (code.includes('auth/argument-error') || code.includes('auth/id-token-revoked')) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (code.includes('auth/invalid-credential') || code.includes('auth/insufficient-permission')) {
      return res.status(401).json({
        error: isDev
          ? 'Firebase Admin credential error. Ensure GOOGLE_APPLICATION_CREDENTIALS points to a service account key from the same Firebase project as the frontend (e.g. datalyze-agency).'
          : 'Authentication failed',
      });
    }
    if (code.includes('auth/project-mismatch') || msg.includes('project')) {
      return res.status(401).json({
        error: isDev
          ? 'Firebase project mismatch. The server\'s service account must be from the same project as the frontend (check project_id in service account JSON).'
          : 'Authentication failed',
      });
    }
    return res.status(401).json({
      error: isDev && (code || msg) ? `Authentication failed: ${code || msg}` : 'Authentication failed',
    });
  }
}

/**
 * Optional auth: if valid token present, sets req.user; otherwise req.user = null.
 */
export async function optionalAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = header.slice(7).trim();
  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = await verifyIdToken(token);
    req.user = { uid: decoded.uid, email: decoded.email || null, name: decoded.name || null };
    next();
  } catch (_) {
    req.user = null;
    next();
  }
}
