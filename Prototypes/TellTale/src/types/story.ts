/** The four text structures Zwijsen wants children to recognise. */
export type TextStructure = 'oorzaak-gevolg' | 'tijdvolgorde' | 'vergelijken' | 'probleem-oplossing'

/*
 * Story texts can use two kinds of markers:
 *   {key}            replaced by a value from the variant picked for this playthrough
 *   [[flag: tekst]]  only shown when a flag was set earlier (a trace of a mistake)
 *   [[!flag: tekst]] only shown when the flag was NOT set
 */

export type StoryChoice = {
  text: string
  /** Passage shown when this choice does not fit the text. Needed if the choice is wrong in any variant. */
  miss?: string
}

/**
 * One version of a decision. Each playthrough picks a variant per decision, so the clue and
 * the choice that fits change when the story is read again.
 */
export type DecisionVariant = {
  /** Index of the choice that fits the text in this variant. */
  fits: number
  /** The sentence from the rendered text that holds the answer. Shown in the recap at the end. */
  clue: string
  /** Values for {key} markers anywhere in the story. Every variant of a decision has the same keys. */
  vars: Record<string, string>
}

/** Placeholder illustrations, drawn as line icons until real artwork is available. */
export type Illustration =
  | 'forest'
  | 'mill'
  | 'stream'
  | 'flowers'
  | 'tracks'
  | 'owl'
  | 'thorns'
  | 'slope'
  | 'swamp'
  | 'bridge'
  | 'stones'
  | 'fox'
  | 'apple'
  | 'glove'
  | 'rope'
  | 'tree'
  | 'loud'
  | 'shake'
  | 'cat'
  | 'wish'
  | 'home'
  | 'night'
  | 'detour'
  | 'torn'
  | 'wetShoe'
  | 'shaky'
  | 'tiredFox'
  | 'friend'

/** Cover colours, taken from the Estafette palette. */
export type StoryColor = 'red' | 'green' | 'blue' | 'purple'

type BaseNode = {
  chapter: string
  title: string
  text: string
  illustration: Illustration
}

/** A moment where the child decides, and only a careful reader knows the wise choice. */
export type DecisionNode = BaseNode & {
  kind: 'decision'
  question: string
  /** Choice labels must not give the answer away; the text has to do that. */
  choices: StoryChoice[]
  variants: DecisionVariant[]
  /** Where the story goes when the child picks the choice that fits the text. */
  onFit: string
  structure: TextStructure
}

/** A passage that continues to the next node, e.g. what happens after a choice. */
export type PassageNode = BaseNode & {
  kind: 'passage'
  next: string
  /** Flags set when this passage is read. Later texts can react to them with [[flag: ...]]. */
  sets?: string[]
}

/** The last passage. After it, the ending is picked from how well the child read. */
export type FinaleNode = BaseNode & {
  kind: 'finale'
  sets?: string[]
}

export type StoryNode = DecisionNode | PassageNode | FinaleNode

export type StoryEnding = {
  /** Lowest number of choices that fit the text needed for this ending. */
  minScore: number
  title: string
  illustration: Illustration
  text: string
}

/** How a flag shows up next to the story, so the child sees what a choice left behind. */
export type Trace = {
  label: string
  illustration: Illustration
  /** 'good' for something the child earned, 'bad' for something that went wrong. */
  tone: 'good' | 'bad'
}

export type Story = {
  id: string
  title: string
  description: string
  cover: Illustration
  color: StoryColor
  /** Reading level shown as a badge, in the same style as Estafette (e.g. M5 = midden groep 5). */
  level: string
  category: string
  time: string
  available: boolean
  startNode: string
  nodes: Record<string, StoryNode>
  endings: StoryEnding[]
  /** Flags shown as traces on the 'Onderweg' card. Every flag the story sets needs one. */
  traces: Record<string, Trace>
  /** The sky slowly turns to evening as the day goes on, faster when clues are missed. */
  dusk?: boolean
}
