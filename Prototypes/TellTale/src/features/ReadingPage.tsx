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
import type { Story, TextStructure } from '../types/story'

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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentNodeId, showEnding])

  useEffect(() => {
    if (!ending || recorded.current) return
    recorded.current = true
    recordRead(story.id, {
      score: points,
      total,
      secretEnding: ending.minScore === bestScore(story),
      variants: playthrough,
    })
  }, [ending, points, total, story, playthrough])

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
        <p>Dit verhaalonderdeel kon niet worden gevonden.</p>
        <button onClick={onBack}>Terug naar verhalen</button>
      </main>
    )
  }

  return (
    <main className="reading-page">
      <header className="reading-header">
        <button className="back-button" onClick={onBack}>
          ← Alle verhalen
        </button>

        <div className="reading-title">
          <span>{story.emoji}</span>
          <span>{story.title}</span>
        </div>

        <div className="reading-progress">
          <span>
            Keuzes: {decisions.length} van {total}
          </span>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${(decisions.length / total) * 100}%` }} />
          </div>
        </div>
      </header>

      <section className="reading-content">
        {ending ? (
          <>
            <div className="chapter-label">EINDE</div>
            <div className="story-panel">
              <div className="story-illustration" aria-hidden="true">
                {ending.image}
              </div>
              <div className="story-text">
                <h1>{ending.title}</h1>
                <p>{render(ending.text)}</p>
              </div>
            </div>

            <section className="ending-box">
              <span className="ending-emoji">{points === total ? '🏆' : '🔎'}</span>
              <h2>{points === total ? `Je vond alle ${total} aanwijzingen!` : `Je vond ${points} van de ${total} aanwijzingen`}</h2>

              {previousRead && (
                <p className="compare-line">
                  Vorige keer: {previousRead.lastScore} van {previousRead.total}.{' '}
                  {points > previousRead.lastScore
                    ? `Je bent ${points - previousRead.lastScore} ${points - previousRead.lastScore === 1 ? 'aanwijzing' : 'aanwijzingen'} vooruitgegaan! 📈`
                    : points === previousRead.lastScore
                      ? 'Net zo goed als vorige keer.'
                      : 'Deze keer was lastiger.'}
                </p>
              )}

              {ending.minScore < bestScore(story) && (
                <p>
                  Er is nog een geheim einde. Lees het verhaal opnieuw: de aanwijzingen zijn dan anders, dus lees
                  goed!
                </p>
              )}

              <ol className="recap-list">
                {decisions.map(decision => {
                  const node = decisionNode(story, decision.nodeId)
                  if (!node) return null
                  const variant = node.variants[playthrough[decision.nodeId] ?? 0]
                  return (
                    <li key={decision.nodeId} className={decision.fitsText ? 'recap-good' : 'recap-miss'}>
                      <span className="recap-icon" aria-hidden="true">
                        {decision.fitsText ? '✅' : '🔎'}
                      </span>
                      <div>
                        <strong>{node.question}</strong>
                        <p>
                          Jij koos: {node.choices[decision.choiceIndex].text}
                          {decision.fitsText ? ' Goed gelezen!' : ''}
                        </p>
                        {!decision.fitsText && (
                          <blockquote>
                            <span>De aanwijzing stond in de tekst:</span> “{variant.clue}”
                          </blockquote>
                        )}
                        <span className="structure-tag">{structureNames[node.structure]}</span>
                      </div>
                    </li>
                  )
                })}
              </ol>

              <button className="restart-button" onClick={restartStory}>
                Lees opnieuw ↻
              </button>
              <button className="home-button" onClick={onBack}>
                Kies een ander verhaal
              </button>
            </section>
          </>
        ) : (
          <>
            <div className="chapter-label">{currentNode.chapter.toUpperCase()}</div>

            <div className="story-panel">
              <div className="story-illustration" aria-hidden="true">
                {currentNode.image}
              </div>
              <div className="story-text">
                <h1>{render(currentNode.title)}</h1>
                <p>{render(currentNode.text)}</p>
              </div>
            </div>

            {currentNode.kind === 'decision' && (
              <section className="choices-section">
                <h2>{currentNode.question}</h2>
                <p>Lees goed: in de tekst staat wat slim is.</p>
                <div className="choices-list">
                  {currentNode.choices.map((choice, index) => (
                    <button className="choice-button" key={`${currentNodeId}-${index}`} onClick={() => choose(index)}>
                      <span className="choice-number">{index + 1}</span>
                      <span>{choice.text}</span>
                      <span className="choice-arrow">→</span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {currentNode.kind === 'passage' && (
              <button className="continue-button" onClick={() => goTo(currentNode.next)}>
                Lees verder →
              </button>
            )}

            {currentNode.kind === 'finale' && (
              <button className="continue-button" onClick={() => setShowEnding(true)}>
                Hoe loopt het af? →
              </button>
            )}
          </>
        )}
      </section>
    </main>
  )
}

export default ReadingPage
