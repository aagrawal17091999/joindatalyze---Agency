'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { track } from '@/lib/mixpanel';
import { Markdown } from './markdown';
import {
  emptyConversation,
  loadActiveId,
  loadConversations,
  mergeConversations,
  saveActiveId,
  saveConversations,
  titleFor,
  type Conversation,
  type Source,
  type Turn,
} from './conversations';
import styles from './Ask.module.css';

// The chat surface.
//
// Reads the NDJSON stream from /api/ask. States worth naming:
//   - authed    : null until /api/ask/session answers; false raises the gate
//   - streaming : text arriving, cancellable
//   - blocked   : an abuse limit fired (per-IP or global), not a per-user quota
//
// A refusal is rendered with the same type, spacing and CTA as an answer — the
// only difference is the absence of citation chips. See Ask.module.css.
//
// History is local-first and mirrored to BigQuery; see ./conversations.ts.

const STARTERS = [
  'How do I set up Mixpanel the right way?',
  'What should be in an event tracking plan?',
  'How do I measure retention properly?',
  'Why do my conversions look too good?',
  'How much does this cost?',
];

const CALENDLY = '/contact?source=ask';

/** Copy is per-reason: a flat "I don't know" reads worse than naming the gap. */
function refusalCopy(reason: string): { lead: string; body: string } {
  switch (reason) {
    case 'pricing_blocked':
    case 'insufficient_context':
      return {
        lead: "I haven't written about that.",
        body: "I only answer from what I've actually published, and this isn't in there.",
      };
    case 'not_calibrated':
      return {
        lead: 'This is still being calibrated.',
        body: "I'd rather say nothing than guess while the retrieval is being tuned.",
      };
    case 'bad_citation':
    case 'ungrounded_figure':
      return {
        lead: "I started an answer I couldn't stand behind.",
        body: "It didn't trace cleanly back to something I've written, so I stopped it.",
      };
    default:
      return {
        lead: "I haven't written about that.",
        body: "I only answer from my own writing, and this one isn't covered.",
      };
  }
}

/** The abuse limits are shared, not personal — say so rather than blaming the visitor. */
function blockedCopy(reason: string): string {
  if (reason === 'ip_cap') {
    return "That's a lot of questions from one place today. The counter resets at midnight UTC — or book a call and skip the queue.";
  }
  return "I've hit today's ceiling on answers across everyone. Try again tomorrow, or book a call.";
}

