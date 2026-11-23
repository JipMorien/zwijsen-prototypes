import {
  Check,
  ChevronRight,
  Highlighter,
  Lightbulb,
  Lock,
  Moon,
  NotebookPen,
  RotateCcw,
  Sun,
  Sunset,
  TrendingUp,
} from 'lucide-react'
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { loadProgress, recordRead, type StoryProgress } from '../engine/progress'
import { activeTraces, clueMarked, duskLevel, splitSentences, timeOfDay, type Mark } from '../engine/reading'
import {
  bestScore,
  collectFlags,
  createPlaythrough,
  decisionCount,
  decisionNode,
  fittingChoice,
  nextAfterChoice,
  pickEnding,
  renderText,
  score,
  storyVars,
  type Decision,
  type Playthrough,
} from '../engine/story'
import type { Illustration, Story, TextStructure } from '../types/story'
import { IllustrationIcon, Scene } from '../ui/illustrations'

type ReadingPageProps = {
  story: Story
  onBack: () => void
}

const structureNames: Record<TextStructure, string> = {
  'oorzaak-gevolg': 'oorzaak en gevolg',
  tijdvolgorde: 'volgorde',
  vergelijken: 'vergelijken',
  'probleem-oplossing': 'probleem en oplossing',
}

type Marking = {
  nodeId: string
  marks: Mark[]
  highlighter: boolean
  onToggle: (text: string) => void
}

/** Story text. With marking, it is split into sentences the child can mark with the highlighter. */
function Paragraphs({ text, marking }: { text: string; marking?: Marking }) {
  return (
    <div className={`story-text ${marking?.highlighter ? 'is-highlighting' : ''}`}>
      {text.split(/\n{2,}/).map((paragraph, index) => (
        <p key={index}>
          {marking
            ? splitSentences(paragraph).map((sentence, i) => <Sentence key={i} text={sentence} marking={marking} />)
            : paragraph}
        </p>
      ))}
    </div>
  )
}

function Sentence({ text, marking }: { text: string; marking: Marking }) {
  const marked = marking.marks.some(mark => mark.nodeId === marking.nodeId && mark.text === text)
  const className = `sentence ${marked ? 'is-marked' : ''}`
  if (!marking.highlighter) {
    return (
      <>
        <span className={className}>{text}</span>{' '}
      </>
    )
  }
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    marking.onToggle(text)
  }
  return (
    <>
      <span
        className={className}
        role="button"
        tabIndex={0}
        aria-pressed={marked}
        onClick={() => marking.onToggle(text)}
        onKeyDown={onKeyDown}
      >
        {text}
      </span>{' '}
    </>
  )
}

