import type { Metadata } from 'next';
import Image from 'next/image';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbSchema } from '@/lib/seo';

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
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Resources', path: '/resources' },
          {
            name: 'Client vs proxy vs server-side tracking',
            path: '/resources/client-vs-proxy-vs-server-tracking',
          },
        ])}
      />
      <div className="container">
        <header className="page-header">
          <div className="eyebrow">Resources</div>
          <h1 className="page-header__title">
            Client vs proxy vs server-side tracking
          </h1>
          <p className="page-header__intro">
            Where you fire each event decides how accurate, complete, and
            trustworthy your product data is. Here&apos;s how the three
            approaches compare, and how to combine them.
          </p>
        </header>

        <article className="prose">
          <p>
            Every analytics setup has to answer one question for each event:
            where does it get sent from? The same &ldquo;Purchase Completed&rdquo;
            event can be fired from the user&apos;s browser, routed through a
            proxy on your own domain, or sent straight from your backend. The
            choice changes how much data you actually capture, how reliable it
            is, and how much it can be tampered with or blocked.
          </p>

          <h2>Client-side tracking</h2>
          <p>
            The event fires directly from the browser or mobile app, usually via
            an analytics SDK. It&apos;s the fastest to set up and captures rich
            front-end context: which button was clicked, page and referrer
            details, device, and the full sequence of UI interactions. The
            downside is reliability. Ad blockers, privacy browsers (Safari&apos;s
            ITP, Firefox), and network failures silently drop a meaningful share
            of events, and because the code runs on the user&apos;s machine it
            can be inspected or spoofed. Great for engagement and UX behaviour;
            risky for anything you need to be exact.
          </p>

          <h2>Server-side tracking</h2>
          <p>
            The event is sent from your own backend after an action is confirmed.
            Because it doesn&apos;t depend on the user&apos;s browser, it
            can&apos;t be blocked by extensions and is far harder to tamper with,
            which makes it the right home for revenue, sign-ups, and any
            business-critical or financial event. The trade-off is that the
            server often lacks front-end context (exact UI state, client-side
            attribution signals) and it takes more engineering effort to
            instrument. It&apos;s the source of truth, not the full picture.
          </p>

          <h2>Proxy (first-party) tracking</h2>
          <p>
            A proxy routes client-side events through an endpoint on your own
            domain before forwarding them to the analytics tool. You keep the
            richness of client-side data while recovering much of what ad
            blockers and tracking-prevention would otherwise drop, because the
            requests look first-party rather than third-party. It needs some
            infrastructure to run and maintain, but it&apos;s the practical way
            to make client-side data more complete without moving everything to
            the server.
          </p>

          <h2>How to combine them</h2>
          <p>
            For most products the answer isn&apos;t one method, it&apos;s a
            deliberate split. Use <strong>server-side</strong> for revenue,
            sign-ups, and anything that must be exact; use{' '}
            <strong>client-side</strong> for UI interactions, engagement, and the
            behavioural detail server events can&apos;t see; and add a{' '}
            <strong>first-party proxy</strong> to recover the client events that
            blockers would otherwise lose. Decide per event based on the outcome
            you need from it, not by picking a single approach for everything.
          </p>
        </article>

        <div className="deck">
          {Array.from({ length: SLIDE_COUNT }, (_, i) => {
            const n = String(i + 1).padStart(2, '0');
            return (
              <figure key={n} className="deck__slide">
                <Image
                  src={`/decks/client-vs-proxy-vs-server/slide-${n}.png`}
                  alt={`Client vs proxy vs server-side tracking — slide ${i + 1} of ${SLIDE_COUNT}`}
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
