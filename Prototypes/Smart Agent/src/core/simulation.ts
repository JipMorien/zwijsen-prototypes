import { expectedScore, initialItemRatings, newProfile, updateRatings } from './elo';
import { pickQuestion, pickText } from './picker';
import { gaussian, seededRandom } from './random';
import { SKILLS, type Skill, type StudentProfile, type Text } from './types';

export interface SimulationOptions {
  /** The student's real ability per skill, hidden from the system. */
  trueAbility: Record<Skill, number>;
  sessions: number;
  seed: number;
  /** Standard deviation of how far the hand-set question ratings are off. */
  itemRatingError: number;
}

/** Runs a fake student through the real picker and Elo. One session is one text. */
export function simulate(texts: Text[], options: SimulationOptions): StudentProfile[] {
  const random = seededRandom(options.seed);
  let profile = newProfile();
  const items = initialItemRatings(texts);
  const trueDifficulty = Object.fromEntries(
    Object.entries(items).map(([id, item]) => [id, item.rating + gaussian(random) * options.itemRatingError]),
  );

  let read: string[] = [];
  let lastSkill: Skill | null = null;
  const history = [profile];

  for (let session = 0; session < options.sessions; session++) {
    if (read.length === texts.length) read = [];
    const text = pickText(profile, items, texts, read);
    read.push(text.id);

    let remaining = text.questions;
    while (remaining.length > 0) {
      const question = pickQuestion(profile, items, remaining, lastSkill);
      const chance = expectedScore(options.trueAbility[question.skill], trueDifficulty[question.id]);
      const score = random() < chance ? 1 : 0;
      const result = updateRatings(profile[question.skill], items[question.id], score);
      profile = { ...profile, [question.skill]: result.student };
      items[question.id] = result.item;
      lastSkill = question.skill;
      remaining = remaining.filter((q) => q.id !== question.id);
    }
    history.push(profile);
  }
  return history;
}

/** Average distance between the estimated and the real ability, over all skills. */
export function meanError(profile: StudentProfile, trueAbility: Record<Skill, number>): number {
  return SKILLS.reduce((sum, skill) => sum + Math.abs(profile[skill].rating - trueAbility[skill]), 0) / SKILLS.length;
}
