/**
 * Full case study content from docs/case-studies.
 * Merged into caseStudyBySlug in caseStudies.js.
 */

function section(heading, blocks) {
  return { heading, blocks };
}
function p(text) {
  return { type: 'p', text };
}
function ul(items) {
  return { type: 'ul', items };
}
function ol(items) {
  return { type: 'ol', items };
}
function h5(text) {
  return { type: 'h5', text };
}
function blockquote(text) {
  return { type: 'blockquote', text };
}
function img(src, alt = '') {
  return { type: 'image', src, alt };
}

export const caseStudyContent = {
  copyfy: {
    intro: 'Copyfy is an AI-powered platform that helps users find a winning product and generate Shopify landing pages, product descriptions and digital assets in minutes. The product is designed for creators, founders, and small businesses that want to build an online presence without technical skills. With multiple templates, AI-assisted editing, and rapid publishing workflows, Copyfy makes it simple to go from idea to a ready-to-launch website in a few clicks.',
    sections: [
      section('Challenge 1: No Reliable Analytics & Limited Insight Into User Behaviour', [
        p('Copyfy wanted someone to:'),
        ul([
          'Set up Mixpanel end-to-end',
          'Monitor data quality',
          'Build dashboards',
          'Uncover insights about user behaviour',
          'Support new feature releases with measurement',
          'Unify data coming from different product and marketing sources',
        ]),
        p('Without this foundation, the team struggled to understand:'),
        ul(['Who their users were', 'Where they came from', 'Why users stayed or churned', 'Which features worked, and which created friction']),
        p('They needed a complete analytics workflow — not just event tracking.'),
      ]),
      section('Solution', [
        p('We partnered closely with Copyfy to build a robust, scalable analytics system and convert raw data into actionable insights.'),
        h5('1. Designed a clean, comprehensive Mixpanel tracking setup'),
        p('We mapped the product end-to-end and implemented:'),
        ul([
          'A structured event taxonomy',
          'Consistent properties across all events',
          'Tracking for activation, engagement, and retention journeys',
          'Feature-level tracking for new releases',
        ]),
        p('Every key interaction now had accurate data behind it.'),
        h5('2. Worked with the dev team to implement & validate all events'),
        ul([
          'Guided engineering on accurate tracking',
          'Verified events live in Mixpanel',
          'Ensured data quality and consistency',
        ]),
        h5('3. Unified data from multiple sources into a single view'),
        p('Copyfy had critical data across different systems.'),
        p('We:'),
        ul([
          'Pulled these datasets together',
          'Cleaned and mapped the data',
          'Tied everything to a <strong>single user identity</strong>',
        ]),
        p('This enabled behaviour-based segmentation, reactivation strategies, and full-funnel visibility.'),
        h5('4. Built dashboards for easy decision-making'),
        p('We created Mixpanel dashboards to help the team understand:'),
        ul([
          'Product performance',
          'Feature adoption',
          'Drop-off patterns',
          'User journeys',
          'Retention trends',
        ]),
        p('These dashboards became their day-to-day analytical command center.'),
        h5('5. Provided ongoing insights & product recommendations'),
        p('By analyzing behaviour data, we helped the team:'),
        ul([
          'Identify product gaps',
          'Spot friction points',
          'Understand who stays, who churns, and why',
          'Evaluate the impact of new feature releases',
        ]),
      ]),
      section('Result', [
        p('With a clean analytics foundation and unified user data:'),
        ul([
          'The team now <strong>moves much faster</strong> and makes decisions confidently',
          'They understand <strong>who their users are</strong>, <strong>where they come from</strong>, and <strong>which users stay long-term</strong>',
          'Product gaps are easier to identify and fix',
          'Reactivation strategies are more personalized and effective',
          'Leadership no longer relies on guesswork, they have clarity in their numbers',
        ]),
        p('Copyfy now operates with a strong, insight-driven analytics workflow that supports both product growth and business strategy.'),
      ]),
      section('Challenge 2: Low Website-to-Signup Conversion', [
        p('Copyfy noticed a significant drop-off in their onboarding funnel. A large portion of visitors were abandoning the product before completing sign-up, resulting in a website-to-sign-up conversion rate far below category benchmarks.'),
        p('After reviewing the flow, it became clear that:'),
        ul([
          'The initial screens were visually cluttered and created cognitive load.',
          'The sign-up path did not match user expectations for speed and simplicity.',
          'Extra steps were added in the middle of the flow that did not provide clear value, causing friction and confusion.',
        ]),
        p('This prevented high-intent visitors from completing the onboarding process.'),
      ]),
      section('Solution', [
        p('We conducted a detailed funnel audit using Mixpanel and heuristics-based UX evaluation. The key actions included:'),
        ul([
          '<strong>Simplifying the UI</strong>: Removing distracting elements, tightening copy, and creating a cleaner, more intuitive layout.',
          '<strong>Eliminating unnecessary steps</strong>: We recommended removing redundant screens and consolidating actions to reduce friction.',
          '<strong>Aligning the experience with user expectations</strong>: Restructured the flow to feel fast, predictable, and aligned with how users expect an AI website builder to work.',
          '<strong>Running iterative experiments</strong>: Testing small changes in layout, messaging, and CTAs to identify what drives conversion uplift.',
        ]),
      ]),
      section('Result', [
        p('The redesigned onboarding process had an immediate impact. <strong>Sign-up conversion rate increased from 30% to 61%</strong>, more than doubling the number of users entering the product.'),
        img('/images/copyfy%20challenge%202.png', 'Copyfy challenge 2 conversion result'),
      ]),
    ],
  },

  foriio: {
    sections: [
      section('About Foriio', [
        p('Foriio is a global portfolio platform that helps designers, illustrators, photographers, and creative professionals showcase their work beautifully. It enables users to build clean, professional portfolios, gain visibility, and attract clients or job opportunities. With thousands of creatives using the platform, Foriio\'s success depends heavily on its ability to activate new users and bring them back consistently.'),
      ]),
      section('Challenge 1: Activation Problem', [
        p('Foriio noticed that although many users were signing up, a large percentage were not completing a key activation milestone: <strong>adding their first work to their portfolio</strong>. This resulted in:'),
        ul(['Low activation rates', 'Incomplete portfolios', 'Users who signed up but never meaningfully experienced the product\'s core value']),
        p('Upon reviewing behaviour patterns, we found that:'),
        ul([
          'Many users signed up impulsively but <strong>didn\'t have their work ready to upload immediately</strong>.',
          'The <strong>upload workflow was not intuitive</strong>, causing users to drop off before completing the first step.',
        ]),
      ]),
      section('Solution', [
        p('We conducted a full audit of the onboarding and upload behaviour using analytics, session patterns, and user interviews. Based on this, we implemented a two-part solution:'),
        h5('1. Behaviour-driven email nudges'),
        p('We created a tailored sequence of email reminders and prompts designed to:'),
        ul([
          'Remind users to add their first work',
          'Reduce hesitation by highlighting how easy and fast it is',
          'Showcase examples of successful Foriio portfolios',
        ]),
        p('These notifications were timed based on user behaviour (not generic blasts) which significantly improved engagement.'),
        h5('2. Simplified the "Add Work" flow'),
        p('We redesigned the workflow to make publishing first work almost instant:'),
        ul([
          'Streamlined the steps into a clean <strong>2-click process</strong>',
          'Reduced clutter and unnecessary fields',
          'Provided clearer guidance on what users should upload',
        ]),
        p('This removed friction and enabled users to quickly experience the platform\'s core value.'),
      ]),
      section('Result', [
        p('The activation rate, defined as users who uploaded their first work after sign-up, <strong>improved by 8%</strong>.'),
        p('More users reached the "aha moment" of seeing their portfolio come to life, which strengthened downstream metrics as well.'),
        img('/images/foriio%20challenge%201.png', 'Foriio challenge 1 activation result'),
      ]),
      section('Challenge 2: Retention Problem', [
        p('Even after users uploaded their first piece of work, many of them <strong>did not return to the platform</strong>. For a portfolio product, this behaviour was expected to some degree: users only come back when they have something new to share. However, this pattern hindered long-term retention and limited Foriio\'s growth.'),
        p('Through analysis, we identified two major reasons for the drop-off:'),
        ul([
          'Users did not have frequent new work to upload.',
          'They simply <strong>forgot about Foriio</strong> because nothing pulled them back after their initial setup.',
        ]),
      ]),
      section('Solution', [
        p('We focused on creating ongoing value for users, even when they weren\'t actively uploading new work.'),
        h5('1. Timely engagement notifications'),
        p('We designed personalized notifications that would bring users back when something meaningful happened on their profile, such as:'),
        ul(['New views on their work', 'Portfolio activity spikes', 'Performance updates over time']),
        p('These nudges served as reminders that their online presence was living and growing.'),
        h5('2. Introducing new "sticky" features'),
        p('To add reasons for users to return, we suggested and implemented features that naturally drive ongoing engagement:'),
        ul([
          '<strong>Portfolio Analytics</strong> — Users could track impressions and views on their uploaded work, creating a continuous loop of interest and motivation.',
          '<strong>Blogging/Content Creation Tools</strong> — This allowed users to share updates, thoughts, or case studies without needing new visual work, giving them more touchpoints with the platform.',
        ]),
        p('These features extended the usefulness of the platform beyond portfolio uploads.'),
      ]),
      section('Result', [
        p('Retention improved by <strong>6%</strong>, driven by recurring value moments and better ongoing engagement. Users returned more often to check analytics, publish updates, and stay connected to their audience, transforming Foriio from a one-time setup tool into a continuous creative hub.'),
        img('/images/Foriio%20challenge%202.png', 'Foriio challenge 2 retention result'),
      ]),
    ],
  },

  cred: {
    sections: [
      section('About CRED', [
        p('CRED is one of India\'s leading FinTech platforms, offering credit card bill payments, rewards, and financial services to over 16 million members. With high transaction volumes and complex payment routing logic, ensuring seamless, reliable, and cost-efficient payments is critical to the platform\'s user experience and bottom line.'),
      ]),
      section('Challenge 1: Payment Routing Model', [
        p('CRED\'s payments infrastructure relied on multiple providers, each with varying success rates, latencies, and transaction costs. The team was facing two core issues:'),
        ol([
          '<strong>Lower-than-expected payment success rates</strong>, leading to user frustration and increased support load.',
          '<strong>High routing costs</strong> because payments were not being optimally distributed across providers.',
        ]),
        p('The existing routing logic could not balance both cost and performance simultaneously, and it also lacked a mechanism to detect provider outages quickly. This created operational inefficiencies and inconsistent user experience during peak transaction windows.'),
      ]),
      section('Solution', [
        p('We designed a two-part optimization framework that transformed how CRED handled routing decisions.'),
        h5('1. Linear Programming–based Routing Engine'),
        p('We built a linear optimization model that allowed stakeholders to choose their primary objective:'),
        ul(['<strong>Maximize success rate</strong>, or', '<strong>Minimize payment processing cost</strong>']),
        p('The model then:'),
        ul([
          'Applied thresholds for the secondary objective (e.g., maintain cost below X, or success rate above Y)',
          'Evaluated all possible provider combinations',
          'Generated an optimal routing mix that satisfied business constraints and performance goals',
        ]),
        p('This gave the team a transparent, data-driven structure for routing decisions.'),
        h5('2. Real-time Provider Outage Detection'),
        p('To handle unpredictable outages, I developed a real-time model that:'),
        ul([
          'Continuously monitored provider-level success rates',
          'Detected sudden drops using statistical thresholds',
          'Automatically rerouted payments away from failing providers',
        ]),
        p('This drastically improved reliability during live outages and reduced manual intervention.'),
      ]),
      section('Result', [
        p('The optimization framework delivered significant business impact:'),
        ul([
          '<strong>Success rate improved by ~7%</strong>',
          '<strong>Payment routing costs decreased by ~12%</strong>',
          '<strong>Operational efficiency increased by ~9%</strong>',
          '<strong>Provider outages decreased by 93% month-over-month</strong> after introducing the real-time rerouting system',
        ]),
        img('/images/CRED%20challenge%201%20-%201st.png', 'CRED routing framework'),
        img('/images/CRED%20Challenge%201%20-%202nd.png', 'CRED outage detection'),
        p('CRED\'s payment infrastructure became more resilient, predictable, and cost-efficient, directly improving user experience at massive scale.'),
      ]),
      section('Challenge 2: Improving Rent Payment Success Rate', [
        p('CRED\'s rent payment product allowed users to pay rent via credit card. However, success rates were lower than expected because:'),
        ul([
          'Banks frequently declined transactions',
          'A subset of users attempted to use the product for <strong>cash-out behavior</strong>, triggering risk controls',
          'Users repeatedly retried payments using the <em>same</em> card after failure, even though the card had already shown a low probability of succeeding',
        ]),
        p('The team needed a behavioural insight that could meaningfully improve success rates.'),
      ]),
      section('Solution', [
        p('We performed a detailed analysis of user-level and transaction-level patterns. The key discovery was:'),
        blockquote('If a user\'s first attempt failed, retrying with a different card had a 34% higher success rate than retrying with the same card.'),
        p('This insight was incorporated directly into the product experience:'),
        ul([
          'The payment failure screen was redesigned',
          'Users were prompted to try an alternative card instead of retrying the same one',
          'Messaging highlighted that using a different card increases the chance of a successful payment',
        ]),
        p('This small behavioural change created a large improvement in funnel performance.'),
      ]),
      section('Result', [
        p('The updated UX and decision logic improved the <strong>rent payment success rate by 3%</strong>, which is a significant lift at CRED\'s transaction scale.'),
        p('This translated into:'),
        ul(['Fewer frustrated users', 'Higher completed volume', 'Fewer repeated declines and customer support cycles']),
      ]),
    ],
  },

  sama: {
    sections: [
      section('About Sama.io', [
        p('Sama.io is a B2B SaaS platform designed to improve employee performance by offering personalized, high-quality 1-1 coaching. Companies use Sama.io to help employees grow through structured coaching sessions, guided frameworks, and ongoing progress tracking. Long-term retention is critical for their business model, as ongoing engagement directly influences coaching effectiveness and customer value.'),
      ]),
      section('Challenge: Low Return Engagement After Coaching Sessions', [
        p('While initial engagement on Sama.io was strong, the team observed a significant drop-off after users completed their first coaching session. Most employees did not return regularly, which limited:'),
        ul([
          'The long-term impact of coaching',
          'Visibility into progress over time',
          'The platform\'s broader value proposition',
        ]),
        p('A deeper analysis showed that the core issue wasn\'t the coaching sessions themselves, but a lack of compelling reasons for users to return between sessions.'),
      ]),
      section('Solution', [
        p('To understand what differentiated returning users from non-returning ones, we conducted a behavioural analysis comparing usage patterns across both groups. A clear insight emerged:'),
        blockquote('Users who consistently returned were heavy users of the "Notes" feature.'),
        p('The Notes feature allowed employees to record session insights, track progress, reflect on learnings, and prepare for upcoming conversations. However:'),
        ul(['It wasn\'t easy to find', 'It required multiple clicks to access', 'It wasn\'t integrated naturally into the user workflow']),
        p('To address this, we redesigned the UI to make Notes:'),
        ul([
          '<strong>More prominent</strong> — moved into prime screen real estate',
          '<strong>Easier to access</strong> — reduced interaction steps',
          '<strong>Integrated into the coaching experience</strong> — tied visually and functionally to upcoming sessions and past conversations',
        ]),
        p('By elevating a feature that already had strong correlation with repeat engagement, we created a natural loop for users to return to the platform regularly.'),
      ]),
      section('Result', [
        p('Improving the visibility and accessibility of the Notes feature led to a <strong>4% lift in retention</strong>.'),
        p('Users now returned more frequently to:'),
        ul([
          'Review what they discussed in past sessions',
          'Capture new reflections',
          'Prepare for future coaching conversations',
        ]),
        p('This strengthened user habits, increased session effectiveness, and improved the platform\'s long-term engagement health.'),
      ]),
    ],
  },

  gametree: {
    sections: [
      section('About GameTree', [
        p('GameTree is a social discovery platform designed to help gamers find meaningful friendships, gaming partners, and communities based on shared interests. The product relies heavily on early user engagement, especially on Day 0, to create strong matches and foster long-term retention. This makes a smooth onboarding and first-use experience critical.'),
      ]),
      section('Challenge: Low Day 0 Activation', [
        p('Although GameTree attracted a steady stream of new sign-ups, many users dropped off almost immediately after creating their accounts. This resulted in <strong>weak Day 0 activation</strong>, meaning users were not completing the key actions needed to experience value on their first day.'),
        p('Through deeper investigation, two primary issues emerged:'),
        ol([
          '<strong>Language Mismatch</strong> — The platform did not automatically display content in the user\'s native language, creating confusion for non-English speakers. This broke the onboarding flow and made the product feel misaligned with user expectations.',
          '<strong>Product Errors During Initial Use</strong> — Several users encountered errors during early interactions, especially during profile setup and community exploration, causing frustration and premature abandonment.',
        ]),
        p('These issues prevented users from reaching the "aha" moment where GameTree starts providing value through matches, groups, and social discovery.'),
      ]),
      section('Solution', [
        p('To address the activation problem, we conducted funnel analysis, error tracking, and language segmentation. Based on the findings, we implemented two key improvements:'),
        h5('1. Localized First-Use Experience'),
        ul([
          'Ensured the UI, content, and onboarding flow automatically rendered in the user\'s native language.',
          'Introduced better language detection and fallback logic.',
          'Reduced the cognitive load for new non-English-speaking users.',
        ]),
        h5('2. Debugging and Resolving Early-Flow Errors'),
        ul([
          'Identified the specific product errors causing drop-offs during initial actions.',
          'Worked with the engineering team to fix these issues and stabilize the onboarding journey.',
          'Monitored error rates post-fix to ensure consistent success.',
        ]),
        p('These changes removed both functional and experiential friction from the Day 0 experience.'),
      ]),
      section('Result', [
        p('With clearer onboarding, fewer errors, and a localized experience, <strong>Day 0 activation increased by 5%</strong>.'),
        p('More users now:'),
        ul(['Completed account setup', 'Explored the app', 'Reached their first value moment faster']),
        img('/images/Gametree%20challenge%201%20-%201st.png', 'GameTree activation improvement'),
        img('/images/Gametree%20challenge%201%20-%202nd.png', 'GameTree onboarding result view'),
        p('This improvement strengthened the foundation for long-term retention and community engagement.'),
      ]),
    ],
  },

  petcademy: {
    sections: [
      section('About Petcademy', [
        p('Petcademy is a digital pet-training and pet-care education platform that works with shelters, trainers, and pet parents to improve the overall wellbeing of animals. Their engagement strategy relies heavily on SMS campaigns, which deliver personalized training tips, reminders, and behavioural guidance to users. With large-scale messaging volumes, optimizing cost without hurting engagement was a priority.'),
      ]),
      section('Challenge: High SMS Costs With Limited Optimization', [
        p('Petcademy saw strong engagement from its SMS campaigns, but the associated costs were disproportionately high. The challenge was twofold:'),
        ul([
          '<strong>Reduce SMS spend</strong>, which had become a significant operational cost.',
          '<strong>Preserve campaign performance</strong>, ensuring user engagement and completion rates were not negatively affected.',
        ]),
        p('The team needed a data-driven approach to optimize messaging without compromising the value users received.'),
      ]),
      section('Solution', [
        p('To identify opportunities for cost reduction, I conducted a detailed performance analysis across all SMS campaigns, reviewing:'),
        ul([
          'Open and click-through behaviour',
          'Engagement patterns by user segments',
          'Message-level contribution to outcomes',
          'Redundancies and low-impact sends',
        ]),
        p('Based on this, we implemented two key changes:'),
        h5('1. Removed Low-Engagement SMS'),
        p('We identified specific messages that had consistently low engagement or did not meaningfully contribute to desired actions. By removing or consolidating these, we were able to reduce unnecessary sends while keeping the core campaign intact.'),
        h5('2. Personalized SMS Content'),
        p('We adjusted content and timing based on how users responded to previous messages. This included:'),
        ul([
          'Tailored messaging for active vs inactive users',
          'Behaviour-driven follow-ups',
          'Clearer, more relevant content tied to user needs',
        ]),
        p('Personalization ensured that the remaining SMS messages delivered higher value, preventing drop-offs despite reduced volume.'),
      ]),
      section('Result', [
        p('The optimized campaign strategy delivered measurable improvements:'),
        ul([
          '<strong>12% reduction in SMS costs</strong>',
          '<strong>Minimal or no decline in user engagement metrics</strong>',
          'Improved efficiency with more targeted messaging',
        ]),
        p('Petcademy retained the effectiveness of their user communication while significantly cutting operational spend.'),
      ]),
    ],
  },

  'wellness-coach': {
    sections: [
      section('About Wellness Coach', [
        p('Wellness Coach is a B2B digital wellbeing platform that offers guided meditation, coaching sessions, habit programs, and enterprise wellness solutions. With millions of users engaging across mobile and web, having clean, reliable analytics is essential for understanding behaviour, improving retention, and optimizing product experiences.'),
      ]),
      section('Challenge: Overtracking & Inconsistent Event Structure Led to Data Chaos', [
        p('The Wellness Coach team had implemented tracking extensively — in fact, almost <strong>every single click</strong> and action was being logged. However:'),
        ul([
          'Event names were inconsistent',
          'The structure lacked hierarchy',
          'Properties varied unpredictably across events',
          'Tracking had grown organically without governance',
        ]),
        p('With <strong>millions of events flowing in</strong>, this resulted in:'),
        ul([
          'Confusion across product and analytics teams',
          'Data discrepancies between dashboards',
          'A lack of trust in the numbers',
          'Difficulty answering even simple behavioural questions',
        ]),
        p('The company needed a clean, scalable analytics foundation.'),
      ]),
      section('Solution', [
        p('To restore clarity and trust, I conducted a comprehensive analytics audit and rebuilt their event taxonomy.'),
        p('<strong>1. Full audit of the existing setup</strong>'),
        p('I reviewed:'),
        ul([
          'Event names and patterns',
          'Property structures and inconsistencies',
          'Redundant or duplicated events',
          'Gaps in measuring core workflows',
          'Misaligned definitions across teams',
        ]),
        p('This helped identify what was useful, what was unnecessary, and what was missing.'),
        p('<strong>2. Created a clean, simplified event taxonomy</strong>'),
        p('The new analytics structure included:'),
        ul([
          '<strong>Clear event naming conventions</strong>',
          '<strong>Categorized events based on user journeys</strong> (onboarding, sessions, habits, content consumption, etc.)',
          '<strong>Consistent property schemas</strong>',
          '<strong>Removal of noisy, click-based events</strong> that offered no strategic value',
          'A blueprint that made sense to both technical and non-technical stakeholders',
        ]),
        p('<strong>3. Prioritized only meaningful events</strong>'),
        p('Instead of tracking everything, we focused on:'),
        ul([
          'Key activation behaviours',
          'Engagement loops',
          'Revenue-driving moments',
          'Retention indicators',
        ]),
        p('This reduced clutter and significantly improved data interpretability.'),
      ]),
      section('Result', [
        p('Once the engineering team implemented the new taxonomy:'),
        ul([
          '<strong>Internal teams regained confidence in the data</strong>',
          'Dashboards began reflecting consistent, reliable numbers',
          'Product managers and leadership started using analytics actively for decisions',
          'Insights, A/B tests, and product planning became smoother and more accurate',
        ]),
        p('The team now benefits from a stable, scalable analytics foundation that supports better decisions, without the confusion and noise that previously held them back.'),
      ]),
    ],
  },

  sol: {
    sections: [
      section('About Sol', [
        p('Sol is a powerful productivity and collaboration app designed for individuals to dive into meditation, exercises, find new friends and more. With a fast-moving product roadmap and weekly feature releases, maintaining clean and consistent analytics was becoming a challenge — especially as the team wanted a <strong>minimalist, property-driven tracking system</strong>.'),
      ]),
      section('Challenge: A Complex Product Needing a Minimal Tracking Structure', [
        p('Sol\'s team wanted a <strong>lean, clean Mixpanel setup</strong>:'),
        ul(['Fewer events', 'More insights driven through properties', 'Easy scalability as new features rolled out']),
        p('However, the product itself was complex, with multiple modules and frequent new releases. This created several issues:'),
        ul([
          'Tracking grew messy and inconsistent over time',
          'New features required ad-hoc events, adding to clutter',
          'Maintaining structure across modules was difficult',
          'The frontend was sending too many events, increasing load',
          'The team risked losing clarity on what truly mattered',
        ]),
        p('They needed a tracking approach that was <strong>simple, scalable, and future-proof</strong>.'),
      ]),
      section('Solution', [
        p('To strike the right balance between minimalism and coverage, I designed a <strong>flexible, modular event structure</strong> centered around Sol\'s core app features.'),
        h5('1. Defined core event categories instead of granular events'),
        p('Rather than creating a new event for every interaction, we grouped behaviours into high-level event types such as:'),
        ul(['Document actions', 'Task interactions', 'Workspace activity', 'Feature modules']),
        p('This meant the same event could serve multiple use cases with the right properties.'),
        h5('2. Moved complexity into properties'),
        p('Most variations: feature type, action type, context, and metadata, were captured through properties rather than separate events. This reduced:'),
        ul(['Event bloat', 'Engineering overhead', 'Implementation time for every new feature']),
        h5('3. Created a scalable structure for weekly feature releases'),
        p('The tracking plan ensured that:'),
        ul([
          'New features could plug into the existing framework',
          'Developers didn\'t need to rethink event structures',
          'Product teams had consistent, reliable data across modules',
        ]),
        h5('4. Reduced frontend event load'),
        p('By consolidating events and removing unnecessary granular tracking, we lightened the load on the app\'s frontend and simplified maintenance.'),
      ]),
      section('Result', [
        p('The new tracking framework delivered clear benefits:'),
        ul([
          '<strong>A streamlined and scalable Mixpanel setup</strong>',
          '<strong>Cleaner data that remained consistent even as the product evolved weekly</strong>',
          '<strong>Fewer events to maintain</strong>, with properties carrying the analytical depth',
          '<strong>Lower frontend load</strong>, improving performance',
          '<strong>Easier dashboards & insights</strong> for product and growth teams',
        ]),
        p('Sol now has a tracking system that grows effortlessly with the product, without sacrificing clarity, accuracy, or simplicity.'),
      ]),
    ],
  },

  videotap: {
    sections: [
      section('About VideoTap', [
        p('VideoTap is a powerful AI-driven video repurposing platform that helps creators, marketers, and brands convert long-form videos into short-form clips, highlights, articles, and social-ready content in minutes. Because the product\'s value is experienced only after users upload a video, a smooth onboarding and upload flow is essential for activation and long-term engagement.'),
      ]),
      section('Challenge 1: High Drop-Off During Onboarding', [
        p('VideoTap noticed that a majority of users abandoned the product during onboarding. Only a small percentage reached the dashboard or engaged with the features needed to understand the product\'s value. A closer analysis revealed two root causes:'),
        ul([
          '<strong>Unnecessary friction:</strong> The onboarding flow asked too many questions that did not meaningfully contribute to personalization or setup.',
          '<strong>Lack of clarity on product value:</strong> Users were not given a strong understanding of what VideoTap could do for them before being asked to complete multiple steps.',
        ]),
        p('This prevented users from progressing to activation, resulting in a leaky funnel and high early churn.'),
      ]),
      section('Solution', [
        p('To address this, we conducted a step-by-step audit of the onboarding experience and identified opportunities to reduce cognitive load and friction. The improvements included:'),
        h5('1. Streamlining the onboarding flow'),
        ul([
          'Removed several non-essential questions',
          'Reduced the total number of steps',
          'Reordered screens to make the flow feel faster and more intuitive',
        ]),
        h5('2. Improving value communication'),
        ul([
          'Inserted clear messaging and visuals showing what VideoTap can do',
          'Highlighted outcomes (clips, summaries, social posts) early in the journey',
          'Ensured users understood the benefit <em>before</em> being asked for inputs',
        ]),
      ]),
      section('Result', [
        p('The streamlined flow produced a dramatic improvement: <strong>Onboarding completion increased from 28% to 80%</strong>. More users reached the dashboard and the activation funnel became significantly stronger.'),
        img('/images/VideoTap%20challenge%201.png', 'VideoTap challenge 1 onboarding result'),
      ]),
      section('Challenge 2: Users Failing to Upload Their First Video', [
        p('Even after completing onboarding, many users dropped off before uploading a video which is the critical moment where VideoTap demonstrates its value. Activation was stalled because users never reached the "aha moment" of seeing their video transformed into repurposed content. Through deeper analysis, the main issues became clear:'),
        ol([
          '<strong>A complex 4-step video upload process</strong> that overwhelmed new users',
          '<strong>Limited UX guidance</strong>, making it unclear what users should do next',
          '<strong>Frequent upload errors</strong>, especially when importing YouTube videos',
        ]),
        p('These friction points prevented users from taking the single most important action.'),
      ]),
      section('Solution', [
        p('We collaborated with the team to redesign and optimize the activation flow:'),
        h5('1. Simplified the upload workflow'),
        ul([
          'Reduced the upload process from 4 steps to 2',
          'Consolidated screens and minimized decision-making',
          'Made the interface cleaner and more intuitive',
        ]),
        h5('2. Enhanced UX guidance'),
        ul([
          'Added clear CTAs and contextual hints',
          'Improved empty states to guide users toward uploading their first video',
          'Reworked the dashboard to make the next step obvious',
        ]),
        h5('3. Fixed YouTube upload errors'),
        ul([
          'Identified root causes of failed imports',
          'Implemented fixes to make YouTube uploads reliable and predictable',
        ]),
      ]),
      section('Result', [
        p('The activation rate improved substantially: <strong>Activation increased from 7% to 19%</strong>. More users uploaded their first video successfully and reached value moments much earlier, improving downstream retention.'),
        img('/images/VideoTap%20challenge%202.png', 'VideoTap challenge 2 activation result'),
      ]),
    ],
  },

  stealth: {
    sections: [
      section('Challenge: Low Activation Due to Limited Early Value', [
        p('Although the product attracted new sign-ups, many users were not moving beyond initial onboarding. The <strong>activation rate was low</strong>, and user sessions were short, indicating that users did not experience enough value before being asked to upgrade.'),
        p('A deep review of the user journey showed two core issues:'),
        ol([
          '<strong>Value was locked too early behind paywalls</strong>, preventing users from exploring the product meaningfully.',
          '<strong>The free-plan limits were too restrictive</strong>, causing users to drop off before forming a habit or understanding the product\'s strengths.',
        ]),
        p('This created a barrier between sign-up and activation, resulting in weak engagement metrics.'),
      ]),
      section('Solution', [
        p('I conducted a product walkthrough, user-flow audit, and session-level analysis to understand exactly where users dropped off and why. The insights made it clear that users were abandoning the product before reaching its core value moments.'),
        p('We implemented a simple but high-leverage change:'),
        h5('Increased Free Plan Usage Limits'),
        ul([
          'Expanded what users could do before upgrading',
          'Allowed them to test core workflows more thoroughly',
          'Created natural "value moments" early in their lifecycle',
          'Reduced friction in the journey from sign-up to first meaningful outcome',
        ]),
        p('By giving users more room to explore, the product\'s value became immediately clearer, increasing the likelihood that they would return and eventually convert.'),
      ]),
      section('Result', [
        p('The change produced a strong improvement across key metrics:'),
        ul([
          '<strong>Activation rate increased by 22%</strong>',
          '<strong>Median time spent on the app increased by 2 minutes</strong> (a meaningful gain at early-stage scale)',
        ]),
        img('/images/Stealth.png', 'Stealth activation improvement'),
        p('Users now had enough freedom to discover the product\'s strengths before committing, resulting in better engagement and stronger early retention.'),
      ]),
    ],
  },

  zeroone: {
    sections: [
      section('About zeroone', [
        p('zeroone is a blockchain-powered social app where users upload, mint, and collect digital artwork. Designed for both creators and collectors, zeroone blends social engagement with crypto-native mechanics, making early activation and repeat usage critical for long-term retention and network growth.'),
      ]),
      section('Challenge 1: Low Artwork Upload Completion After Onboarding', [
        p('zeroone noticed that although users were completing onboarding, a significant portion dropped off before uploading their first artwork, a key activation milestone. Since the core value of the app is tied to uploading and collecting art, this created:'),
        ul(['Low activation rates', 'Weak creator participation', 'Slower social and marketplace interactions']),
        p('The team needed a way to help users reach value faster.'),
      ]),
      section('Solution', [
        p('After validating that the onboarding flow itself was smooth and not causing friction, we proposed a high-leverage experiment to reshape the early user experience:'),
        h5('1. Encourage artwork uploads during onboarding (optional)'),
        ul([
          'Added a lightweight prompt during onboarding for users to upload their first piece',
          'Keeps the step optional to avoid cognitive overload',
          'Increases the chance of completing this action early in the journey',
        ]),
        h5('2. Removed unnecessary onboarding screens'),
        ul([
          'Streamlined the onboarding flow to reduce friction',
          'Helps users reach the app faster and experience value sooner',
        ]),
        h5('3. Enabled collecting even before uploading'),
        p('Users were given <strong>a few free collection tickets</strong>, allowing them to:'),
        ul([
          'Collect artwork immediately',
          'Engage socially before contributing their own work',
          'Experience the excitement of the product from day one',
        ]),
        p('This gave users a meaningful first interaction that didn\'t depend on having artwork ready.'),
      ]),
      section('Result', [
        p('The experiment delivered strong improvements: <strong>Activation increased from 21% to 55%</strong> and <strong>Week 2 retention increased by 15%</strong>. Providing early value and simplifying onboarding helped users better understand the purpose of the app and stay engaged longer.'),
        img('/images/zeroone%20challenge%201.png', 'zeroone challenge 1 activation result'),
      ]),
      section('Challenge 2: Week 2 Retention Dropped by 26%', [
        p('zeroone saw a sudden <strong>26% decline in Week 2 retention</strong>, which did not recover organically. The team needed clarity on what caused the drop, which app updates or user segments were most affected, and what actions were needed to restore retention.'),
        p('Given the community-driven nature of the product, retention dips have compounding effects on engagement and marketplace activity.'),
      ]),
      section('Solution', [
        p('I performed a multi-layer analysis that included:'),
        ul([
          'Reviewing feature releases leading up to the drop',
          'Segmenting users by acquisition channels, device, first-week behaviour, and art actions',
          'Analyzing key funnel steps where the drop-off became most pronounced',
          'Cross-checking for technical issues or broken user flows',
        ]),
        p('This allowed us to identify the precise contributors to the retention decline, enabling the team to focus on the right fixes rather than guessing.'),
      ]),
      section('Result', [
        p('The engineering and product teams are now implementing the required fixes identified in the analysis. Early internal tests indicate that correcting the issues will restore baseline retention levels and prevent future declines.'),
      ]),
      section('Challenge 3: Low Ongoing Engagement and Lack of Habit Loops', [
        p('zeroone wanted to make the platform more engaging, fun, and repeat-visit-friendly. Users interacted with the product but did not develop strong habits around daily posting, collecting, or exploring art.'),
        p('The team needed features that:'),
        ul([
          'Encourage users to come back frequently',
          'Create a sense of progression',
          'Increase social sharing',
          'Make the platform feel more alive and competitive',
        ]),
      ]),
      section('Solution', [
        p('We conducted competitive research across social apps, gaming ecosystems, and Web2.0 engagement loops to identify high-impact mechanics. Based on this analysis, we proposed three features:'),
        h5('1. Streaks'),
        p('Reward users for daily activity, creating habit loops and a sense of progress.'),
        h5('2. Leaderboards'),
        p('Introduce friendly competition across creators and collectors, encouraging users to improve their ranking and share achievements.'),
        h5('3. Tiered Rewards'),
        p('Give users incentives to stay active and unlock exclusive perks based on their engagement level. All three features were designed to reinforce repeat usage and make the app socially sharable, fun, and rewarding.'),
      ]),
      section('Result', [
        p('After rollout, zeroone saw a measurable lift in user activity: <strong>Engagement increased by 30%</strong>. Users frequently shared streak milestones and leaderboard positions, and collecting and posting activity became more consistent.'),
        p('These features created the habit loops the product was missing, transforming zeroone into a more dynamic and interactive platform.'),
      ]),
      section('Challenge 4: New App Launch With No Tracking in Place', [
        p('As zeroone prepared to roll out a completely rebuilt app, the team needed a clean, comprehensive tracking plan with clear definitions for events and properties. They also needed a structure that would help measure onboarding, engagement, creations, collections, and social loops, and a way to ensure new features could be analyzed immediately after launch.'),
        p('Without proper tracking, the team would be flying blind during one of the most critical phases of the product\'s life cycle.'),
      ]),
      section('Solution', [
        p('To support the relaunch, we conducted a full product walkthrough and mapped out every meaningful user interaction. This included:'),
        h5('1. Deep-dive into the new app flows'),
        ul([
          'Identified core journeys such as onboarding, uploading artwork, collecting, social actions, wallets, and profile setup',
          'Documented edge cases and hidden paths to ensure nothing was missed',
        ]),
        h5('2. Built a complete tracking plan'),
        p('The tracking plan covered:'),
        ul([
          '<strong>Event definitions</strong> for key actions',
          '<strong>Properties</strong> needed to segment and understand behaviour',
          '<strong>Standardized naming conventions</strong> for consistency',
          '<strong>Conversion funnels</strong> tied to activation and retention metrics',
          '<strong>Feature-specific tracking</strong> for new UI/UX elements introduced in the revamp',
        ]),
        h5('3. Created implementation guidelines'),
        p('So the engineering team could integrate tracking easily and accurately from day one.'),
      ]),
      section('Result', [
        p('The tracking plan is now with the development team and is being fully implemented across the new app. Once live, zeroone will have complete visibility into user behaviour, the ability to measure the impact of the redesign, and clean, structured data for insights, experiments, and growth strategy. This foundation will allow the team to iterate faster and make data-driven decisions immediately after launch.'),
      ]),
    ],
  },

  anyip: {
    sections: [
      section('About AnyIP', [
        p('AnyIP is a high-performance proxy and networking infrastructure provider used by developers, marketers, and automation teams to route traffic reliably across the globe. With multiple marketing channels driving acquisition, the team needed clarity on performance, spend efficiency, and the true ROI of their campaigns, but their analytics setup wasn\'t giving them the visibility they needed.'),
      ]),
      section('Challenge: No Ownership of Analytics & Limited Visibility Into Marketing Performance', [
        p('AnyIP needed someone to fully <strong>own their analytics</strong> and help them make sense of their marketing data. The core challenges were:'),
        ul([
          'Data was messy and inconsistent',
          'Dashboards lacked structure and clarity',
          'The team couldn\'t see which channels were performing',
          'CAC was difficult to measure accurately',
          'Insights were fragmented, slowing down decision-making',
        ]),
        p('They needed a clean analytics foundation and clear reporting that could guide day-to-day marketing decisions.'),
      ]),
      section('Solution', [
        p('We collaborated with the team to build a complete, reliable analytics workflow.'),
        h5('1. Cleaned and structured the raw data'),
        ul([
          'Identified inconsistencies in existing datasets',
          'Cleaned and standardized data fields',
          'Streamlined tracking across channels',
          'Ensured the data aligned with their business goals',
        ]),
        p('This created a trustworthy dataset that could power reliable insights.'),
        h5('2. Built a structured reporting system'),
        p('We created multiple dashboards focused on:'),
        ul([
          'Channel performance',
          'CAC and ROI trends',
          'Activation and funnel metrics',
          'Campaign-level breakdowns',
          'User behaviour insights derived from marketing traffic',
        ]),
        p('Each dashboard was designed to be easy to understand, even for non-technical team members.'),
        h5('3. Enabled ongoing visibility & decision-making'),
        p('The dashboards helped the team:'),
        ul([
          'See what\'s working and what\'s not',
          'Allocate budget more effectively',
          'Identify high-performing channels',
          'Reduce wasted spend',
          'Make faster data-driven decisions',
        ]),
      ]),
      section('Result', [
        p('The team now actively uses these dashboards to optimize their marketing operations. As a result:'),
        ul([
          'Marketing performance improved across channels',
          'CAC decreased as spend became more efficient',
          'Decisions are now grounded in data, not assumptions',
        ]),
        p('AnyIP now operates with a clear, structured view of their marketing funnel, enabling them to scale with confidence.'),
      ]),
    ],
  },

  frai: {
    intro: '<strong>About FRAI</strong> — FRAI is an AI-driven product designed to help users clear interviews using the help of AI-interviewer for their live job interviews. As the product grew, the team needed clarity on user behaviour, conversion drivers, and the effectiveness of their experiments. Without a clear understanding of what was working, and what wasn\'t, it became challenging to scale growth with confidence.',
    sections: [
      section('Challenge: Lack of Visibility Into Product Performance & Growth Levers', [
        p('FRAI was facing several interconnected issues:'),
        ul([
          'Limited understanding of which user segments were converting',
          'No clear insights into why some users dropped off',
          'Difficulty evaluating whether new experiments or features were successful',
          'A general lack of visibility into product metrics and behavioural patterns',
        ]),
        p('This made it hard for the team to prioritize improvements or know which initiatives would meaningfully impact conversion and revenue.'),
      ]),
      section('Solution', [
        p('We partnered closely with FRAI to build a clear, insight-driven growth workflow.'),
        h5('1. Deep behavioural analysis'),
        p('We identified:'),
        ul([
          'Which user segments converted best',
          'Where drop-offs were happening in the funnel',
          'What behaviours correlated with long-term engagement',
          'Which journeys and touchpoints needed improvement',
        ]),
        h5('2. Actionable product recommendations'),
        p('Based on insights, we gave the team clear direction on:'),
        ul([
          'What to fix',
          'What to improve',
          'What to double down on',
          'Which flows were hurting conversions',
          'Which features were driving value',
        ]),
        h5('3. Designed and ran structured experiments'),
        p('We collaborated with the team to:'),
        ul([
          'Launch meaningful A/B tests',
          'Validate hypotheses with data',
          'Iterate quickly based on real behavioural feedback',
          'Measure experiment impact with clarity',
        ]),
        p('This helped FRAI go beyond intuition and build a repeatable experimentation process.'),
      ]),
      section('Result', [
        p('The combined effort of insights, product changes, and structured experimentation led to a major improvement:'),
        ul(['<strong>Paid conversion rate increased 2×</strong>']),
        p('The team now has a much clearer understanding of their product, their users, and the levers that drive growth, enabling them to continue iterating with confidence.'),
      ]),
    ],
  },

  'answering-agent': {
    sections: [
      section('About Answering Agent', [
        p('Answering Agent is an AI-powered calling platform that automates customer outreach, follow-ups, and support conversations. As an AI-first product, the <strong>quality of each call</strong> directly impacts customer satisfaction, product trust, and conversion outcomes. But without a clear way to evaluate call performance, the team struggled to understand how well the AI was functioning — and what needed improvement.'),
      ]),
      section('Challenge 1: No Visibility Into AI Call Quality', [
        p('The core issue Answering Agent faced was the inability to evaluate whether an AI-generated call was "good" or "bad," and more importantly, <em>why</em>.'),
        p('This created multiple problems:'),
        ul([
          'The team couldn\'t pinpoint weaknesses in the AI\'s calling logic.',
          'Product decisions were based on assumptions rather than data.',
          'There was no standardized framework for evaluating calls.',
          'Improving the AI became guesswork instead of a structured process.',
        ]),
        p('Without call-level insights, the product\'s evolution was limited.'),
      ]),
      section('Solution', [
        p('To give the team clarity and actionable insights, we built an end-to-end evaluation framework for AI call quality.'),
        h5('1. Deep dive into the product & industry benchmarks'),
        p('We studied:'),
        ul([
          'How the AI conducted calls',
          'Typical call flows and expected outcomes',
          'Industry standards for conversational AI performance',
          'Real-world call scenarios and edge cases',
        ]),
        p('This groundwork enabled us to define what "good" looked like.'),
        h5('2. Defined a complete set of evaluation metrics'),
        p('We created a structured metric system that captured dimensions such as:'),
        ul([
          'Call clarity and coherence',
          'Response relevance',
          'Latency and hesitation patterns',
          'Completion of the intended task',
          'User sentiment cues',
          'Compliance with call scripts or guidelines',
        ]),
        p('These metrics formed the foundation of a consistent scoring framework.'),
        h5('3. Built an AI call scoring model'),
        p('On top of the defined metrics, we developed a model that:'),
        ul([
          'Analyzed each AI call',
          'Scored it across the defined dimensions',
          'Highlighted specific issues when a call underperformed',
          'Provided an overall call quality score',
        ]),
        p('This transformed raw call data into actionable insights.'),
      ]),
      section('Result', [
        p('The scoring system is now actively used across the team: they can instantly see <strong>which calls performed poorly and why</strong>, product and engineering teams can prioritize improvements based on real data, and the model enables continuous optimization of the AI calling logic. Over time, call quality has become significantly more predictable and measurable, giving the team full visibility to drive faster, targeted improvements.'),
      ]),
    ],
  },

  termplus: {
    intro: 'TermPlus is a digital financial services platform offering streamlined insurance and banking workflows for users across Australia. As the product scaled, the team needed clearer visibility into user behaviour, product performance, and marketing effectiveness. They were using PostHog, but the setup was incomplete, leaving them without reliable insights or unified data to make informed decisions.',
    sections: [
      section('Challenge: No Clear Analytics Setup & Fragmented Data', [
        p('TermPlus faced two major challenges:'),
        ol([
          '<strong>PostHog was not fully or correctly set up</strong> — They needed someone to design a proper tracking structure, guide implementation, and extract meaningful insights.',
          '<strong>Data was scattered across multiple sources</strong> — Marketing, product, and backend data lived in separate systems, making it impossible to understand the full user journey.',
        ]),
        p('This lack of visibility prevented the team from:'),
        ul([
          'Identifying friction points',
          'Understanding acquisition quality',
          'Measuring product performance',
          'Making data-driven decisions',
        ]),
      ]),
      section('Solution', [
        p('We partnered closely with the TermPlus team to build a strong analytics foundation and unify all product data.'),
        h5('1. Deep product audit & tracking plan creation'),
        p('We explored the product end-to-end to identify:'),
        ul([
          'Core user journeys',
          'Activation and conversion points',
          'Key events and properties needed for actionable insights',
        ]),
        p('Based on this, we created a complete <strong>tracking plan</strong> aligned with TermPlus\' business goals.'),
        h5('2. Worked with the dev team to implement tracking'),
        ul([
          'Guided the engineering team through correct event implementation',
          'Ensured naming conventions and properties were consistent',
          'Verified every event for accuracy and completeness in PostHog',
        ]),
        h5('3. Unified data from multiple sources'),
        p('TermPlus had important datasets spread across systems.'),
        p('We:'),
        ul([
          'Brought these datasets into PostHog',
          'Consolidated them',
          'Tied everything to a <strong>single unified user identity</strong>',
        ]),
        p('This enabled full-funnel analysis, from acquisition to conversion to retention.'),
        h5('4. Built dashboards for clear decision-making'),
        p('We created dashboards that gave the team visibility into:'),
        ul([
          'Product metrics',
          'Marketing performance',
          'User behaviour trends',
          'Funnel drop-offs',
          'Conversion insights',
        ]),
        p('These dashboards became the team\'s central source of truth.'),
      ]),
      section('Result', [
        p('Before this project, TermPlus had little clarity on how users behaved or where the product needed improvement. After the implementation:'),
        ul([
          'The team gained <strong>full visibility into their product and user journey</strong>',
          'They now have a clear direction for product improvements and marketing strategy',
          'Insights can be generated quickly without relying on guesswork or manual effort',
        ]),
        p('TermPlus now operates with a structured analytics foundation that supports continuous growth and decision-making.'),
      ]),
    ],
  },

  speedyloans: {
    sections: [
      section('About Speedyloans', [
        p('Speedyloans is an online lending platform that provides fast, accessible loan advances to users across the US. With a high-volume user base and millions of outbound communication events, optimizing engagement workflows and improving conversion targeting are crucial for revenue and operational efficiency.'),
      ]),
      section('Challenge 1: Millions of Emails, Rising Costs & Domain Reputation Risk', [
        p('Speedyloans relied heavily on large-scale email campaigns to bring users back and encourage them to complete loan applications. However:'),
        ul([
          'Sending millions of emails was <strong>expensive</strong>',
          'Deliverability issues started affecting <strong>domain score</strong>',
          'A significant portion of these emails went to users unlikely to convert',
        ]),
        p('The team needed a smarter, data-driven way to prioritize outreach without hurting engagement metrics.'),
      ]),
      section('Solution', [
        p('To solve this, we analyzed historical campaign and behaviour data to understand:'),
        ul([
          'Which users were most likely to re-engage',
          'What patterns predicted successful conversions',
          'Which attributes (demographics, behaviour, timing) correlated with high ROI',
        ]),
        p('Based on these insights, we built a <strong>weighted scoring model in Python</strong> that ranked users by re-engagement likelihood.'),
        p('The scoring incorporated:'),
        ul([
          'Past loan behaviour',
          'Email engagement patterns',
          'Product interaction signals',
          'Time since last activity',
          'High-value attribute combinations',
        ]),
        p('With this model, the team could send emails only to users above a certain score threshold, maximizing return while cutting waste.'),
      ]),
      section('Result', [
        ul([
          '<strong>30% reduction in email costs</strong>',
          '<strong>1% increase in re-engagement</strong> (despite sending fewer emails)',
        ]),
        p('This enabled Speedyloans to maintain strong engagement while significantly reducing operational spend and improving domain health.'),
      ]),
      section('Challenge 2: 100+ Attributes With No Clear Prioritization', [
        p('Speedyloans was tracking over 100 user attributes that influenced conversion and revenue outcomes. However:'),
        ul([
          'Manual analysis was slow and often inconclusive',
          'Interactions between attributes were not obvious',
          'The team lacked clarity on which combinations mattered most',
        ]),
        p('They needed a scalable way to find patterns that predict high conversion probability.'),
      ]),
      section('Solution', [
        p('We applied the <strong>Apriori algorithm</strong>, a powerful association-rule mining technique, to uncover:'),
        ul([
          'Attribute pairs and combinations that strongly correlated with conversion',
          'High-probability user segments hidden beneath surface-level metrics',
          'Patterns that manual analysis would miss due to dimensional complexity',
        ]),
        p('The algorithm revealed:'),
        ul([
          'Key behavioural sequences',
          'High-value demographic clusters',
          'Attribute combinations with strong conversion lift',
        ]),
        p('This allowed the team to refine targeting, segmentation, and messaging with precision.'),
      ]),
      section('Result', [
        p('Speedyloans shifted their focus toward users most likely to convert based on these attribute combinations:'),
        ul([
          'Improved targeting accuracy',
          'Reduced time spent on exploratory analysis',
          'Higher ROI across reactivation and acquisition campaigns',
        ]),
        p('The company now uses these insights as part of their ongoing targeting and segmentation strategy.'),
      ]),
    ],
  },
};
