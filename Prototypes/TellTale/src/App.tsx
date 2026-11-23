import { House } from 'lucide-react'
import { useState } from 'react'
import './App.css'
import HomePage from './features/Homepage'
import ReadingPage from './features/ReadingPage'
import { getStoryById, stories } from './prototype-data/stories'

function App() {
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null)
  const selectedStory = selectedStoryId ? getStoryById(selectedStoryId) : undefined
  const goHome = () => setSelectedStoryId(null)

  return (
    <div className="app">
      <header className="topbar">
        <button className="icon-button" onClick={goHome} aria-label="Naar alle verhalen" disabled={!selectedStory}>
          <House size={22} strokeWidth={2.25} />
        </button>
        {selectedStory && <span className="level-badge">{selectedStory.level}</span>}
        <span className="topbar-title">
          {selectedStory ? (
            <>
              <span className="topbar-crumb">Leesavonturen</span>
              <span className="topbar-sep" aria-hidden="true">
                /
              </span>
              {selectedStory.title}
            </>
          ) : (
            'Leesavonturen'
          )}
        </span>
        <span className="wordmark" aria-hidden="true">
          tell<span>tale</span>
        </span>
      </header>

      {selectedStory ? (
        <ReadingPage key={selectedStory.id} story={selectedStory} onBack={goHome} />
      ) : (
        <HomePage stories={stories} onSelectStory={setSelectedStoryId} />
      )}
    </div>
  )
}

export default App
