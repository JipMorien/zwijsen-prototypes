import { describe, expect, it } from 'vitest';
import { allSentences, SKILLS } from '../core/types';
import { texts } from './index';

describe.each(texts.map((text) => [text.id, text] as const))('text %s', (_id, text) => {
  it('covers every skill once', () => {
    expect(text.questions.map((q) => q.skill).sort()).toEqual([...SKILLS].sort());
  });

  it.each(text.questions.map((q) => [q.id, q] as const))('%s points at a real answer and sentence', (_qid, q) => {
    expect(q.correctIndex).toBeGreaterThanOrEqual(0);
    expect(q.correctIndex).toBeLessThan(q.options.length);
    expect(q.evidenceSentence).toBeGreaterThanOrEqual(1);
    expect(q.evidenceSentence).toBeLessThanOrEqual(allSentences(text).length);
  });
});

it('has unique question ids', () => {
  const ids = texts.flatMap((text) => text.questions.map((q) => q.id));
  expect(new Set(ids).size).toBe(ids.length);
});
