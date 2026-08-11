import type { Metadata } from 'next';
import CtaButton from '../_components/cta-button';
import Faq from '../_components/faq';
import Failures from './_components/failures';
import QueryDemo from './_components/query-demo';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbSchema, faqPageSchema, orgRef, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'AI Analytics Agent',
  description:
    'Most AI data tools confidently give wrong answers. We fix the foundation, build the business context, and ship an AI analytics agent your team can trust.',
  alternates: { canonical: '/ai-analytics-agent' },
};

const METHOD_STEPS = [
  {
    num: '01',
    title: 'We start with how your business actually works',
    body: "We don't begin with your schema. We begin with your team. What questions do they ask the analyst every week? What metrics matter to your CEO? What language does your product team use that's different from your finance team? The answers to these questions become the foundation of the knowledge base — and the reason the agent will eventually understand the difference between \u201Cactive users\u201D and \u201Cpaying users\u201D without being asked twice.",
    fixesLabel: 'The "no business context" failure.',
    fixesRest: 'Most tools start with your data schema. We start with your business.',
  },
  {
    num: '02',
    title: 'We clean and model your data so the agent can reason over it',
    body: 'Raw data breaks AI. Misnamed events, drifted definitions, broken pipelines, and stale tables produce hallucinated answers no matter how good the model is. We audit your full data layer — product events, warehouse tables, pipelines, definitions — and rebuild the parts that the agent will need to query. You end up with clean, reusable tables as a side benefit, even outside the AI agent itself.',
    fixesLabel: 'The "hallucinated numbers" failure.',
    fixesRest:
      'Clean data inputs are non-negotiable. Skip this and the model will lie to you with confidence.',
  },
  {
    num: '03',
    title: "We build the agent's brain",
    body: "This is what every other AI analytics tool skips, and it's the single biggest reason most of them don't work. We create a deep knowledge base covering your business context, metric definitions, table relationships, common questions, and the gotchas only a senior analyst would know (\u201Cif someone asks for revenue, use the deduped Stripe table, not the raw events one\u201D). The agent doesn't just see your schema — it understands your product.",
    fixesLabel: 'The "can\'t answer the questions that matter" failure.',
    fixesRest:
      'This is the difference between a chatbot that runs SQL and an agent that thinks like an analyst.',
  },
  {
    num: '04',
    title: 'We build the agent or set up the right tool',
    body: "With clean data and a real knowledge base in place, we either build a custom AI agent tailored to your product, or we configure a best-in-class tool like Julius AI, Vanna.ai, or DataGPT on top of your foundation. The choice depends on your stack, your budget, and how custom your needs are. We'll recommend the right path on the first call — and we have no incentive to push you toward the more expensive option.",
    fixesLabel: 'Lock-in and overspend.',
    fixesRest:
      "Most agencies will sell you their custom build because that's what they make money on. We'll tell you when an off-the-shelf tool would do the job better.",
  },
  {
    num: '05',
    title: 'Two weeks of supervised testing on your real questions',
    body: "Your team uses the agent on real questions for two weeks. We sit alongside, tracking where it's right, where it's off, where it's almost-right-but-subtly-wrong. We refine the knowledge base, add missing context, and tighten the responses until the team trusts what comes back. This is the step that decides whether the agent gets used or quietly abandoned in three months.",
    fixesLabel: 'The "team stops using it" failure.',
    fixesRest:
      'No AI tool earns trust without supervised early use. We build that trust deliberately.',
  },
  {
    num: '06',
    title: 'We keep it sharp over time',
    body: "Your data changes. New tables, new events, new metrics, new questions from new hires. Without ongoing maintenance, the knowledge base goes stale and the agent's accuracy degrades within a quarter. We offer ongoing maintenance plans — keeping the data model current, expanding the knowledge base, and retraining when something material changes in how your business measures itself.",
    fixesLabel: 'Slow decay.',
    fixesRest:
      "The reason AI tools die in production isn't the launch — it's the lack of upkeep.",
  },
];

