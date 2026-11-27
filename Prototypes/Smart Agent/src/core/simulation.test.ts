import { expect, it } from 'vitest';
import { texts } from '../content/index';
import { meanError, simulate } from './simulation';
import type { Skill } from './types';

const trueAbility: Record<Skill, number> = {
  hoofdgedachte: 1200,
  verbanden: 1050,
  woordenschat: 800,
  afleiden: 950,
};
const seeds = Array.from({ length: 30 }, (_, seed) => seed);
const run = (seed: number) => simulate(texts, { trueAbility, sessions: 20, seed, itemRatingError: 80 });
const average = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length;

it('gets closer to the real ability over 20 sessions, on average', () => {
  const before = average(seeds.map((seed) => meanError(run(seed)[0], trueAbility)));
  const after = average(seeds.map((seed) => meanError(run(seed)[20], trueAbility)));
  expect(after).toBeLessThan(before * 0.65);
});

it('finds the strongest and weakest skill, on average', () => {
  const finals = seeds.map((seed) => run(seed)[20]);
  const mean = (skill: Skill) => average(finals.map((profile) => profile[skill].rating));
  expect(mean('hoofdgedachte')).toBeGreaterThan(mean('verbanden'));
  expect(mean('verbanden')).toBeGreaterThan(mean('afleiden'));
  expect(mean('afleiden')).toBeGreaterThan(mean('woordenschat'));
});

it('gives the same result for the same seed', () => {
  expect(run(7)).toEqual(run(7));
});
