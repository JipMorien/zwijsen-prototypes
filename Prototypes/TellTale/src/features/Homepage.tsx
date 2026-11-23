import type { Story } from '../types/story'

type HomePageProps = {
  stories: Story[]
  onSelectStory: (id: string) => void
}

function HomePage({ stories, onSelectStory }: HomePageProps) {
  return (
    <main className="home-page">
      <header className="hero">
        <div className="hero-content">
          <span className="hero-label">📚 LEES, ONTDEK & KIES</span>
          <h1>Welkom in jouw<br />verhalenwereld!</h1>
          <p>
            Duik in spannende verhalen, ontdek geheimen en bepaal
            zelf hoe het verhaal verdergaat.
          </p>
          <a href="#stories" className="hero-button">
            Kies een verhaal <span>↓</span>
          </a>
        </div>

        <div className="hero-illustration" aria-hidden="true">
          <span className="hero-book">📖</span>
          <span className="hero-star star-one">✨</span>
          <span className="hero-star star-two">⭐</span>
          <span className="hero-star star-three">🌙</span>
        </div>
      </header>

      <section className="stories-section" id="stories">
        <div className="section-heading">
          <div>
            <span className="section-label">KIES JOUW AVONTUUR</span>
            <h2>Welke wereld ontdek jij?</h2>
            <p>Elk verhaal heeft verschillende keuzes en verrassende eindes.</p>
          </div>
          <span className="story-count">
            {stories.filter(story => story.available).length} verhalen
          </span>
        </div>

        <div className="story-grid">
          {stories.map(story => (
            <article
              className={`story-card ${!story.available ? 'story-card-disabled' : ''}`}
              key={story.id}
            >
              <div className="story-card-image">
                <span className="story-emoji">{story.emoji}</span>
                <span className="story-category">{story.category}</span>
              </div>

              <div className="story-card-content">
                <h3>{story.title}</h3>
                <p>{story.description}</p>

                <div className="story-card-footer">
                  <span>⏱ {story.time}</span>

                  <button
                    type="button"
                    disabled={!story.available}
                    onClick={() => onSelectStory(story.id)}
                  >
                    {story.available ? 'Lees verhaal →' : 'Binnenkort'}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="home-footer">
        <p>🌟 Lees goed, denk slim en ontdek waar jouw keuzes je brengen!</p>
      </footer>
    </main>
  )
}

export default HomePage