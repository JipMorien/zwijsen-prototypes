import type { Text } from '../core/types';

export function ReadingText({ text, highlighted }: { text: Text; highlighted: number | null }) {
  let sentenceNumber = 0;
  return (
    <article className="text">
      <h1>{text.title}</h1>
      {text.paragraphs.map((paragraph) => (
        <p key={paragraph[0]}>
          {paragraph.map((sentence) => {
            sentenceNumber += 1;
            return (
              <span key={sentenceNumber} className={sentenceNumber === highlighted ? 'sentence lit' : 'sentence'}>
                <sup>{sentenceNumber}</sup>
                {sentence}{' '}
              </span>
            );
          })}
        </p>
      ))}
    </article>
  );
}
