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
    const code = err.code || err.message || '';
    if (code.includes('auth/id-token-expired')) {
      return res.status(401).json({ error: 'Token expired' });
    }
    if (code.includes('auth/argument-error') || code.includes('auth/id-token-revoked')) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    return res.status(401).json({ error: 'Authentication failed' });
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
