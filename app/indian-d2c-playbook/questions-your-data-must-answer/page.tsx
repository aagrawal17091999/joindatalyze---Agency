import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbSchema } from '@/lib/seo';
import Link from 'next/link';
import TwoLayerDashboard from '@/components/playbook-metrics/TwoLayerDashboard';
import FlatNumberFansOut from '@/components/playbook-metrics/FlatNumberFansOut';
import styles from './QuestionsPlaybook.module.css';

export const metadata: Metadata = {
  title: 'The questions your data has to answer',
  description:
    'Analytics questions come in two layers, and almost every brand is stuck on the first one. Telling them apart, and climbing to the layer that changes what you do. Playbook 03 of the Indian D2C data series.',
  alternates: {
    canonical: '/indian-d2c-playbook/questions-your-data-must-answer',
  },
};

export default function QuestionsYourDataMustAnswerPage() {
  return (
    <div className="page-shell">
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Indian D2C Playbook', path: '/indian-d2c-playbook' },
          {
            name: 'The questions your data has to answer',
            path: '/indian-d2c-playbook/questions-your-data-must-answer',
          },
        ])}
      />
      <div className="container">
        <header className="page-header">
          <div className="eyebrow">Playbook 03 · D2C Data Series</div>
          <h1 className="page-header__title">
            The questions your data has to answer
          </h1>
          <p className="page-header__intro">
            Analytics questions come in two layers. Almost every brand is stuck on
            the first one, mistaking a full dashboard for understanding. The money
            is in the second.
          </p>
        </header>

        <article className={styles.article}>
          {/* The short version */}
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>The short version</h2>
            <div className="prose">
              <p>
                Analytics questions come in two layers, and almost every brand is
                stuck on the first one without realising it.
              </p>
              <p>
                The first layer describes where your product stands right now.
                Where do users come from, how many add to cart, how many buy, which
                source has the best return, where do people drop off, what gets
                purchased, how many come back. These are necessary and most brands
                can answer them once their tracking is in place. The problem is that
                they only describe. A full dashboard of these numbers feels like
                understanding, and it isn&rsquo;t.
              </p>
              <p>
                The second layer is the one that changes what you do. Why do users
                behave the way they do, and what happens if you change something.
                People who view five or more products convert far better than people
                who view one. Traffic from one specific landing page converts at
                roughly twice the rate of the rest. Two products in the same
                category, same price, same shelf, behave nothing alike. These are
                hypotheses you can act on, and they are where the money is.
              </p>
              <p>
                This playbook is about telling the two apart, knowing which
                questions are worth instrumenting for, and climbing from the layer
                you have to the layer you don&rsquo;t.
              </p>
            </div>
          </section>

          {/* Interactive: the two-layer dashboard — the opening gut-punch */}
          <TwoLayerDashboard />

          {/* You already have the first layer */}
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>
              You already have the first layer, and it hasn&rsquo;t made you
              sharper
            </h2>
            <div className="prose">
              <p>
                Open the dashboard of almost any D2C brand doing a few crore a year
                and you will find the same screen. Sessions, conversion rate, top
                traffic sources, a funnel from product view to purchase, a
                repeat-rate number, revenue by channel. It is a competent dashboard.
                The founder looks at it every morning. And the decisions still get
                made on gut, because the dashboard answers the wrong half of the
                question.
              </p>
              <p>
                Here is the gap. Your dashboard tells you 60% of people drop at
                checkout. That is a true, useless sentence. It does not tell you
                that the drop is almost entirely on mobile, almost entirely
                first-time visitors, and almost entirely after they hit the
                cash-on-delivery-unavailable message for their pincode. The first
                sentence makes you stare. The second sentence makes you fix the COD
                flow on mobile for new users in those pincodes, and then go measure
                whether it worked. One of those is analytics. The other is a number
                you screenshot for the investor update.
              </p>
              <p>
                This is not a tooling problem. You don&rsquo;t need a better
                dashboard or another platform. You have collected the data to{' '}
                <em>have</em> it, the way most brands do, instead of collecting it to
                answer something specific. The fix is not more instrumentation. It
                is starting from the decision and working backwards to the data,
                which means knowing what separates a question worth chasing from a
                number worth ignoring.
              </p>
            </div>

            <figure className={styles.figure}>
              <FlatNumberFansOut />
            </figure>
          </section>

          {/* The two layers, named properly */}
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>The two layers, named properly</h2>
            <div className="prose">
              <p>
                It helps to give the two layers names, because once you can see
                which one you are in, you stop confusing a populated dashboard for an
                understood business.
              </p>
              <p>
                <strong>Layer one is descriptive.</strong> It answers{' '}
                <em>where are we</em>. What is our conversion rate, which channel
                drives the most revenue, how many people came back this month, where
                do they fall out of the funnel. These questions have a single number
                as an answer, the number sits on a dashboard, and the moment you have
                it you are done. They are necessary. You cannot run a brand blind to
                them. But they describe a state, they do not point at an action, and
                a brand that only has layer one will always feel data-rich and
                decision-poor at the same time.
              </p>
              <p>
                <strong>Layer two is behavioural.</strong> It answers <em>why</em>,
                and <em>what happens if</em>. Why do users from this source convert
                better. What is the one action in the first session that predicts a
                second purchase. Which product turns a buyer into a repeat buyer
                instead of a one-time order. These questions don&rsquo;t have a
                single number as an answer. They have a hypothesis, a segment, and a
                test. They require event-level data, not just aggregate counts, and
                they require you to slice that data by who the user is and what they
                did. That is harder, which is exactly why most brands never get here,
                and exactly why the brands that do pull ahead.
              </p>
              <p>
                The test that decides whether any question, in either layer, is worth
                instrumenting for is the same, and it has four parts. A real
                question, the decision it would change, the data you need to answer
                it, and where that data lives. If you can fill all four cells, the
                question earns its place. If the decision cell is empty, meaning you
                cannot name a single thing you would do differently based on the
                answer, it is not a question. It is a number you will look at and
                move on from. The decision cell is the one that matters, and it is the
                one founders skip.
              </p>
            </div>
          </section>

          {/* Layer one */}
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>
              Layer one: the questions you should already be able to answer
            </h2>
            <div className="prose">
              <p>
                This is the table-stakes set. You probably have most of it. The point
                of listing it is not to teach it, it is to give you a checklist so
                you know what is genuinely missing versus what just feels missing, and
                to be honest about where each number stops being useful.
              </p>
              <p>
                <strong>Where are people coming from.</strong> Your acquisition
                source mix, by real channel, not by whatever the ad platforms each
                claim. Tells you where your traffic originates. Stops short of telling
                you which of those sources brings people who actually stick, which is
                a layer-two question.
              </p>
              <p>
                <strong>How many add to cart, and how many of those buy.</strong> The
                two core funnel conversions. Tells you the shape of your funnel. Stops
                short of telling you why people fall out at each step, or whether the
                fallout is concentrated in one segment.
              </p>
              <p>
                <strong>Which source gives the best return.</strong> Revenue, ideally
                contribution margin, against spend by channel. Tells you where your
                money is currently working. Worth remembering that source affects
                conversion enormously, a channel like email or direct will
                out-convert cold social by several times, so a blended number across
                all of them hides more than it shows.
              </p>
              <p>
                <strong>Where people drop in the funnel.</strong> The step-by-step
                fallout from landing to paid. Tells you which stage leaks. This is the
                single most valuable layer-one number to have segmented, because the
                aggregate drop is almost always made of one or two specific segments
                behaving badly, and that is the bridge into layer two.
              </p>
              <p>
                <strong>What gets purchased.</strong> Your product and category sales
                mix. Tells you what sells. Stops short of telling you which products
                create repeat buyers versus which just sell once, which is the
                difference between a hero product and a popular one.
              </p>
              <p>
                <strong>How many people come back.</strong> Your repeat or retention
                rate, ideally as a cohort and not a single blended percentage. Tells
                you whether the business compounds or leaks. A blended repeat rate is
                the most over-trusted number in D2C, because it averages your good
                cohorts and your bad ones into a figure that hides both.
              </p>
              <p>
                That is layer one. If you cannot answer one of these, that gap is your
                instrumentation backlog, and it is worth closing before you do
                anything fancier. But closing it is not the finish line. It is the
                price of admission to the layer that actually moves the business.
              </p>
            </div>
          </section>

          {/* Layer two */}
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>
              Layer two: the questions that change what you do
            </h2>
            <div className="prose">
              <p>
                These are the ones worth obsessing over. Each is a hypothesis about
                your own users, framed so the answer points at an action. I have seen
                versions of all of these play out across the Indian D2C accounts I
                have worked on, and the specific shape always differs by brand, which
                is the entire reason you have to go find yours rather than borrow
                mine.
              </p>
              <p>
                <strong>
                  Does browsing depth cause conversion, or just correlate with it.
                </strong>{' '}
                Across the accounts I have looked at, users who view five or more
                products convert far better than users who view one or two. That much
                is easy to see. The hard and useful question is which way the arrow
                points. It may be that engaged, high-intent buyers naturally browse
                more, in which case the depth is a symptom and pushing people to view
                more products does nothing. Or it may be that browsing genuinely
                builds intent, in which case surfacing related products, better
                discovery, and a reason to keep looking would lift conversion
                directly. You answer it by looking at whether people who are{' '}
                <em>nudged</em> into more views, by a merchandising change, convert
                better than people who weren&rsquo;t, not by staring at the
                correlation. The decision this changes is whether you invest in
                product discovery and recommendations at all. To see it you need
                product-view events tagged to sessions and users, sliced by how the
                session started.
              </p>
              <p>
                <strong>
                  Which sources bring buyers who come back, not just buyers.
                </strong>{' '}
                Every channel report tells you who converted. Almost none tell you who
                is still around in ninety days. The source with the cheapest first
                purchase is routinely not the source with the best second purchase,
                and a brand optimising spend on first-purchase ROAS will happily pour
                money into a channel that brings one-time buyers and starve the
                channel that brings a base. The decision this changes is where your
                next rupee of acquisition spend goes, and it is the natural sequel to
                trusting your own numbers over the platforms. To see it you need
                first-purchase source stitched to each customer and their repeat
                behaviour over time, which means customer-level data, not
                campaign-level data.
              </p>
              <p>
                <strong>Where exactly do people drop, once you segment it.</strong>{' '}
                The aggregate funnel drop is the layer-one number. The layer-two
                version is the same funnel cut by device, by new versus returning, by
                source, by pincode serviceability. In Indian D2C this matters more
                than almost anywhere, because mobile is not a slice of your traffic,
                it is roughly three-quarters of it, and mobile usually converts lower
                than desktop. The size of that gap is something your own segmented
                data should tell you, not a benchmark, because it varies wildly by
                brand and category. When you cut the drop properly you stop seeing
                &ldquo;60% leave at checkout&rdquo; and start seeing
                &ldquo;first-time mobile users in non-metro pincodes leave at checkout
                when COD isn&rsquo;t offered,&rdquo; which is a fixable thing with an
                owner. The decision this changes is what you fix first, and in what
                order.
              </p>
              <p>
                <strong>
                  Which products create repeat buyers, and which just sell once.
                </strong>{' '}
                Your bestseller list ranks products by units. It says nothing about
                what a product does to the customer who buys it. Some products are
                gateways, the first thing someone buys before becoming a loyal
                multi-product customer. Others sell in volume and never lead to a
                second order. Two products in the same category, at the same price,
                routinely behave completely differently on this axis, and the only way
                to know is to look at the repeat behaviour of people whose first order
                contained each one. The decision this changes is what you feature,
                what you bundle, what you put your acquisition behind, and crucially
                what you push on quick commerce, where you are buying a first trial and
                want it to be a product that pulls people back. To see it you need
                first-order product composition joined to each customer&rsquo;s repeat
                history.
              </p>
              <p>
                <strong>
                  What is the trigger that turns a first-time buyer into a repeat one.
                </strong>{' '}
                This is the most valuable question on the list and the hardest to
                answer. Somewhere in the first order or the first few days, there is
                an action, or a product, or a window of time, that separates the
                customers who come back from the ones who don&rsquo;t. Subscribing to
                the list. Buying a specific entry product. Coming back within a certain
                number of days. Reaching a second order before a certain point. Find
                that trigger and your entire activation strategy has a target, because
                now you know what to nudge every new customer toward instead of
                guessing. The decision this changes is where you spend your retention
                effort, which lifecycle messages you send and when, and what your
                post-purchase flow is actually trying to make happen. To see it you
                need cohorts of first-time buyers tracked forward, with their early
                actions tagged, compared on whether they came back.
              </p>
              <p>
                None of these has a single-number answer. Each is a hypothesis you
                confirm or kill with a segment and, ideally, a test. That is what
                layer two is, and it is why a brand cannot buy its way into it with a
                better dashboard. The dashboard shows you layer one. Layer two you
                have to go and dig for.
              </p>
            </div>
          </section>

          {/* The questions that feel important but aren't */}
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>
              The questions that feel important but aren&rsquo;t
            </h2>
            <div className="prose">
              <p>
                Some numbers get watched obsessively and fail the decision test
                completely. They feel like analytics because they go up and to the
                right, but nobody can name a thing they would do differently if they
                moved.
              </p>
              <p>
                Total signups, total followers, total registered users. Cumulative
                counts that only ever go up, which is exactly why they tell you
                nothing, a number that cannot go down cannot inform a decision. Your
                blended conversion rate, with no segment attached, which averages your
                best and worst traffic into a figure that is true and useless in the
                same way the aggregate funnel drop is. Sessions and pageviews as a
                headline, when the question is always <em>which</em> sessions and{' '}
                <em>whose</em>. Bounce rate at the top of the dashboard, when it
                changes meaning entirely depending on the page and the source. None of
                these is wrong to have. They are wrong to lead with, and a layer-one
                number with no layer-two question behind it is not insight, it is just
                a screenshot you will show someone and then close.
              </p>
              <p>
                The test catches all of them. If doubling the number changes nothing
                you would do, and halving it changes nothing you would do, it is not a
                metric you manage. It is a metric you report.
              </p>
            </div>
          </section>

          {/* What to do Monday */}
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>What to do Monday</h2>
            <div className="prose">
              <p>
                Start by confirming you can actually answer every layer-one question.
                Walk the six. For each one you cannot answer cleanly, that is not a
                dashboard gap, that is an instrumentation task, and it goes on a list.
                Closing that list is the foundation and it is worth doing properly
                before anything else, because every layer-two question is built on top
                of clean layer-one data.
              </p>
              <p>
                Then do the part almost nobody does. Write down three hypotheses about
                your own users, in layer-two form, decision attached. Not &ldquo;what
                is our conversion rate&rdquo; but &ldquo;I think buyers who start on
                our bestseller page come back more, and if that&rsquo;s true I should
                send more cold traffic there.&rdquo; Then go check each one against
                your data. Some will be wrong, which is the point, a killed hypothesis
                is a real result. The ones that survive are the most valuable thing
                your analytics will produce this quarter, because each one is a
                decision you can now make with evidence instead of instinct.
              </p>
              <p>
                The catch is that every layer-two question depends on event-level data
                that is tagged correctly and consistently, and for most brands that is
                exactly where things fall apart. You cannot ask which products create
                repeat buyers if your purchase event doesn&rsquo;t reliably carry the
                products. You cannot find the second-purchase trigger if your events
                don&rsquo;t tie back to a stable customer identity. Knowing the
                questions is half of it. The other half is instrumenting the events
                that answer them, designed so they don&rsquo;t collapse the moment you
                scale spend, which is where this series goes next.
              </p>
            </div>
          </section>

          <p className={styles.seriesNote}>
            This is Playbook 3 of a 12-part series on running an Indian D2C brand
            from a data perspective. Next: the events you have to track and the
            tracking taxonomy that holds up, so the layer-two questions actually have
            clean data to run on before you scale.
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
