import { createHmac, randomUUID, timingSafeEqual } from 'crypto';
import { sha256 } from './text';

// Chat sessions.
//
// Signed cookie, same HMAC shape as lib/api/download-token.ts. It carries who
// the visitor is; it deliberately does NOT carry the question count, because a
// cookie is replayable - a visitor could keep re-sending the cookie they had
// after question one and never exhaust the quota. The authoritative count lives
// in BigQuery (see lib/kb/users.ts).

const TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
export const SESSION_COOKIE = 'ask_session';

function secret(): string {
  return process.env.TOOL_DOWNLOAD_TOKEN_SECRET || 'dev-secret-change-in-production';
}

export type AskSession = { userId: string; email: string; emailHash: string };

export function mintSession(email: string): { token: string; session: AskSession } {
  const userId = randomUUID();
  const payload = `${userId}:${email}:${Date.now()}`;
  const sig = createHmac('sha256', secret()).update(payload).digest('hex').slice(0, 32);
  return {
    token: `${Buffer.from(payload).toString('base64url')}.${sig}`,
    session: { userId, email, emailHash: sha256(email) },
  };
}

export function verifySession(token: string | undefined): AskSession | null {
  if (!token) return null;

  const dot = token.lastIndexOf('.');
  if (dot === -1) return null;

  let payload: string;
  try {
    payload = Buffer.from(token.slice(0, dot), 'base64url').toString('utf8');
  } catch {
    return null;
  }

  const expected = createHmac('sha256', secret()).update(payload).digest('hex').slice(0, 32);
  const given = token.slice(dot + 1);
  // Constant-time compare so the signature can't be discovered byte by byte.
  if (given.length !== expected.length) return null;
  if (!timingSafeEqual(Buffer.from(given), Buffer.from(expected))) return null;

  const parts = payload.split(':');
  if (parts.length < 3) return null;

  const [userId, email, issued] = parts;
  if (Date.now() - Number(issued) > TTL_MS) return null;

  return { userId, email, emailHash: sha256(email) };
}

/** Every ask route needs this, and hand-parsing the cookie header in each was one copy too many. */
export function sessionFromRequest(request: Request): AskSession | null {
  const raw = (request.headers.get('cookie') ?? '')
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${SESSION_COOKIE}=`))
    ?.slice(SESSION_COOKIE.length + 1);
  return verifySession(raw);
}

export function sessionCookie(token: string): string {
  return [
    `${SESSION_COOKIE}=${token}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${Math.floor(TTL_MS / 1000)}`,
    process.env.NODE_ENV === 'production' ? 'Secure' : '',
  ]
    .filter(Boolean)
    .join('; ');
}
