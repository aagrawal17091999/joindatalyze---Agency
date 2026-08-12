import type { PreparedDocument, RunMode, SourceResult } from './types';
import { fetchGhostDocuments } from './sources/ghost';
import { fetchGdocDocuments, type ExcludedBlock } from './sources/gdoc';
import { fetchLinkedInDocuments, hasApifyToken } from './sources/linkedin';
import { assertNoPricingLeaks, prepareAll, type PreparedResult } from './prepare';
import { embedChunks, hasVoyageKey, EMBEDDING_MODEL } from './embed';
import { publishArtifact } from './publish';
import {
  assertSourceNotCollapsed,
  findChunkCountDrift,
  loadDocumentHashes,
  reconcileDeletes,
  replaceChunks,
  upsertDocuments,
} from './store';

export type BuildOptions = {
  /** Report only; touch nothing. */
  dryRun?: boolean;
  /** Ignore content hashes and rebuild every document. */
  force?: boolean;
  /** Skip the Voyage call and write chunks with a NULL embedding. */
  skipEmbedding?: boolean;
  /**
   * Only `full` runs reconcile deletes. An incremental LinkedIn pull returns a
   * recent slice, so treating everything it didn't return as deleted would
   * tombstone the entire back catalogue. See lib/kb/sources/linkedin.ts.
   */
  linkedinRunMode?: RunMode;
  onLog?: (line: string) => void;
};

export type BuildReport = {
  indexVersion: string;
  sources: Array<{
    sourceType: string;
    fetched: number;
    unchanged: number;
    changed: number;
    added: number;
    deleted: number;
  }>;
  excludedFromDoc: ExcludedBlock[];
  redactedFigures: number;
  chunksTotal: number;
  chunksWritten: number;
  chunksEmbedded: number;
  embeddingModel: string | null;
  tokensEstimated: number;
  warnings: string[];
};

/** Monotonic, human-readable, and sortable. Stamped on every row written. */
function newIndexVersion(): string {
  return new Date().toISOString().replace(/[-:]/g, '').slice(0, 15).replace('T', '-');
}

/**
 * Rebuild the knowledge base from every source.
 *
 * This is the body of both the one-off corpus rebuild (step 1) and the weekly
 * sync (step 7) — same code path, so the thing that runs every week is the
 * thing that was verified up front.
 */
