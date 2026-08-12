import { homeMethod } from '@/lib/data/home-method';
import {
  AuditReveal,
  ConnectedStack,
  DashboardMockup,
  GrowthCurve,
} from '@/components/method/MethodVisuals';
import MethodScroll from './method-scroll';

const stepVisuals = [AuditReveal, ConnectedStack, DashboardMockup, GrowthCurve];

/** h2 on the homepage, where the hero owns the h1; h1 on /how-it-works, where
 *  this section is the page's lead content. */
export default function Method({
  headingAs: Heading = 'h2',
}: {
  headingAs?: 'h1' | 'h2';
}) {
  return (
    <section className="section method" id="how-it-works">
      <div className="container">
        <header className="method__header">
          <div className="eyebrow eyebrow--center">The Datalyze Method</div>
          <Heading className="method__title">
            How does Datalyze fix analytics?
          </Heading>
          <p className="method__intro">
            Four stages - Foundation, Unification, Visibility, Compounding
          </p>
        </header>

        <MethodScroll>
          <div className="method__steps" id="method-steps">
            <div className="method__line" aria-hidden="true" />

            {homeMethod.map((step, idx) => {
              const isLeft = idx % 2 === 0;
              const Visual = stepVisuals[idx];
              return (
                <article
                  key={step.number}
                  className={`method-step ${
                    isLeft ? 'method-step--left' : 'method-step--right'
                  }`}
                >
                  <div className="method-step__content">
                    <h3 className="method-step__title">{step.title}</h3>
                    <p className="method-step__body">{step.body}</p>
                  </div>
                  <div className="method-step__visual-wrap">
                    <div className="method-step__label">
                      {step.number} - {step.eyebrow}
                    </div>
                    <div className="method-step__visual">
                      {Visual ? <Visual /> : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </MethodScroll>
      </div>
    </section>
  );
}
