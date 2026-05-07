import { homePainScenes } from '@/lib/data/home-pain-scenes';
import PainScenes from './pain-scenes';

export default function PainSection() {
  return (
    <section className="section pain" id="pain">
      <div className="container">
        <div className="pain__grid">
          <header className="pain__header">
            <div className="eyebrow">The Cost</div>
            <h2 className="pain__title">
              Why most analytics work doesn't
              <br />
              <em>move the business</em>
            </h2>
            <p className="pain__subhead">
              Most growing companies stall in one of these four places. None of them are obvious. All of them are expensive.
            </p>
          </header>

          <PainScenes scenes={homePainScenes} />
        </div>
      </div>
    </section>
  );
}
