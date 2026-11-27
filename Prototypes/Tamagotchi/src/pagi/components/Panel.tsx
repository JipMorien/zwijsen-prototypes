import { X } from "lucide-react";
import { NEED_MAX } from "../config";
import { copy } from "../copy";
import type { Needs, PagiState } from "../types";

interface PanelProps {
  state: PagiState;
  onFeed: () => void;
  onPet: () => void;
  onClose: () => void;
}

const NEED_LABELS: Record<keyof Needs, string> = {
  food: copy.panel.honger,
  energy: copy.panel.energie,
  joy: copy.panel.blij,
};

const NEED_ORDER: (keyof Needs)[] = ["food", "energy", "joy"];

function NeedBar({ need, value }: { need: keyof Needs; value: number }) {
  const percentage = Math.round((value / NEED_MAX) * 100);
  return (
    <div className="pagi-need" data-need={need}>
      <div className="pagi-need-label">
        <span>{NEED_LABELS[need]}</span>
        <span>{percentage}%</span>
      </div>
      <progress
        className="pagi-bar"
        aria-label={NEED_LABELS[need]}
        value={value}
        max={NEED_MAX}
      />
    </div>
  );
}

export function Panel({ state, onFeed, onPet, onClose }: PanelProps) {
  return (
    <section className="pagi-panel" aria-label={copy.panel.title}>
      <header className="pagi-panel-header">
        <h2 className="pagi-name">{copy.panel.title}</h2>
        <button
          type="button"
          className="pagi-close"
          aria-label={copy.panel.close}
          onClick={onClose}
        >
          <X aria-hidden="true" />
        </button>
      </header>
      <div className="pagi-stats">
        <p className="pagi-chip" data-kind="brokjes">
          {copy.panel.brokjes(state.wordBites)}
        </p>
        <p className="pagi-chip" data-kind="sterren">
          {copy.panel.sterren(state.stars)}
        </p>
      </div>
      {state.sleeping && <p className="pagi-note">{copy.panel.sleepNote}</p>}
      {NEED_ORDER.map((need) => (
        <NeedBar key={need} need={need} value={state.needs[need]} />
      ))}
      <div className="pagi-actions">
        <button
          type="button"
          className="pagi-action"
          data-primary="true"
          onClick={onFeed}
        >
          {copy.panel.feed}
        </button>
        <button type="button" className="pagi-action" onClick={onPet}>
          {copy.panel.pet}
        </button>
      </div>
    </section>
  );
}
