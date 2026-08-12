import { after } from 'next/server';
import { loadCorpus, retrieveAndRerank, type Corpus } from '@/lib/kb/retrieve';
import { embedQuery, EMBEDDING_MODEL } from '@/lib/kb/embed';
import {
  evaluateGate,
  validateAnswer,
  GATE_CONFIG,
  type RefusalReason,
} from '@/lib/kb/gate';
import { streamAnswer, ANSWER_MODEL } from '@/lib/kb/answer';
import { logQuery } from '@/lib/kb/log';
import { sessionFromRequest } from '@/lib/kb/session';
import { getQuota, recordOutcome, recordQuestion } from '@/lib/kb/users';
import { checkLimits, hashIp, readCache, writeCache } from '@/lib/kb/limits';
import type { ScoredDocument } from '@/lib/kb/retrieve';

// Ask Ansh's AI - the serving endpoint.
//
// Node runtime (the default here, and required: @google-cloud/bigquery is
// gRPC-native and `after()` is Node-only). Streams NDJSON rather than SSE -
// the client is our own fetch reader, not EventSource, so a line-delimited
// JSON protocol is simpler and carries structured events natively.
//
// Flow: embed -> hybrid search -> rerank -> GATE -> generate -> validate -> log.
// Every stage that can't be evaluated refuses rather than passes.

// Generous because generation streams and a cold instance also loads the
// corpus. Measured: ~7.7s cold, ~5.8s warm end to end.
export const maxDuration = 120;

const MAX_QUESTION_CHARS = 500;

/**
 * The corpus is cached at module scope so warm Fluid Compute invocations reuse
 * it - the same reasoning as the BigQuery client in lib/api/bigquery.ts. At
 * ~957 chunks this is a few MB and loads in a second or two on a cold start.
 *
 * The in-flight promise is cached too, so concurrent cold requests trigger one
 * load rather than N.
 */
let corpusPromise: Promise<Corpus> | null = null;
function getCorpus(): Promise<Corpus> {
  if (!corpusPromise) {
    corpusPromise = loadCorpus().catch((err) => {
      // Don't cache a failure - the next request should retry.
      corpusPromise = null;
      throw err;
    });
  }
  return corpusPromise;
}

type Event =
  | { type: 'answer_start'; sources: PublicSource[] }
  | { type: 'text'; text: string }
  | { type: 'refusal'; reason: RefusalReason; nearest: PublicSource | null }
  | { type: 'done'; citedDocIds: string[]; remaining: number | null }
  | { type: 'error'; message: string };

type PublicSource = {
  docId: string;
  title: string;
  /** Null for internal notes - the UI renders those unlinked, as "from my notes". */
  url: string | null;
  sourceType: string;
  publishedAt: string | null;
};

function toPublicSource(d: ScoredDocument): PublicSource {
  return {
    docId: d.document.docId,
    title: d.document.title,
    url: d.document.sourceUrl,
    sourceType: d.document.sourceType,
    publishedAt: d.document.publishedAt?.toISOString().slice(0, 10) ?? null,
  };
}

