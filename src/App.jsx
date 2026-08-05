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
  error: null,
};

// The spine again, this time as the waiting state — segments light up as if
// the deck were being dealt.
function LoadingScreen() {
  return (
    <div className="screen-enter mx-auto flex min-h-dvh w-full max-w-xl flex-col items-center justify-center px-5">
      <div className="flex items-end gap-[3px]" aria-hidden="true">
        {Array.from({ length: 9 }, (_, i) => (
          <span
            key={i}
            className="deal-tick w-[3px] rounded-full bg-accent"
            style={{
              height: i % 2 === 0 ? '16px' : '10px',
              animationDelay: `${i * 90}ms`,
            }}
          />
        ))}
      </div>
      <p role="status" className="mt-7 text-[15px] text-muted">
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
    patch({ screen: 'loading', error: null });
    try {
      const deck = await generateDeck(state.notes);
      setState((s) => ({
        ...s,
        screen: 'flashcards',
        deck,
        cardIndex: 0,
        quizIndex: 0,
        answers: {},
        error: null,
      }));
    } catch (err) {
      // Back to the notes with the reason, rather than stranding the user on
      // a loading screen that never resolves.
      patch({
        screen: 'landing',
        error: err?.message || 'Something went wrong while building your deck.',
      });
    }
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
          error={state.error}
          onNotesChange={(notes) => patch({ notes, error: null })}
          onGenerate={handleGenerate}
          loading={false}
        />
      );
  }

  return <main className="min-h-dvh">{screen}</main>;
}
