// One segment per card — the spine of the deck.
// Seen: accent. Current: accent and taller. Unseen: --border.
export default function ProgressTicks({ total, current, label = 'Progress' }) {
  return (
    <div
      className="flex h-4 w-full items-end gap-[3px]"
      role="img"
      aria-label={`${label}: ${current + 1} of ${total}`}
    >
      {Array.from({ length: total }, (_, i) => {
        const isCurrent = i === current;
        const seen = i <= current;
        return (
          <span
            key={i}
            className={[
              'min-w-[3px] flex-1 rounded-full transition-all duration-300',
              isCurrent ? 'h-4 bg-accent' : seen ? 'h-2 bg-accent/70' : 'h-2 bg-border',
            ].join(' ')}
          />
        );
      })}
    </div>
  );
}
