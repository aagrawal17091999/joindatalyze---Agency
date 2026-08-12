import { createHmac } from 'crypto';

function generateGhostJWT(): string {
  const adminKey = process.env.GHOST_ADMIN_API_KEY;
  if (!adminKey) throw new Error('GHOST_ADMIN_API_KEY is not set');
  const [keyId, secret] = adminKey.split(':');
  if (!keyId || !secret) {
    throw new Error('GHOST_ADMIN_API_KEY must be in "id:secret" format');
  }
  const header = Buffer.from(
    JSON.stringify({ alg: 'HS256', kid: keyId, typ: 'JWT' }),
  ).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(
    JSON.stringify({ iat: now, exp: now + 300, aud: '/admin/' }),
  ).toString('base64url');
  const signingInput = `${header}.${payload}`;
  const secretBytes = Buffer.from(secret, 'hex');
  const sig = createHmac('sha256', secretBytes)
    .update(signingInput)
    .digest('base64url');
  return `${signingInput}.${sig}`;
}

export async function addGhostMember(email: string): Promise<void> {
  if (!process.env.GHOST_ADMIN_API_KEY) return;

  const ghostUrl =
    process.env.GHOST_API_URL || 'https://datalyze.ghost.io';
  const token = generateGhostJWT();

  const res = await fetch(`${ghostUrl}/ghost/api/admin/members/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Ghost ${token}`,
    },
    body: JSON.stringify({ members: [{ email, subscribed: true }] }),
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as {
      errors?: Array<{ message?: string; context?: string }>;
    };
    const err = body.errors?.[0] || {};
    const msg = err.message || '';
    const ctx = err.context || '';
    // 422 "Member already exists" is expected - don't treat as failure.
    if (
      res.status === 422 &&
      (msg + ctx).toLowerCase().includes('already exists')
    ) {
      return;
    }
    throw new Error(
      `Ghost API ${res.status}: ${msg}${ctx ? ` (${ctx})` : ''}`,
    );
  }
}
