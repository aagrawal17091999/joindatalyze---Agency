import type { Metadata } from 'next';
import Image from 'next/image';
import Faq from '@/app/_components/faq';
import JsonLd from '@/components/seo/JsonLd';
import {
  breadcrumbSchema,
  faqPageSchema,
  orgRef,
  personRef,
  SITE_URL,
} from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Client vs Proxy vs Server Side Tracking',
  description:
    'Server-side for revenue and sign-ups, client-side for behaviour, a first-party proxy to recover blocked events. Which method each event should use.',
  alternates: { canonical: '/resources/client-vs-proxy-vs-server-tracking' },
};

const TRACKING_FAQS = [
  {
    q: 'Is server-side tracking better than client-side?',
    a: 'Not better - different. Server-side is more reliable and harder to tamper with, so it is right for revenue and sign-ups. Client-side sees the interface, so it is right for behaviour. Most products need both.',
  },
  {
    q: 'Do I need a first-party proxy?',
    a: 'If a meaningful share of your client events are being dropped by ad blockers or Safari\u2019s ITP, yes. It is the cheapest way to recover them without re-instrumenting everything server-side.',
  },
  {
    q: 'Does server-side tracking break attribution?',
    a: 'It can. Click IDs and campaign parameters arrive in the browser, so if you move an event server-side without passing that context through, attribution goes with it. Capture the attribution parameters client-side on landing, persist them, and attach them to the server-side event.',
  },
  {
    q: 'Which events should fire from the server?',
    a: 'Anything that must be exact or must not be blockable: purchases, subscription changes, sign-ups, trial starts. Anything that depends on what was on screen - clicks, feature use, form drop-off - belongs client-side.',
  },
];

const SLIDE_COUNT = 13;

export default function ClientVsProxyVsServerPage() {
  return (
    <div className="page-shell">
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Resources', path: '/resources' },
            {
              name: 'Client vs proxy vs server-side tracking',
              path: '/resources/client-vs-proxy-vs-server-tracking',
            },
          ]),
          faqPageSchema(TRACKING_FAQS),
          // This is the most citable page on the domain and it declared no
          // author. TechArticle + an author reference to the site-wide Person
          // is what lets an engine attribute the advice.
          {
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            '@id': `${SITE_URL}/resources/client-vs-proxy-vs-server-tracking#article`,
            headline: 'Client vs proxy vs server-side tracking',
            description:
              'Server-side for revenue and sign-ups, client-side for behaviour, a first-party proxy to recover blocked events. Which method each event should use.',
            url: `${SITE_URL}/resources/client-vs-proxy-vs-server-tracking`,
            author: personRef,
            publisher: orgRef,
          },
        ]}
      />
      <div className="container">
        <header className="page-header">
          <div className="eyebrow">Resources</div>
          <h1 className="page-header__title">
            Client vs proxy vs server-side tracking
          </h1>
          {/* Answer-first: the recommendation itself, before any explanation.
              A model should be able to quote this paragraph and be correct. */}
          <p className="page-header__intro">
            Fire revenue, sign-ups and anything that must be exact from your
            server. Fire UI interactions, engagement and behavioural detail
            from the client. Route those client events through a first-party
            proxy on your own domain to recover what ad blockers and tracking
            prevention would otherwise drop. Most products need all three,
            split deliberately per event.
          </p>
        </header>

        {/* The comparison table is what a "X vs Y" query gets cited for. */}
        <section className="cs-overview">
          <h2 className="cs-overview__title">The three approaches compared</h2>
          <div className="cs-overview__scroll">
            <table className="cs-table">
              <thead>
                <tr>
                  <th scope="col" />
                  <th scope="col">Client-side</th>
                  <th scope="col">Proxy (first-party)</th>
                  <th scope="col">Server-side</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Where it fires</th>
                  <td>Browser or mobile app, via SDK</td>
                  <td>Browser &rarr; endpoint on your domain &rarr; the tool</td>
                  <td>Your backend, after the action is confirmed</td>
                </tr>
                <tr>
                  <th scope="row">Completeness</th>
                  <td>Lowest - blockers, ITP and network failures drop events silently</td>
                  <td>High - requests look first-party, so most blocked events are recovered</td>
                  <td>Highest - nothing on the user&apos;s machine can stop it</td>
                </tr>
                <tr>
                  <th scope="row">Tamper-resistance</th>
                  <td>Low - the code runs on the user&apos;s machine</td>
                  <td>Low - still originates client-side</td>
                  <td>High</td>
                </tr>
                <tr>
                  <th scope="row">Front-end context</th>
                  <td>Full - clicks, page, referrer, device, UI sequence</td>
                  <td>Full - same payload, different route</td>
                  <td>Limited - the server can&apos;t see UI state</td>
                </tr>
                <tr>
                  <th scope="row">Setup effort</th>
                  <td>Lowest</td>
                  <td>Medium - infrastructure to run and maintain</td>
                  <td>Highest - real engineering per event</td>
                </tr>
                <tr>
                  <th scope="row">Best for</th>
                  <td>Engagement, UX behaviour, funnels through the interface</td>
                  <td>Recovering blocked client events</td>
                  <td>Revenue, sign-ups, anything business-critical</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

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

          <h2>Which method should each event use?</h2>
        </article>

        <div className="cs-overview__scroll">
          <table className="cs-table">
            <thead>
              <tr>
                <th scope="col">Event</th>
                <th scope="col">Fire it from</th>
                <th scope="col">Why</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Purchase / payment completed</th>
                <td>Server</td>
                <td>Must be exact; must not be blockable or spoofable</td>
              </tr>
              <tr>
                <th scope="row">Subscription started, renewed, cancelled</th>
                <td>Server</td>
                <td>Billing truth lives in your backend, not the browser</td>
              </tr>
              <tr>
                <th scope="row">Sign-up / account created</th>
                <td>Server</td>
                <td>Drives CAC and activation denominators</td>
              </tr>
              <tr>
                <th scope="row">Page or screen viewed</th>
                <td>Client, via proxy</td>
                <td>Needs front-end context; volume makes server instrumentation expensive</td>
              </tr>
              <tr>
                <th scope="row">Button or CTA clicked</th>
                <td>Client, via proxy</td>
                <td>Only the client knows what was on screen</td>
              </tr>
              <tr>
                <th scope="row">Feature used in-app</th>
                <td>Client, via proxy</td>
                <td>Behavioural detail the server can&apos;t see</td>
              </tr>
              <tr>
                <th scope="row">Form errors, drop-off within a flow</th>
                <td>Client, via proxy</td>
                <td>Pure UI state</td>
              </tr>
              <tr>
                <th scope="row">Email opened, link clicked</th>
                <td>Server, from your ESP webhook</td>
                <td>Not your front end at all</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="deck">
          {Array.from({ length: SLIDE_COUNT }, (_, i) => {
            const n = String(i + 1).padStart(2, '0');
            return (
              <figure key={n} className="deck__slide">
                <Image
                  src={`/decks/client-vs-proxy-vs-server/slide-${n}.png`}
                  alt={`Client vs proxy vs server-side tracking - slide ${i + 1} of ${SLIDE_COUNT}`}
                  width={2880}
                  height={1620}
                  sizes="(max-width: 1280px) 100vw, 1200px"
                  priority={i === 0}
                />
              </figure>
            );
          })}
        </div>

        <Faq
          items={TRACKING_FAQS}
          title="Tracking questions"
          eyebrow="Questions"
        />
      </div>
    </div>
  );
}
