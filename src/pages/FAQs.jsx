import SEO from '../components/SEO';

const faqs = [
  { q: 'What is Datalyze?', a: 'Datalyze is an analytics and growth partner. We help you set up your data correctly, understand how users behave, and use those insights to run experiments and improve revenue.' },
  { q: 'How fast can you get started?', a: 'We can usually start within a day once you decide to work with us.' },
  { q: 'Who will I work with?', a: "You'll work with a small, focused team based on your needs. This may include a product analyst, analytics engineer, growth strategist, and developer. There are no unnecessary layers." },
  { q: 'How is pricing structured?', a: 'Pricing is either one-time or monthly, depending on the scope and duration of the work.' },
  { q: 'What do you need from our team?', a: 'We may need light developer support to implement tracking, add events, or help with data foundations for modeling.' },
  { q: 'What does a typical engagement look like?', a: 'We usually have at least one call per week to review progress, share insights, and align on priorities for the coming week.' },
];

export default function FAQs() {
  return (
    <section className="section surface faqs">
      <SEO
        title="FAQs"
        description="Frequently asked questions about working with Datalyze — pricing, team, engagement, and what to expect."
        path="/faqs"
      />
      <div className="container">
        <div className="section-header center">
          <div className="eyebrow">FAQs</div>
          <h2>Frequently Asked Questions</h2>
        </div>
        <div className="faq-list">
          {faqs.map((faq) => (
            <details key={faq.q} className="faq-item">
              <summary>{faq.q}</summary>
              <p>{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
