import { homeFaqs } from '@/lib/data/home-faqs';

type Props = {
  items?: typeof homeFaqs;
  title?: string;
  eyebrow?: string;
  headingLevel?: 'h1' | 'h2';
  /** Exclusive-accordion group name. Pages that render more than one <Faq>
   *  must pass a distinct value per section, or opening an item in one section
   *  silently closes the open item in another. */
  group?: string;
  /** Open the first item. Off when a page stacks several sections, so they
   *  don't fight over the shared accordion group. */
  defaultOpen?: boolean;
};

export default function Faq({
  items = homeFaqs,
  title = 'Frequently asked',
  eyebrow = 'Questions',
  headingLevel = 'h2',
  group = 'home-faq',
  defaultOpen = true,
}: Props) {
  const Heading = headingLevel;
  return (
    <section className="section" id="faq">
      <div className="container">
        <div className="faq">
          <header className="faq__header">
            <div className="eyebrow eyebrow--center">{eyebrow}</div>
            <Heading className="faq__title">{title}</Heading>
          </header>

          <div className="faq-list">
            {items.map((item, i) => (
              <details
                key={item.q}
                className="faq-item"
                name={group}
                open={defaultOpen && i === 0}
              >
                <summary className="faq-item__question">
                  <span>{item.q}</span>
                  <span className="faq-item__icon" aria-hidden="true">
                    +
                  </span>
                </summary>
                <div className="faq-item__answer">
                  <p>{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
