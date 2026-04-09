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
              This is what <em>bad data</em>
              <br />
              actually costs you
            </h2>
            <p className="pain__subhead">
              Most of it doesn&apos;t show up on a line item. That&apos;s what
              makes it expensive.
            </p>
          </header>

          <PainScenes scenes={homePainScenes} />
        </div>
      </div>
    </section>
  );
}
