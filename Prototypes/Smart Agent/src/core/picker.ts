import { expectedScore } from './elo';
import type { ItemRatings, Question, Skill, StudentProfile, Text } from './types';

/** Middle of the 70-75% success band from the proposal. */
export const TARGET_SUCCESS = 0.725;
const REPEAT_SKILL_PENALTY = 0.1;

export function successChance(profile: StudentProfile, items: ItemRatings, question: Question): number {
  return expectedScore(profile[question.skill].rating, items[question.id].rating);
}

function distanceToTarget(profile: StudentProfile, items: ItemRatings, question: Question): number {
  return Math.abs(successChance(profile, items, question) - TARGET_SUCCESS);
}

/** Picks the unread text that fits best. Once all are read, everything is available again. */
export function pickText(
  profile: StudentProfile,
  items: ItemRatings,
  texts: Text[],
  readTextIds: string[],
): Text {
  const unread = texts.filter((text) => !readTextIds.includes(text.id));
  const candidates = unread.length > 0 ? unread : texts;
  const fit = (text: Text) =>
    text.questions.reduce((sum, q) => sum + distanceToTarget(profile, items, q), 0) / text.questions.length;
  return candidates.reduce((best, text) => (fit(text) < fit(best) ? text : best));
}

/** Picks the best-fitting question, steering away from repeating the previous skill. */
export function pickQuestion(
  profile: StudentProfile,
  items: ItemRatings,
  candidates: Question[],
  lastSkill: Skill | null,
): Question {
  const cost = (question: Question) =>
    distanceToTarget(profile, items, question) + (question.skill === lastSkill ? REPEAT_SKILL_PENALTY : 0);
  return candidates.reduce((best, question) => (cost(question) < cost(best) ? question : best));
}
