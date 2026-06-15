import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbSchema } from '@/lib/seo';
import Link from 'next/link';
import ReportedVsRealToggle from '@/components/playbook-metrics/ReportedVsRealToggle';
import GraphicDoubleCount from '@/components/playbook-metrics/GraphicDoubleCount';
import GraphicAttributionWindows from '@/components/playbook-metrics/GraphicAttributionWindows';
import GraphicCrossDevice from '@/components/playbook-metrics/GraphicCrossDevice';
import GraphicProxyArchitecture from '@/components/playbook-metrics/GraphicProxyArchitecture';
import GraphicDashboardsGrid from '@/components/playbook-metrics/GraphicDashboardsGrid';
import GraphicConversionFunnel from '@/components/playbook-metrics/GraphicConversionFunnel';
import styles from './MetricsPlaybook.module.css';

export const metadata: Metadata = {
  title: 'The Metrics That Lie',
  description:
    'What to actually measure for a D2C brand, and why your ad dashboard is wrong. Playbook 01 of the Indian D2C data series.',
  alternates: {
    canonical: '/indian-d2c-playbook/metrics-that-lie',
  },
};

export default function MetricsThatLiePage() {
  return (
    <div className="page-shell">
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Indian D2C Playbook', path: '/indian-d2c-playbook' },
          {
            name: 'The Metrics That Lie',
            path: '/indian-d2c-playbook/metrics-that-lie',
          },
        ])}
      />
      <div className="container">
        <header className="page-header">
          <div className="eyebrow">Playbook 01 · D2C Data Series</div>
          <h1 className="page-header__title">The Metrics That Lie</h1>
          <p className="page-header__intro">
            What to actually measure for a D2C brand, and why your ad dashboard is
            wrong.
          </p>
        </header>

        <article className={styles.article}>
          {/* The short version */}
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>The short version</h2>
            <div className="prose">
              <p>
                Your ad platforms are not lying about what you spent. They are
                lying about what it did.
              </p>
              <p>
                Meta reports the orders it drove. Google reports the orders it
                drove. Add them up and they will routinely claim more orders than
                you actually got, because they are both counting the same
                customers. Neither one knows what the other took credit for, and
                neither one is built to care.
              </p>
              <p>
                There is one number on an ad platform you can trust completely:
                the spend. You paid it. It left your account. Everything else in
                that dashboard is the platform marking its own homework. So the
                entire discipline of measuring a D2C brand correctly starts with
                one rule. Trust the spend. Map it to conversions from your own
                analytics, not theirs. Then build four dashboards on top of that
                honest base. The rest of this playbook is how.
              </p>
            </div>
          </section>

          {/* Section 1 */}
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>Section 1: See it for yourself</h2>
            <ReportedVsRealToggle />
            <div className="prose" style={{ marginTop: 'var(--space-6)' }}>
              <p>
                Flip the switch. Same month, same spend. One view is what your ad
                dashboards report. The other is what your own analytics would show
                after you stop double-counting.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>
              Section 2: Why the ad platforms over-report
            </h2>
            <div className="prose">
              <p>
                Ad platforms are not committing fraud. They are doing exactly what
                they are designed to do, which is the actual problem.
              </p>
              <p>
                Meta decides what counts as a Meta conversion. Google decides what
                counts as a Google conversion. When a customer sees your Meta ad,
                searches your brand on Google two days later, and buys, both
                platforms record that order as theirs. At any real volume the
                credit adds up to more orders than happened. The platforms are not
                reconciling against each other. They never will.
              </p>
            </div>

            <figure className={styles.figure}>
              <GraphicDoubleCount />
            </figure>

            <div className="prose">
              <p>
                Three mechanics drive most of the inflation, and they are worth
                knowing by name because they are all adjustable.
              </p>
              <p>
                The first is view-through attribution. Meta will count a
                conversion when someone was shown your ad, did not click, and
                bought within a day. It is on by default with a one-day view
                window. Meta counts an impression as your ad being half on screen
                for one second, so a fast scroll past your creative can qualify.
                Whether that impression actually caused the purchase is genuinely
                unknowable. Sometimes the ad planted the idea and the person came
                back later, in which case it contributed something. Sometimes the
                person was going to buy anyway and the impression was noise. Only
                Meta can connect the impression to the sale, and Meta cannot prove
                the ad was even seen. View-through is the single most
                inflation-prone setting in the platform.
              </p>
              <p>
                The second is the attribution window. Meta&rsquo;s default is
                seven-day click plus one-day view. A click today can take credit
                for a purchase a week later, even if a dozen other things happened
                in between.
              </p>
            </div>

            <figure className={styles.figure}>
              <GraphicAttributionWindows />
            </figure>

            <div className="prose">
              <p>
                The third is self-attribution bias, which is structural. Every
                platform&rsquo;s reporting exists to make that platform look like a
                good place to spend. That is not a glitch. That is the product.
              </p>
              <p>
                Here is the part people get wrong when they first hear all this.
                The fix is not to turn conversion tracking off. Meta and Google
                need the conversion signal to optimize your campaigns. Take it away
                and their algorithms target blind and your cost per acquisition
                climbs. Keep the tracking on. Just stop believing the numbers it
                hands back to you.
              </p>
              <p>
                Even Meta has effectively conceded the over-reporting. In 2026 they
                narrowed click attribution for website conversions to count only
                link clicks, instead of also counting reactions, shares, and other
                taps, and they said plainly the goal was to reduce the mismatch
                between Meta&rsquo;s reporting and third-party tools like Google
                Analytics. When the platform itself tightens its definition to look
                more like your independent analytics, that tells you which number
                was inflated and which one to trust.
              </p>
              <blockquote>
                <strong>The rule.</strong> Set up conversions on the ad platform so
                it can optimize. Read your spend from the platform. Read your
                conversions and revenue from your own analytics or database. Never
                the conversions from the platform itself.
              </blockquote>
            </div>
          </section>

          {/* Section 3 */}
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>
              Section 3: Your own analytics lies too, in two specific ways
            </h2>
            <div className="prose">
              <p>
                This is the part most &ldquo;just trust your own data&rdquo; advice
                skips, and skipping it is how people replace one wrong number with
                another. Your analytics tool is more honest than Meta, because it
                is not trying to sell you ad space. But it has two blind spots that
                will quietly wreck your numbers if you leave them unfixed. Both are
                fixable. Most brands fix neither.
              </p>
              <h3>Blind spot one: cross-device breaks attribution</h3>
              <p>
                A customer sees your Meta ad on their phone at lunch. That evening
                they open a laptop, go to your site, and buy.
              </p>
              <p>
                To your analytics, that is two different people. The mobile visitor
                who saw the ad and the desktop buyer who purchased share no
                connection. Different device, different session, different
                anonymous ID. The ad gets no credit. The purchase looks like it
                came from nowhere, which is how your &ldquo;direct&rdquo; traffic
                quietly fills up with sales that ads actually drove.
              </p>
              <p>
                In India this is worse than the global default. Discovery happens
                on mobile. Considered purchases often move to a laptop or a shared
                family device. People browse on one phone and pay from another.
              </p>
            </div>

            <figure className={styles.figure}>
              <GraphicCrossDevice />
            </figure>

            <div className="prose">
              <p>
                The fix is to capture an email on mobile, early. Put a lightweight
                email step near the top of your mobile ad funnel, a
                discount-for-email popup, a notify-me, a short form. Once you have
                an email on mobile and the same email at checkout on desktop, you
                can stitch the two sessions into one person. That shared identifier
                is the thread that reconnects the ad to the sale. You will not
                catch everyone. Going from zero cross-device stitching to even half
                of it changes how much of your &ldquo;direct&rdquo; bucket you can
                correctly trace back to ads.
              </p>
              <h3>Blind spot two: you are losing about a third of your events</h3>
              <p>
                This is the technical one, and it is the most expensive problem on
                this page because it is invisible. Across the Indian D2C accounts I
                have looked at, the data loss from this tends to sit around 30%.
                Your number depends on your traffic, and I will come back to why,
                but 30% is a fair planning figure for an Indian consumer brand.
              </p>
              <p>
                When you fire analytics the standard way, a script loaded from a
                third-party domain like the analytics or pixel vendor, sending data
                straight to that vendor, a large share of those events never
                arrive. Three things kill them before they fire.
              </p>
              <p>
                Ad blockers, which block known tracking domains outright. Adoption
                is high and skews toward the more technical, higher-spending end of
                your audience.
              </p>
              <p>
                Safari&rsquo;s Intelligent Tracking Prevention. Any cookie written
                by JavaScript in the browser is capped at a seven-day lifetime on
                Safari, and dropped to twenty-four hours when a known click
                identifier like a Google or Meta click ID is in the URL. Because
                this runs at the browser engine level, it applies to every browser
                on iOS, not just Safari. Your returning customer on an iPhone can
                look like a brand-new visitor every week.
              </p>
              <p>
                Browser privacy defaults more broadly. Firefox strict mode and
                Brave block analytics as a category with no action from the user.
              </p>
              <p>
                The result is that a meaningful share of your website events are
                never recorded. Your conversion rate reads lower than it is. Your
                funnels show drop-off that did not happen. You are optimizing
                against data with a chunk missing, and you cannot see which chunk.
              </p>
              <p>
                The cruel detail is which users you lose. Safari and iOS users skew
                toward higher average order value. The customers your tracking
                drops are disproportionately your most valuable ones. So this is
                not random noise that averages out. It is a systematic bias against
                your best segment.
              </p>
              <p>
                The fix is to fire events through a first-party proxy, paired with
                server-side tracking. Instead of the browser sending events to a
                third-party vendor domain, you route them through your own domain
                first. You stand up a tracking endpoint on a subdomain of your own
                site, say data.yourbrand.com, that receives the events and forwards
                them to your analytics and to the ad platforms&rsquo; conversion
                APIs. To the browser these are first-party requests going to your
                own domain, so ad blockers and ITP do not treat them as cross-site
                tracking. For the ad platforms specifically you pair this with
                their server-side conversion APIs, Meta&rsquo;s CAPI and
                Google&rsquo;s server-side tagging, so conversions are sent server
                to server and bypass browser blocking entirely. As a side benefit
                this improves the optimization signal you feed the platforms in
                Section 2, because the match quality goes up.
              </p>
              <p>
                The architecture is simple to state. Browser, then your own domain
                running the proxy or server-side container, then out to your
                analytics and the ad platform APIs.
              </p>
            </div>

            <figure className={styles.figure}>
              <GraphicProxyArchitecture />
            </figure>

            <div className="prose">
              <p>
                Two honest caveats, because this is where vendors oversell. First,
                server-side does not magically restore everything. A realistic
                recovery is a large portion of what was lost, not all of it.
                Second, the setup has a real trap. Safari now checks whether the
                server setting your cookies shares an IP with your main website, and
                a basic server-side container running on a cloud provider&rsquo;s IP
                fails that check and still gets the seven-day cap. Doing this
                properly means deploying on infrastructure that genuinely looks
                first-party, handling consent correctly, and keeping identity
                stitched across the proxy. It is real engineering, and it pays for
                itself the day it is live, because you stop flying blind on a third
                of your traffic. This is the kind of setup we do, so flag it if you
                want a hand.
              </p>
              <blockquote>
                <strong>The takeaway for Section 3.</strong> Your own data is the
                source of truth, but only after you stitch identity across devices
                and stop leaking a third of your events. Do both before you trust a
                single conversion number.
              </blockquote>
            </div>
          </section>

          {/* Section 4 */}
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>
              Section 4: The four dashboards that actually matter
            </h2>
            <div className="prose">
              <p>
                Once the base is honest, spend from the ad platforms, conversions
                from your stitched and proxied analytics, you need somewhere to
                look. Not forty metrics. Four dashboards. Each answers one question,
                each has the breakdowns that drive a decision, and each has a caveat
                you ignore at your cost.
              </p>
            </div>

            <figure className={styles.figure}>
              <GraphicDashboardsGrid />
            </figure>

            <div className={styles.dashboard}>
              <h3 className={styles.dashboardTitle}>Dashboard one: New Users</h3>
              <div className="prose">
                <p>
                  The question. Who is showing up, and where are they coming from.
                </p>
                <p>
                  This sits at the top of everything. Before conversion, before
                  revenue, you need the shape of your incoming traffic, how many,
                  from where, on what.
                </p>
                <p>
                  The breakdowns that matter. Source and channel, paid social, paid
                  search, organic, direct, referral, WhatsApp, read against spend
                  the way Section 2 demands. Geography, country and within India the
                  city tiers, because metro and tier-two behavior diverge sharply.
                  Device, the mobile and desktop split, which feeds straight into
                  the cross-device problem. New versus returning, so you know what
                  share of today is genuinely new.
                </p>
                <p>
                  The caveat. Direct traffic is a lie detector. If it is large and
                  growing, you usually do not have a loyal type-in audience, you
                  have an attribution leak. Fix Section 3 before you trust this
                  dashboard&rsquo;s source split.
                </p>
              </div>
            </div>

            <div className={styles.dashboard}>
              <h3 className={styles.dashboardTitle}>
                Dashboard two: Funnel Conversion
              </h3>
              <div className="prose">
                <p>
                  The question. Where in the journey are you losing people, and for
                  whom is it worse.
                </p>
                <p>
                  The full path, new user to product view to add to cart to checkout
                  started to payment to order. This is the workhorse. Everything you
                  change on the site or in acquisition shows up here first.
                </p>
              </div>

              <figure className={styles.figure} style={{ marginTop: 'var(--space-6)' }}>
                <GraphicConversionFunnel />
              </figure>

              <div className="prose" style={{ marginTop: 'var(--space-6)' }}>
                <p>
                  The breakdowns that matter. By source, because the paid-social
                  funnel looks nothing like the organic one, paid often adds to cart
                  and bounces while organic converts deeper, and blending them hides
                  both. By device, because a mobile drop between cart and payment
                  may be people finishing on a laptop, not people leaving. By new
                  versus returning, because returning users skip stages and mixing
                  them inflates your new-user rate. By landing page and campaign, to
                  see which entry points convert and which just burn spend.
                </p>
                <p>
                  The caveat. A drop-off here is only real if your events are
                  firing. If you have not proxied your tracking, the gap between two
                  steps might be missing data rather than lost customers. Stitch and
                  proxy first, then diagnose the funnel, or you will spend a sprint
                  fixing a step that was never broken.
                </p>
              </div>
            </div>

            <div className={styles.dashboard}>
              <h3 className={styles.dashboardTitle}>Dashboard three: Product Sold</h3>
              <div className="prose">
                <p>
                  The question. What are people actually buying, and in what
                  combinations.
                </p>
                <p>
                  Acquisition and funnels tell you about people. This tells you
                  about products, and it is where merchandising, inventory, and
                  bundling decisions get made.
                </p>
                <p>
                  The breakdowns that matter. By SKU, the top sellers, the slow
                  movers, the long tail. By category and variant, which sizes,
                  shades, flavors, bundles move. First order versus repeat, what
                  gets bought first versus what brings people back, which feeds
                  Dashboard four directly. Basket composition, what sells together,
                  units per order, AOV by product. By source, because different
                  channels often sell different products and your paid-social hero
                  SKU can be invisible in organic.
                </p>
                <p>
                  The caveat. Revenue by product from analytics drifts from real
                  orders, because of returns, cancellations, and failed
                  cash-on-delivery, and COD failure is a serious factor in India
                  specifically. For anything money-critical, reconcile against your
                  order and payment system of record, not the analytics tool.
                  Analytics is for behavior. Your backend is the truth on rupees.
                </p>
              </div>
            </div>

            <div className={styles.dashboard}>
              <h3 className={styles.dashboardTitle}>Dashboard four: Retention</h3>
              <div className="prose">
                <p>
                  The question. Do people come back and buy again, and is the
                  business actually compounding.
                </p>
                <p>
                  This is the dashboard founders look at last and should look at
                  first. Acquisition is rented. Retention is owned. A brand that
                  cannot retain is just buying revenue from Meta on a loop.
                </p>
                <p>
                  The breakdowns that matter. Repeat purchase rate, the share who
                  place a second order and a third. Time to second order, the gap
                  and whether it is shrinking, which sets your whole CRM cadence.
                  Same product versus different, whether they rebuy the hero SKU,
                  which is predictable consumable behavior, or cross-buy into the
                  catalog, which is a range-expansion opening, because those are
                  different motions. Cohort retention, grouping customers by
                  acquisition month and watching how each cohort holds up over time,
                  which is the most honest chart you have about whether the business
                  is getting healthier. By acquisition source, because a channel
                  with great CAC and terrible retention is a trap, and you can only
                  see the trap here.
                </p>
                <p>
                  The caveat. Retention only makes sense with stitched identity from
                  Section 3. If one human shows up as three anonymous IDs across
                  devices, your repeat rate is understated and retention looks worse
                  than it is. The plumbing is not a nice-to-have here. It is the
                  foundation of the number.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>Section 5: What to do Monday</h2>
            <div className="prose">
              <p>
                In order. Do not jump to the dashboards before the plumbing, or you
                are just looking at the same lies in a nicer interface.
              </p>
              <p>
                One. Stop trusting platform conversions today. Keep the conversion
                tracking on for optimization, but from now on judge performance by
                spend from the platform mapped to conversions from your own tool.
                Re-pull last month that way. The number will drop, and the lower
                number is the real one.
              </p>
              <p>
                Two. Proxy your events. Stand up first-party and server-side
                tracking so you stop losing roughly a third of your data. This is
                the highest-leverage fix and the one most likely to need technical
                help, and every number downstream depends on it.
              </p>
              <p>
                Three. Add email capture on mobile ads. A light email step on
                mobile campaigns so you can stitch cross-device identity. Cheap to
                add, and it changes how much of your direct traffic you can trace
                back to ads.
              </p>
              <p>
                Four. Stand up the four dashboards. New Users, Funnel Conversion,
                Product Sold, Retention, each with its breakdowns and its caveat.
                Start here. Expand later.
              </p>
              <p>
                Do these four and you will be looking at a version of your business
                that is actually true. Most of your competitors never will.
              </p>
            </div>
          </section>

          <p className={styles.seriesNote}>
            This is Playbook 1 of a 12-part series on running an Indian D2C brand
            from a data perspective. Next: why every number in your business
            disagrees, and which one to believe. The attribution reality check.
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
