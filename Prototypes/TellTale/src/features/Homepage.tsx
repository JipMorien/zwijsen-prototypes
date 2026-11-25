import { BookOpen, ChevronRight, Clock, Gem, Lock, Pencil } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { loadAllProgress } from '../engine/progress'
import { MAX_NAME_LENGTH } from '../engine/settings'
import type { Story } from '../types/story'
import { Scene } from '../ui/illustrations'

type HomePageProps = {
  stories: Story[]
  name: string
  onNameChange: (name: string) => void
  onSelectStory: (id: string) => void
}

/** Asks the child's name once, so the characters in the story can talk to them. */
function NameForm({ name, onNameChange }: { name: string; onNameChange: (name: string) => void }) {
  const [editing, setEditing] = useState(!name)
  const [draft, setDraft] = useState(name)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    onNameChange(draft)
    setEditing(false)
  }

  if (!editing) {
    return (
      <button type="button" className="name-change" onClick={() => setEditing(true)}>
        <Pencil size={14} aria-hidden="true" />
        Niet {name}? Verander je naam
      </button>
    )
  }

  return (
    <form className="name-form" onSubmit={submit}>
      <label htmlFor="reader-name">Hoe heet jij? Dan praten de personages in het verhaal met jou.</label>
      <div>
        <input
          id="reader-name"
          value={draft}
          maxLength={MAX_NAME_LENGTH}
          autoComplete="off"
          placeholder="Jouw naam"
          onChange={event => setDraft(event.target.value)}
        />
        <button type="submit" className="button-primary">
          Bewaar
        </button>
      </div>
    </form>
  )
}

function HomePage({ stories, name, onNameChange, onSelectStory }: HomePageProps) {
  const progress = loadAllProgress()

  return (
    <main className="home-page">
      <section className="home-intro">
        <h1>{name ? `Hoi ${name}! Kies een verhaal` : 'Kies een verhaal'}</h1>
        <p>Jij bepaalt hoe het verhaal verdergaat. Lees goed, want in de tekst staat wat slim is.</p>
        <NameForm name={name} onNameChange={onNameChange} />
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
                      <BookOpen size={16} aria-hidden="true" />
                      {result.timesRead === 1 ? '1 keer gelezen' : `${result.timesRead} keer gelezen`}
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
