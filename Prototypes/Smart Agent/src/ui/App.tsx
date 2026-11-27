import { useRef, useState } from 'react';
import { texts } from '../content/index';
import { initialItemRatings, newProfile, scoreAnswer, updateRatings } from '../core/elo';
import { pickQuestion, pickText, successChance } from '../core/picker';
import type { ItemRatings, Question, Skill, StudentProfile, Text } from '../core/types';
import { DebugPanel, type LogEntry } from './DebugPanel';
import { ReadingText } from './ReadingText';

interface HintState {
  sentence: number;
  hint: string;
  source: 'llm' | 'fallback';
  fallbackReason?: string;
}

type Outcome = 'correct' | 'revealed' | null;

interface Session {
  profile: StudentProfile;
  items: ItemRatings;
  readIds: string[];
  text: Text;
  remaining: Question[];
  question: Question | null;
  lastSkill: Skill | null;
}

function startSession(): Session {
  const profile = newProfile();
  const items = initialItemRatings(texts);
  return openText({ profile, items, readIds: [], lastSkill: null });
}

function openText(state: Pick<Session, 'profile' | 'items' | 'readIds' | 'lastSkill'>): Session {
  const text = pickText(state.profile, state.items, texts, state.readIds);
  const question = pickQuestion(state.profile, state.items, text.questions, state.lastSkill);
  return {
    ...state,
    text,
    question,
    remaining: text.questions.filter((q) => q.id !== question.id),
    readIds: [...state.readIds, text.id],
  };
}

