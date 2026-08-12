import type { KbChunk, SourceDocument } from './types';
import { containsOwnPricing, contentHash, estimateTokens } from './text';

// Heading-aware chunker. Replaces the Colab `chunk_markdown`, and fixes its
// three bugs (see docs/ai-avatar-plan.md §0.4):
//
//   1. It dropped every section under 200 chars silently. That cost 8 LinkedIn
//      posts and an unknown number of short definitional sections — which are
//      often the BEST Q&A answers ("what's a super property?" is three
//      sentences). There is no minimum length here.
//   2. Chunk IDs were `md5(text)[:12]`, so they changed whenever the text did
//      and couldn't anchor a citation. IDs here are `<docId>#<index>`, stable
//      across edits, with the hash kept separately for change detection.
//   3. The split regex never fired on `# `, and no chunk carried its parent
//      headings. Every chunk here is embedded with its full breadcrumb.
//
// Strategy is "retrieve small, generate big" (plan §2.1): we embed and search
// at section level for precision, then expand to the whole parent document
// before generation. So these chunks are deliberately small — they are search
// keys, not the context the model reads.

const MAX_CHARS = 2400;
const MIN_MERGE_CHARS = 280;

type Section = {
  headingPath: string[];
  body: string;
};

/**
 * Split markdown-ish text into sections on ATX headings at any level (h1-h4),
 * tracking the heading stack so each section knows its ancestry.
 */
function splitIntoSections(text: string): Section[] {
  const lines = text.split('\n');
  const sections: Section[] = [];
  const stack: string[] = [];
  let buffer: string[] = [];

  const flush = () => {
    const body = buffer.join('\n').trim();
    if (body) sections.push({ headingPath: [...stack], body });
    buffer = [];
  };

  for (const line of lines) {
    const heading = /^(#{1,4})\s+(.*)$/.exec(line.trim());
    if (!heading) {
      buffer.push(line);
      continue;
    }

    flush();
    const level = heading[1].length;
    const title = heading[2].replace(/[*_`]/g, '').trim();
    // Truncate the stack to this heading's depth, then push. Handles skipped
    // levels (h2 -> h4) without losing the ancestry we do have.
    stack.length = Math.min(stack.length, level - 1);
    stack[level - 1] = title;
    for (let i = 0; i < level; i += 1) stack[i] ??= '';
  }
  flush();

  return sections.filter((s) => s.body.trim().length > 0);
}

/**
 * Split a section body that exceeds MAX_CHARS on paragraph boundaries. Prose
 * that has no paragraph breaks at all falls back to a hard slice — rare, but a
 * pasted transcript would otherwise produce one enormous chunk.
 */
function splitLongBody(body: string): string[] {
  if (body.length <= MAX_CHARS) return [body];

  const parts: string[] = [];
  let current: string[] = [];
  let length = 0;

  for (const para of body.split(/\n{2,}/)) {
    if (para.length > MAX_CHARS) {
      if (current.length) {
        parts.push(current.join('\n\n'));
        current = [];
        length = 0;
      }
      for (let i = 0; i < para.length; i += MAX_CHARS) {
        parts.push(para.slice(i, i + MAX_CHARS));
      }
      continue;
    }
    if (length + para.length > MAX_CHARS && current.length) {
      parts.push(current.join('\n\n'));
      current = [para];
      length = para.length;
      continue;
    }
    current.push(para);
    length += para.length + 2;
  }
  if (current.length) parts.push(current.join('\n\n'));

  return parts;
}

/**
 * Merge runs of very short sections into their neighbour.
 *
 * Not a length filter — nothing is dropped. A bare `### Register modes`
 * followed by two lines is a worse search key on its own than it is attached to
 * the section beside it, but the *content* survives either way. This is the
 * safe version of the thing the old indexer got wrong.
 */
function mergeTinySections(sections: Section[]): Section[] {
  const out: Section[] = [];

  for (const section of sections) {
    const previous = out[out.length - 1];
    const isTiny = section.body.length < MIN_MERGE_CHARS;
    const sharesParent =
      previous !== undefined &&
      previous.headingPath.slice(0, -1).join(' → ') ===
        section.headingPath.slice(0, -1).join(' → ');

    if (isTiny && previous && sharesParent && previous.body.length + section.body.length <= MAX_CHARS) {
      previous.body = `${previous.body}\n\n${section.body}`;
      continue;
    }
    out.push({ ...section });
  }

  return out;
}

function breadcrumb(headingPath: string[], title: string): string {
  const parts = [title, ...headingPath.filter(Boolean)];
  // De-duplicate consecutive repeats: a LinkedIn post's doc title and its only
  // heading are usually the same string, and "Post 11 → Post 11" helps nobody.
  return parts
    .filter((part, i) => i === 0 || part !== parts[i - 1])
    .join(' → ');
}

/**
 * Chunk a source document into retrieval units.
 *
 * Every chunk's `embeddedText` is prefixed with its heading breadcrumb. That
 * prefix is the cheapest retrieval win available: it makes each chunk
 * self-describing, so a section titled "Event properties" is embedded knowing
 * it sits inside the Mixpanel setup guide rather than floating free.
 */
export function chunkDocument(doc: SourceDocument): KbChunk[] {
  const sections = mergeTinySections(splitIntoSections(doc.text));

  // A document with no headings at all (most LinkedIn posts) is one section.
  const effective: Section[] = sections.length
    ? sections
    : [{ headingPath: [], body: doc.text.trim() }];

  const chunks: KbChunk[] = [];

  for (const section of effective) {
    for (const body of splitLongBody(section.body)) {
      const trimmed = body.trim();
      if (!trimmed) continue;

      const headingPath = breadcrumb(section.headingPath, doc.title);
      const chunkIndex = chunks.length;

      chunks.push({
        chunkId: `${doc.docId}#${chunkIndex}`,
        docId: doc.docId,
        chunkIndex,
        text: trimmed,
        embeddedText: `${headingPath}\n\n${trimmed}`,
        headingPath,
        contentHash: contentHash(trimmed),
        tokenCount: estimateTokens(trimmed),
        containsPricing: containsOwnPricing(trimmed, doc.sourceTier),
      });
    }
  }

  return chunks;
}
