import {
  DAY_DECAY,
  FEED_AMOUNT,
  FOUND_JOY,
  HUNGRY_AT,
  INITIAL_STATE,
  MIN_READ_MS,
  NEED_MAX,
  PET_AMOUNT,
  READ_ENERGY,
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
  if (!readLongEnough) return { state, say: copy.tooFast };

  return {
    state: {
      ...state,
      wordBites: state.wordBites + 1,
      needs: {
        ...state.needs,
        energy: clampNeed(state.needs.energy + READ_ENERGY),
      },
      sleeping: false,
      pageOpenedAt: null,
    },
    say: state.sleeping ? copy.woke : copy.pageRead,
  };
}

function passSchoolDay(state: PagiState): PagiResult {
  const needsAfterDay: Needs = {
    food: clampNeed(state.needs.food - DAY_DECAY.food),
    energy: clampNeed(state.needs.energy - DAY_DECAY.energy),
    joy: clampNeed(state.needs.joy - DAY_DECAY.joy),
  };
  if (state.sleeping) {
    return { state: { ...state, needs: needsAfterDay } };
  }
  const fallsAsleep = averageNeed(needsAfterDay) < SLEEP_AVG;
  return {
    state: { ...state, needs: needsAfterDay, sleeping: fallsAsleep },
    say: fallsAsleep ? copy.fellAsleep : copy.dayPassed,
  };
}

function feed(state: PagiState): PagiResult {
  if (state.sleeping) return { state, say: copy.asleep };
  if (state.wordBites === 0) return { state, say: copy.noBrokjes };
  const foodAfterFeeding = clampNeed(state.needs.food + FEED_AMOUNT);
  return {
    state: {
      ...state,
      wordBites: state.wordBites - 1,
      needs: { ...state.needs, food: foodAfterFeeding },
    },
    say: foodAfterFeeding === NEED_MAX ? copy.full : copy.fed,
  };
}

function pet(state: PagiState): PagiResult {
  if (state.sleeping) return { state, say: copy.asleep };
  return {
    state: {
      ...state,
      needs: { ...state.needs, joy: clampNeed(state.needs.joy + PET_AMOUNT) },
    },
    say: copy.pet,
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
      return { state, say: copy.question(action.question) };
    case "evidence_found":
      return {
        state: {
          ...state,
          stars: state.stars + 1,
          needs: {
            ...state.needs,
            joy: clampNeed(state.needs.joy + FOUND_JOY),
          },
        },
        say: copy.found(action.signal),
        animation: "juich",
      };
    case "evidence_missed":
      return { state, say: copy.missed(action.signal) };
    case "quiet":
      return {
        state: { ...state, quiet: action.on },
        say: action.on ? undefined : copy.quietOff,
      };
    case "demo_day":
      return passSchoolDay(state);
    case "demo_reset":
      return {
        state: { ...INITIAL_STATE, view: state.view, quiet: state.quiet },
        say: copy.hello,
      };
    case "feed":
      return feed(state);
    case "pet":
      return pet(state);
    case "panel_changed":
      return { state: { ...state, panelOpen: action.open } };
  }
}
