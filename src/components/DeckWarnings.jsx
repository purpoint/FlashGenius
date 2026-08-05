// The deck carries a `warnings` array the AI will populate — truncated notes,
// low-confidence questions. Rendered from the array, so any number is fine
// and an empty array renders nothing.
export default function DeckWarnings({ warnings }) {
  if (!warnings?.length) return null;

  return (
    <div
      role="status"
      className="rounded-card border-border bg-surface border border-l-2 border-l-amber-400/70 px-4 py-3"
    >
      <p className="label text-amber-400/90">
        {warnings.length === 1 ? 'Note' : `${warnings.length} notes`}
      </p>
      <ul className="mt-2 flex flex-col gap-1.5">
        {warnings.map((warning, i) => (
          <li key={i} className="text-[15px] leading-relaxed text-muted">
            {warning}
          </li>
        ))}
      </ul>
    </div>
  );
}
