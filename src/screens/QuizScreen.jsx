import QuizQuestion from '../components/QuizQuestion';
import ProgressTicks from '../components/ProgressTicks';
import ScreenHeader from '../components/ScreenHeader';
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
    <div className="screen-enter mx-auto flex w-full max-w-xl flex-col px-5 py-8 sm:py-12">
      <ScreenHeader backLabel="Back to cards" onBack={onBackToCards} />

      <div className="mt-8">
        <div className="mb-3 flex items-baseline justify-between text-[13px] text-muted">
          <span aria-live="polite">
            Question {index + 1} of {total}
          </span>
          <span>Quiz</span>
        </div>
        <ProgressTicks total={total} current={index} label="Question" />
      </div>

      <div className="mt-9">
        <QuizQuestion
          key={question.id}
          question={question}
          selectedId={selectedId}
          onSelect={(optionId) => onAnswer(question.id, optionId)}
        />
      </div>

      {locked && (
        <div className="fade-in mt-6">
          <Button full onClick={atLast ? onFinish : onNext}>
            {atLast ? 'See results' : 'Next question'}
          </Button>
        </div>
      )}
    </div>
  );
}
