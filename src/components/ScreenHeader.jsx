import Wordmark from './Wordmark';

// Slim, consistent top bar for the three inner screens: identity on the left,
// the way back on the right. Keeps every screen anchored the same way.
export default function ScreenHeader({ backLabel, onBack }) {
  return (
    <header className="flex items-center justify-between gap-4">
      <Wordmark />
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg px-2 py-1 text-[13px] text-muted transition-colors hover:text-text"
        >
          {backLabel}
        </button>
      )}
    </header>
  );
}
