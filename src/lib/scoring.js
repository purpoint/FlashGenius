// Everything here derives from the deck it is handed — no assumptions about
// how many questions there are.

export function isCorrect(question, answers) {
  return answers[question.id] === question.correctOptionId;
}

export function scoreQuiz(quiz, answers) {
  return quiz.reduce((n, q) => n + (isCorrect(q, answers) ? 1 : 0), 0);
}

const DIFFICULTY_ORDER = ['easy', 'medium', 'hard'];

export function breakdownByDifficulty(quiz, answers) {
  const buckets = new Map();

  for (const q of quiz) {
    const bucket = buckets.get(q.difficulty) ?? { difficulty: q.difficulty, correct: 0, total: 0 };
    bucket.total += 1;
    if (isCorrect(q, answers)) bucket.correct += 1;
    buckets.set(q.difficulty, bucket);
  }

  return [...buckets.values()].sort(
    (a, b) => DIFFICULTY_ORDER.indexOf(a.difficulty) - DIFFICULTY_ORDER.indexOf(b.difficulty),
  );
}

export function verdict(score, total) {
  if (total === 0) return 'Nothing to score yet.';
  const ratio = score / total;
  if (ratio === 1) return 'Perfect run — this one has stuck.';
  if (ratio >= 0.8) return 'Strong. A couple of edges left to sand down.';
  if (ratio >= 0.6) return 'Solid footing, but the details are still slipping.';
  if (ratio >= 0.4) return 'The shape is there. Worth another pass through the cards.';
  return 'Early days. Read it through once more, then come back.';
}

export function reviewRows(quiz, answers) {
  return quiz.map((q) => {
    const selectedId = answers[q.id] ?? null;
    return {
      question: q,
      selectedId,
      selected: q.options.find((o) => o.id === selectedId) ?? null,
      correct: q.options.find((o) => o.id === q.correctOptionId) ?? null,
      wasCorrect: selectedId === q.correctOptionId,
    };
  });
}
