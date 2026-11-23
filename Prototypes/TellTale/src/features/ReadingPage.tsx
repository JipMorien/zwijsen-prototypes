import { Check, ChevronRight, Lightbulb, Lock, RotateCcw, TrendingUp } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { loadProgress, recordRead, type StoryProgress } from '../engine/progress'
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
import { Scene } from '../ui/illustrations'

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

function Paragraphs({ text }: { text: string }) {
  return (
    <div className="story-text">
      {text.split(/\n{2,}/).map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
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
    <aside className="chapter-card">
      <span className="chapter-name">{label}</span>
      <Scene name={illustration} color={story.color} size="small" />
    </aside>
  )
}

function ReadingPage({ story, onBack }: ReadingPageProps) {
  const [playthrough, setPlaythrough] = useState<Playthrough>(() =>
    createPlaythrough(story, Math.random, loadProgress(story.id)?.lastVariants),
  )
  const [currentNodeId, setCurrentNodeId] = useState(story.startNode)
  const [visited, setVisited] = useState<string[]>([story.startNode])
  const [decisions, setDecisions] = useState<Decision[]>([])
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

  const restartStory = () => {
    setPreviousRead(loadProgress(story.id))
    setPlaythrough(createPlaythrough(story, Math.random, playthrough))
    setCurrentNodeId(story.startNode)
    setVisited([story.startNode])
    setDecisions([])
    setShowEnding(false)
    recorded.current = false
  }

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
    return (
      <main className="reading-page">
        <div className="reading-layout">
          <ChapterCard label="Einde" illustration={ending.illustration} story={story} />

          <div className="reading-main">
            <article className="paper">
              <h1>{ending.title}</h1>
              <Paragraphs text={render(ending.text)} />
            </article>

            <section className="paper result">
              <div className="result-head">
                <ChoiceDotsResult decisions={decisions} />
                <h2>{points === total ? `Je vond alle ${total} aanwijzingen!` : `Je vond ${points} van de ${total} aanwijzingen`}</h2>
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
                  return (
                    <li key={decision.nodeId} className={decision.fitsText ? 'is-good' : 'is-miss'}>
                      <span className="recap-number">{decision.fitsText ? <Check size={16} strokeWidth={3} /> : index + 1}</span>
                      <div>
                        <strong>{node.question}</strong>
                        <p className="recap-choice">
                          Jij koos: {node.choices[decision.choiceIndex].text}
                          {decision.fitsText && <span className="recap-good"> Goed gelezen!</span>}
                        </p>
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
    <main className="reading-page">
      <div className="reading-layout">
        <ChapterCard label={currentNode.chapter} illustration={currentNode.illustration} story={story} />

        <div className="reading-main">
          <article className="paper">
            <div className="paper-head">
              <h1>{render(currentNode.title)}</h1>
              <ChoiceDots made={decisions.length} total={total} />
            </div>
            <Paragraphs text={render(currentNode.text)} />

            {currentNode.kind === 'decision' && (
              <section className="decision" aria-labelledby="decision-question">
                <h2 id="decision-question">{currentNode.question}</h2>
                <p className="decision-tip">
                  <Lightbulb size={18} aria-hidden="true" />
                  Lees goed: in de tekst staat wat slim is.
                </p>
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
