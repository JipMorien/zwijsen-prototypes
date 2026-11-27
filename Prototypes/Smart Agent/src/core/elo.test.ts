import { describe, expect, it } from 'vitest';
import { expectedScore, scoreAnswer, studentK, updateRatings } from './elo';

describe('expectedScore', () => {
  it('is 50% for equal ratings', () => {
    expect(expectedScore(1000, 1000)).toBeCloseTo(0.5);
  });

  it('gives about 76% with a 200-point advantage', () => {
    expect(expectedScore(1200, 1000)).toBeCloseTo(0.76, 2);
  });
});

describe('scoreAnswer', () => {
  it('gives less credit when hints were used, but always more than a wrong answer', () => {
    expect(scoreAnswer(true, 0)).toBe(1);
    expect(scoreAnswer(true, 1)).toBe(0.75);
    expect(scoreAnswer(true, 9)).toBe(0.5);
    expect(scoreAnswer(false, 0)).toBe(0);
  });
});

describe('updateRatings', () => {
  const student = { rating: 1000, answered: 0 };
  const item = { rating: 1000, answered: 0 };

  it('raises the student and lowers the item after a correct answer', () => {
    const result = updateRatings(student, item, 1);
    expect(result.student.rating).toBeGreaterThan(1000);
    expect(result.item.rating).toBeLessThan(1000);
    expect(result.student.answered).toBe(1);
  });

  it('lowers the student and raises the item after a wrong answer', () => {
    const result = updateRatings(student, item, 0);
    expect(result.student.rating).toBeLessThan(1000);
    expect(result.item.rating).toBeGreaterThan(1000);
  });

  it('moves a new student more than an experienced one', () => {
    expect(studentK(0)).toBeGreaterThan(studentK(40));
  });
});