export async function buildKnowledgeBase(
  options: BuildOptions = {},
): Promise<BuildReport> {
  const log = options.onLog ?? (() => {});
  const indexVersion = newIndexVersion();
  const warnings: string[] = [];

  log(`index_version ${indexVersion}`);

  // --- fetch -----------------------------------------------------------------
  const results: Array<SourceResult & { excluded?: ExcludedBlock[] }> = [];

  log('fetching ghost…');
  results.push(await fetchGhostDocuments());

  log('fetching google doc…');
  const gdoc = await fetchGdocDocuments();
  warnings.push(...(gdoc.warnings ?? []));
  // A skipped source is not an empty source. Pushing it would make the
  // count-drop guard see 2 -> 0 and abort the run, or reconcile every internal
  // note as deleted. Leaving it out means "no news from this source".
  if (!gdoc.skipped) results.push(gdoc);

  // LinkedIn. Absent until APIFY_TOKEN exists — and the run says so loudly,
  // because the Doc's copies of these posts are excluded as duplicates, so a
  // silent skip means ~355 posts are missing from the knowledge base entirely.
  if (hasApifyToken()) {
    const runMode = options.linkedinRunMode ?? 'full';
    log(`fetching linkedin (${runMode})…`);
    results.push(await fetchLinkedInDocuments(runMode, log));
  } else {
    warnings.push(
      'APIFY_TOKEN not set — LinkedIn posts are NOT in this build. The Doc\'s ' +
        'copies of them are excluded as duplicates, so those ~355 posts are ' +
        'currently absent from the knowledge base entirely.',
    );
  }

  // --- prepare ---------------------------------------------------------------
  const prepared: PreparedResult[] = [];
  for (const result of results) {
    prepared.push(...prepareAll(result.documents));
  }

  // Fail closed. Shipping a rate card is the one outcome this subsystem exists
  // to prevent, so it aborts the build rather than warning.
  assertNoPricingLeaks(prepared);

  const redactedFigures = prepared.reduce(
    (sum, d) => sum + d.redactions.reduce((t, r) => t + r.figures.length, 0),
    0,
  );
  log(`prepared ${prepared.length} documents, redacted ${redactedFigures} pricing figures`);

  const byDocId = new Map(prepared.map((d) => [d.docId, d]));
  const chunksTotal = prepared.reduce((s, d) => s + d.chunks.length, 0);
  const tokensEstimated = prepared.reduce((s, d) => s + d.tokenCount, 0);

  const report: BuildReport = {
    indexVersion,
    sources: [],
    excludedFromDoc: gdoc.excluded ?? [],
    redactedFigures,
    chunksTotal,
    chunksWritten: 0,
    chunksEmbedded: 0,
    embeddingModel: null,
    tokensEstimated,
    warnings,
  };

  // --- change detection ------------------------------------------------------
  const existingHashes =
    options.dryRun || options.force
      ? new Map<string, string>()
      : await loadDocumentHashes();

  const dirty: PreparedDocument[] = [];
  for (const [sourceIdx, result] of results.entries()) {
    const docs = result.documents.map((d) => byDocId.get(d.docId)).filter(Boolean) as PreparedResult[];

    let unchanged = 0;
    let changed = 0;
    let added = 0;
    for (const doc of docs) {
      const previous = existingHashes.get(doc.docId);
      if (previous === undefined) {
        added += 1;
        dirty.push(doc);
      } else if (previous !== doc.contentHash) {
        changed += 1;
        dirty.push(doc);
      } else {
        unchanged += 1;
      }
    }

    report.sources.push({
      sourceType: result.sourceType,
      fetched: docs.length,
      unchanged,
      changed,
      added,
      deleted: 0,
    });
    void sourceIdx;
  }

  // Churn alarm. If normalisation is unstable every document looks changed
  // every week, which re-embeds the corpus and blows the response cache.
  const totalDocs = prepared.length;
  const changedDocs = report.sources.reduce((s, r) => s + r.changed, 0);
  if (existingHashes.size > 0 && changedDocs / Math.max(totalDocs, 1) > 0.5) {
    warnings.push(
      `${changedDocs}/${totalDocs} documents changed. Above ~50% usually means ` +
        'text normalisation is unstable, not that the content moved.',
    );
  }

  log(
    `changes: ${report.sources.map((s) => `${s.sourceType} +${s.added} ~${s.changed} =${s.unchanged}`).join('  ')}`,
  );

  if (options.dryRun) {
    log('dry run — nothing written');
    return report;
  }

  // --- guards ----------------------------------------------------------------
  //
  // FULL runs only. The guard exists to stop a short pull from tombstoning the
  // corpus — and only full runs reconcile deletes, so only full runs can do
  // that damage. On an incremental run a small count is the expected outcome
  // (16 recent LinkedIn posts vs 386 total), and checking it there turns the
  // safety net into a weekly false alarm that blocks the sync entirely.
  for (const result of results) {
    if (result.runMode !== 'full') continue;
    await assertSourceNotCollapsed(result.sourceType, result.documents.length);
  }

  // --- embed -----------------------------------------------------------------
  const dirtyChunks = dirty.flatMap((d) => byDocId.get(d.docId)?.chunks ?? []);
  let chunksToWrite: Awaited<ReturnType<typeof embedChunks>> | typeof dirtyChunks = dirtyChunks;

  const shouldEmbed = !options.skipEmbedding && hasVoyageKey() && dirtyChunks.length > 0;
  if (shouldEmbed) {
    const grouped = new Map<string, typeof dirtyChunks>();
    for (const chunk of dirtyChunks) {
      const list = grouped.get(chunk.docId) ?? [];
      list.push(chunk);
      grouped.set(chunk.docId, list);
    }
    log(`embedding ${dirtyChunks.length} chunks with ${EMBEDDING_MODEL}…`);
    chunksToWrite = await embedChunks(grouped, {
      onProgress: (done, total) => log(`  embedded ${done}/${total}`),
    });
    report.chunksEmbedded = chunksToWrite.length;
    report.embeddingModel = EMBEDDING_MODEL;
  } else if (dirtyChunks.length) {
    warnings.push(
      options.skipEmbedding
        ? 'Embedding skipped by flag — chunks written with NULL embedding.'
        : 'VOYAGE_API_KEY not set — chunks written with NULL embedding. ' +
          'Re-run once the key exists to backfill; nothing is retrievable until then.',
    );
  }

  // --- write -----------------------------------------------------------------
  //
  // CHUNKS FIRST, then documents. BigQuery has no cross-table transactions, so
  // the order decides what a partial failure leaves behind. Documents carry the
  // content_hash that drives change detection, so writing them first means a
  // later chunk failure leaves hashes claiming "up to date" over an empty
  // kb_chunks — and the next run skips the work and reports success. (That is
  // not hypothetical: it happened on the first run of this pipeline.)
  //
  // This order fails safe instead: chunks may be written for a document whose
  // hash wasn't updated, so the next run simply redoes it.
  if (dirty.length) {
    await replaceChunks(dirty.map((d) => d.docId), chunksToWrite, indexVersion);
    await upsertDocuments(dirty, indexVersion);
    report.chunksWritten = chunksToWrite.length;
    log(`wrote ${chunksToWrite.length} chunks, ${dirty.length} documents`);
  } else {
    log('no changes to write');
  }

  // Publish the serving artifact. Must come after the writes — it is a
  // snapshot of what actually landed, not of what we intended to write.
  try {
    const bytes = await publishArtifact();
    log(`published serving artifact (${(bytes / 1024 / 1024).toFixed(1)} MB gzipped)`);
  } catch (err) {
    warnings.push(
      `Serving artifact NOT published: ${(err as Error).message}. The API still ` +
        'works but falls back to the slow BigQuery load (~47s cold).',
    );
  }

  // Drift check: a document whose stored chunk_count doesn't match the rows in
  // kb_chunks means a half-finished write. Cheap, and it catches the class of
  // bug the ordering above is designed to prevent.
  const drift = await findChunkCountDrift();
  if (drift.length) {
    warnings.push(
      `${drift.length} document(s) have a chunk_count that disagrees with kb_chunks ` +
        `(e.g. ${drift[0].doc_id}: expected ${drift[0].expected}, found ${drift[0].actual}). ` +
        'Re-run with --force to rebuild them.',
    );
  }

  // --- deletes ---------------------------------------------------------------
  for (const [i, result] of results.entries()) {
    const deleted = await reconcileDeletes(
      result.sourceType,
      result.runMode,
      result.documents.map((d) => d.docId),
    );
    report.sources[i].deleted = deleted;
  }

  return report;
}
