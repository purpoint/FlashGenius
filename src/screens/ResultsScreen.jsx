import { scoreQuiz, breakdownByDifficulty, verdict, reviewRows } from '../lib/scoring';
import DifficultyPill from '../components/DifficultyPill';
import Button from '../components/Button';

export default function ResultsScreen({ deck, answers, onRetake, onRestart, onBackToCards }) {
  const quiz = deck.quiz;
  const total = quiz.length;
  const score = scoreQuiz(quiz, answers);
  const breakdown = breakdownByDifficulty(quiz, answers);
  const rows = reviewRows(quiz, answers);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col px-5 py-10 sm:py-14">
      <p className="text-[13px] tracking-wide text-muted uppercase">Results</p>
      <h1 className="font-display mt-3 text-[40px] leading-none sm:text-[52px]">
        {score}
        <span className="text-muted"> / {total}</span>
      </h1>
      <p className="mt-3 text-[17px] text-muted">{verdict(score, total)}</p>

      <section className="rounded-card border-border bg-surface mt-8 border p-5">
        <h2 className="text-[13px] tracking-wide text-muted uppercase">By difficulty</h2>
        <ul className="mt-4 flex flex-col gap-3">
          {breakdown.map((b) => (
            <li key={b.difficulty} className="flex items-center justify-between gap-4">
              <DifficultyPill difficulty={b.difficulty} />
              <span className="text-[15px] text-muted">
                <span className="text-text">{b.correct}</span> of {b.total} correct
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-[13px] tracking-wide text-muted uppercase">Review</h2>
        <ol className="mt-4 flex max-h-[440px] flex-col gap-4 overflow-y-auto pr-1">
          {rows.map((row, i) => (
            <li
              key={row.question.id}
              className={`rounded-card border-border bg-surface border border-l-2 p-5 ${
                row.wasCorrect ? 'border-l-correct' : 'border-l-wrong'
              }`}
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[13px] text-muted">Question {i + 1}</span>
                <span className={`text-[13px] ${row.wasCorrect ? 'text-correct' : 'text-wrong'}`}>
                  {row.wasCorrect ? 'Correct' : 'Incorrect'}
                </span>
              </div>

              <p className="font-display mt-2 text-[18px] leading-snug">{row.question.question}</p>

              <dl className="mt-4 flex flex-col gap-2 text-[15px]">
                <div className="flex gap-2">
                  <dt className="shrink-0 text-muted">You picked</dt>
                  <dd className={row.wasCorrect ? 'text-correct' : 'text-wrong'}>
                    {row.selected ? row.selected.text : 'Not answered'}
                  </dd>
                </div>
                {!row.wasCorrect && (
                  <div className="flex gap-2">
                    <dt className="shrink-0 text-muted">Correct</dt>
                    <dd className="text-correct">{row.correct?.text}</dd>
                  </div>
                )}
              </dl>

              <p className="mt-3 text-[15px] leading-relaxed text-muted">
                {row.question.explanation}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button full className="sm:flex-1" onClick={onRetake}>
          Retake quiz
        </Button>
        <Button variant="ghost" full className="sm:flex-1" onClick={onRestart}>
          New notes
        </Button>
      </div>

      <button
        type="button"
        onClick={onBackToCards}
        className="mt-5 self-center text-[13px] text-muted hover:text-text"
      >
        Review the flashcards again
      </button>
    </div>
  );
}
