import { homeDifferentiators } from '@/lib/data/home-differentiators';
import {
  SeniorOperators,
  SpeedTimeline,
  RevenueLift,
  FixCheckboxes,
} from '@/components/why/WhyVisuals';

const VISUALS = {
  'senior-operators': SeniorOperators,
  'speed-timeline': SpeedTimeline,
  'revenue-lift': RevenueLift,
  'fix-checkboxes': FixCheckboxes,
} as const;

export default function Differentiators() {
  return (
    <section className="section" id="why">
      <div className="container">
        <header className="diff__header">
          <div className="eyebrow">Why Datalyze</div>
          <h2 className="diff__title">Why 150+ companies chose Datalyze</h2>
        </header>

        <div className="diff-grid">
          {homeDifferentiators.map((block) => {
            const Visual = VISUALS[block.visual];
            return (
              <article key={block.number} className="diff-block">
                <div className="diff-block__number">{block.number}</div>
                <h3 className="diff-block__title">{block.title}</h3>
                <div className="diff-block__visual">
                  <Visual />
                </div>
                <div className="diff-block__divider" />
                <p className="diff-block__body">{block.body}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
