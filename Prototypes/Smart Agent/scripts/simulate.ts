import { texts } from '../src/content/index';
import { meanError, simulate } from '../src/core/simulation';
import { SKILLS, type Skill } from '../src/core/types';

const trueAbility: Record<Skill, number> = {
  hoofdgedachte: 1200,
  verbanden: 1050,
  woordenschat: 800,
  afleiden: 950,
};
const sessions = 20;
const checkpoints = [0, 1, 5, 10, 20];

const history = simulate(texts, { trueAbility, sessions, seed: 42, itemRatingError: 80 });
const cell = (value: string | number) => String(value).padStart(14);

console.log(`Simulated student, ${sessions} sessions, 4 questions per session\n`);
console.log(cell('after session') + SKILLS.map(cell).join('') + cell('mean error'));
console.log(cell('real ability') + SKILLS.map((s) => cell(trueAbility[s])).join('') + cell('-'));
for (const session of checkpoints) {
  const profile = history[session];
  console.log(
    cell(session) +
      SKILLS.map((s) => cell(Math.round(profile[s].rating))).join('') +
      cell(Math.round(meanError(profile, trueAbility))),
  );
}
