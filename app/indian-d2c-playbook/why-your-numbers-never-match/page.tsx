import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbSchema } from '@/lib/seo';
import Link from 'next/link';
import FourNumbersOneWeek from '@/components/playbook-metrics/FourNumbersOneWeek';
import AttributionModels from '@/components/playbook-metrics/AttributionModels';
import AttributionWindows from '@/components/playbook-metrics/AttributionWindows';
import DecisionFramework from '@/components/playbook-metrics/DecisionFramework';
import styles from './NumbersPlaybook.module.css';

export const metadata: Metadata = {
  title: 'Why your numbers never match',
  description:
    'The attribution reality check. Why every platform reports a different number, and which one to actually trust. Playbook 02 of the Indian D2C data series.',
  alternates: {
    canonical: '/indian-d2c-playbook/why-your-numbers-never-match',
  },
};

export default function WhyYourNumbersNeverMatchPage() {
  return (
    <div className="page-shell">
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Indian D2C Playbook', path: '/indian-d2c-playbook' },
          {
            name: 'Why your numbers never match',
            path: '/indian-d2c-playbook/why-your-numbers-never-match',
          },
        ])}
      />
      <div className="container">
        <header className="page-header">
          <div className="eyebrow">Playbook 02 · D2C Data Series</div>
          <h1 className="page-header__title">Why your numbers never match</h1>
          <p className="page-header__intro">
            The attribution reality check. Why every platform reports a different
            number, and which one to actually trust.
          </p>
        </header>

        <article className={styles.article}>
          {/* The short version */}
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>The short version</h2>
            <div className="prose">
              <p>
                Open Meta, Google, GA4, and Shopify for the same week and you will
                get four different revenue numbers. Not because something is broken.
                Because each one is measuring a different thing through a different
                lens, and those lenses were never built to agree.
              </p>
              <p>
                The instinct is to find the bug and make them match. There is no
                bug, and they will never match. The real skill is knowing which
                number answers which question, taking each fact from the source
                closest to the truth for that fact, and leaning on the sources you
                can actually model to your business over the black boxes you cannot.
                Here is how to do that.
              </p>
            </div>
          </section>

          {/* The same week, four numbers */}
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>The same week, four numbers</h2>
            <div className="prose">
              <p>
                Picture one D2C brand, one ordinary week. Same customers, same
                sales, same money in the bank. Now look at what each system says
                happened.
              </p>
            </div>

            <FourNumbersOneWeek />

            <div className="prose">
              <p>
                Meta is the most confident and the most generous, because it counts
                a conversion whenever someone clicked or even just saw an ad before
                buying. Google Ads counts its own clicks. GA4 sits in the middle,
                trying to spread credit across the whole journey, and quietly drops
                the orders it never saw fire. Shopify is the only one not playing the
                attribution game at all. It just counts orders when the money is
                captured.
              </p>
              <p>
                None of these four is lying. They are answering four different
                questions and presenting the answers as if they were the same one.
                Once you see that, the disagreement stops being frustrating and
                starts being useful, because each number is now good for something
                specific.
              </p>
            </div>
          </section>

          {/* Why the numbers disagree */}
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>Why the numbers disagree</h2>
            <div className="prose">
              <p>
                There are four reasons the same sale shows up differently across
                your stack. None of them is fixable in the sense of making the
                numbers converge. They are structural. But understanding each one
                tells you which number to believe for which job.
              </p>
              <h3>They use different attribution models</h3>
              <p>
                A real customer journey is messy. Someone sees your ad on Instagram,
                ignores it, searches your brand on Google two days later, leaves,
                then comes back through a direct visit and buys. One sale, three
                touchpoints. The question of who gets credit has no objectively
                correct answer, so every system invented its own rule.
              </p>
            </div>

            <figure className={styles.figure}>
              <AttributionModels />
            </figure>

            <div className="prose">
              <p>
                Last-click gives everything to the final touch, the direct visit,
                and tells you nothing about what brought the person there. Meta does
                the opposite. It claims the sale for the Instagram impression even
                though the person bought after a brand search they would probably
                have made anyway. GA4&rsquo;s default is data-driven attribution,
                which uses machine learning to spread fractional credit across the
                touches based on which ones actually tend to move conversions. So a
                single order can show up as part Google, part organic, part direct,
                and never as one clean whole number.
              </p>
              <p>
                There is a catch with GA4 that trips up a lot of smaller brands.
                Data-driven attribution only switches on once you have enough volume,
                roughly 400 conversions for that event and around 20,000 conversions
                in total within the lookback window. Below that, GA4 silently falls
                back to last-click and does not tell you. So you can be looking at a
                &ldquo;data-driven&rdquo; report that is quietly just last-click,
                crediting the bottom of your funnel and starving everything above it.
                If your brand is doing a few hundred orders a month, this is probably
                you. Worth checking before you trust a single number in that report.
              </p>
              <h3>They use different time windows</h3>
              <p>
                Attribution is not just about which touch gets credit. It is about
                how far back the system is willing to look. And every platform draws
                that line differently.
              </p>
            </div>

            <figure className={styles.figure}>
              <AttributionWindows />
            </figure>

            <div className="prose">
              <p>
                Meta&rsquo;s default is a 7-day click and 1-day view window. Click
                the ad, buy within seven days, it counts. See the ad without
                clicking, buy within one day, it counts. Buy on day nine after
                clicking, Meta shows nothing, even though the ad genuinely started
                the journey. GA4&rsquo;s default lookback is longer, 30 days for the
                first touch that acquired the user and 90 days for the conversion
                itself, so it will still see a touch that Meta has already forgotten.
                Same sale, same ad, one platform credits it and the other has moved
                on.
              </p>
              <p>
                Meta has been quietly tightening these windows. In January 2026 it
                permanently removed the 7-day-view and 28-day-view options, and in
                March it changed click attribution so that only real link clicks
                count, not likes or comments or video views, which all moved to a
                separate engage-through bucket. The interesting part is the
                direction. When the platform that profits from looking good narrows
                its own definition to credit itself less, that tells you which number
                was inflated to begin with. It is moving closer to what your
                independent analytics would have said all along.
              </p>
              <h3>They resolve identity differently</h3>
              <p>
                For any of this to work, a system has to recognize that the person
                who saw the ad and the person who bought are the same human. That
                recognition is held together by cookies, and cookies have been
                falling apart for years.
              </p>
              <p>
                In Playbook 1 the problem was the mobile-to-desktop jump, someone
                sees the ad on their phone and buys on their laptop, and no system
                connects the two. The layer underneath that is worse. Even on a
                single device, Safari&rsquo;s tracking prevention caps any cookie set
                by JavaScript at seven days, and drops it to twenty-four hours if the
                link that brought the person in carried a click ID like fbclid or
                gclid. So a Safari user who takes longer than a week to come back
                looks like a brand new person. The journey resets. The original ad
                touch is gone.
              </p>
              <p>
                This is where the honest answer for Indian D2C is different from the
                Western playbooks. Most of the scary &ldquo;you are losing half your
                data to Safari&rdquo; content is written for US and European
                audiences, where iPhones are everywhere. In India, Safari is around
                3% of browsing. The overwhelming majority of your traffic is Chrome
                on Android, so the Safari cookie problem is real but it is a small
                slice, mostly your higher-AOV iPhone buyers. The bigger identity gaps
                here come from cross-device journeys and from consent and ad-blocker
                loss on the Android side, not from Safari. Importing a 50% data-loss
                number into an Indian deck would be wrong, and a sharp founder would
                catch it.
              </p>
              <p>
                You can recover a chunk of this by firing events through a proxy on
                your own domain so the cookies are server-set rather than written by
                JavaScript in the browser. It genuinely helps. It does not recover
                everything, and if the proxy runs on a cloud IP that does not match
                your site, Safari reapplies the seven-day cap anyway. So treat it as
                closing part of the gap, not sealing it.
              </p>
              <h3>They count different things as a conversion</h3>
              <p>
                This is the one almost nobody accounts for, and it is the simplest.
                The four systems do not even agree on what the word
                &ldquo;conversion&rdquo; means.
              </p>
              <p>
                Shopify counts an order. The moment payment is captured, that is one
                order, full revenue, no attribution, no model, no window. It is a
                financial record. GA4 counts a session in which a purchase event
                successfully fired in the browser, which means if the event was
                blocked, or the connection dropped, or the person closed the tab too
                fast, the sale happened but GA4 never saw it. Meta counts an
                attributed conversion, its own claim on a sale it thinks it
                influenced. Three systems, three definitions, and that is before you
                get into refunds, timezones, and currency, each of which moves the
                totals again.
              </p>
              <p>
                So when Shopify says 100 orders and GA4 says 78, GA4 did not lose 22
                orders. It counted a different thing, sessions where an event fired,
                and the gap is the orders whose events never reached it. The numbers
                were never the same measurement to begin with.
              </p>
            </div>
          </section>

          {/* So which one do you believe? */}
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>
              So which one do you believe?
            </h2>
            <div className="prose">
              <p>
                Here is the part that actually matters on Monday. You do not pick one
                platform and crown it. You pick the right source for each specific
                fact, and you bias toward the sources you can model.
              </p>
            </div>

            <figure className={styles.figure}>
              <DecisionFramework />
            </figure>

            <div className="prose">
              <p>
                For the absolute money and order count, go to the system of record.
                Revenue from Stripe or your database, orders from Shopify. These are
                not attribution numbers, they are facts about what was captured, and
                nothing models a sale better than the system that processed the
                payment.
              </p>
              <p>
                For where a user actually came from, trust your own product analytics
                tool, not the ad platform&rsquo;s self-report. And here is the real
                reason, the one that separates this from generic advice. You can
                model conversions in your own tool to fit your business. You can
                define what counts, set the window that matches your real buying
                cycle, stitch identity the way your funnel actually works, and shape
                the whole thing to your reality. You cannot do any of that to
                Meta&rsquo;s reported conversions. They are a black box optimized for
                Meta&rsquo;s story, and you have no levers. Given a number you can
                shape to the truth and a number you cannot touch, trust the one you
                can shape.
              </p>
              <p>
                For deciding where to put more budget, this is the spend-to-conversion
                mapping from Playbook 1. Take the spend from the ad platform, because
                spend is the one thing platforms have no reason to misreport, and map
                it against conversions from your own analytics or database. That gives
                you a real cost per acquisition by channel instead of the inflated one
                the platform shows you.
              </p>
              <p>
                Notice what every one of these has in common. The trustworthy number
                always comes from a source you control and can model, and the
                platform&rsquo;s role shrinks to the one input it cannot fake, which
                is how much you spent.
              </p>
            </div>
          </section>

          {/* What to do Monday */}
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>What to do Monday</h2>
            <div className="prose">
              <p>
                Pick your system of record and stop apologizing to the other
                dashboards for not matching it. Revenue and orders come from the
                system that captured the payment. That is your truth for how the
                business actually did.
              </p>
              <p>
                Then stop trying to reconcile the platforms to it. You will never get
                Meta, Google, and GA4 to agree with Shopify or with each other, and
                the hours spent chasing that are hours not spent on something real.
                Use the platform numbers for what they are good at, which is relative
                and directional reads. Is this campaign trending up or down, is this
                audience cheaper than that one. Not absolute truth, just direction.
              </p>
              <p>
                Bring it all into one place. Right now that is probably your product
                analytics tool, with spend mapped in from the platforms. Later it
                becomes a proper warehouse, which is a whole playbook of its own. The
                point is one place where you can see spend and real conversions side
                by side and model them to your business, rather than flipping between
                four tabs that each tell a different story.
              </p>
              <p>
                And before any of this works, check one unglamorous thing. The
                campaign name or ID has to be present as a UTM parameter on every
                paid link, flowing into your analytics tool. This is the join key.
                Without it, spend lives in Meta and conversions live in your analytics
                and there is no way to connect the two, no matter how good the rest of
                your setup is. Most attribution problems that look like model problems
                are actually this, a tagging problem hiding underneath. Fix the
                tagging first, then worry about the models.
              </p>
              <p>
                You will still have four numbers. You will just know what each one is
                for, and which one to act on.
              </p>
            </div>
          </section>

          <p className={styles.seriesNote}>
            This is Playbook 2 of a 12-part series on running an Indian D2C brand
            from a data perspective. Next: the handful of questions every D2C brand
            has to be able to answer with data, and what you actually get out of
            answering each one.
          </p>

          <p className={styles.backLink}>
            <Link href="/indian-d2c-playbook" className="card__cta">
              Back to the playbook
            </Link>
          </p>
        </article>
      </div>
    </div>
  );
}
