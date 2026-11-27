import { NEED_MAX } from "../config";
import { copy } from "../copy";
import type { Needs, PagiState } from "../types";

interface PanelProps {
  state: PagiState;
  onFeed: () => void;
  onPet: () => void;
  onClose: () => void;
}

const NEED_ORDER: (keyof Needs)[] = ["food", "energy", "joy"];

function NeedBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="pagi-need">
      <span className="pagi-need-label">{label}</span>
      <div
        className="pagi-meter"
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={NEED_MAX}
        aria-valuenow={value}
      >
        <div
          className="pagi-meter-fill"
          style={{ width: `${(value / NEED_MAX) * 100}%` }}
        />
      </div>
    </div>
  );
}

export function Panel({ state, onFeed, onPet, onClose }: PanelProps) {
  return (
    <section className="pagi-panel" aria-label={copy.name}>
      <header className="pagi-panel-header">
        <h2 className="pagi-name">{copy.name}</h2>
        <button type="button" className="pagi-close" onClick={onClose}>
          {copy.close}
        </button>
      </header>
      <dl className="pagi-stats">
        <div className="pagi-stat">
          <dt>{copy.wordBites}</dt>
          <dd>{state.wordBites}</dd>
        </div>
        <div className="pagi-stat">
          <dt>{copy.stars}</dt>
          <dd>{state.stars}</dd>
        </div>
      </dl>
      {state.sleeping && <p className="pagi-note">{copy.asleep}</p>}
      {NEED_ORDER.map((need) => (
        <NeedBar
          key={need}
          label={copy.needs[need]}
          value={state.needs[need]}
        />
      ))}
      <div className="pagi-actions">
        <button type="button" className="pagi-action" onClick={onFeed}>
          {copy.feed}
        </button>
        <button type="button" className="pagi-action" onClick={onPet}>
          {copy.pet}
        </button>
      </div>
    </section>
  );
}
