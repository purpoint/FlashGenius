import DifficultyPill from './DifficultyPill';

function optionClasses(state) {
  switch (state) {
    case 'correct':
      return 'border-correct/60 bg-correct/[0.07] text-text';
    case 'wrong':
      return 'border-wrong/60 bg-wrong/[0.07] text-text';
    case 'muted':
      return 'border-border bg-surface/60 text-muted';
    default:
      return 'border-border bg-surface text-text lift hover:bg-accent/[0.04]';
  }
}

// The badge carries the option letter until the question locks, then becomes
// the verdict — so the row never changes shape when it resolves.
function Badge({ state, letter }) {
  const base =
    'grid h-7 w-7 shrink-0 place-items-center rounded-lg border text-[13px] transition-colors';

  if (state === 'correct') {
    return <span className={`${base} border-correct/50 bg-correct/15 text-correct`}>✓</span>;
  }
  if (state === 'wrong') {
    return <span className={`${base} border-wrong/50 bg-wrong/15 text-wrong`}>✕</span>;
  }
  return (
    <span
      className={`${base} border-border ${state === 'muted' ? 'text-muted/60' : 'text-muted'}`}
      aria-hidden="true"
    >
      {letter}
    </span>
  );
}

export default function QuizQuestion({ question, selectedId, onSelect }) {
  const locked = selectedId != null;

  return (
    <div>
      <DifficultyPill difficulty={question.difficulty} />

      <h2 className="font-display mt-5 text-[23px] leading-snug sm:text-[27px]">
        {question.question}
      </h2>

      <div className="mt-7 flex flex-col gap-2.5">
        {question.options.map((option, i) => {
          const isCorrect = option.id === question.correctOptionId;
          const isChosen = option.id === selectedId;

          let state = 'idle';
          if (locked) {
            if (isCorrect) state = 'correct';
            else if (isChosen) state = 'wrong';
            else state = 'muted';
          }

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option.id)}
              disabled={locked}
              aria-label={
                locked && isCorrect && !isChosen ? `${option.text} — correct answer` : undefined
              }
              className={[
                'flex w-full items-center gap-3.5 rounded-card border px-4 py-3.5 text-left',
                'disabled:cursor-default',
                optionClasses(state),
              ].join(' ')}
            >
              <Badge state={state} letter={String.fromCharCode(65 + i)} />
              <span className="leading-relaxed">{option.text}</span>
            </button>
          );
        })}
      </div>

      {locked && (
        <div
          role="status"
          className="slide-in rounded-card border-border bg-surface mt-5 border border-l-2 border-l-accent px-5 py-4"
        >
          <p className="label">Why</p>
          <p className="mt-2 text-[15px] leading-relaxed text-muted">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
