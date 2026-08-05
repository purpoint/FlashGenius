const TONE = {
  easy: 'text-correct border-correct/35 bg-correct/10',
  medium: 'text-accent border-accent/35 bg-accent/10',
  hard: 'text-wrong border-wrong/35 bg-wrong/10',
};

export default function DifficultyPill({ difficulty }) {
  const tone = TONE[difficulty] ?? 'text-muted border-border bg-surface';
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[13px] capitalize ${tone}`}
    >
      {difficulty}
    </span>
  );
}
