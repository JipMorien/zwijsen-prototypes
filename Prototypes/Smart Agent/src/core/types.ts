export const SKILLS = ['hoofdgedachte', 'verbanden', 'woordenschat', 'afleiden'] as const;
export type Skill = (typeof SKILLS)[number];

export interface Question {
  id: string;
  skill: Skill;
  prompt: string;
  options: string[];
  correctIndex: number;
  /** Hand-set starting difficulty, on the same scale as student ratings. */
  rating: number;
  /** 1-based number of the sentence that holds the answer. */
  evidenceSentence: number;
}

export interface Text {
  id: string;
  title: string;
  /** Sentences grouped by paragraph. Sentence numbers run through the whole text. */
  paragraphs: string[][];
  questions: Question[];
}

export interface RatingState {
  rating: number;
  answered: number;
}

export type StudentProfile = Record<Skill, RatingState>;

/** Current difficulty of each question, by question id. */
export type ItemRatings = Record<string, RatingState>;

export function allSentences(text: Text): string[] {
  return text.paragraphs.flat();
}
