import {
  DAY_DECAY,
  ENERGY_PER_PAGE,
  FOOD_PER_FEEDING,
  HUNGRY_AT,
  INITIAL_STATE,
  JOY_PER_EVIDENCE,
  JOY_PER_PET,
  MIN_READ_MS,
  NEED_MAX,
  SLEEP_AVG,
} from "./config";
import { copy } from "./copy";
import type { Mood, Needs, PagiAction, PagiResult, PagiState } from "./types";

function clampNeed(value: number): number {
  return Math.min(NEED_MAX, Math.max(0, value));
}

function averageNeed({ food, energy, joy }: Needs): number {
  return (food + energy + joy) / 3;
}

export function moodOf(state: PagiState): Mood {
  if (state.sleeping) return "slaapt";
  if (state.needs.food < HUNGRY_AT) return "honger";
  return "blij";
}

function readPage(state: PagiState, now: number): PagiResult {
  const readLongEnough =
    state.pageOpenedAt !== null && now - state.pageOpenedAt >= MIN_READ_MS;
  if (!readLongEnough) return { state, say: copy.readTooFast };

  return {
    state: {
      ...state,
      wordBites: state.wordBites + 1,
      needs: {
        ...state.needs,
        energy: clampNeed(state.needs.energy + ENERGY_PER_PAGE),
      },
      sleeping: false,
      // Cleared so a second page_read for the same page earns nothing.
      pageOpenedAt: null,
    },
    say: state.sleeping ? copy.wokeUp : copy.pageRead,
  };
}

function passSchoolDay(state: PagiState): PagiResult {
  const needsAfterDay: Needs = {
    food: clampNeed(state.needs.food - DAY_DECAY.food),
    energy: clampNeed(state.needs.energy - DAY_DECAY.energy),
    joy: clampNeed(state.needs.joy - DAY_DECAY.joy),
  };
  const fallsAsleep = !state.sleeping && averageNeed(needsAfterDay) < SLEEP_AVG;
  return {
    state: {
      ...state,
      needs: needsAfterDay,
      sleeping: state.sleeping || fallsAsleep,
    },
    say: fallsAsleep ? copy.fellAsleep : undefined,
  };
}

function feed(state: PagiState): PagiResult {
  if (state.sleeping) return { state, say: copy.asleep };
  if (state.wordBites === 0) return { state, say: copy.noWordBites };
  return {
    state: {
      ...state,
      wordBites: state.wordBites - 1,
      needs: {
        ...state.needs,
        food: clampNeed(state.needs.food + FOOD_PER_FEEDING),
      },
    },
    say: copy.fed,
  };
}

function pet(state: PagiState): PagiResult {
  if (state.sleeping) return { state, say: copy.asleep };
  return {
    state: {
      ...state,
      needs: { ...state.needs, joy: clampNeed(state.needs.joy + JOY_PER_PET) },
    },
    say: copy.petted,
  };
}

export function reducer(
  state: PagiState,
  action: PagiAction,
  now: number,
): PagiResult {
  switch (action.type) {
    case "view_changed":
      return { state: { ...state, view: action.view } };
    case "page_opened":
      return { state: { ...state, pageOpenedAt: now } };
    case "page_read":
      return readPage(state, now);
    case "structure_question":
      return { state, say: action.question };
    case "evidence_found":
      return {
        state: {
          ...state,
          stars: state.stars + 1,
          needs: {
            ...state.needs,
            joy: clampNeed(state.needs.joy + JOY_PER_EVIDENCE),
          },
        },
        say: copy.evidenceFound(action.signal),
        animation: "juich",
      };
    case "evidence_missed":
      return { state, say: copy.evidenceMissed(action.signal) };
    case "quiet":
      return { state: { ...state, quiet: action.on } };
    case "demo_day":
      return passSchoolDay(state);
    case "demo_reset":
      return { state: { ...INITIAL_STATE, view: state.view } };
    case "feed":
      return feed(state);
    case "pet":
      return pet(state);
    case "panel_changed":
      return { state: { ...state, panelOpen: action.open } };
  }
}
