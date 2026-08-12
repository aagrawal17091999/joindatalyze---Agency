import { sessionFromRequest } from '@/lib/kb/session';
import { listThreads } from '@/lib/kb/threads';

// Who is this, and what have they asked before?
//
// /ask is a static page, so it can't read the cookie at render time - it asks
// here on mount instead. A 401 is the signal to raise the email gate; a 200
// carries the visitor's threads so history follows the email rather than the
// browser.

export async function GET(request: Request) {
  const session = sessionFromRequest(request);
  if (!session) {
    return Response.json({ authenticated: false }, { status: 401 });
  }

  // History is a convenience. A BigQuery hiccup must not lock someone out of
  // the chat they're already entitled to.
  const threads = await listThreads(session.emailHash).catch((err) => {
    console.error('[ask/session] thread list failed:', err);
    return [];
  });

  return Response.json(
    { authenticated: true, email: session.email, conversations: threads },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
