import { describe, expect, it } from 'vitest';
import { newProfile } from './elo';
import { pickQuestion, pickText, successChance, TARGET_SUCCESS } from './picker';
import type { ItemRatings, Question, Skill, Text } from './types';

const question = (id: string, skill: Skill, rating: number): Question => ({
  id,
  skill,
  rating,
  prompt: id,
  options: ['a', 'b'],
  correctIndex: 0,
  evidenceSentence: 1,
});
const text = (id: string, rating: number): Text => ({
  id,
  title: id,
  paragraphs: [['Zin.']],
  questions: [question(`${id}-q`, 'verbanden', rating)],
});
const itemsFor = (questions: Question[]): ItemRatings =>
  Object.fromEntries(questions.map((q) => [q.id, { rating: q.rating, answered: 0 }]));

describe('pickQuestion', () => {
  it('picks the question closest to the target success chance', () => {
    // At student rating 1000 the target corresponds to an item rating of about 832.
    const candidates = [
      question('easy', 'verbanden', 400),
      question('fit', 'verbanden', 830),
      question('hard', 'verbanden', 1400),
    ];
    const items = itemsFor(candidates);
    const picked = pickQuestion(newProfile(), items, candidates, null);
    expect(picked.id).toBe('fit');
    expect(successChance(newProfile(), items, picked)).toBeCloseTo(TARGET_SUCCESS, 1);
  });

  it('avoids repeating a skill when another question fits about as well', () => {
    const candidates = [question('same', 'verbanden', 832), question('other', 'afleiden', 850)];
    expect(pickQuestion(newProfile(), itemsFor(candidates), candidates, 'verbanden').id).toBe('other');
  });
});

describe('pickText', () => {
  const texts = [text('easy', 500), text('fit', 830), text('hard', 1400)];
  const items = itemsFor(texts.flatMap((t) => t.questions));

  it('picks the best fitting unread text', () => {
    expect(pickText(newProfile(), items, texts, []).id).toBe('fit');
    expect(pickText(newProfile(), items, texts, ['fit']).id).toBe('easy');
  });

  it('makes all texts available again once everything is read', () => {
    expect(pickText(newProfile(), items, texts, ['easy', 'fit', 'hard']).id).toBe('fit');
  });
});
