import { sessionFromRequest } from '@/lib/kb/session';
import { deleteThread, saveThread, type StoredThread } from '@/lib/kb/threads';

// Thread sync. The browser owns the transcript; this mirrors it against the
// email so it survives a cleared cache or a second device.
//
// POST is called once per completed answer, not per token - see lib/kb/threads.ts.

const MAX_TITLE = 200;

function parseThread(value: unknown): StoredThread | null {
  if (!value || typeof value !== 'object') return null;
  const c = value as Record<string, unknown>;
  if (typeof c.id !== 'string' || !c.id) return null;
  if (!Array.isArray(c.turns)) return null;

  const now = Date.now();
  return {
    id: c.id.slice(0, 64),
    title: typeof c.title === 'string' ? c.title.slice(0, MAX_TITLE) : 'Chat',
    createdAt: typeof c.createdAt === 'number' ? c.createdAt : now,
    updatedAt: typeof c.updatedAt === 'number' ? c.updatedAt : now,
    turns: c.turns,
  };
}

export async function POST(request: Request) {
  const session = sessionFromRequest(request);
  if (!session) return Response.json({ error: 'email_required' }, { status: 401 });

  let body: { conversation?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const thread = parseThread(body.conversation);
  if (!thread) return Response.json({ error: 'Invalid conversation' }, { status: 400 });
  // An empty thread is a UI placeholder, not history worth a row.
  if (thread.turns.length === 0) return Response.json({ ok: true, skipped: true });

  try {
    await saveThread(session.emailHash, thread);
  } catch (err) {
    if (err instanceof Error && err.message === 'transcript_too_large') {
      return Response.json({ error: 'Conversation too large to save.' }, { status: 413 });
    }
    console.error('[ask/conversations] save failed:', err);
    return Response.json({ error: 'save_failed' }, { status: 500 });
  }

  return Response.json({ ok: true });
}

export async function DELETE(request: Request) {
  const session = sessionFromRequest(request);
  if (!session) return Response.json({ error: 'email_required' }, { status: 401 });

  const id = new URL(request.url).searchParams.get('id');
  if (!id) return Response.json({ error: 'id is required' }, { status: 400 });

  try {
    // Scoped by email_hash, so an id guessed from another visitor deletes nothing.
    await deleteThread(session.emailHash, id);
  } catch (err) {
    console.error('[ask/conversations] delete failed:', err);
    return Response.json({ error: 'delete_failed' }, { status: 500 });
  }

  return Response.json({ ok: true });
}
