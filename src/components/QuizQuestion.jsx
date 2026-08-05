import DifficultyPill from './DifficultyPill';

function optionClasses(state) {
  switch (state) {
    case 'correct':
      return 'border-correct/60 bg-correct/10 text-text';
    case 'wrong':
      return 'border-wrong/60 bg-wrong/10 text-text';
    case 'muted':
      return 'border-border bg-surface text-muted';
    default:
      return 'border-border bg-surface text-text hover:border-accent/50 hover:bg-accent/5';
  }
}

function Marker({ state }) {
  if (state === 'correct') {
    return <span className="text-correct shrink-0 text-[15px]">✓</span>;
  }
  if (state === 'wrong') {
    return <span className="text-wrong shrink-0 text-[15px]">✕</span>;
  }
  return null;
}

export default function QuizQuestion({ question, selectedId, onSelect }) {
  const locked = selectedId != null;

  return (
    <div>
      <DifficultyPill difficulty={question.difficulty} />

      <h2 className="font-display mt-5 text-[22px] leading-snug sm:text-[26px]">
        {question.question}
      </h2>

      <div className="mt-6 flex flex-col gap-3">
        {question.options.map((option) => {
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
                'flex w-full items-start justify-between gap-3 rounded-card border px-4 py-4 text-left',
                'transition-colors duration-150 disabled:cursor-default',
                optionClasses(state),
              ].join(' ')}
            >
              <span className="leading-relaxed">{option.text}</span>
              <Marker state={state} />
            </button>
          );
        })}
      </div>

      {locked && (
        <p
          role="status"
          className="slide-in rounded-card border-border bg-surface mt-5 border border-l-2 border-l-accent px-4 py-4 text-[15px] leading-relaxed text-muted"
        >
          {question.explanation}
        </p>
      )}
    </div>
  );
}