const PATHS = [
  {
    label: 'Path A',
    title: 'Custom AI Agent',
    body: 'We build the agent ourselves, tailored to your stack and your business logic. You own the code, the knowledge base, and the deployment. No per-seat pricing. No vendor lock-in.',
    bestFor:
      'Complex data, unique product logic, sensitive data that can\u2019t go through third-party tools, or teams that want full control over how the agent behaves.',
    timeline: '4\u20136 weeks build + ongoing maintenance',
  },
  {
    label: 'Path B',
    title: 'Tool Setup',
    body: 'We configure a best-in-class AI analytics tool — Julius AI, Vanna.ai, or DataGPT — on top of your cleaned data and knowledge base. You get the polish of a productized tool with the foundation work that makes it actually accurate.',
    bestFor:
      'Teams whose data and business logic fit cleanly into an existing tool\u2019s model, buyers who want a polished UI out of the box, or those who\u2019d rather pay a SaaS subscription than maintain custom code.',
    timeline: '3\u20134 weeks setup + ongoing maintenance',
  },
];

const AGENT_FAQS = [
  {
    q: 'How is this different from buying Julius AI or DataGPT directly?',
    a: "You can absolutely buy those tools directly. Most companies that do find out within a month that the tools don't work on their data — because their data is messy, their definitions are inconsistent, and there's no business context loaded into the tool. We do the foundation work that makes those tools (or a custom agent) actually accurate. About a third of our engagements are tool setups, not custom builds.",
  },
  {
    q: 'Why do most AI analytics agents give bad answers?',
    a: "Three reasons, in order of impact: (1) the data they're querying is broken — misnamed events, drifted definitions, stale tables; (2) the model has no idea what your business metrics actually mean — it's reading your schema like a tourist reading street signs in a foreign language; (3) nobody validated the answers in the first few weeks, so wrong answers slipped through and trust eroded. We solve all three.",
  },
  {
    q: 'How long does this take to build?',
    a: 'Most engagements run 4\u20136 weeks end to end. The foundation work (cleaning data, building the knowledge base) takes 2\u20133 weeks. The agent build or tool setup takes 1\u20132 weeks. The supervised testing phase takes 2 weeks. We can start within a day of signing.',
  },
  {
    q: 'Do I need SQL or technical skills to use the agent?',
    a: 'No. That\u2019s the whole point. Your team asks questions in plain English ("what\u2019s our paid conversion rate in Germany this month?") and the agent runs the right query against the right table and returns the answer. The technical work happens once, during the build — your team never touches SQL.',
  },
  {
    q: 'What if I already have an analyst?',
    a: "Even better. The agent doesn't replace your analyst — it removes the repetitive questions from their queue so they can focus on the analysis that actually requires a human. Most of our clients see their analyst's productivity jump because they're no longer answering \u201Cwhat's our MRR\u201D for the fifth time this week.",
  },
  {
    q: 'What if the agent gives a wrong answer after we launch?',
    a: 'It will, occasionally — every AI tool does. The difference is that during the supervised testing phase, we catch the failure modes early and refine the knowledge base before the team relies on the answers. After launch, ongoing maintenance keeps the accuracy up. We monitor the question patterns, and when the agent starts getting something wrong, we fix it within the week.',
  },
  {
    q: 'Can you work with our existing data warehouse?',
    a: "Yes. We work fluently with BigQuery, Snowflake, Databricks, Postgres, and most modern warehouses, plus the pipelines and modeling layers around them (dbt, Fivetran, Segment, Rudderstack). If your data lives somewhere unusual, mention it on the first call and we'll tell you straight whether we can handle it.",
  },
];

