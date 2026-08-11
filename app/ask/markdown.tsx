import type { ReactNode } from 'react';

// A deliberately small markdown renderer.
//
// The answers use a narrow subset — bold, inline code, links, bullets and the
// occasional numbered list — and it has to render mid-stream, on text that is
// still half-written. A real parser is more dependency (and more re-parsing per
// token) than the job needs.
//
// Anything it doesn't understand falls through as plain text, which is the
// right failure mode: a stray asterisk beats a thrown parser.

const INLINE = /(\*\*[^*\n]+\*\*|`[^`\n]+`|\[[^\]\n]+\]\([^)\s]+\)|(?<![*\w])\*[^*\n]+\*(?!\w))/g;

function inline(text: string, key: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let i = 0;

  for (const match of text.matchAll(INLINE)) {
    const token = match[0];
    const at = match.index ?? 0;
    if (at > last) out.push(text.slice(last, at));
    last = at + token.length;
    const k = `${key}-${i++}`;

    if (token.startsWith('**')) {
      out.push(<strong key={k}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith('`')) {
      out.push(<code key={k}>{token.slice(1, -1)}</code>);
    } else if (token.startsWith('[')) {
      const split = token.indexOf('](');
      const label = token.slice(1, split);
      const href = token.slice(split + 2, -1);
      out.push(
        <a key={k} href={href} target="_blank" rel="noopener noreferrer">
          {label}
        </a>,
      );
    } else {
      out.push(<em key={k}>{token.slice(1, -1)}</em>);
    }
  }

  if (last < text.length) out.push(text.slice(last));
  return out;
}

// One literal per member: a union like `kind: 'ul' | 'ol'` isn't a discriminant
// TypeScript can narrow away, so the renderer below would lose the type.
type Block =
  | { kind: 'p'; text: string }
  | { kind: 'h3'; text: string }
  | { kind: 'h4'; text: string }
  | { kind: 'ul'; items: string[] }
  | { kind: 'ol'; items: string[] };

function blocks(markdown: string): Block[] {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const out: Block[] = [];
  let paragraph: string[] = [];

  const flush = () => {
    if (paragraph.length) {
      out.push({ kind: 'p', text: paragraph.join(' ') });
      paragraph = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flush();
      continue;
    }

    const heading = /^(#{1,6})\s+(.*)$/.exec(trimmed);
    if (heading) {
      flush();
      out.push({ kind: heading[1].length <= 2 ? 'h3' : 'h4', text: heading[2] });
      continue;
    }

    const bullet = /^[-*+]\s+(.*)$/.exec(trimmed);
    if (bullet) {
      flush();
      const prev = out[out.length - 1];
      if (prev?.kind === 'ul') prev.items.push(bullet[1]);
      else out.push({ kind: 'ul', items: [bullet[1]] });
      continue;
    }

    const numbered = /^\d+[.)]\s+(.*)$/.exec(trimmed);
    if (numbered) {
      flush();
      const prev = out[out.length - 1];
      if (prev?.kind === 'ol') prev.items.push(numbered[1]);
      else out.push({ kind: 'ol', items: [numbered[1]] });
      continue;
    }

    paragraph.push(trimmed);
  }

  flush();
  return out;
}

export function Markdown({ text }: { text: string }) {
  return (
    <>
      {blocks(text).map((block, i) => {
        if (block.kind === 'ul' || block.kind === 'ol') {
          const items = block.items.map((item, j) => (
            <li key={j}>{inline(item, `${i}-${j}`)}</li>
          ));
          return block.kind === 'ul' ? <ul key={i}>{items}</ul> : <ol key={i}>{items}</ol>;
        }
        if (block.kind === 'h3') return <h3 key={i}>{inline(block.text, String(i))}</h3>;
        if (block.kind === 'h4') return <h4 key={i}>{inline(block.text, String(i))}</h4>;
        return <p key={i}>{inline(block.text, String(i))}</p>;
      })}
    </>
  );
}
