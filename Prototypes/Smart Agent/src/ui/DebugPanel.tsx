import { TARGET_SUCCESS } from '../core/picker';
import { SKILLS, type Question, type Skill, type StudentProfile } from '../core/types';

export interface LogEntry {
  key: string;
  questionId: string;
  skill: Skill;
  correct: boolean;
  hintsUsed: number;
  seconds: number;
  chance: number;
  score: number;
  ratingBefore: number;
  ratingAfter: number;
}

interface Props {
  profile: StudentProfile;
  question: Question | null;
  questionRating: number | null;
  chance: number | null;
  hintSource: string | null;
  log: LogEntry[];
  onRestart: () => void;
}

const percent = (value: number) => `${Math.round(value * 100)}%`;
const signed = (value: number) => `${value >= 0 ? '+' : ''}${Math.round(value)}`;

export function DebugPanel({ profile, question, questionRating, chance, hintSource, log, onRestart }: Props) {
  return (
    <aside className="debug" aria-label="Debugpaneel">
      <div className="debug-head">
        <h2>Debug: wat het systeem nu denkt</h2>
        <button className="ghost" onClick={onRestart}>
          Opnieuw beginnen
        </button>
      </div>

      <div className="debug-grid">
        <section>
          <h3>Profiel per vaardigheid</h3>
          <table>
            <thead>
              <tr>
                <th>Vaardigheid</th>
                <th className="num">Rating</th>
                <th className="num">Vragen</th>
                <th className="num">Laatste</th>
              </tr>
            </thead>
            <tbody>
              {SKILLS.map((skill) => {
                const last = log.find((entry) => entry.skill === skill);
                return (
                  <tr key={skill} className={log[0]?.skill === skill ? 'recent' : ''}>
                    <td>{skill}</td>
                    <td className="num">{Math.round(profile[skill].rating)}</td>
                    <td className="num">{profile[skill].answered}</td>
                    <td className="num">{last ? signed(last.ratingAfter - last.ratingBefore) : '–'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <section>
          <h3>Huidige vraag</h3>
          {question && questionRating !== null && chance !== null ? (
            <dl>
              <dt>Vraag</dt>
              <dd>{question.id}</dd>
              <dt>Vaardigheid</dt>
              <dd>{question.skill}</dd>
              <dt>Vraagrating</dt>
              <dd>{Math.round(questionRating)}</dd>
              <dt>Kans op goed</dt>
              <dd>
                {percent(chance)} (doel {percent(TARGET_SUCCESS)})
              </dd>
              <dt>Bron hint</dt>
              <dd>{hintSource ?? '–'}</dd>
            </dl>
          ) : (
            <p className="muted">Geen vraag open.</p>
          )}
        </section>
      </div>

      <section>
        <h3>Gemeten antwoorden</h3>
        {log.length === 0 ? (
          <p className="muted">Nog geen antwoorden.</p>
        ) : (
          <div className="scroll">
            <table>
              <thead>
                <tr>
                  <th>Vraag</th>
                  <th>Vaardigheid</th>
                  <th>Eerste poging</th>
                  <th className="num">Hints</th>
                  <th className="num">Tijd</th>
                  <th className="num">Kans</th>
                  <th className="num">Score</th>
                  <th className="num">Rating</th>
                </tr>
              </thead>
              <tbody>
                {log.map((entry) => (
                  <tr key={entry.key}>
                    <td>{entry.questionId}</td>
                    <td>{entry.skill}</td>
                    <td>{entry.correct ? 'goed' : 'fout'}</td>
                    <td className="num">{entry.hintsUsed}</td>
                    <td className="num">{entry.seconds.toFixed(1)}s</td>
                    <td className="num">{percent(entry.chance)}</td>
                    <td className="num">{entry.score}</td>
                    <td className="num">
                      {Math.round(entry.ratingBefore)} → {Math.round(entry.ratingAfter)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </aside>
  );
}
