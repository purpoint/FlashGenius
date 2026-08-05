import { scoreQuiz, breakdownByDifficulty, verdict, reviewRows } from '../lib/scoring';
import DifficultyPill from '../components/DifficultyPill';
import ScreenHeader from '../components/ScreenHeader';
import Button from '../components/Button';

// The spine again, at small size: one segment per question in that band,
// filled for each one answered correctly.
function MiniSpine({ correct, total }) {
  return (
    <span className="flex items-center gap-[3px]" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`h-2.5 w-[3px] rounded-full ${i < correct ? 'bg-correct' : 'bg-border'}`}
        />
      ))}
    </span>
  );
}

export default function ResultsScreen({ deck, answers, onRetake, onRestart, onBackToCards }) {
  const quiz = deck.quiz;
  const total = quiz.length;
  const score = scoreQuiz(quiz, answers);
  const breakdown = breakdownByDifficulty(quiz, answers);
  const rows = reviewRows(quiz, answers);

  return (
    <div className="screen-enter mx-auto flex w-full max-w-xl flex-col px-5 py-8 sm:py-12">
      <ScreenHeader backLabel="New notes" onBack={onRestart} />

      <section className="mt-10">
        <p className="label">Results</p>
        <div className="mt-2 flex items-baseline gap-3">
          <span className="font-display text-[64px] leading-none sm:text-[76px]">{score}</span>
          <span className="font-display text-[28px] leading-none text-muted">/ {total}</span>
        </div>
        <p className="mt-4 max-w-md text-[17px] leading-relaxed text-muted">
          {verdict(score, total)}
        </p>
      </section>

      <section className="rounded-card border-border bg-surface mt-9 border px-5 py-4">
        <h2 className="label">By difficulty</h2>
        <ul className="mt-4 flex flex-col divide-y divide-border">
          {breakdown.map((b) => (
            <li key={b.difficulty} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
              <DifficultyPill difficulty={b.difficulty} />
              <span className="flex items-center gap-3">
                <MiniSpine correct={b.correct} total={b.total} />
                <span className="text-[15px] text-muted">
                  <span className="text-text">{b.correct}</span>/{b.total}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-9">
        <h2 className="label">Review</h2>
        <ol className="mt-4 flex max-h-[420px] flex-col gap-3 overflow-y-auto pr-1">
          {rows.map((row, i) => (
            <li
              key={row.question.id}
              className={`rounded-card border-border bg-surface border border-l-2 px-5 py-4 ${
                row.wasCorrect ? 'border-l-correct' : 'border-l-wrong'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-[13px] text-muted">Question {i + 1}</span>
                <span
                  className={`text-[13px] ${row.wasCorrect ? 'text-correct' : 'text-wrong'}`}
                >
                  {row.wasCorrect ? 'Correct' : 'Incorrect'}
                </span>
              </div>

              <p className="font-display mt-2 text-[18px] leading-snug">{row.question.question}</p>

              <dl className="mt-4 flex flex-col gap-1.5 text-[15px]">
                <div className="flex gap-2">
                  <dt className="w-[84px] shrink-0 whitespace-nowrap text-muted">You picked</dt>
                  <dd className={row.wasCorrect ? 'text-correct' : 'text-wrong'}>
                    {row.selected ? row.selected.text : 'Not answered'}
                  </dd>
                </div>
                {!row.wasCorrect && (
                  <div className="flex gap-2">
                    <dt className="w-[84px] shrink-0 whitespace-nowrap text-muted">Correct</dt>
                    <dd className="text-correct">{row.correct?.text}</dd>
                  </div>
                )}
              </dl>

              <p className="border-border mt-3 border-t pt-3 text-[15px] leading-relaxed text-muted">
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
        <Button variant="ghost" full className="sm:flex-1" onClick={onBackToCards}>
          Review the cards
        </Button>
      </div>

      <button
        type="button"
        onClick={onRestart}
        className="mt-5 self-center rounded-lg px-2 py-1 text-[13px] text-muted transition-colors hover:text-text"
      >
        Start over with new notes
      </button>
    </div>
  );
}
