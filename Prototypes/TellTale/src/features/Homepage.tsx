import { ChevronRight, Clock, Gem, Lock, Search } from 'lucide-react'
import { loadAllProgress } from '../engine/progress'
import type { Story } from '../types/story'
import { Scene } from '../ui/illustrations'

type HomePageProps = {
  stories: Story[]
  onSelectStory: (id: string) => void
}

function HomePage({ stories, onSelectStory }: HomePageProps) {
  const progress = loadAllProgress()

  return (
    <main className="home-page">
      <section className="home-intro">
        <h1>Kies een verhaal</h1>
        <p>Jij bepaalt hoe het verhaal verdergaat. Lees goed, want in de tekst staat wat slim is.</p>
      </section>

      <div className="story-grid">
        {stories.map(story => {
          const result = progress[story.id]
          return (
            <article className={`book ${story.available ? '' : 'book-disabled'}`} key={story.id}>
              <div className="book-cover">
                <div className="book-cover-top">
                  <span className="level-badge">{story.level}</span>
                  <h2>{story.title}</h2>
                  <span className="book-category">{story.category}</span>
                </div>
                <Scene name={story.cover} color={story.color} />
              </div>

              <div className="book-body">
                <p>{story.description}</p>

                {result && (
                  <ul className="book-progress" aria-label="Jouw voortgang">
                    <li>
                      <Search size={16} aria-hidden="true" />
                      Beste: {result.bestScore} van {result.total} aanwijzingen
                    </li>
                    <li className={result.secretEndingFound ? 'is-found' : ''}>
                      {result.secretEndingFound ? <Gem size={16} aria-hidden="true" /> : <Lock size={16} aria-hidden="true" />}
                      {result.secretEndingFound ? 'Geheim einde gevonden' : 'Geheim einde nog niet gevonden'}
                    </li>
                  </ul>
                )}

                <div className="book-footer">
                  <span className="book-time">
                    <Clock size={16} aria-hidden="true" />
                    {story.time}
                  </span>
                  <button className="button-primary" disabled={!story.available} onClick={() => onSelectStory(story.id)}>
                    {story.available ? (result ? 'Opnieuw lezen' : 'Lezen') : 'Binnenkort'}
                    {story.available && <ChevronRight size={18} aria-hidden="true" />}
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </main>
  )
}

export default HomePage
