import { useState, useEffect } from 'react';

const svgCache = {};

function processWhiteFills(svgText) {
  return svgText
    .replace(/\bfill="(#[Ff]{6}|#[Ff]{3}|white)"/g, 'fill="#1f2937"')
    .replace(/\bfill='(#[Ff]{6}|#[Ff]{3}|white)'/g, "fill='#1f2937'")
    .replace(/\bstroke="(#[Ff]{6}|#[Ff]{3}|white)"/g, 'stroke="#1f2937"')
    .replace(/\bstroke='(#[Ff]{6}|#[Ff]{3}|white)'/g, "stroke='#1f2937'")
    .replace(/(fill\s*:\s*)(#[Ff]{6}|#[Ff]{3}|white)(\s*[;}])/g, '$1#1f2937$3')
    .replace(/(stroke\s*:\s*)(#[Ff]{6}|#[Ff]{3}|white)(\s*[;}])/g, '$1#1f2937$3')
    .replace(/\bstop-color="(#[Ff]{6}|#[Ff]{3}|white)"/g, 'stop-color="#1f2937"')
    .replace(/(stop-color\s*:\s*)(#[Ff]{6}|#[Ff]{3}|white)(\s*[;}])/g, '$1#1f2937$3');
}

export default function LogoImg({ src, name, className = '' }) {
  const [svgHtml, setSvgHtml] = useState(() => (src && src in svgCache ? svgCache[src] : null));

  useEffect(() => {
    if (!src) return;
    if (src in svgCache) {
      setSvgHtml(svgCache[src]);
      return;
    }
    let cancelled = false;
    fetch(src)
      .then((r) => r.text())
      .then((text) => {
        const processed = processWhiteFills(text);
        svgCache[src] = processed;
        if (!cancelled) setSvgHtml(processed);
      })
      .catch(() => {
        svgCache[src] = null;
      });
    return () => { cancelled = true; };
  }, [src]);

  if (!src) return null;

  if (!svgHtml) {
    return <img src={src} alt={name} loading="lazy" className={className} />;
  }

  return (
    <span
      className={`logo-svg-inline ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: svgHtml }}
      aria-label={name}
      role="img"
    />
  );
}
