import { useEffect, useState } from 'react';
import { generateDeck } from './lib/generate';
import LandingScreen from './screens/LandingScreen';
import FlashcardsScreen from './screens/FlashcardsScreen';
import QuizScreen from './screens/QuizScreen';
import ResultsScreen from './screens/ResultsScreen';

const INITIAL = {
  screen: 'landing',
  notes: '',
  deck: null,
  cardIndex: 0,
  quizIndex: 0,
  answers: {},
};

function LoadingScreen() {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-2xl flex-col items-center justify-center px-5">
      <div className="flex gap-[3px]" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="h-4 w-1.5 rounded-full bg-accent"
            style={{
              animation: 'fade-in 900ms ease-in-out infinite alternate',
              animationDelay: `${i * 120}ms`,
            }}
          />
        ))}
      </div>
      <p role="status" className="mt-6 text-[15px] text-muted">
        Reading your notes and building the deck…
      </p>
    </div>
  );
}

export default function App() {
  const [state, setState] = useState(INITIAL);
  const patch = (next) => setState((s) => ({ ...s, ...next }));

  // Each screen starts at the top rather than inheriting the last one's scroll.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [state.screen]);

  const handleGenerate = async () => {
    patch({ screen: 'loading' });
    const deck = await generateDeck(state.notes);
    setState((s) => ({
      ...s,
      screen: 'flashcards',
      deck,
      cardIndex: 0,
      quizIndex: 0,
      answers: {},
    }));
  };

  // Answered questions are final.
  const handleAnswer = (questionId, optionId) => {
    setState((s) =>
      s.answers[questionId] != null
        ? s
        : { ...s, answers: { ...s.answers, [questionId]: optionId } },
    );
  };

  let screen;
  switch (state.screen) {
    case 'loading':
      screen = <LoadingScreen />;
      break;

    case 'flashcards':
      screen = (
        <FlashcardsScreen
          deck={state.deck}
          index={state.cardIndex}
          onIndexChange={(cardIndex) => patch({ cardIndex })}
          onStartQuiz={() => patch({ screen: 'quiz', quizIndex: 0, answers: {} })}
          onRestart={() => setState(INITIAL)}
        />
      );
      break;

    case 'quiz':
      screen = (
        <QuizScreen
          deck={state.deck}
          index={state.quizIndex}
          answers={state.answers}
          onAnswer={handleAnswer}
          onNext={() => patch({ quizIndex: state.quizIndex + 1 })}
          onFinish={() => patch({ screen: 'results' })}
          onBackToCards={() => patch({ screen: 'flashcards' })}
        />
      );
      break;

    case 'results':
      screen = (
        <ResultsScreen
          deck={state.deck}
          answers={state.answers}
          onRetake={() => patch({ screen: 'quiz', quizIndex: 0, answers: {} })}
          onRestart={() => setState(INITIAL)}
          onBackToCards={() => patch({ screen: 'flashcards', cardIndex: 0 })}
        />
      );
      break;

    default:
      screen = (
        <LandingScreen
          notes={state.notes}
          onNotesChange={(notes) => patch({ notes })}
          onGenerate={handleGenerate}
          loading={false}
        />
      );
  }

  return <main className="min-h-dvh">{screen}</main>;
}