/** The sentences the child marked so far, like a detective's notebook. */
function Notebook({ marks }: { marks: Mark[] }) {
  return (
    <div className="notebook">
      <h3>
        <NotebookPen size={18} aria-hidden="true" />
        Jouw speurdersboekje
      </h3>
      {marks.length === 0 ? (
        <p className="notebook-empty">Nog leeg. Markeer een zin die belangrijk is, dan komt hij hier te staan.</p>
      ) : (
        <ul>
          {marks.map(mark => (
            <li key={`${mark.nodeId}-${mark.text}`}>
              <span className="notebook-chapter">{mark.chapter}</span>
              {mark.text.replace(/["“”]/g, '')}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/** What the child carries along: the time of day and the traces earlier choices left behind. */
function OnTheWay({ story, flags, dusk }: { story: Story; flags: Set<string>; dusk: number }) {
  const traces = activeTraces(story, flags)
  const SkyIcon = dusk < 0.55 ? Sun : dusk < 0.8 ? Sunset : Moon
  return (
    <section className="on-the-way" aria-label="Onderweg">
      <h3>Onderweg</h3>
      {story.dusk && (
        <p className="sky-time">
          <SkyIcon size={18} aria-hidden="true" />
          {timeOfDay(dusk)}
        </p>
      )}
      {traces.length === 0 ? (
        <p className="trace-empty">Alles gaat nog goed.</p>
      ) : (
        <ul className="trace-list">
          {traces.map(trace => (
            <li key={trace.flag} className={`trace trace-${trace.tone}`}>
              <IllustrationIcon name={trace.illustration} size={18} />
              {trace.label}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

/** Dots for the decisions so far: filled when a choice was made, not whether it was right. */
function ChoiceDots({ made, total }: { made: number; total: number }) {
  return (
    <div className="choice-dots" role="img" aria-label={`Keuze ${made} van ${total}`}>
      {Array.from({ length: total }, (_, index) => (
        <span key={index} className={index < made ? 'is-made' : ''} />
      ))}
    </div>
  )
}

function ChapterCard({ label, illustration, story }: { label: string; illustration: Illustration; story: Story }) {
  return (
    <div className="chapter-card">
      <span className="chapter-name">{label}</span>
      <Scene name={illustration} color={story.color} size="small" />
    </div>
  )
}

function ReadingPage({ story, onBack }: ReadingPageProps) {
  const [playthrough, setPlaythrough] = useState<Playthrough>(() =>
    createPlaythrough(story, Math.random, loadProgress(story.id)?.lastVariants),
  )
  const [currentNodeId, setCurrentNodeId] = useState(story.startNode)
  const [visited, setVisited] = useState<string[]>([story.startNode])
  const [decisions, setDecisions] = useState<Decision[]>([])
  const [marks, setMarks] = useState<Mark[]>([])
  const [highlighter, setHighlighter] = useState(true)
  const [showEnding, setShowEnding] = useState(false)
  const [previousRead, setPreviousRead] = useState<StoryProgress | undefined>(() => loadProgress(story.id))
  const recorded = useRef(false)

  const currentNode = story.nodes[currentNodeId]
  const total = decisionCount(story)
  const vars = storyVars(story, playthrough)
  const flags = collectFlags(story, visited)
  const render = (text: string) => renderText(text, vars, flags)
  const points = score(decisions)
  const ending = showEnding ? pickEnding(story, decisions) : null
  const hasSecret = ending ? ending.minScore === bestScore(story) : false
  const dusk = story.dusk ? duskLevel(decisions, total) : 0

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentNodeId, showEnding])

  useEffect(() => {
    if (!ending || recorded.current) return
    recorded.current = true
    recordRead(story.id, { score: points, total, secretEnding: hasSecret, variants: playthrough })
  }, [ending, points, total, story, playthrough, hasSecret])

  const goTo = (nodeId: string | undefined) => {
    if (!nodeId || !story.nodes[nodeId]) return
    setCurrentNodeId(nodeId)
    setVisited(previous => [...previous, nodeId])
  }

  const choose = (choiceIndex: number) => {
    if (currentNode?.kind !== 'decision') return
    const fitsText = choiceIndex === fittingChoice(story, currentNodeId, playthrough)
    setDecisions(previous => [...previous, { nodeId: currentNodeId, choiceIndex, fitsText }])
    goTo(nextAfterChoice(story, currentNodeId, choiceIndex, playthrough))
  }

  const toggleMark = (text: string) => {
    if (!currentNode) return
    const isThis = (mark: Mark) => mark.nodeId === currentNodeId && mark.text === text
    setMarks(previous =>
      previous.some(isThis)
        ? previous.filter(mark => !isThis(mark))
        : [...previous, { nodeId: currentNodeId, chapter: currentNode.chapter, text }],
    )
  }

  const restartStory = () => {
    setPreviousRead(loadProgress(story.id))
    setPlaythrough(createPlaythrough(story, Math.random, playthrough))
    setCurrentNodeId(story.startNode)
    setVisited([story.startNode])
    setDecisions([])
    setMarks([])
    setShowEnding(false)
    recorded.current = false
  }

  const pageClass = `reading-page ${story.dusk ? 'has-sky' : ''}`
  const pageStyle = { '--dusk': dusk } as CSSProperties

  if (!currentNode) {
    return (
      <main className="reading-page">
        <div className="paper">
          <p>Dit deel van het verhaal kon niet worden gevonden.</p>
          <button className="button-primary" onClick={onBack}>
            Terug naar de verhalen
          </button>
        </div>
      </main>
    )
  }

  if (ending) {
    const gained = previousRead ? points - previousRead.lastScore : 0
    const markedClues = decisions.filter(decision => {
      const node = decisionNode(story, decision.nodeId)
      return node ? clueMarked(node.variants[playthrough[decision.nodeId] ?? 0].clue, marks, decision.nodeId) : false
    }).length
    return (
      <main className={pageClass} style={pageStyle}>
        <div className="reading-layout">
          <aside className="reading-side">
            <ChapterCard label="Einde" illustration={ending.illustration} story={story} />
            <OnTheWay story={story} flags={flags} dusk={dusk} />
          </aside>

          <div className="reading-main">
            <article className="paper">
              <h1>{ending.title}</h1>
              <Paragraphs text={render(ending.text)} />
            </article>

            <section className="paper result">
              <div className="result-head">
                <ChoiceDotsResult decisions={decisions} />
                <h2>{points === total ? `Je vond alle ${total} aanwijzingen!` : `Je vond ${points} van de ${total} aanwijzingen`}</h2>
                {marks.length > 0 && (
                  <p className="marked-summary">
                    <Highlighter size={18} aria-hidden="true" />
                    {markedClues === 0
                      ? 'Je hebt zinnen gemarkeerd, maar nog niet de aanwijzingen. Kijk hieronder waar ze stonden.'
                      : `Je markeerde ${markedClues} van de ${total} aanwijzingen.`}
                  </p>
                )}
                {previousRead && (
                  <p className={`compare ${gained > 0 ? 'is-up' : ''}`}>
                    {gained > 0 && <TrendingUp size={18} aria-hidden="true" />}
                    Vorige keer: {previousRead.lastScore} van {previousRead.total}.{' '}
                    {gained > 0
                      ? `${gained} ${gained === 1 ? 'aanwijzing' : 'aanwijzingen'} meer dan toen!`
                      : gained === 0
                        ? 'Net zo goed als vorige keer.'
                        : 'Deze keer was lastiger.'}
                  </p>
                )}
                {!hasSecret && (
                  <p className="secret-hint">
                    <Lock size={18} aria-hidden="true" />
                    Er is nog een geheim einde. Lees opnieuw: de aanwijzingen zijn dan anders.
                  </p>
                )}
              </div>

              <ol className="recap">
                {decisions.map((decision, index) => {
                  const node = decisionNode(story, decision.nodeId)
                  if (!node) return null
                  const variant = node.variants[playthrough[decision.nodeId] ?? 0]
                  const marked = clueMarked(variant.clue, marks, decision.nodeId)
                  return (
                    <li key={decision.nodeId} className={decision.fitsText ? 'is-good' : 'is-miss'}>
                      <span className="recap-number">{decision.fitsText ? <Check size={16} strokeWidth={3} /> : index + 1}</span>
                      <div>
                        <strong>{node.question}</strong>
                        <p className="recap-choice">
                          Jij koos: {node.choices[decision.choiceIndex].text}
                          {decision.fitsText && <span className="recap-good"> Goed gelezen!</span>}
                        </p>
                        {marked && (
                          <p className="recap-marked">
                            <Highlighter size={16} aria-hidden="true" />
                            {decision.fitsText
                              ? 'Je had de aanwijzing gemarkeerd.'
                              : 'Je had de aanwijzing wel gemarkeerd! Lees hem nog eens goed.'}
                          </p>
                        )}
                        {!decision.fitsText && (
                          <p className="recap-clue">
                            <span>Hier stond de aanwijzing:</span>
                            <mark>{variant.clue}</mark>
                          </p>
                        )}
                        <span className="tag">{structureNames[node.structure]}</span>
                      </div>
                    </li>
                  )
                })}
              </ol>

              <div className="paper-footer">
                <button className="button-secondary" onClick={onBack}>
                  Ander verhaal
                </button>
                <button className="button-primary" onClick={restartStory}>
                  <RotateCcw size={18} aria-hidden="true" />
                  Opnieuw lezen
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className={pageClass} style={pageStyle}>
      <div className="reading-layout">
        <aside className="reading-side">
          <ChapterCard label={currentNode.chapter} illustration={currentNode.illustration} story={story} />
          <button
            className={`tool-button ${highlighter ? 'is-on' : ''}`}
            aria-pressed={highlighter}
            onClick={() => setHighlighter(on => !on)}
          >
            <Highlighter size={20} aria-hidden="true" />
            Markeerstift
          </button>
          <OnTheWay story={story} flags={flags} dusk={dusk} />
        </aside>

        <div className="reading-main">
          <article className="paper">
            <div className="paper-head">
              <h1>{render(currentNode.title)}</h1>
              <ChoiceDots made={decisions.length} total={total} />
            </div>
            {highlighter && currentNodeId === story.startNode && marks.length === 0 && (
              <p className="highlight-hint">
                <Highlighter size={18} aria-hidden="true" />
                Tik op een zin om hem te markeren. Markeer wat belangrijk is!
              </p>
            )}
            <Paragraphs
              text={render(currentNode.text)}
              marking={{ nodeId: currentNodeId, marks, highlighter, onToggle: toggleMark }}
            />

            {currentNode.kind === 'decision' && (
              <section className="decision" aria-labelledby="decision-question">
                <h2 id="decision-question">{currentNode.question}</h2>
                <p className="decision-tip">
                  <Lightbulb size={18} aria-hidden="true" />
                  Lees goed: in de tekst staat wat slim is.
                </p>
                <Notebook marks={marks} />
                <ul className="choice-list">
                  {currentNode.choices.map((choice, index) => (
                    <li key={`${currentNodeId}-${index}`}>
                      <button onClick={() => choose(index)}>
                        <span>{choice.text}</span>
                        <ChevronRight size={22} aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {currentNode.kind !== 'decision' && (
              <div className="paper-footer">
                <button
                  className="button-primary"
                  onClick={() => (currentNode.kind === 'passage' ? goTo(currentNode.next) : setShowEnding(true))}
                >
                  {currentNode.kind === 'passage' ? 'Lees verder' : 'Hoe loopt het af?'}
                  <ChevronRight size={20} aria-hidden="true" />
                </button>
              </div>
            )}
          </article>
        </div>
      </div>
    </main>
  )
}

/** Result dots on the end screen: one per decision, filled when the choice fitted the text. */
function ChoiceDotsResult({ decisions }: { decisions: Decision[] }) {
  return (
    <div className="result-dots" aria-hidden="true">
      {decisions.map((decision, index) => (
        <span key={index} className={decision.fitsText ? 'is-good' : ''}>
          {decision.fitsText && <Check size={18} strokeWidth={3} />}
        </span>
      ))}
    </div>
  )
}

export default ReadingPage
