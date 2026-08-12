// BM25 lexical search.
//
// This is the half of hybrid retrieval that dense embeddings are bad at, and
// for this domain it is not optional. Ansh's corpus is dense with exact terms -
// HogQL, UTM, GA4, $identify, mixpanel_distinct_id, Lexicon, MMM - and an
// embedding model maps "HogQL" into roughly the same region as "SQL" and
// "query language". Semantically reasonable, practically useless when someone
// asked about HogQL and gets a chunk about BigQuery SQL.
//
// Deliberately dependency-free and in-process: at this corpus size an inverted
// index is a few hundred KB and queries take single-digit milliseconds, so
// there is nothing to justify a search service. When the corpus outgrows that,
// Upstash Vector's hybrid index provides the same thing server-side and this
// module becomes the local fallback.

const K1 = 1.5; // term-frequency saturation
const B = 0.75; // length normalisation

/**
 * Words carrying no retrieval signal. Deliberately short: aggressive stopword
 * lists hurt a domain corpus, where "how" and "why" genuinely distinguish
 * "how do I set up Mixpanel" from "why does Mixpanel double-count".
 */
const STOPWORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'if', 'of', 'at', 'by', 'for', 'with',
  'to', 'from', 'in', 'on', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'it', 'its', 'this', 'that', 'these', 'those', 'as', 'i', 'you', 'we', 'they',
]);

/**
 * Tokenise while preserving the exact terms this domain runs on.
 *
 * Rules that matter:
 *  - keep `$identify` and `$mp_web_page_view` - the leading `$` is meaningful
 *    in Mixpanel and stripping it merges distinct events
 *  - keep `ga4`, `utm_source`, `mixpanel_distinct_id` intact (digits and
 *    underscores are part of the token, not separators)
 *  - additionally emit the underscore-split parts, so a search for "utm source"
 *    still finds "utm_source"
 */
export function tokenize(text: string): string[] {
  const raw = text
    .toLowerCase()
    .replace(/[''']/g, '')
    .match(/[$]?[a-z0-9][a-z0-9_.-]*/g);

  if (!raw) return [];

  const out: string[] = [];
  for (const token of raw) {
    const cleaned = token.replace(/[.-]+$/, '');
    if (!cleaned || STOPWORDS.has(cleaned)) continue;
    out.push(cleaned);

    // Emit parts of compound identifiers as well as the whole.
    if (cleaned.includes('_')) {
      for (const part of cleaned.split('_')) {
        if (part.length > 1 && !STOPWORDS.has(part)) out.push(part);
      }
    }
  }
  return out;
}

export type LexicalDoc = { id: string; text: string };

export type LexicalHit = { id: string; score: number };

export class BM25Index {
  private postings = new Map<string, Map<string, number>>();
  private docLength = new Map<string, number>();
  private averageLength = 0;
  private size = 0;

  constructor(docs: LexicalDoc[]) {
    let totalLength = 0;

    for (const doc of docs) {
      const tokens = tokenize(doc.text);
      this.docLength.set(doc.id, tokens.length);
      totalLength += tokens.length;

      const counts = new Map<string, number>();
      for (const token of tokens) counts.set(token, (counts.get(token) ?? 0) + 1);

      for (const [term, count] of counts) {
        let posting = this.postings.get(term);
        if (!posting) {
          posting = new Map();
          this.postings.set(term, posting);
        }
        posting.set(doc.id, count);
      }
    }

    this.size = docs.length;
    this.averageLength = this.size ? totalLength / this.size : 0;
  }

  get documentCount(): number {
    return this.size;
  }

  get termCount(): number {
    return this.postings.size;
  }

  search(query: string, limit = 40): LexicalHit[] {
    const terms = tokenize(query);
    if (!terms.length) return [];

    const scores = new Map<string, number>();

    // Deduplicate query terms but keep their multiplicity as a weight, so
    // "mixpanel mixpanel setup" doesn't triple-count by accident.
    const queryTerms = new Map<string, number>();
    for (const term of terms) queryTerms.set(term, (queryTerms.get(term) ?? 0) + 1);

    for (const [term, queryFrequency] of queryTerms) {
      const posting = this.postings.get(term);
      if (!posting) continue;

      // Robertson/Sparck-Jones IDF with the +0.5 smoothing, floored at zero so
      // a term appearing in almost every document can't push scores negative.
      const idf = Math.max(
        0,
        Math.log(1 + (this.size - posting.size + 0.5) / (posting.size + 0.5)),
      );
      if (idf === 0) continue;

      for (const [docId, termFrequency] of posting) {
        const length = this.docLength.get(docId) ?? 0;
        const norm = 1 - B + (B * length) / (this.averageLength || 1);
        const tf = (termFrequency * (K1 + 1)) / (termFrequency + K1 * norm);
        scores.set(docId, (scores.get(docId) ?? 0) + idf * tf * queryFrequency);
      }
    }

    return [...scores.entries()]
      .map(([id, score]) => ({ id, score }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
}
