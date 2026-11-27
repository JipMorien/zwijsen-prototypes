import { allSentences, type Question, type Text } from '../src/core/types';

export interface LlmConfig {
  provider: 'mock' | 'openai';
  baseUrl: string;
  model: string;
  apiKey: string;
}

export interface Hint {
  /** 1-based sentence in the text that the hint points at. */
  sentence: number;
  hint: string;
  source: 'llm' | 'fallback';
  fallbackReason?: string;
}

const REQUEST_TIMEOUT_MS = 30_000;
const ATTEMPTS = 2;

/** Only the text and the question go to the model, never anything about the student. */
export function buildMessages(text: Text, question: Question) {
  const numbered = allSentences(text)
    .map((sentence, i) => `${i + 1}. ${sentence}`)
    .join('\n');
  return [
    {
      role: 'system',
      content:
        'Je helpt een basisschoolleerling (8-10 jaar) bij begrijpend lezen. ' +
        'Gebruik uitsluitend de gegeven tekst, verzin niets. ' +
        'Geef een korte hint van maximaal twee eenvoudige zinnen die de leerling zelf laat nadenken. ' +
        'Noem het juiste antwoord nooit. ' +
        'Antwoord alleen met JSON: {"sentence": <nummer van de zin die het meest helpt>, "hint": "<de hint>"}.',
    },
    {
      role: 'user',
      content:
        `Tekst met genummerde zinnen:\n${numbered}\n\n` +
        `Vraag: ${question.prompt}\n` +
        `Juiste antwoord (niet verklappen): ${question.options[question.correctIndex]}`,
    },
  ];
}

const normalize = (value: string) => value.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

/** Returns the hint only if it points at a real sentence and doesn't give the answer away. */
export function parseHint(raw: string, sentenceCount: number, correctOption: string) {
  const json = raw.match(/\{[\s\S]*\}/)?.[0];
  if (!json) return { error: 'geen JSON in antwoord' };
  let parsed: { sentence?: unknown; hint?: unknown };
  try {
    parsed = JSON.parse(json);
  } catch {
    return { error: 'ongeldige JSON' };
  }
  const { sentence, hint } = parsed;
  if (typeof sentence !== 'number' || !Number.isInteger(sentence) || sentence < 1 || sentence > sentenceCount) {
    return { error: `zin ${String(sentence)} bestaat niet in de tekst` };
  }
  if (typeof hint !== 'string' || hint.trim() === '') return { error: 'lege hint' };
  if (normalize(hint).includes(normalize(correctOption))) return { error: 'hint verklapt het antwoord' };
  return { sentence, hint: hint.trim() };
}

function fallback(question: Question, fallbackReason?: string): Hint {
  return {
    sentence: question.evidenceSentence,
    hint: `Lees zin ${question.evidenceSentence} nog eens rustig door.`,
    source: 'fallback',
    fallbackReason,
  };
}

async function callModel(config: LlmConfig, text: Text, question: Question, fetchFn: typeof fetch) {
  const response = await fetchFn(`${config.baseUrl.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(config.apiKey ? { Authorization: `Bearer ${config.apiKey}` } : {}),
    },
    body: JSON.stringify({ model: config.model, messages: buildMessages(text, question), temperature: 0.2 }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`model gaf status ${response.status}`);
  const data = (await response.json()) as { choices?: { message?: { content?: string } }[] };
  return data.choices?.[0]?.message?.content ?? '';
}

/** Asks the model for a hint. Any failure falls back to pointing at the evidence sentence. */
export async function getHint(
  config: LlmConfig,
  text: Text,
  question: Question,
  fetchFn: typeof fetch = fetch,
): Promise<Hint> {
  if (config.provider === 'mock') return fallback(question);

  let reason = '';
  for (let attempt = 0; attempt < ATTEMPTS; attempt++) {
    try {
      const raw = await callModel(config, text, question, fetchFn);
      const result = parseHint(raw, allSentences(text).length, question.options[question.correctIndex]);
      if ('sentence' in result) return { sentence: result.sentence!, hint: result.hint!, source: 'llm' };
      reason = result.error;
    } catch (error) {
      reason = error instanceof Error ? error.message : String(error);
    }
  }
  return fallback(question, reason);
}
