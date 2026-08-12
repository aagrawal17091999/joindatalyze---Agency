import { readFile } from 'fs/promises';
import { GoogleAuth } from 'google-auth-library';
import type { SourceDocument, SourceResult, SourceTier } from '../types';

// The internal knowledge Doc.
//
// This source is where the corpus rebuild actually happens. The Doc as it
// stands is a SUPERSET: it contains Ansh's internal context AND a verbatim copy
// of 63 Ghost posts AND all 355 LinkedIn posts. Its own header says so —
// "Blog archive: blog.joindatalyze.com / Auto-synced from Ghost. 63 posts."
//
// Ingesting all of it alongside Ghost and Apify would index that content twice:
// once with a real URL at `published` tier, once without a URL at `internal`.
// Citations would sometimes render as "from my notes" for public blog posts,
// and the tier system would stop meaning anything.
//
// So blocks are CLASSIFIED, not guessed at silently, and every exclusion is
// reported. Nothing is dropped without saying so — that was the old indexer's
// defining bug and it isn't repeated here.

/**
 * H1 titles that begin a region of duplicated content. Matching is on the
 * heading text, case-insensitive.
 *
 * `sticky` means the exclusion carries forward to subsequent H1 blocks that
 * carry no directive of their own. The Doc needs this: the blog archive is
 * followed by ~20 pasted posts whose H1 is literally `**Introduction**`, which
 * is unclassifiable on its own but is plainly part of the archive.
 */
const EXCLUDED_REGIONS: Array<{
  pattern: RegExp;
  reason: string;
  sticky: boolean;
}> = [
  {
    pattern: /^blog archive/i,
    reason: 'duplicate-of-ghost',
    sticky: true,
  },
  {
    pattern: /^ansh'?s linkedin posts/i,
    reason: 'duplicate-of-linkedin',
    sticky: true,
  },
];

/**
 * Authored override, so classification never has to stay a heuristic. Put one
 * of these directly under an H1:
 *
 *   <!-- kb: exclude reason=superseded -->
 *   <!-- kb: internal -->
 *   <!-- kb: draft -->
 */
const DIRECTIVE = /<!--\s*kb:\s*(exclude|internal|draft|published)(?:\s+reason=(\S+))?\s*-->/i;

export type DocBlock = {
  title: string;
  text: string;
  lineStart: number;
  charCount: number;
};

export type ExcludedBlock = DocBlock & { reason: string };

export type ParsedDoc = {
  documents: SourceDocument[];
  excluded: ExcludedBlock[];
};

function slugify(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'untitled'
  );
}

/** Split markdown into H1-delimited blocks. Each block becomes one document. */
function splitTopLevelBlocks(markdown: string): DocBlock[] {
  const lines = markdown.split('\n');
  const blocks: DocBlock[] = [];
  let current: { title: string; body: string[]; lineStart: number } | null = null;

  const flush = () => {
    if (!current) return;
    const text = current.body.join('\n').trim();
    if (text) {
      blocks.push({
        title: current.title,
        text,
        lineStart: current.lineStart,
        charCount: text.length,
      });
    }
  };

  lines.forEach((line, i) => {
    const h1 = /^#\s+(.*)$/.exec(line);
    if (h1) {
      flush();
      current = {
        // Google Docs exports bold headings as `# **Title**`.
        title: h1[1].replace(/\*\*/g, '').replace(/[*_`]/g, '').trim(),
        body: [line],
        lineStart: i + 1,
      };
      return;
    }
    if (!current) {
      current = { title: 'Preamble', body: [line], lineStart: i + 1 };
      return;
    }
    current.body.push(line);
  });
  flush();

  return blocks;
}

/**
 * Classify and convert a knowledge Doc into source documents.
 *
 * Returns both what was kept and what was excluded, so the caller can print a
 * report. Callers must surface `excluded` — an exclusion nobody sees is a
 * silent drop.
 */
export function parseKnowledgeDoc(markdown: string, docId: string): ParsedDoc {
  const blocks = splitTopLevelBlocks(markdown);
  const documents: SourceDocument[] = [];
  const excluded: ExcludedBlock[] = [];

  let stickyReason: string | null = null;

  for (const block of blocks) {
    const directive = DIRECTIVE.exec(block.text);
    let reason: string | null = null;
    let tier: SourceTier = 'internal';

    if (directive) {
      const kind = directive[1].toLowerCase();
      // An explicit directive always wins, and clears any sticky region.
      stickyReason = null;
      if (kind === 'exclude') {
        reason = directive[2] ?? 'excluded-by-directive';
      } else if (kind === 'draft') {
        tier = 'draft';
      }
    } else {
      const match = EXCLUDED_REGIONS.find((r) => r.pattern.test(block.title));
      if (match) {
        reason = match.reason;
        stickyReason = match.sticky ? match.reason : null;
      } else if (stickyReason) {
        reason = stickyReason;
      }
    }

    if (reason) {
      excluded.push({ ...block, reason });
      continue;
    }

    documents.push({
      docId: `gdoc:${docId}#${slugify(block.title)}`,
      sourceType: 'gdoc',
      // Internal notes have no public home. Citations render as "from my
      // notes" with no link rather than pointing nowhere.
      sourceUrl: null,
      title: block.title,
      author: 'Ansh Agrawal',
      publishedAt: null,
      updatedAt: null,
      sourceTier: tier,
      text: block.text,
    });
  }

  return { documents, excluded };
}

/**
 * Fetch a Google Doc and render it as markdown-ish text.
 *
 * Port of the Colab `_load_gdoc_as_markdown`. Uses the same service account the
 * app already uses for BigQuery — it holds `documents.readonly` today, so there
 * is no new auth to provision, just the Doc shared with it.
 */
export async function fetchGoogleDocMarkdown(docId: string): Promise<string> {
  const auth = new GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/documents.readonly'],
    credentials: process.env.BIGQUERY_CREDENTIALS_JSON
      ? JSON.parse(process.env.BIGQUERY_CREDENTIALS_JSON)
      : undefined,
  });
  const client = await auth.getClient();
  const token = await client.getAccessToken();

  // `includeTabsContent=true` is REQUIRED. Google Docs now supports tabs, and a
  // tabbed document returns its content under `tabs[]` with `body` empty — so
  // the plain request silently yields zero characters rather than an error.
  // That is exactly what happened with the live Doc: HTTP 200, no content.
  const res = await fetch(
    `https://docs.googleapis.com/v1/documents/${encodeURIComponent(docId)}?includeTabsContent=true`,
    { headers: { Authorization: `Bearer ${token.token}` } },
  );

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(
      `Google Docs API ${res.status} for ${docId}: ${body.slice(0, 300)}\n` +
        'Check the Doc is shared with the BigQuery service account.',
    );
  }

  const doc = (await res.json()) as GdocResponse;

  // Legacy (untabbed) docs still populate `body`; tabbed ones populate `tabs`,
  // which can nest arbitrarily deep via childTabs.
  const bodies: GdocBody[] = [];
  if (doc.body) bodies.push(doc.body);
  const walk = (tabs: GdocTab[] | undefined): void => {
    for (const tab of tabs ?? []) {
      if (tab.documentTab?.body) bodies.push(tab.documentTab.body);
      walk(tab.childTabs);
    }
  };
  walk(doc.tabs);

  const out: string[] = [];
  for (const body of bodies) {
    for (const element of body.content ?? []) {
      const para = element.paragraph;
      if (!para) continue;

      const style = para.paragraphStyle?.namedStyleType ?? '';
      const level = /^HEADING_([1-6])$/.exec(style);
      const prefix = level ? `${'#'.repeat(Number(level[1]))} ` : '';

      const line = (para.elements ?? [])
        .map((el) => el.textRun?.content ?? '')
        .join('')
        .replace(/\n+$/, '');

      if (line.trim() || out.length) out.push(prefix + line);
    }
  }

  return out.join('\n').replace(/\n{3,}/g, '\n\n');
}

