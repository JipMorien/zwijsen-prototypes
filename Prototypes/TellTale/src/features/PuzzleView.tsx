import { Check, Puzzle as PuzzleIcon, Sparkles, Undo2 } from 'lucide-react'
import { useState } from 'react'
import { shuffledOrder } from '../engine/puzzle'
import type { Puzzle } from '../types/story'

type PuzzleViewProps = {
  puzzle: Puzzle
  render: (text: string) => string
  onSolved: () => void
}

/**
 * A text-structure puzzle inside the story. There is no score: the child tries until it fits.
 * After a try, the parts that are right stay (green) and the others go back, with a hint.
 */
function PuzzleView({ puzzle, render, onSolved }: PuzzleViewProps) {
  return (
    <section className="puzzle" aria-labelledby="puzzle-prompt">
      <h2 id="puzzle-prompt">
        <PuzzleIcon size={20} aria-hidden="true" />
        {render(puzzle.prompt)}
      </h2>
      {puzzle.type === 'order' ? (
        <OrderPuzzle items={puzzle.items.map(render)} onSolved={onSolved} />
      ) : (
        <MatchPuzzle pairs={puzzle.pairs.map(pair => ({ left: render(pair.left), right: render(pair.right) }))} onSolved={onSolved} />
      )}
    </section>
  )
}

function Feedback({ solved, tried }: { solved: boolean; tried: boolean }) {
  if (solved) {
    return (
      <p className="puzzle-feedback is-solved" role="status">
        <Sparkles size={18} aria-hidden="true" />
        Ja, zo zit het!
      </p>
    )
  }
  if (!tried) return null
  return (
    <p className="puzzle-feedback" role="status">
      Bijna! De groene staan al goed. Denk nog eens na over de andere.
    </p>
  )
}

/** tijdvolgorde: tap the events in the order they happened. Item i belongs in place i. */
function OrderPuzzle({ items, onSolved }: { items: string[]; onSolved: () => void }) {
  const [shuffle] = useState(() => shuffledOrder(items.length))
  const [slots, setSlots] = useState<(number | null)[]>(() => items.map(() => null))
  const [locked, setLocked] = useState<boolean[]>(() => items.map(() => false))
  const [tried, setTried] = useState(false)
  const solved = locked.every(Boolean)

  const place = (item: number) => {
    setSlots(previous => {
      const free = previous.indexOf(null)
      return free === -1 || previous.includes(item) ? previous : previous.map((slot, index) => (index === free ? item : slot))
    })
  }

  const remove = (place: number) => {
    if (locked[place]) return
    setSlots(previous => previous.map((slot, index) => (index === place ? null : slot)))
  }

  const check = () => {
    const right = slots.map((item, place) => item === place)
    setLocked(right)
    setSlots(slots.map((item, place) => (right[place] ? item : null)))
    setTried(true)
    if (right.every(Boolean)) onSolved()
  }

  return (
    <>
      <ol className="order-slots">
        {slots.map((item, place) => (
          <li key={place} className={locked[place] ? 'is-locked' : item === null ? 'is-empty' : ''}>
            <span className="slot-number">{locked[place] ? <Check size={16} strokeWidth={3} /> : place + 1}</span>
            {item === null ? (
              <span className="slot-empty">…</span>
            ) : (
              <button type="button" onClick={() => remove(place)} disabled={locked[place]}>
                {items[item]}
                {!locked[place] && <Undo2 size={16} aria-label="Terugzetten" />}
              </button>
            )}
          </li>
        ))}
      </ol>

      {!solved && (
        <div className="order-pool">
          {shuffle
            .filter(item => !slots.includes(item))
            .map(item => (
              <button type="button" key={item} className="puzzle-chip" onClick={() => place(item)}>
                {items[item]}
              </button>
            ))}
        </div>
      )}

      <Feedback solved={solved} tried={tried} />
      {!solved && (
        <button type="button" className="button-primary" disabled={slots.includes(null)} onClick={check}>
          Is dit de goede volgorde?
        </button>
      )}
    </>
  )
}

/** oorzaak-gevolg: pick for every thing Mila sees what it means. */
function MatchPuzzle({ pairs, onSolved }: { pairs: { left: string; right: string }[]; onSolved: () => void }) {
  const [shuffle] = useState(() => shuffledOrder(pairs.length))
  const [picked, setPicked] = useState<(number | null)[]>(() => pairs.map(() => null))
  const [locked, setLocked] = useState<boolean[]>(() => pairs.map(() => false))
  const [tried, setTried] = useState(false)
  const solved = locked.every(Boolean)

  const pick = (row: number, answer: number) => {
    if (locked[row]) return
    setPicked(previous => previous.map((value, index) => (index === row ? answer : value)))
  }

  const check = () => {
    const right = picked.map((answer, row) => answer === row)
    setLocked(right)
    setPicked(picked.map((answer, row) => (right[row] ? answer : null)))
    setTried(true)
    if (right.every(Boolean)) onSolved()
  }

  return (
    <>
      <ul className="match-rows">
        {pairs.map((pair, row) => (
          <li key={row} className={locked[row] ? 'is-locked' : ''}>
            <p className="match-left">
              {locked[row] && <Check size={16} strokeWidth={3} aria-hidden="true" />}
              {pair.left}
            </p>
            {locked[row] ? (
              <p className="match-answer">{pair.right}</p>
            ) : (
              <div className="match-options" role="group" aria-label={pair.left}>
                {shuffle.map(answer => (
                  <button
                    type="button"
                    key={answer}
                    className={`puzzle-chip ${picked[row] === answer ? 'is-picked' : ''}`}
                    aria-pressed={picked[row] === answer}
                    onClick={() => pick(row, answer)}
                  >
                    {pairs[answer].right}
                  </button>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>

      <Feedback solved={solved} tried={tried} />
      {!solved && (
        <button type="button" className="button-primary" disabled={picked.includes(null)} onClick={check}>
          Klopt dit?
        </button>
      )}
    </>
  )
}

export default PuzzleView
