import { useEffect, useState } from 'react';
import Flashcard from '../components/Flashcard';
import ProgressTicks from '../components/ProgressTicks';
import ScreenHeader from '../components/ScreenHeader';
import DeckWarnings from '../components/DeckWarnings';
import Button from '../components/Button';

export default function FlashcardsScreen({ deck, index, onIndexChange, onStartQuiz, onRestart }) {
  const [flipped, setFlipped] = useState(false);
  const cards = deck.flashcards;
  const total = cards.length;
  const atFirst = index === 0;
  const atLast = index === total - 1;

  // Every move lands on the question side.
  const go = (next) => {
    if (next < 0 || next > total - 1) return;
    setFlipped(false);
    onIndexChange(next);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        go(index + 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        go(index - 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div className="screen-enter mx-auto flex w-full max-w-xl flex-col px-5 py-8 sm:py-12">
      <ScreenHeader backLabel="New notes" onBack={onRestart} />

      <h1 className="font-display mt-8 text-[21px] leading-snug sm:text-[25px]">{deck.title}</h1>

      {deck.warnings?.length > 0 && (
        <div className="mt-5">
          <DeckWarnings warnings={deck.warnings} />
        </div>
      )}

      <div className="mt-6">
        <div className="mb-3 flex items-baseline justify-between text-[13px] text-muted">
          <span aria-live="polite">
            Card {index + 1} of {total}
          </span>
          <span className={flipped ? 'text-accent' : ''}>{flipped ? 'Answer' : 'Question'}</span>
        </div>
        <ProgressTicks total={total} current={index} label="Card" />
      </div>

      <div className="mt-9">
        <Flashcard
          card={cards[index]}
          flipped={flipped}
          onFlip={() => setFlipped((f) => !f)}
          remaining={total - 1 - index}
        />
      </div>

      <div className="mt-10 flex gap-3">
        <Button variant="ghost" className="flex-1" onClick={() => go(index - 1)} disabled={atFirst}>
          Previous
        </Button>
        <Button variant="ghost" className="flex-1" onClick={() => go(index + 1)} disabled={atLast}>
          Next
        </Button>
      </div>

      {atLast && (
        <div className="fade-in mt-4">
          <Button full onClick={onStartQuiz}>
            Start quiz
          </Button>
          <p className="mt-3 text-center text-[13px] text-muted">
            {deck.quiz.length} {deck.quiz.length === 1 ? 'question' : 'questions'} on this deck.
          </p>
        </div>
      )}
    </div>
  );
}