type GdocParagraph = {
  paragraphStyle?: { namedStyleType?: string };
  elements?: Array<{ textRun?: { content?: string } }>;
};
type GdocBody = { content?: Array<{ paragraph?: GdocParagraph }> };
type GdocTab = { documentTab?: { body?: GdocBody }; childTabs?: GdocTab[] };
type GdocResponse = { title?: string; body?: GdocBody; tabs?: GdocTab[] };

/**
 * Load the knowledge Doc from whichever source is configured.
 *
 * `KB_GDOC_ID` points at the live Doc. `KB_GDOC_LOCAL_PATH` reads a markdown
 * file instead — used for the initial rebuild and for offline iteration on the
 * chunker, which is far faster than round-tripping the Docs API.
 */
/** Below this, a Doc is empty in practice — a title and a blank page. */
const MIN_USEFUL_CHARS = 500;

export async function fetchGdocDocuments(): Promise<
  SourceResult & { excluded: ExcludedBlock[]; warnings: string[]; skipped?: boolean }
> {
  const docId = process.env.KB_GDOC_ID;
  const localPath = process.env.KB_GDOC_LOCAL_PATH;
  const warnings: string[] = [];

  if (!docId && !localPath) {
    throw new Error(
      'Set KB_GDOC_ID (live Google Doc) or KB_GDOC_LOCAL_PATH (markdown file).',
    );
  }

  let markdown = '';
  let sourceId = docId ?? 'local';

  if (docId) {
    markdown = await fetchGoogleDocMarkdown(docId);

    // The live Doc is authoritative when it has content. When it's empty we do
    // NOT silently contribute nothing: that would drop the entire internal tier
    // and trip the count-drop guard on the next run. Fall back to the committed
    // snapshot and say so loudly on every run until the Doc is filled.
    if (markdown.trim().length < MIN_USEFUL_CHARS && localPath) {
      warnings.push(
        `KB_GDOC_ID ${docId} is readable but effectively EMPTY ` +
          `(${markdown.trim().length} chars). Falling back to the local snapshot ` +
          `${localPath}. Paste the internal knowledge base into that Doc to make ` +
          'the weekly sync meaningful — until then it syncs a file that never changes.',
      );
      markdown = await readFile(localPath, 'utf8');
      sourceId = 'local';
    } else if (markdown.trim().length < MIN_USEFUL_CHARS) {
      // Empty live Doc and no local snapshot (the deployed runtime has none).
      // Do NOT throw: that would fail the whole weekly sync and block Ghost and
      // LinkedIn from ever updating because an unrelated source is empty.
      // Instead skip this source entirely — `skipped` tells the caller to leave
      // existing gdoc documents alone rather than reconcile them as deleted.
      warnings.push(
        `KB_GDOC_ID ${docId} is readable but EMPTY (${markdown.trim().length} chars). ` +
          'Skipping the internal-notes source for this run; existing gdoc documents ' +
          'are left untouched. Paste content into the Doc to activate it.',
      );
      return {
        sourceType: 'gdoc',
        runMode: 'full',
        documents: [],
        reportedTotal: 0,
        excluded: [],
        warnings,
        skipped: true,
      };
    }
  } else {
    markdown = await readFile(localPath as string, 'utf8');
  }

  const { documents, excluded } = parseKnowledgeDoc(markdown, sourceId);

  return {
    sourceType: 'gdoc',
    runMode: 'full',
    documents,
    reportedTotal: documents.length + excluded.length,
    excluded,
    warnings,
  };
}
