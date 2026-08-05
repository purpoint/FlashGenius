// The card itself is a real button: click, Space or Enter all flip it.
// `remaining` draws stacked layers behind it so the deck has visible depth.
export default function Flashcard({ card, flipped, onFlip, remaining = 0 }) {
  return (
    <div
      className={`relative ${remaining > 0 ? 'deck-stack' : ''}`}
      data-remaining={remaining}
    >
      <div className="flip-scene relative h-[340px] w-full sm:h-[380px]">
        <button
          type="button"
          onClick={onFlip}
          aria-pressed={flipped}
          aria-label={
            flipped ? 'Answer. Press to see the question.' : 'Question. Press to reveal the answer.'
          }
          className="flip-inner group block cursor-pointer text-left"
          data-flipped={flipped}
        >
          <span className="flip-face rounded-card border-border bg-surface lift border px-6 py-7 sm:px-9">
            <span className="label block" aria-hidden={flipped}>
              Question
            </span>
            <span className="flex flex-1 flex-col justify-center py-4">
              <span
                className="font-display block text-[23px] leading-snug sm:text-[27px]"
                aria-hidden={flipped}
              >
                {card.question}
              </span>
            </span>
            <span className="flex items-center gap-2 text-[13px] text-muted" aria-hidden="true">
              <span className="border-border group-hover:border-accent/40 rounded border px-1.5 py-0.5 text-[11px] transition-colors">
                Space
              </span>
              to flip
            </span>
          </span>

          <span className="flip-face flip-face-back rounded-card border-accent/25 bg-surface lift border px-6 py-7 sm:px-9">
            <span className="label block text-accent" aria-hidden={!flipped}>
              Answer
            </span>
            <span className="flex flex-1 flex-col justify-center py-4">
              <span className="block text-[17px] leading-relaxed text-text/90" aria-hidden={!flipped}>
                {card.answer}
              </span>
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}