export function App() {
  const [session, setSession] = useState(startSession);
  const [hint, setHint] = useState<HintState | null>(null);
  const [hintLoading, setHintLoading] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [wrongPicks, setWrongPicks] = useState<number[]>([]);
  const [outcome, setOutcome] = useState<Outcome>(null);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [debugOpen, setDebugOpen] = useState(true);
  const questionShownAt = useRef(Date.now());
  /** Bumped on every question change, so a late hint reply can't land on the wrong question. */
  const hintTicket = useRef(0);

  const { text, question, profile, items } = session;

  function resetQuestionState() {
    hintTicket.current += 1;
    setHint(null);
    setHintLoading(false);
    setHintsUsed(0);
    setAttempts(0);
    setWrongPicks([]);
    setOutcome(null);
    questionShownAt.current = Date.now();
  }

  async function fetchHint(q: Question) {
    const ticket = ++hintTicket.current;
    setHintLoading(true);
    try {
      const response = await fetch('/api/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ textId: text.id, questionId: q.id }),
      });
      if (!response.ok) throw new Error(`status ${response.status}`);
      const result = (await response.json()) as HintState;
      if (ticket === hintTicket.current) setHint(result);
    } catch {
      if (ticket === hintTicket.current) {
        setHint({
          sentence: q.evidenceSentence,
          hint: `Lees zin ${q.evidenceSentence} nog eens rustig door.`,
          source: 'fallback',
          fallbackReason: 'hint-server niet bereikbaar',
        });
      }
    } finally {
      if (ticket === hintTicket.current) setHintLoading(false);
    }
  }

  function askForHint() {
    if (!question || hint || hintLoading) return;
    setHintsUsed((n) => n + 1);
    void fetchHint(question);
  }

  function answer(index: number) {
    if (!question || outcome) return;
    const correct = index === question.correctIndex;

    // Only the first attempt counts for the rating; retries are for learning.
    if (attempts === 0) {
      const chance = successChance(profile, items, question);
      const score = scoreAnswer(correct, hintsUsed);
      const before = profile[question.skill].rating;
      const result = updateRatings(profile[question.skill], items[question.id], score);
      setSession({
        ...session,
        profile: { ...profile, [question.skill]: result.student },
        items: { ...items, [question.id]: result.item },
        lastSkill: question.skill,
      });
      setLog((entries) => [
        {
          key: `${question.id}-${entries.length}`,
          questionId: question.id,
          skill: question.skill,
          correct,
          hintsUsed,
          seconds: (Date.now() - questionShownAt.current) / 1000,
          chance,
          score,
          ratingBefore: before,
          ratingAfter: result.student.rating,
        },
        ...entries,
      ]);
    }

    setAttempts((n) => n + 1);
    if (correct) {
      setOutcome('correct');
    } else if (attempts === 0) {
      setWrongPicks([index]);
      if (!hint) void fetchHint(question);
    } else {
      setWrongPicks((picks) => [...picks, index]);
      setOutcome('revealed');
    }
  }

  function next() {
    resetQuestionState();
    if (session.remaining.length > 0) {
      const nextQuestion = pickQuestion(profile, items, session.remaining, session.lastSkill);
      setSession({
        ...session,
        question: nextQuestion,
        remaining: session.remaining.filter((q) => q.id !== nextQuestion.id),
      });
    } else {
      setSession({ ...session, question: null });
    }
  }

  function nextText() {
    resetQuestionState();
    // After the last text everything is open again, except the one just read.
    const readIds = session.readIds.length >= texts.length ? [text.id] : session.readIds;
    setSession(openText({ ...session, readIds }));
  }

  function restart() {
    resetQuestionState();
    setLog([]);
    setSession(startSession());
  }

  const highlighted = outcome === 'revealed' ? (question?.evidenceSentence ?? null) : (hint?.sentence ?? null);

  return (
    <div className="page">
      <header className="topbar">
        <span className="brand">Leesmaatje</span>
        <button className="ghost" onClick={() => setDebugOpen((open) => !open)}>
          {debugOpen ? 'Verberg debug' : 'Toon debug'}
        </button>
      </header>

      <main className="reader">
        <ReadingText text={text} highlighted={highlighted} />

        <section className="card" aria-label="Vraag">
          {question ? (
            <>
              <h2 className="prompt">{question.prompt}</h2>
              <div className="options">
                {question.options.map((option, index) => {
                  const isCorrectShown = outcome !== null && index === question.correctIndex;
                  const isWrong = wrongPicks.includes(index);
                  return (
                    <button
                      key={option}
                      className={`option${isCorrectShown ? ' correct' : ''}${isWrong ? ' wrong' : ''}`}
                      disabled={outcome !== null || isWrong}
                      onClick={() => answer(index)}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              <div className="feedback" aria-live="polite">
                {outcome === 'correct' && <p className="good">Goed gedaan!</p>}
                {outcome === 'revealed' && (
                  <p>
                    Het juiste antwoord staat nu groen. Je vindt het terug in zin {question.evidenceSentence}.
                  </p>
                )}
                {outcome === null && attempts > 0 && <p>Nog niet. Probeer het nog een keer.</p>}
                {hint && outcome === null && <p className="hint">{hint.hint}</p>}
                {hintLoading && <p className="muted">Even nadenken…</p>}
              </div>

              {outcome ? (
                <button className="primary" onClick={next}>
                  Volgende
                </button>
              ) : (
                <button className="ghost" onClick={askForHint} disabled={hint !== null || hintLoading}>
                  Ik wil een hint
                </button>
              )}
            </>
          ) : (
            <>
              <h2 className="prompt">Tekst uitgelezen!</h2>
              <p>Goed bezig. Klaar voor de volgende tekst?</p>
              <button className="primary" onClick={nextText}>
                Volgende tekst
              </button>
            </>
          )}
        </section>
      </main>

      {debugOpen && (
        <DebugPanel
          profile={profile}
          question={question}
          questionRating={question ? items[question.id].rating : null}
          chance={question ? successChance(profile, items, question) : null}
          hintSource={hint ? (hint.source === 'llm' ? 'LLM' : `terugval${hint.fallbackReason ? `: ${hint.fallbackReason}` : ''}`) : null}
          log={log}
          onRestart={restart}
        />
      )}
    </div>
  );
}
