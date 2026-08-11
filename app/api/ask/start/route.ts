import { after } from 'next/server';
import { addGhostMember } from '@/lib/api/ghost';
import { mintSession, sessionCookie } from '@/lib/kb/session';
import { getQuota, upsertUser } from '@/lib/kb/users';

// The email gate.
//
// Trades an email for access to the chat. Reuses addGhostMember() so every
// visitor also becomes a newsletter subscriber — the function already exists
// and already swallows the 422-already-exists case.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: { email?: unknown; question?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const email =
    typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const firstQuestion =
    typeof body.question === 'string' ? body.question.trim().slice(0, 500) : null;

  if (!EMAIL_RE.test(email)) {
    return Response.json({ error: 'That email doesn’t look right.' }, { status: 400 });
  }

  const { token, session } = mintSession(email);

  try {
    await upsertUser({
      userId: session.userId,
      email,
      emailHash: session.emailHash,
      referrer: request.headers.get('referer'),
      firstQuestion,
    });
  } catch (err) {
    console.error('[ask/start] user upsert failed:', err);
    return Response.json(
      { error: 'Something broke on my end. Try again in a moment.' },
      { status: 500 },
    );
  }

  // Quota is read AFTER the upsert so a returning visitor with a cleared cookie
  // gets their real remaining count, not a fresh 3.
  const quota = await getQuota(session.emailHash).catch(() => null);

  // Newsletter signup is a side effect, not a precondition — a Ghost outage
  // must never block access to the chat. addGhostMember throws on non-422
  // errors, so it runs after the response is committed.
  after(async () => {
    try {
      await addGhostMember(email);
    } catch (err) {
      console.error('[ask/start] Ghost member creation failed:', err);
    }
  });

  return Response.json(
    { ok: true, remaining: quota?.remaining ?? null, limit: quota?.limit ?? null },
    { headers: { 'Set-Cookie': sessionCookie(token) } },
  );
}