export default function AIAnalyticsAgentPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'AI Analytics Agent', path: '/ai-analytics-agent' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'AI Analytics Agent',
            serviceType: 'AI analytics agent setup',
            provider: orgRef,
            url: `${SITE_URL}/ai-analytics-agent`,
            areaServed: 'Worldwide',
            description:
              'We fix your data foundation, build the business-context knowledge base, and ship an AI analytics agent your team can actually trust.',
          },
          // Generated from the same AGENT_FAQS array the <Faq> section below
          // renders, so the markup can never drift from the visible answers.
          faqPageSchema(AGENT_FAQS),
        ]}
      />
      {/* Section 1 — Hero */}
      <section className="ai-hero" id="ai-hero">
        <div className="container ai-hero__inner">
          <div className="ai-hero__text">
            <div className="eyebrow ai-hero__eyebrow">AI Analytics Agent</div>
            <h1 className="ai-hero__headline">
              Most AI data tools confidently give you wrong answers.
              <br />
              <em>Ours doesn&apos;t.</em>
            </h1>
            <p className="ai-hero__subhead">
              The reason every &ldquo;ask your data in plain English&rdquo; tool
              fails is the same: it&apos;s built on broken data, with no
              understanding of your business. We fix the foundation, build the
              context, and ship you an AI agent your team can actually trust —
              custom-built for your product, or set up on top of Julius,
              Vanna, or DataGPT.
            </p>

            <div className="ai-hero__buttons">
              <CtaButton href="/contact" location="ai_agent_hero">
                Book a Call
              </CtaButton>
              <CtaButton
                href="#ai-method"
                location="ai_agent_hero"
                className="btn-secondary"
              >
                See How It Works
              </CtaButton>
            </div>

            <div className="ai-hero__meta">
              <span>4-Week Build</span>
              <span className="ai-hero__meta-dot" />
              <span>Custom or Tool-Based</span>
              <span className="ai-hero__meta-dot" />
              <span>Tested on Your Real Data</span>
            </div>
          </div>

          <div className="ai-hero__demo">
            <QueryDemo />
          </div>
        </div>
      </section>

      {/* Section 2 — Failure modes */}
      <Failures />

      {/* Section 3 — The Datalyze Build (6 steps) */}
      <section className="ai-method" id="ai-method">
        <div className="container">
          <header className="ai-method__header">
            <div className="eyebrow eyebrow--center">The Datalyze Build</div>
            <h2 className="ai-method__title">
              What it actually takes to ship an AI analytics agent that works
            </h2>
            <p className="ai-method__intro">
              Six steps. Built around the three things every other approach
              skips: clean data, real business context, and a validation loop.
              Most engagements take 4–6 weeks end to end.
            </p>
          </header>

          <div className="ai-method__list">
            {METHOD_STEPS.map((step) => (
              <article key={step.num} className="ai-step">
                <div className="ai-step__number">{step.num}</div>
                <div className="ai-step__content">
                  <h3 className="ai-step__title">{step.title}</h3>
                  <p className="ai-step__body">{step.body}</p>
                  <div className="ai-step__fixes">
                    <span className="ai-step__fixes-label">
                      What this fixes
                    </span>
                    <span className="ai-step__fixes-text">
                      <em>{step.fixesLabel}</em> {step.fixesRest}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4 — Two paths */}
      <section className="paths" id="paths">
        <div className="container">
          <header className="paths__header">
            <div className="eyebrow eyebrow--center">Two Paths</div>
            <h2 className="paths__title">
              Custom AI agent, or set up the right tool. We&apos;ll tell you
              which.
            </h2>
            <p className="paths__intro">
              Most engagements fall into one of two paths. Both start with the
              same foundation work — clean data, knowledge base, validation.
              The difference is what gets built on top.
            </p>
          </header>

          <div className="paths-grid">
            {PATHS.map((path) => (
              <article key={path.label} className="path-card">
                <div className="path-card__label">{path.label}</div>
                <h3 className="path-card__title">{path.title}</h3>
                <p className="path-card__body">{path.body}</p>
                <div className="path-card__divider" />
                <div className="path-card__meta">
                  <div className="path-card__meta-row">
                    <span className="path-card__meta-label">Best for</span>
                    <span className="path-card__meta-value">
                      {path.bestFor}
                    </span>
                  </div>
                  <div className="path-card__meta-row">
                    <span className="path-card__meta-label">Timeline</span>
                    <span className="path-card__meta-value">
                      {path.timeline}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <p className="paths__not-sure">
            <strong>Not sure which?</strong> That&apos;s what the first call
            is for. We&apos;ll look at your stack, your data, and your
            team&apos;s needs, and tell you which path fits — even if the
            answer is &ldquo;neither, you don&apos;t need this yet.&rdquo;
          </p>
        </div>
      </section>

      {/* Section 5 — Proof / case study */}
      <section className="proof" id="proof">
        <div className="container">
          <header className="proof__header">
            <div className="eyebrow eyebrow--center">Proof</div>
            <h2 className="proof__title">What this looks like in practice</h2>
          </header>

          <article className="proof-card">
            <div className="proof-card__meta">
              <span className="proof-card__company">Series B Fintech</span>
              <span className="proof-card__divider">·</span>
              <span className="proof-card__industry">Consumer Finance</span>
              <span className="proof-card__divider">·</span>
              <span className="proof-card__stage">100K+ customers</span>
            </div>

            <div className="proof-card__body">
              <div className="proof-card__section">
                <span className="proof-card__label">The problem</span>
                <p className="proof-card__text">
                  Their growth team was asking the data team 30+ ad-hoc
                  questions per week. Half of them had been answered before.
                  The other half took 2–3 days to come back with conflicting
                  numbers across dashboards. Their analyst was spending 60% of
                  their week fielding repeat questions instead of doing real
                  analysis.
                </p>
              </div>

              <div className="proof-card__section">
                <span className="proof-card__label">What we built</span>
                <p className="proof-card__text">
                  A custom AI analytics agent built on top of their cleaned
                  warehouse, with a knowledge base covering 80+ business metric
                  definitions, table relationships, and the specific gotchas in
                  their Stripe and payment data model. Two weeks of supervised
                  testing before handoff.
                </p>
              </div>

              <div className="proof-card__section">
                <span className="proof-card__label">The outcome</span>
                <ul className="proof-card__metrics">
                  <li>Reduced ad-hoc data requests by 73% within 6 weeks</li>
                  <li>
                    Growth team self-served 4 out of 5 questions without
                    waiting on the data team
                  </li>
                  <li>
                    Data team reclaimed ~15 hours/week to focus on strategic
                    analysis
                  </li>
                </ul>
              </div>
            </div>

            <blockquote className="proof-card__quote">
              <p>
                &ldquo;For the first time, I trust an AI tool to answer a
                metrics question without checking the work. That&apos;s what
                we&apos;d been trying to get to for two years.&rdquo;
              </p>
              <footer>
                <span className="proof-card__quote-name">
                  Head of Growth
                </span>
                <span className="proof-card__quote-role">
                  Series B Fintech
                </span>
              </footer>
            </blockquote>
          </article>
        </div>
      </section>

      {/* Section 7 — FAQ */}
      <Faq
        items={AGENT_FAQS}
        title="Frequently asked"
        eyebrow="Questions"
      />

      {/* Section 8 — Final CTA */}
      <section className="final-cta" id="book">
        <div className="container">
          <div className="final-cta__inner">
            <div className="eyebrow eyebrow--center">Book a Call</div>
            <h2 className="final-cta__title">
              Stop <em>guessing</em> whether
              <br />
              your data is right
            </h2>
            <p className="final-cta__subhead">
              Book a 30-minute call. Bring your stack, your top 5 questions
              your team asks every week, and any AI tools you&apos;ve already
              tried. We&apos;ll tell you exactly what would need to happen to
              make an AI analytics agent work for you — and whether it&apos;s
              worth doing yet.
            </p>
            <CtaButton
              href="/contact"
              location="ai_agent_final_cta"
              className="btn-primary final-cta__btn"
            >
              Book a Call
            </CtaButton>
            <p className="ai-scarcity">
              We take on 2–3 new AI analytics builds per month.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
