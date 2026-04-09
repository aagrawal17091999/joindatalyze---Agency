import { createHmac, randomBytes } from 'crypto';

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function secret() {
  return (
    process.env.TOOL_DOWNLOAD_TOKEN_SECRET ||
    'dev-secret-change-in-production'
  );
}

export function generateDownloadToken(email: string, toolId: string): string {
  const payload = `${email}:${toolId}:${Date.now()}:${randomBytes(8).toString('hex')}`;
  const sig = createHmac('sha256', secret()).update(payload).digest('hex');
  return (
    Buffer.from(payload).toString('base64url') + '.' + sig.slice(0, 32)
  );
}

export type VerifiedToken = {
  email: string;
  toolId: string;
};

export function verifyDownloadToken(token: string): VerifiedToken | null {
  const dotIdx = token.lastIndexOf('.');
  if (dotIdx === -1) return null;

  const encodedPayload = token.slice(0, dotIdx);
  const sig = token.slice(dotIdx + 1);

  let payload: string;
  try {
    payload = Buffer.from(encodedPayload, 'base64url').toString('utf8');
  } catch {
    return null;
  }

  const expectedSig = createHmac('sha256', secret())
    .update(payload)
    .digest('hex')
    .slice(0, 32);

  if (sig !== expectedSig) return null;

  const parts = payload.split(':');
  if (parts.length < 4) return null;

  const [email, toolId, timestamp] = parts;
  if (Date.now() - parseInt(timestamp, 10) > TOKEN_TTL_MS) return null;

  return { email, toolId };
}

export function getTokenExpiry(): Date {
  return new Date(Date.now() + TOKEN_TTL_MS);
}