export async function POST(request: Request) {
  const started = Date.now();

  let body: { question?: unknown; sessionId?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const question = typeof body.question === 'string' ? body.question.trim() : '';
  const sessionId = typeof body.sessionId === 'string' ? body.sessionId : null;
  const referrer = request.headers.get('referer');

  // --- gate: identity, then quota -------------------------------------------
  const session = sessionFromRequest(request);
  if (!session) {
    return Response.json({ error: 'email_required' }, { status: 401 });
  }

  // Layered controls, cheapest first. With the per-email cap off by default,
  // these ARE the cost control: the email proves a human bothered to give an
  // address, the caps below bound what any one of them can spend.
  const ipHash = hashIp(request);
  const limits = await checkLimits(ipHash);
  if (!limits.allowed) {
    return Response.json(
      { error: limits.reason },
      { status: 429, headers: { 'Retry-After': String(limits.retryAfterSeconds) } },
    );
  }

  const quota = await getQuota(session.emailHash);
  if (quota.exhausted) {
    return Response.json(
      { error: 'quota_exhausted', asked: quota.asked, limit: quota.limit },
      { status: 429 },
    );
  }

  if (!question) {
    return Response.json({ error: 'A question is required.' }, { status: 400 });
  }
  // Enforced server-side, not just in the UI: this is the cheap defence against
  // pasted documents and prompt-injection payloads.
  if (question.length > MAX_QUESTION_CHARS) {
    return Response.json(
      { error: `Questions are limited to ${MAX_QUESTION_CHARS} characters.` },
      { status: 400 },
    );
  }

  // Count the question BEFORE doing the work. A visitor who disconnects
  // mid-answer has still consumed it; incrementing afterwards would hand out
  // free questions to anyone who closes the tab.
  await recordQuestion(session.emailHash, question);

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: Event) => {
        controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
      };

      // Captured for the log row regardless of which path we take.
      let answered = false;
      let refusalReason: RefusalReason | null = null;
      let retrieved: ScoredDocument[] = [];
      let citedDocIds: string[] = [];
      let topScore: number | null = null;
      let scoreGap: number | null = null;
      let scoresTop5: number[] = [];
      let outputTokens: number | null = null;
      let corpus: Corpus | null = null;
      // Null when the per-email cap is off, which is the default - the UI shows
      // no counter in that case rather than an invented one.
      const remainingAfter = quota.remaining === null ? null : Math.max(0, quota.remaining - 1);
      let cacheHit = false;
      const timing: {
        corpusMs?: number;
        embedMs?: number;
        searchMs?: number;
        generationMs?: number;
      } = {};

      try {
        // Timed explicitly: on a cold start this dominates everything else, and
        // an untimed step is an invisible one.
        const corpusStart = Date.now();
        corpus = await getCorpus();
        timing.corpusMs = Date.now() - corpusStart;

        // Cache lookup happens AFTER the corpus loads because the key is
        // invalidated by index_version - a cached answer must never outlive
        // the content it cited.
        const cached = readCache(question, corpus.indexVersion);
        if (cached) {
          cacheHit = true;
          if (cached.refusal) {
            refusalReason = cached.refusal.reason as RefusalReason;
            send({
              type: 'refusal',
              reason: refusalReason,
              nearest: cached.refusal.nearest as PublicSource | null,
            });
          } else {
            answered = true;
            citedDocIds = cached.citedDocIds;
            send({ type: 'answer_start', sources: cached.sources as PublicSource[] });
            send({ type: 'text', text: cached.text });
          }
          send({ type: 'done', citedDocIds, remaining: remainingAfter });
          controller.close();
          return;
        }

        const embedStart = Date.now();
        const queryEmbedding = await embedQuery(question);
        timing.embedMs = Date.now() - embedStart;

        const searchStart = Date.now();
        const { documents, scoreKind } = await retrieveAndRerank(corpus, question, {
          queryEmbedding,
        });
        timing.searchMs = Date.now() - searchStart;
        retrieved = documents;

        const decision = evaluateGate(documents, GATE_CONFIG, scoreKind);
        topScore = decision.topScore;
        scoreGap = decision.scoreGap;
        scoresTop5 = decision.scoresTop5;

        if (!decision.answer) {
          refusalReason = decision.reason;
          const nearest = decision.nearest ? toPublicSource(decision.nearest) : null;
          send({ type: 'refusal', reason: decision.reason, nearest });
          writeCache(
            question,
            { text: '', sources: [], citedDocIds: [], refusal: { reason: decision.reason, nearest } },
            corpus.indexVersion,
          );
          send({ type: 'done', citedDocIds: [], remaining: remainingAfter });
          controller.close();
          return;
        }

        const genStart = Date.now();
        let full = '';
        let insufficient = false;
        let announced = false;

        for await (const chunk of streamAnswer(question, decision.documents)) {
          if (chunk.type === 'text') {
            // Announce sources on the FIRST text chunk, not before generation.
            // The model can still decline after passing the gate, and a
            // response that turns out to be a refusal must never flash source
            // chips the user then sees retracted.
            if (!announced) {
              announced = true;
              send({ type: 'answer_start', sources: decision.documents.map(toPublicSource) });
            }
            send({ type: 'text', text: chunk.text });
            continue;
          }
          full = chunk.answer;
          citedDocIds = chunk.citedDocIds;
          insufficient = chunk.insufficient;
          outputTokens = chunk.outputTokens;
        }
        timing.generationMs = Date.now() - genStart;

        // Post-generation validation: citations must exist in the retrieved set,
        // and every currency figure must be quoted from context. Deterministic,
        // free, and it runs on every answer.
        const validation = validateAnswer(
          { answer: full, citedDocIds, insufficientContext: insufficient },
          decision.documents,
        );

        if (!validation.valid) {
          // The answer already streamed to the client. That is a real limitation
          // of streaming a validated answer: we can retract, not un-send. The UI
          // must treat a late `refusal` as replacing whatever it rendered.
          refusalReason = validation.reason;
          citedDocIds = [];
          send({
            type: 'refusal',
            reason: validation.reason,
            nearest: decision.documents[0] ? toPublicSource(decision.documents[0]) : null,
          });
          send({ type: 'done', citedDocIds: [], remaining: remainingAfter });
          controller.close();
          return;
        }

        answered = true;
        writeCache(
          question,
          {
            text: full,
            sources: decision.documents.map(toPublicSource),
            citedDocIds,
            refusal: null,
          },
          corpus.indexVersion,
        );
        send({ type: 'done', citedDocIds, remaining: remainingAfter });
        controller.close();
      } catch (err) {
        console.error('[ask] failed:', err);
        refusalReason = refusalReason ?? 'no_results';
        send({
          type: 'error',
          message: 'Something broke on my end. Try again in a moment.',
        });
        controller.close();
      } finally {
        const totalMs = Date.now() - started;
        // after() so logging never delays the response - and so it still runs
        // when the client disconnects mid-stream.
        after(async () => {
          try {
            await logQuery({
              question,
              emailHash: session.emailHash,
              sessionId,
              answered,
              refusalReason,
              topScore,
              scoreGap,
              scoresTop5,
              retrievedChunkIds: retrieved.map((d) => d.bestChunk.chunkId),
              citedDocIds,
              sourceTiers: retrieved.map((d) => d.document.sourceTier),
              latency: { ...timing, totalMs },
              cacheHit,
              model: ANSWER_MODEL,
              embeddingModel: corpus?.embeddingModel ?? EMBEDDING_MODEL,
              indexVersion: corpus?.indexVersion ?? null,
              tau: GATE_CONFIG.tau,
              delta: GATE_CONFIG.delta,
              inputTokens: null,
              outputTokens,
              questionIndexInSession: quota.asked + 1,
              referrer,
              ipHash,
            });
            await recordOutcome(session.emailHash, answered);
          } catch (err) {
            // A logging failure must never surface to the user, but it should
            // be visible - a silently broken query log is a silently lost
            // content roadmap.
            console.error('[ask] query log failed:', err);
          }
        });
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Cache-Control': 'no-store',
      // Streaming responses must not be buffered by an intermediary.
      'X-Accel-Buffering': 'no',
    },
  });
}
