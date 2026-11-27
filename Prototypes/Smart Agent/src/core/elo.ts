import { SKILLS, type ItemRatings, type RatingState, type StudentProfile, type Text } from './types';

export const START_RATING = 1000;
const HINT_PENALTY = 0.25;
const MIN_SCORE_WITH_HINT = 0.5;

/** Chance (0-1) that a student at this rating answers an item at this rating correctly. */
export function expectedScore(studentRating: number, itemRating: number): number {
  return 1 / (1 + 10 ** ((itemRating - studentRating) / 400));
}

/** A student's K starts high so the first answers count a lot, then settles. */
export function studentK(answered: number): number {
  return Math.max(24, 96 / (1 + answered / 4));
}

/** Items start from hand-set ratings and one student shouldn't move them far. */
export function itemK(answered: number): number {
  return Math.max(4, 12 / (1 + answered / 10));
}

/** 1 for correct unaided, less with hints, 0 for wrong. Only the first attempt is scored. */
export function scoreAnswer(correct: boolean, hintsUsed: number): number {
  if (!correct) return 0;
  return hintsUsed === 0 ? 1 : Math.max(MIN_SCORE_WITH_HINT, 1 - HINT_PENALTY * hintsUsed);
}

export function updateRatings(student: RatingState, item: RatingState, score: number) {
  const expected = expectedScore(student.rating, item.rating);
  return {
    expected,
    student: {
      rating: student.rating + studentK(student.answered) * (score - expected),
      answered: student.answered + 1,
    },
    item: {
      rating: item.rating + itemK(item.answered) * (expected - score),
      answered: item.answered + 1,
    },
  };
}

export function newProfile(): StudentProfile {
  return Object.fromEntries(
    SKILLS.map((skill) => [skill, { rating: START_RATING, answered: 0 }]),
  ) as StudentProfile;
}

export function initialItemRatings(texts: Text[]): ItemRatings {
  const ratings: ItemRatings = {};
  for (const text of texts) {
    for (const question of text.questions) {
      ratings[question.id] = { rating: question.rating, answered: 0 };
    }
  }
  return ratings;
}
