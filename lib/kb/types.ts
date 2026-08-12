// Shared types for the Ask Ansh's AI knowledge base.
//
// The pipeline is: source adapter -> SourceDocument[] -> chunker -> KbChunk[]
// -> embedder -> BigQuery + vector store. Everything upstream of the embedder
// is deterministic and offline-testable, which is why the source adapters
// return plain data rather than writing anywhere themselves.

export type SourceType = 'ghost' | 'linkedin' | 'gdoc';

/**
 * Confidence tiers. Applied as a multiplier to the *rerank* score after
 * retrieval, never to the embedding - retrieval should find the best match on
 * merit, and ranking is where editorial policy belongs. See plan §2.6.
 */
export type SourceTier = 'published' | 'tutorial' | 'internal' | 'draft';

export type DocStatus = 'active' | 'deleted';

/**
 * A source document before chunking. One per blog post, LinkedIn post, or
 * top-level Google Doc section.
 */
export type SourceDocument = {
  /** Stable and source-scoped: `ghost:<uuid>`, `linkedin:<urn>`, `gdoc:<docId>#<slug>`. */
  docId: string;
  sourceType: SourceType;
  /** Canonical public URL. Null only for `gdoc`, which has no public home. */
  sourceUrl: string | null;
  title: string;
  author: string | null;
  publishedAt: Date | null;
  updatedAt: Date | null;
  sourceTier: SourceTier;
  /**
   * Markdown-ish body. Retains `#`-style headings so the chunker can split on
   * them and build breadcrumbs.
   */
  text: string;
};

export type Redaction = { sentence: string; figures: string[] };

/** A source document with the derived fields the pipeline adds. */
export type PreparedDocument = SourceDocument & {
  /** SHA-256 of the normalised text. Drives change detection. */
  contentHash: string;
  tokenCount: number;
  containsPricing: boolean;
  chunks: KbChunk[];
};

export type KbChunk = {
  /**
   * Stable across edits: `<docId>#<chunkIndex>`. Deliberately NOT a content
   * hash - the old Colab indexer used `md5(text)[:12]`, which changed whenever
   * the text did and made chunk IDs useless as citation anchors.
   */
  chunkId: string;
  docId: string;
  chunkIndex: number;
  /** Raw text, for display and for assembling the parent document. */
  text: string;
  /** Breadcrumb + text. This is what actually gets embedded. */
  embeddedText: string;
  headingPath: string;
  contentHash: string;
  tokenCount: number;
  containsPricing: boolean;
};

export type EmbeddedChunk = KbChunk & {
  embedding: number[];
  embeddingModel: string;
};

/**
 * How a source was pulled. Only `full` runs may drive delete reconciliation -
 * an `incremental` run returns a recent slice, and treating everything it
 * didn't return as deleted would wipe the corpus. See plan §2.5.
 */
export type RunMode = 'full' | 'incremental';

export type SourceResult = {
  sourceType: SourceType;
  runMode: RunMode;
  documents: SourceDocument[];
  /**
   * Count the source reports it holds in total, when it can be known cheaply.
   * Used by the count-drop guard to catch a partial pull that would otherwise
   * look like a successful one.
   */
  reportedTotal: number | null;
};
