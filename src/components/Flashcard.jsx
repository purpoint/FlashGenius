// The card itself is a real button: click, Space or Enter all flip it.
export default function Flashcard({ card, flipped, onFlip }) {
  return (
    <div className="flip-scene h-[340px] w-full sm:h-[380px]">
      <button
        type="button"
        onClick={onFlip}
        aria-pressed={flipped}
        aria-label={flipped ? 'Answer. Press to see the question.' : 'Question. Press to reveal the answer.'}
        className="flip-inner block cursor-pointer text-left"
        data-flipped={flipped}
      >
        <span
          className="flip-face rounded-card border border-border bg-surface px-6 py-8 sm:px-8"
          aria-hidden={flipped}
        >
          <span className="mb-4 block text-[13px] tracking-wide text-muted uppercase">
            Question
          </span>
          <span className="font-display block text-[22px] leading-snug sm:text-[26px]">
            {card.question}
          </span>
          <span className="mt-6 block text-[13px] text-muted">Tap or press Space to flip</span>
        </span>

        <span
          className="flip-face flip-face-back rounded-card border border-accent/30 bg-surface px-6 py-8 sm:px-8"
          aria-hidden={!flipped}
        >
          <span className="mb-4 block text-[13px] tracking-wide text-accent uppercase">Answer</span>
          <span className="block text-[17px] leading-relaxed text-text/90">{card.answer}</span>
        </span>
      </button>
    </div>
  );
}
