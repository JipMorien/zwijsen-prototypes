import { useState } from 'react'
import type { Story } from '../types/story'

type ReadingPageProps = {
  story: Story
  onBack: () => void
}

function ReadingPage({ story, onBack }: ReadingPageProps) {
  const [currentNodeId, setCurrentNodeId] = useState(story.startNode)
  const [visitedNodes, setVisitedNodes] = useState<string[]>([
    story.startNode,
  ])

  const currentNode = story.nodes[currentNodeId]

  const handleChoice = (nextNodeId: string) => {
    if (!story.nodes[nextNodeId]) return

    setCurrentNodeId(nextNodeId)
    setVisitedNodes(previous =>
      previous.includes(nextNodeId)
        ? previous
        : [...previous, nextNodeId]
    )
  }

  const restartStory = () => {
    setCurrentNodeId(story.startNode)
    setVisitedNodes([story.startNode])
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
          <span>Ontdekte delen: {visitedNodes.length}</span>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${Math.min(visitedNodes.length * 20, 100)}%`,
              }}
            />
          </div>
        </div>
      </header>

      <section className="reading-content">
        <div className="chapter-label">
          <span>HOOFDSTUK</span>
          <span>{currentNode.chapter}</span>
        </div>

        <div className="story-panel">
          <div className="story-illustration" aria-label="Verhaalillustratie">
            {currentNode.image}
          </div>

          <div className="story-text">
            <h1>{currentNode.title}</h1>
            <p>{currentNode.text}</p>
          </div>
        </div>

        {currentNode.question && (
          <section className="comprehension-box">
            <span className="question-label">🧠 DENK EVEN NA</span>
            <h2>Begrijp je het verhaal?</h2>
            <p>{currentNode.question}</p>
          </section>
        )}

        {currentNode.choices && currentNode.choices.length > 0 && (
          <section className="choices-section">
            <h2>Wat doe jij?</h2>
            <p>Kies hoe het verhaal verdergaat.</p>

            <div className="choices-list">
              {currentNode.choices.map((choice, index) => (
                <button
                  className="choice-button"
                  key={`${currentNodeId}-${index}`}
                  onClick={() => handleChoice(choice.next)}
                >
                  <span className="choice-number">{index + 1}</span>
                  <span>{choice.text}</span>
                  <span className="choice-arrow">→</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {currentNode.ending && (
          <section className="ending-box">
            <span className="ending-emoji">🎉</span>
            <h2>Het verhaal is afgelopen!</h2>

            {currentNode.reflection && (
              <p>{currentNode.reflection}</p>
            )}

            <button className="restart-button" onClick={restartStory}>
              Lees opnieuw ↻
            </button>

            <button className="home-button" onClick={onBack}>
              Kies een ander verhaal
            </button>
          </section>
        )}
      </section>
    </main>
  )
}

export default ReadingPage