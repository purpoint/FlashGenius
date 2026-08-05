import QuizQuestion from '../components/QuizQuestion';
import ProgressTicks from '../components/ProgressTicks';
import Button from '../components/Button';

export default function QuizScreen({
  deck,
  index,
  answers,
  onAnswer,
  onNext,
  onFinish,
  onBackToCards,
}) {
  const quiz = deck.quiz;
  const total = quiz.length;
  const question = quiz[index];
  const selectedId = answers[question.id] ?? null;
  const locked = selectedId != null;
  const atLast = index === total - 1;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col px-5 py-10 sm:py-14">
      <header>
        <button
          type="button"
          onClick={onBackToCards}
          className="text-[13px] text-muted hover:text-text"
        >
          ← Back to cards
        </button>
      </header>

      <div className="mt-6">
        <div className="mb-3 flex items-baseline justify-between text-[13px] text-muted">
          <span aria-live="polite">
            Question {index + 1} of {total}
          </span>
        </div>
        <ProgressTicks total={total} current={index} label="Question" />
      </div>

      <div className="mt-8">
        <QuizQuestion
          key={question.id}
          question={question}
          selectedId={selectedId}
          onSelect={(optionId) => onAnswer(question.id, optionId)}
        />
      </div>

      {locked && (
        <div className="fade-in mt-8">
          <Button full onClick={atLast ? onFinish : onNext}>
            {atLast ? 'See results' : 'Next question'}
          </Button>
        </div>
      )}
    </div>
  );
}