export default function AskChat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  /** null while /api/ask/session is in flight — the gate only shows on a real false. */
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [held, setHeld] = useState<{ question: string; conversationId: string } | null>(null);
  const [email, setEmail] = useState('');
  const [gateBusy, setGateBusy] = useState(false);
  const [gateError, setGateError] = useState<string | null>(null);
  const [blocked, setBlocked] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  // Hard re-entry guard. The gate button being double-clicked is what found
  // this, but any second caller would have raced the same way: two runs append
  // two turns and both then patch "the last turn", so one stream writes into
  // the other's bubble and neither ever finishes.
  const runningRef = useRef(false);
  /** conversation id -> updatedAt already mirrored to BigQuery. */
  const pushedRef = useRef(new Map<string, number>());
  // Only follow the stream while the reader is already at the bottom — yanking
  // someone back down while they're re-reading an earlier answer is hostile.
  const stickRef = useRef(true);

  // --- persistence ----------------------------------------------------------

  /** Pull the server's threads and fold them in. Safe to call more than once. */
  const pullThreads = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/ask/session', { cache: 'no-store' });
      if (res.status === 401) return false;
      if (!res.ok) return true; // Cookie may still be good; let /api/ask decide.

      const data = await res.json();
      const remote: Conversation[] = Array.isArray(data.conversations)
        ? data.conversations
        : [];
      // Anything that came from the server is already stored there — record it
      // so the sync effect below doesn't immediately write it back.
      for (const c of remote) pushedRef.current.set(c.id, c.updatedAt ?? 0);
      if (remote.length) setConversations((prev) => mergeConversations(prev, remote));
      return true;
    } catch {
      // Offline or a blocked request. Don't gate someone who may well have a
      // valid cookie — the answer endpoint gates for real.
      return true;
    }
  }, []);

  useEffect(() => {
    const stored = loadConversations();
    const wanted = loadActiveId();
    const seed = stored.length ? stored : [emptyConversation()];
    setConversations(seed);
    setActiveId(seed.some((c) => c.id === wanted) ? wanted : seed[0].id);
    setHydrated(true);

    let cancelled = false;
    void pullThreads().then((ok) => {
      if (!cancelled) setAuthed(ok);
    });
    return () => {
      cancelled = true;
    };
  }, [pullThreads]);

  // Mirror finished threads to BigQuery so history follows the email rather
  // than the browser. Deliberately not during streaming: one write per answer,
  // not one per token.
  useEffect(() => {
    if (!hydrated || busy || authed !== true) return;
    for (const c of conversations) {
      if (c.turns.length === 0) continue;
      if (pushedRef.current.get(c.id) === c.updatedAt) continue;
      pushedRef.current.set(c.id, c.updatedAt);
      void fetch('/api/ask/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation: c }),
      }).catch(() => {
        // A failed mirror costs cross-device history, not this session.
        pushedRef.current.delete(c.id);
      });
    }
  }, [hydrated, busy, authed, conversations]);

  // Debounced: this effect fires on every streamed token, and serialising the
  // whole history per token is real work on a long thread.
  useEffect(() => {
    if (!hydrated) return;
    const t = setTimeout(() => {
      saveConversations(conversations);
      saveActiveId(activeId);
    }, 400);
    return () => clearTimeout(t);
  }, [hydrated, conversations, activeId]);

  const active = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? null,
    [conversations, activeId],
  );
  const turns = active?.turns ?? [];

  // --- scrolling ------------------------------------------------------------

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || !stickRef.current) return;
    el.scrollTop = el.scrollHeight;
  }, [turns, activeId]);

  const onScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    stickRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  }, []);

  // Grow the composer with its content, up to a ceiling.
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [input]);

  // --- asking ---------------------------------------------------------------

  const runQuestion = useCallback(async (
    conversationId: string,
    question: string,
    priorTurns: number,
  ) => {
    if (runningRef.current) return;
    runningRef.current = true;
    setBusy(true);
    stickRef.current = true;

    const patch = (fn: (t: Turn) => Turn) =>
      setConversations((prev) =>
        prev.map((c) =>
          c.id !== conversationId
            ? c
            : {
                ...c,
                updatedAt: Date.now(),
                turns: c.turns.map((t, i) => (i === c.turns.length - 1 ? fn(t) : t)),
              },
        ),
      );

    const dropLastTurn = () =>
      setConversations((prev) =>
        prev.map((c) => (c.id !== conversationId ? c : { ...c, turns: c.turns.slice(0, -1) })),
      );

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== conversationId) return c;
        return {
          ...c,
          title: c.turns.length === 0 ? titleFor(question) : c.title,
          updatedAt: Date.now(),
          turns: [
            ...c.turns,
            {
              question,
              text: '',
              sources: [],
              citedDocIds: [],
              refusal: null,
              error: null,
              streaming: true,
            },
          ],
        };
      }),
    );

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, sessionId: conversationId }),
        signal: controller.signal,
      });

      if (res.status === 401) {
        // Session expired or was never minted — hold the question behind the gate.
        dropLastTurn();
        setHeld({ question, conversationId });
        setAuthed(false);
        return;
      }
      if (res.status === 429) {
        const data = await res.json().catch(() => ({}));
        dropLastTurn();
        setBlocked(blockedCopy(typeof data.error === 'string' ? data.error : 'daily_cap'));
        track('Ask AI Quota Reached', { questions_asked: priorTurns });
        return;
      }
      if (!res.ok || !res.body) throw new Error('request failed');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      // NDJSON: one JSON event per line. Hold the trailing partial line.
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.trim()) continue;
          const event = JSON.parse(line);

          if (event.type === 'answer_start') {
            patch((t) => ({ ...t, sources: event.sources }));
          } else if (event.type === 'text') {
            patch((t) => ({ ...t, text: t.text + event.text }));
          } else if (event.type === 'refusal') {
            // A late refusal REPLACES anything already streamed — the server can
            // retract an answer it couldn't validate, but it can't un-send it.
            patch((t) => ({
              ...t,
              text: '',
              sources: [],
              refusal: { reason: event.reason, nearest: event.nearest },
            }));
            track('Ask AI Refused', { refusal_reason: event.reason });
          } else if (event.type === 'error') {
            patch((t) => ({ ...t, error: event.message }));
          } else if (event.type === 'done') {
            patch((t) => ({ ...t, citedDocIds: event.citedDocIds, streaming: false }));
          }
        }
      }
    } catch (err) {
      // A stop is not a failure — keep whatever streamed and say nothing.
      if (!(err instanceof DOMException && err.name === 'AbortError')) {
        patch((t) => ({ ...t, error: 'Something broke on my end. Try again in a moment.' }));
      }
    } finally {
      patch((t) => ({ ...t, streaming: false }));
      abortRef.current = null;
      runningRef.current = false;
      setBusy(false);
    }
  }, []);

  const submit = useCallback(
    (raw?: string) => {
      const question = (raw ?? input).trim();
      if (!question || busy || !active) return;
      setInput('');
      track('Ask AI Question Submitted', {
        question_length: question.length,
        is_first_question: active.turns.length === 0,
      });
      void runQuestion(active.id, question, active.turns.length);
    },
    [input, busy, active, runQuestion],
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  // --- conversation management ---------------------------------------------

  const newChat = useCallback(() => {
    if (busy) return;
    setSidebarOpen(false);

    // An untouched chat is already a new chat — don't stack empties.
    const existingEmpty = conversations.find((c) => c.turns.length === 0);
    if (existingEmpty) {
      setActiveId(existingEmpty.id);
    } else {
      const fresh = emptyConversation();
      setConversations((prev) => [fresh, ...prev]);
      setActiveId(fresh.id);
    }

    stickRef.current = true;
    track('Ask AI New Chat', {});
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [busy, conversations]);

  const openChat = useCallback(
    (id: string) => {
      if (busy) return;
      setActiveId(id);
      setSidebarOpen(false);
      stickRef.current = true;
    },
    [busy],
  );

  const deleteChat = useCallback(
    (id: string) => {
      if (busy) return;

      pushedRef.current.delete(id);
      if (authed) {
        void fetch(`/api/ask/conversations?id=${encodeURIComponent(id)}`, {
          method: 'DELETE',
        }).catch(() => {
          // Gone locally either way; the server copy is soft-deleted on retry.
        });
      }

      const next = conversations.filter((c) => c.id !== id);
      if (next.length === 0) {
        // The sidebar is never empty — deleting the last chat starts a fresh one.
        const fresh = emptyConversation();
        setConversations([fresh]);
        setActiveId(fresh.id);
        return;
      }
      setConversations(next);
      if (activeId === id) setActiveId(next[0].id);
    },
    [busy, conversations, activeId, authed],
  );

  const submitEmail = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      // The button is disabled while this runs, but a second submit can still
      // arrive from the Enter key before React repaints — hence the guard.
      if (gateBusy) return;
      setGateBusy(true);
      setGateError(null);
      const pending = held;

      try {
        const res = await fetch('/api/ask/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, question: pending?.question }),
        });
        const data = await res.json();
        if (!res.ok) {
          setGateError(data.error ?? 'That didn’t work. Try again.');
          return;
        }

        track('Ask AI Email Submitted', {});
        setHeld(null);
        setAuthed(true);
        // A returning visitor gets their threads back here, before anything else.
        await pullThreads();
        if (pending) void runQuestion(pending.conversationId, pending.question, 0);
        else setTimeout(() => inputRef.current?.focus(), 0);
      } catch {
        setGateError('That didn’t work. Try again.');
      } finally {
        setGateBusy(false);
      }
    },
    [email, gateBusy, held, pullThreads, runQuestion],
  );

  const empty = turns.length === 0;

  return (
    <div className={styles.app}>
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <button type="button" className={styles.newChat} onClick={newChat} disabled={busy}>
          <span aria-hidden="true">+</span> New chat
        </button>

        <div className={styles.historyLabel}>Chats</div>
        <nav className={styles.history}>
          {conversations.map((c) => (
            <div
              key={c.id}
              className={`${styles.historyRow} ${c.id === activeId ? styles.historyActive : ''}`}
            >
              <button
                type="button"
                className={styles.historyButton}
                onClick={() => openChat(c.id)}
                title={c.title}
              >
                {c.title}
              </button>
              <button
                type="button"
                className={styles.historyDelete}
                aria-label={`Delete ${c.title}`}
                onClick={() => deleteChat(c.id)}
              >
                ×
              </button>
            </div>
          ))}
        </nav>

        <p className={styles.sidebarNote}>
          Chats are saved against your email, so they come back on any device.
        </p>
      </aside>

      {sidebarOpen && (
        <button
          type="button"
          className={styles.scrim}
          aria-label="Close chat history"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={styles.main}>
        <div className={styles.topbar}>
          <button
            type="button"
            className={styles.iconButton}
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Chat history"
          >
            ☰
          </button>
          <span className={styles.topbarTitle}>{active?.title ?? 'Ask Ansh'}</span>
          <button
            type="button"
            className={styles.iconButton}
            onClick={newChat}
            aria-label="New chat"
          >
            +
          </button>
        </div>

        <div className={styles.scroller} ref={scrollerRef} onScroll={onScroll}>
          <div className={styles.thread}>
            {empty ? (
              <div className={styles.welcome}>
                <div className="eyebrow">Ask Ansh</div>
                <h1 className={styles.title}>
                  Ask me anything about <em>analytics</em>
                </h1>
                <p className={styles.lede}>
                  Every answer comes from something I&apos;ve actually written — 460+ posts,
                  blog pieces and case studies. If I haven&apos;t covered it, you&apos;ll get a
                  straight no and a link to book time instead of a confident guess.
                </p>
                <div className={styles.starters}>
                  {STARTERS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={styles.starter}
                      onClick={() => submit(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              turns.map((turn, i) => (
                <div key={i} className={styles.exchange}>
                  <div className={styles.userRow}>
                    <p className={styles.bubble}>{turn.question}</p>
                  </div>

                  <div className={styles.assistantRow}>
                    <div className={styles.avatar} aria-hidden="true">
                      A
                    </div>
                    <div className={styles.assistant}>
                      {turn.refusal ? (
                        <Refusal turn={turn} />
                      ) : turn.error ? (
                        <p className={`${styles.answer} ${styles.error}`}>{turn.error}</p>
                      ) : turn.streaming && !turn.text ? (
                        <div className={styles.thinking} aria-label="Thinking">
                          <span />
                          <span />
                          <span />
                        </div>
                      ) : (
                        <>
                          <div className={styles.answer}>
                            <Markdown text={turn.text} />
                            {turn.streaming && (
                              <span className={styles.cursor} aria-hidden="true" />
                            )}
                          </div>
                          {!turn.streaming && turn.text && (
                            <>
                              <Chips sources={turn.sources} cited={turn.citedDocIds} />
                              <BookCta label="Want this applied to your stack?" />
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}

            {blocked && (
              <div className={styles.notice}>
                <p>{blocked}</p>
                <BookCta label="Or skip ahead —" />
              </div>
            )}
          </div>
        </div>

        <div className={styles.composer}>
          <div className={styles.field}>
            <textarea
              ref={inputRef}
              className={styles.input}
              value={input}
              maxLength={500}
              rows={1}
              placeholder="Ask about analytics, tracking, retention, attribution…"
              disabled={!!blocked}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
            />
            {busy ? (
              <button
                type="button"
                className={styles.send}
                onClick={stop}
                aria-label="Stop generating"
              >
                <span className={styles.stopIcon} aria-hidden="true" />
              </button>
            ) : (
              <button
                type="button"
                className={styles.send}
                onClick={() => submit()}
                disabled={!!blocked || !input.trim()}
                aria-label="Send question"
              >
                ↑
              </button>
            )}
          </div>
          <div className={styles.meta}>
            <span>Answers come only from what Ansh has published. No answer beats a wrong one.</span>
            <span className={styles.metaHint}>Enter to send · Shift+Enter for a new line</span>
          </div>
        </div>
      </div>

      {authed === false && (
        <div className={styles.overlay} role="dialog" aria-modal="true">
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>
              {held ? 'Where should I send the good stuff?' : 'Your email, then ask away'}
            </h2>
            <p className={styles.modalBody}>
              {held
                ? "Drop your email and I'll answer — then ask as much as you like."
                : 'One email unlocks unlimited questions, and brings back every chat you’ve had with me before — on any device.'}{' '}
              I&apos;ll add you to the list too; unsubscribe whenever.
            </p>
            <form className={styles.modalForm} onSubmit={submitEmail}>
              <input
                className={styles.input}
                type="email"
                required
                autoFocus
                disabled={gateBusy}
                value={email}
                placeholder="you@company.com"
                onChange={(e) => setEmail(e.target.value)}
              />
              {gateError && <p className={styles.error}>{gateError}</p>}
              <button type="submit" className="btn-primary" disabled={gateBusy}>
                {gateBusy ? 'One moment…' : held ? 'Ask my question' : 'Start asking'}
              </button>
            </form>
            {/* The gate covers the nav, so it needs its own way out. */}
            <p className={styles.modalExit}>
              <Link href="/">Back to the site</Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function Refusal({ turn }: { turn: Turn }) {
  const copy = refusalCopy(turn.refusal!.reason);
  const nearest = turn.refusal!.nearest;

  return (
    <div className={styles.refusal}>
      <p>
        <span className={styles.refusalLead}>{copy.lead}</span> {copy.body}
      </p>
      {nearest && (
        <p style={{ marginTop: 'var(--space-3)' }}>
          Closest thing I have:{' '}
          {nearest.url ? (
            <a
              href={nearest.url}
              className={styles.chip}
              onClick={() =>
                track('Ask AI Citation Clicked', {
                  source_type: nearest.sourceType,
                  source_url: nearest.url,
                })
              }
            >
              <span className={styles.chipLabel}>{nearest.title}</span>
            </a>
          ) : (
            <em>{nearest.title}</em>
          )}{' '}
          — though that&apos;s not quite what you asked.
        </p>
      )}
      <BookCta label="Want a straight answer on this?" afterRefusal />
    </div>
  );
}

function Chips({ sources, cited }: { sources: Source[]; cited: string[] }) {
  // Show only what the model actually cited, not everything retrieved.
  const shown = sources.filter((s) => cited.includes(s.docId));
  if (!shown.length) return null;

  return (
    <div className={styles.sources}>
      {shown.map((s) =>
        s.url ? (
          <a
            key={s.docId}
            href={s.url}
            className={styles.chip}
            onClick={() =>
              track('Ask AI Citation Clicked', { source_type: s.sourceType, source_url: s.url })
            }
          >
            <span className={styles.chipLabel}>{s.title}</span>
          </a>
        ) : (
          <span key={s.docId} className={`${styles.chip} ${styles.chipInternal}`}>
            <span className={styles.chipLabel}>from my notes</span>
          </span>
        ),
      )}
    </div>
  );
}

function BookCta({ label, afterRefusal = false }: { label: string; afterRefusal?: boolean }) {
  return (
    <p className={styles.cta}>
      <span style={{ color: 'var(--text-muted)' }}>{label} </span>
      <Link
        href={CALENDLY}
        className="btn-link"
        onClick={() => track('Ask AI Booking Clicked', { after_refusal: afterRefusal })}
      >
        Book a call
      </Link>
    </p>
  );
}
