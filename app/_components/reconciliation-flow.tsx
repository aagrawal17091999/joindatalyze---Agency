export default function ReconciliationFlow() {
  return (
    <div className="rf">
      <h2 className="visually-hidden">
        Animated diagram: fragmented data across four domains is rewired by
        Datalyze into a unified source of truth, surfacing a retention insight
        about onboarding completion that drives a product decision.
      </h2>

      <div className="rf__label">data - fragmented</div>
      <div className="rf__sources">
        <div className="rf__src">
          <div className="rf__src-name">Product</div>
          <div className="rf__src-sub">events</div>
        </div>
        <div className="rf__src">
          <div className="rf__src-name">Marketing</div>
          <div className="rf__src-sub">spend</div>
        </div>
        <div className="rf__src">
          <div className="rf__src-name">Revenue</div>
          <div className="rf__src-sub">MRR</div>
        </div>
        <div className="rf__src">
          <div className="rf__src-name">Warehouse</div>
          <div className="rf__src-sub">tables</div>
        </div>
      </div>

      <div className="rf__conn">
        <span className="rf__dot" />
      </div>

      <div className="rf__proc">↳ Datalyze rewires the layer</div>

      <div className="rf__conn">
        <span className="rf__dot" />
      </div>

      <div className="rf__label">foundation - unified</div>
      <div className="rf__unified">
        <div className="rf__unified-title">one source of truth</div>
        <div className="rf__unified-row">
          <span className="rf__pill">Product</span>
          <span className="rf__pill-link">───</span>
          <span className="rf__pill">Marketing</span>
          <span className="rf__pill-link">───</span>
          <span className="rf__pill">Revenue</span>
          <span className="rf__pill-link">───</span>
          <span className="rf__pill">Warehouse</span>
        </div>
        <div className="rf__unified-sub">queryable end-to-end</div>
      </div>

      <div className="rf__conn">
        <span className="rf__dot" />
      </div>

      <div className="rf__label">growth - surfaced</div>
      <div className="rf__growth">
        <div className="rf__growth-cap">
          Day 30 retention by onboarding completion
        </div>
        <div className="rf__bar-row">
          <span className="rf__bar-label">completed onboarding</span>
          <div className="rf__bar-track">
            <div className="rf__bar-fill rf__bar-fill--lime" />
          </div>
          <span className="rf__bar-val rf__bar-val--lime">84%</span>
        </div>
        <div className="rf__bar-row">
          <span className="rf__bar-label">stopped midway</span>
          <div className="rf__bar-track">
            <div className="rf__bar-fill rf__bar-fill--muted" />
          </div>
          <span className="rf__bar-val rf__bar-val--muted">26%</span>
        </div>
      </div>

      <div className="rf__conn">
        <span className="rf__dot" />
      </div>

      <div className="rf__label">decision - made</div>
      <div className="rf__decision">
        Ship onboarding v2 →
        <span className="rf__decision-impact">+12% projected activation</span>
      </div>
    </div>
  );
}
