import type { Needs, PagiState } from "./types";

export const MIN_READ_MS = 4000;
export const HUNGRY_AT = 50;
export const SLEEP_AVG = 8;
export const BUBBLE_MS = 7000;
export const DAY_DECAY: Needs = { food: 25, energy: 30, joy: 15 };
export const FEED_AMOUNT = 20;
export const PET_AMOUNT = 3;
export const READ_ENERGY = 10;
export const FOUND_JOY = 10;
export const NEED_MAX = 100;

export const SITTING_SIZE = { width: 84, height: 111 };
export const PERCH_OVERLAP = 10;
export const PERCH_INSET = 20;

export const STORAGE_KEY = "pagi-state-v1";

export const INITIAL_STATE: PagiState = {
  needs: { food: 45, energy: 55, joy: 70 },
  wordBites: 2,
  stars: 0,
  sleeping: false,
  panelOpen: false,
  view: "overview",
  quiet: false,
  pageOpenedAt: null,
};
