import type { PreparedDocument, Redaction, SourceDocument } from './types';
import { chunkDocument } from './chunk';
import {
  containsOwnPricing,
  contentHash,
  estimateTokens,
  redactOwnPricing,
  sanitizeText,
} from './text';

export type PreparedResult = PreparedDocument & { redactions: Redaction[] };

/**
 * Turn a raw source document into everything the writers need.
 *
 * Order matters and is the point of this module:
 *
 *   1. REDACT first, so Datalyze's rates never reach the hash, the chunks, the
 *      parent `full_text`, BigQuery, or the vector store. Nothing downstream
 *      has to remember to handle them, because they no longer exist.
 *   2. HASH the redacted text, so changing the redaction rules correctly
 *      invalidates affected documents on the next sync.
 *   3. CHUNK last, off the redacted text.
 */
export function prepareDocument(doc: SourceDocument): PreparedResult {
  // 0. SANITISE first. LinkedIn's bold-text hack (Mathematical Alphanumeric
  //    Symbols) breaks the embedding API outright and hides those posts from
  //    lexical search; fixing it here means nothing downstream has to know.
  const clean = sanitizeText(doc.text);
  const cleanTitle = sanitizeText(doc.title);

  const { text, redactions } = redactOwnPricing(clean, doc.sourceTier);
  const redacted: SourceDocument = { ...doc, title: cleanTitle, text };

  const chunks = chunkDocument(redacted);

  // Assertion, not mechanism: if redaction did its job this is always false.
  // If it ever trips, the pipeline should fail loudly rather than publish.
  const stillLeaks = containsOwnPricing(text, doc.sourceTier);

  return {
    ...redacted,
    contentHash: contentHash(text),
    tokenCount: estimateTokens(text),
    containsPricing: stillLeaks,
    chunks,
    redactions,
  };
}

export function prepareAll(docs: SourceDocument[]): PreparedResult[] {
  return docs.map(prepareDocument);
}

/**
 * Fail-closed check for the build pipeline. Any document that still contains
 * own-pricing after redaction is a bug in the rules, and shipping it is the
 * one outcome this whole subsystem exists to prevent.
 */
export function assertNoPricingLeaks(docs: PreparedResult[]): void {
  const leaking = docs.filter((d) => d.containsPricing);
  if (!leaking.length) return;

  const detail = leaking
    .map((d) => `  ${d.docId}  (${d.title.slice(0, 60)})`)
    .join('\n');
  throw new Error(
    `${leaking.length} document(s) still contain own-pricing after redaction:\n${detail}\n` +
      'Fix the rules in lib/kb/text.ts before building the index.',
  );
}
