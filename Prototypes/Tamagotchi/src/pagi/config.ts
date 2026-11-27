import type { Needs, PagiState } from "./types";

export const MIN_READ_MS = 4000;
export const HUNGRY_AT = 50;
export const SLEEP_AVG = 8;
export const BUBBLE_MS = 7000;
export const NEED_MAX = 100;

export const DAY_DECAY: Needs = { food: 25, energy: 30, joy: 15 };
export const ENERGY_PER_PAGE = 10;
export const JOY_PER_EVIDENCE = 10;
export const FOOD_PER_FEEDING = 20;
export const JOY_PER_PET = 3;

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
