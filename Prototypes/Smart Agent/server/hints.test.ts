import { describe, expect, it, vi } from 'vitest';
import { texts } from '../src/content/index';
import { buildMessages, getHint, parseHint, type LlmConfig } from './hints';

const text = texts[0];
const question = text.questions[1]; // "Zijn eigen band was lek", evidence sentence 7
const correct = question.options[question.correctIndex];
const config: LlmConfig = { provider: 'openai', baseUrl: 'http://model/v1', model: 'test', apiKey: '' };

const modelReplies = (...replies: string[]) => {
  const queue = [...replies];
  return vi.fn(async () =>
    Response.json({ choices: [{ message: { content: queue.shift() } }] }),
  ) as unknown as typeof fetch;
};

describe('parseHint', () => {
  it('accepts a hint that points at a real sentence', () => {
    expect(parseHint('{"sentence": 7, "hint": "Kijk wat er met Tims fiets is."}', 8, correct)).toEqual({
      sentence: 7,
      hint: 'Kijk wat er met Tims fiets is.',
    });
  });

  it('finds JSON wrapped in other text', () => {
    expect(parseHint('Hier: {"sentence": 2, "hint": "Lees verder."} klaar', 8, correct)).toHaveProperty('sentence', 2);
  });

  it.each([
    ['sentence out of range', '{"sentence": 99, "hint": "Kijk daar."}'],
    ['sentence zero', '{"sentence": 0, "hint": "Kijk daar."}'],
    ['no sentence', '{"sentence": null, "hint": "Kijk daar."}'],
    ['empty hint', '{"sentence": 2, "hint": " "}'],
    ['not JSON', 'Lees de tekst nog eens.'],
    ['broken JSON', '{"sentence": 2,'],
    ['answer given away', '{"sentence": 7, "hint": "Het antwoord is: zijn EIGEN band was lek!"}'],
  ])('rejects %s', (_name, raw) => {
    expect(parseHint(raw, 8, correct)).toHaveProperty('error');
  });
});

describe('getHint', () => {
  it('uses the evidence sentence in mock mode without calling a model', async () => {
    const fetchFn = modelReplies();
    const hint = await getHint({ ...config, provider: 'mock' }, text, question, fetchFn);
    expect(hint).toMatchObject({ sentence: 7, source: 'fallback' });
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it('returns a valid model hint', async () => {
    const hint = await getHint(config, text, question, modelReplies('{"sentence": 7, "hint": "Wat is er met Tims fiets?"}'));
    expect(hint).toEqual({ sentence: 7, hint: 'Wat is er met Tims fiets?', source: 'llm' });
  });

  it('retries once after an invalid reply', async () => {
    const fetchFn = modelReplies('{"sentence": 99, "hint": "x"}', '{"sentence": 6, "hint": "Kijk naar Tim."}');
    expect(await getHint(config, text, question, fetchFn)).toMatchObject({ sentence: 6, source: 'llm' });
    expect(fetchFn).toHaveBeenCalledTimes(2);
  });

  it('falls back and reports why when the model keeps failing', async () => {
    const fetchFn = vi.fn(async () => new Response('', { status: 500 })) as unknown as typeof fetch;
    expect(await getHint(config, text, question, fetchFn)).toMatchObject({
      sentence: 7,
      source: 'fallback',
      fallbackReason: 'model gaf status 500',
    });
  });
});

it('sends only the text and question to the model, numbered by sentence', () => {
  const [system, user] = buildMessages(text, question);
  expect(user.content).toContain('7. Hij had de fiets geleend');
  expect(system.content).toContain('Noem het juiste antwoord nooit');
});
