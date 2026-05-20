import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Client vs Proxy vs Server Side Tracking',
  description:
    'Where to fire each event and why it matters for your data. A practical guide to client, proxy, and server-side event tracking.',
  alternates: { canonical: '/resources/client-vs-proxy-vs-server-tracking' },
};

const SLIDE_COUNT = 13;

export default function ClientVsProxyVsServerPage() {
  return (
    <div className="page-shell">
      <div className="container">
        <header className="page-header">
          <div className="eyebrow">Resources</div>
          <h1 className="page-header__title">
            Client vs proxy vs server-side tracking
          </h1>
          <p className="page-header__intro">
            Where to fire each event and why it matters for your data.
          </p>
        </header>

        <div className="deck">
          {Array.from({ length: SLIDE_COUNT }, (_, i) => {
            const n = String(i + 1).padStart(2, '0');
            return (
              <figure key={n} className="deck__slide">
                <Image
                  src={`/decks/client-vs-proxy-vs-server/slide-${n}.png`}
                  alt={`Slide ${i + 1} of ${SLIDE_COUNT}`}
                  width={2880}
                  height={1620}
                  sizes="(max-width: 1280px) 100vw, 1200px"
                  priority={i === 0}
                />
              </figure>
            );
          })}
        </div>
      </div>
    </div>
  );
}
