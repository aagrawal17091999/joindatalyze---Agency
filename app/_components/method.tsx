import { homeMethod } from '@/lib/data/home-method';
import MethodScroll from './method-scroll';

export default function Method() {
  return (
    <section className="section method" id="method">
      <div className="container">
        <header className="method__header">
          <div className="eyebrow eyebrow--center">The Datalyze Method</div>
          <h2 className="method__title">Introducing The Datalyze Method</h2>
          <p className="method__intro">
            Most agencies start with dashboards. We start with the foundation.
            By the time we get to dashboards, they actually mean something.
          </p>
        </header>

        <MethodScroll>
          <div className="method__steps" id="method-steps">
            <div className="method__line" aria-hidden="true" />

            {homeMethod.map((step, idx) => {
              const isLeft = idx % 2 === 0;
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
                  <div className="method-step__number-wrap">
                    <span className="method-step__number">{step.number}</span>
                    <div className="method-step__eyebrow">{step.eyebrow}</div>
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
