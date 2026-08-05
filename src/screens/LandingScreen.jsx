import { countWords, MIN_WORDS, LONG_NOTES_WORDS } from '../lib/generate';
import Button from '../components/Button';

export default function LandingScreen({ notes, onNotesChange, onGenerate, loading }) {
  const words = countWords(notes);
  const long = words > LONG_NOTES_WORDS;
  const ready = words >= MIN_WORDS;

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-12 sm:py-20">
      <h1 className="font-display text-[34px] leading-tight sm:text-[44px]">FlashGenius</h1>
      <p className="mt-3 text-[17px] text-muted">
        Paste what you're studying. Get cards and a quiz that actually test you.
      </p>

      <label htmlFor="notes" className="mt-10 mb-2 block text-[13px] tracking-wide text-muted uppercase">
        Your notes
      </label>
      <textarea
        id="notes"
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        disabled={loading}
        rows={12}
        placeholder="Paste your notes here — a lecture, a chapter, a summary."
        className="rounded-card border-border bg-surface w-full resize-y border px-4 py-4 leading-relaxed text-text placeholder:text-muted/70 focus:border-accent/50 disabled:opacity-60"
      />

      <div className="mt-3 flex items-center justify-between gap-4 text-[13px]">
        <span className={long ? 'text-amber-400' : 'text-muted'}>
          {words.toLocaleString()} {words === 1 ? 'word' : 'words'}
          {long && ' — long notes may lose detail'}
        </span>
        {!ready && (
          <span className="text-muted">
            {MIN_WORDS - words} more to go
          </span>
        )}
      </div>

      <div className="mt-8">
        <Button full onClick={onGenerate} disabled={!ready || loading}>
          {loading ? 'Reading your notes…' : 'Generate flashcards'}
        </Button>
        {!ready && (
          <p className="mt-3 text-center text-[13px] text-muted">
            At least {MIN_WORDS} words needed.
          </p>
        )}
      </div>
    </div>
  );
}
