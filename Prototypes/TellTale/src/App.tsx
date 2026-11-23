
import { useState } from 'react'
import './App.css'
import { getStoryById, stories } from './prototype-data/stories'
import HomePage from './features/Homepage'
import ReadingPage from './features/ReadingPage'

function App() {
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null)

  const selectedStory = selectedStoryId
    ? getStoryById(selectedStoryId)
    : undefined

  return (
    <div className="app">
      {selectedStory ? (
        <ReadingPage
          story={selectedStory}
          onBack={() => setSelectedStoryId(null)}
        />
      ) : (
        <HomePage
          stories={stories}
          onSelectStory={setSelectedStoryId}
        />
      )}
    </div>
  )
}

export default App
