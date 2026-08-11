'use client';

// Conversation persistence.
//
// Two layers, on purpose:
//   - localStorage is the fast path. It renders instantly on load, survives a
//     refresh, and works while the network is doing nothing useful.
//   - BigQuery (via /api/ask/conversations) is the durable copy, keyed by email
//     hash, so history follows the person rather than the browser.
//
// The server is authoritative on conflict — see mergeConversations. Local-only
// threads are pushed up the moment an email exists to attach them to.

export type Source = {
  docId: string;
  title: string;
  url: string | null;
  sourceType: string;
  publishedAt: string | null;
};

export type Turn = {
  question: string;
  text: string;
  sources: Source[];
  citedDocIds: string[];
  refusal: { reason: string; nearest: Source | null } | null;
  error: string | null;
  streaming: boolean;
};

export type Conversation = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  turns: Turn[];
};

const KEY = 'ask.conversations.v1';
const ACTIVE_KEY = 'ask.activeConversation.v1';
const MAX_CONVERSATIONS = 50;

export function newId(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `c${Date.now()}${Math.random().toString(36).slice(2, 8)}`;
}

export function emptyConversation(): Conversation {
  const now = Date.now();
  return { id: newId(), title: 'New chat', createdAt: now, updatedAt: now, turns: [] };
}

/** First question, trimmed to something that fits a sidebar row. */
export function titleFor(question: string): string {
  const clean = question.replace(/\s+/g, ' ').trim();
  return clean.length > 48 ? `${clean.slice(0, 47)}…` : clean || 'New chat';
}

export function loadConversations(): Conversation[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // A half-written record from an interrupted stream must not come back
    // still claiming to be streaming — nothing is going to finish it.
    return parsed
      .filter((c): c is Conversation => !!c && typeof c.id === 'string' && Array.isArray(c.turns))
      .map((c) => ({ ...c, turns: c.turns.map((t) => ({ ...t, streaming: false })) }));
  } catch {
    return [];
  }
}

export function saveConversations(conversations: Conversation[]): void {
  if (typeof window === 'undefined') return;
  try {
    // Never persist an in-flight turn as in-flight, and cap the history so a
    // heavy user can't fill the origin's storage quota.
    const trimmed = conversations
      .slice(0, MAX_CONVERSATIONS)
      .map((c) => ({ ...c, turns: c.turns.map((t) => ({ ...t, streaming: false })) }));
    window.localStorage.setItem(KEY, JSON.stringify(trimmed));
  } catch {
    // Quota or private mode. History is a nicety; losing it is not an error.
  }
}

/**
 * Fold the server's threads into the local ones.
 *
 * Same id on both sides: whichever was updated last wins, because the only way
 * that happens is the same person on two devices and the later edit is the one
 * they'd expect to see. Different ids: keep both — a thread started before the
 * email was given is still theirs.
 */
export function mergeConversations(
  local: Conversation[],
  remote: Conversation[],
): Conversation[] {
  const byId = new Map<string, Conversation>();

  for (const c of local) byId.set(c.id, c);
  for (const c of remote) {
    const mine = byId.get(c.id);
    if (!mine || (c.updatedAt ?? 0) > (mine.updatedAt ?? 0)) byId.set(c.id, c);
  }

  return [...byId.values()]
    .map((c) => ({ ...c, turns: c.turns.map((t) => ({ ...t, streaming: false })) }))
    .sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
}

export function loadActiveId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(ACTIVE_KEY);
  } catch {
    return null;
  }
}

export function saveActiveId(id: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (id) window.localStorage.setItem(ACTIVE_KEY, id);
    else window.localStorage.removeItem(ACTIVE_KEY);
  } catch {
    /* ignore */
  }
}
