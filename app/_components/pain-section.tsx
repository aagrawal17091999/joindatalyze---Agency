import { homePainScenes } from '@/lib/data/home-pain-scenes';
import CtaButton from './cta-button';
import PainScenes from './pain-scenes';

export default function PainSection() {
  return (
    <section className="section pain" id="pain">
      <div className="container">
        <div className="pain__grid">
          <header className="pain__header">
            <div className="eyebrow">The Cost</div>
            <h2 className="pain__title">
              Why doesn't analytics work
              <br />
              <em>move the business?</em>
            </h2>
          </header>

          <PainScenes scenes={homePainScenes} />
        </div>

        <div className="pain__cta">
          <p className="pain__cta-line">
            Sound familiar? Let's show you what your data is actually hiding.
          </p>
          <CtaButton href="/contact" location="home_pain">
            Get a free audit
          </CtaButton>
        </div>
      </div>
    </section>
  );
}
