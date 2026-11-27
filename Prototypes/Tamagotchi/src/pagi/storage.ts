import { INITIAL_STATE, STORAGE_KEY } from "./config";
import type { Needs, PagiState, SavedState } from "./types";

export interface PagiStorage {
  load(): SavedState | null;
  save(state: SavedState): void;
}

function isNeeds(value: unknown): value is Needs {
  return (
    typeof value === "object" &&
    value !== null &&
    "food" in value &&
    typeof value.food === "number" &&
    "energy" in value &&
    typeof value.energy === "number" &&
    "joy" in value &&
    typeof value.joy === "number"
  );
}

function isSavedState(value: unknown): value is SavedState {
  return (
    typeof value === "object" &&
    value !== null &&
    "needs" in value &&
    isNeeds(value.needs) &&
    "wordBites" in value &&
    typeof value.wordBites === "number" &&
    "stars" in value &&
    typeof value.stars === "number" &&
    "sleeping" in value &&
    typeof value.sleeping === "boolean"
  );
}

export const localStorageAdapter: PagiStorage = {
  load() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw === null) return null;
      const parsed: unknown = JSON.parse(raw);
      return isSavedState(parsed) ? parsed : null;
    } catch {
      return null;
    }
  },
  save(state) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  },
};

export function toSavedState(state: PagiState): SavedState {
  const { needs, wordBites, stars, sleeping } = state;
  return { needs, wordBites, stars, sleeping };
}

export function restoreState(saved: SavedState | null): PagiState {
  return saved ? { ...INITIAL_STATE, ...saved } : INITIAL_STATE;
}
