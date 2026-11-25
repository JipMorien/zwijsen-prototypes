import { House, Volume2, VolumeX } from 'lucide-react'
import { useState } from 'react'
import './App.css'
import { READER_DEFAULT } from './engine/story'
import { loadName, loadSound, saveName, saveSound } from './engine/settings'
import HomePage from './features/Homepage'
import ReadingPage from './features/ReadingPage'
import { getStoryById, stories } from './prototype-data/stories'

function App() {
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null)
  const [name, setName] = useState(() => loadName())
  const [sound, setSound] = useState(() => loadSound())
  const selectedStory = selectedStoryId ? getStoryById(selectedStoryId) : undefined
  const goHome = () => setSelectedStoryId(null)

  const toggleSound = () => {
    setSound(on => {
      saveSound(!on)
      return !on
    })
  }

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
        {selectedStory && (
          <button
            className={`sound-button ${sound ? 'is-on' : ''}`}
            onClick={toggleSound}
            aria-pressed={sound}
            aria-label={sound ? 'Geluid uitzetten' : 'Geluid aanzetten'}
            title={sound ? 'Geluid uitzetten' : 'Geluid aanzetten'}
          >
            {sound ? <Volume2 size={22} /> : <VolumeX size={22} />}
          </button>
        )}
      </header>

      {selectedStory ? (
        <ReadingPage
          key={selectedStory.id}
          story={selectedStory}
          reader={name || READER_DEFAULT}
          sound={sound}
          onBack={goHome}
        />
      ) : (
        <HomePage stories={stories} name={name} onNameChange={value => setName(saveName(value))} onSelectStory={setSelectedStoryId} />
      )}
    </div>
  )
}

export default App
