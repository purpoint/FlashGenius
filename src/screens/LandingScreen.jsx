import { countWords, MIN_WORDS, LONG_NOTES_WORDS } from '../lib/generate';
import Button from '../components/Button';
import Wordmark from '../components/Wordmark';

export default function LandingScreen({ notes, onNotesChange, onGenerate, loading }) {
  const words = countWords(notes);
  const long = words > LONG_NOTES_WORDS;
  const ready = words >= MIN_WORDS;
  const progress = Math.min(1, words / MIN_WORDS);

  return (
    <div className="screen-enter mx-auto flex min-h-dvh w-full max-w-xl flex-col justify-center px-5 py-12">
      <Wordmark size="lg" />
      <p className="mt-4 max-w-md text-[17px] leading-relaxed text-muted">
        Paste what you're studying. Get cards and a quiz that actually test you.
      </p>

      {/* The field and its metadata are one panel, so the count reads as part
          of the input rather than loose text underneath it. */}
      <div className="field rounded-card border-border bg-surface mt-9 overflow-hidden border focus-within:border-accent/40">
        <label htmlFor="notes" className="sr-only">
          Your notes
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          disabled={loading}
          rows={10}
          placeholder="Paste your notes here — a lecture, a chapter, a summary."
          className="block w-full resize-y bg-transparent px-5 py-5 leading-relaxed text-text placeholder:text-muted/60 focus:outline-none disabled:opacity-60"
        />

        <div className="border-border flex items-center justify-between gap-4 border-t px-5 py-3">
          <span className={`text-[13px] ${long ? 'text-amber-400' : 'text-muted'}`}>
            {words.toLocaleString()} {words === 1 ? 'word' : 'words'}
            {long && ' — long notes may lose detail'}
          </span>

          {/* Fills as you approach the 50-word minimum, then gets out of the way. */}
          {!ready && (
            <span className="flex items-center gap-2 text-[13px] text-muted">
              <span className="bg-border h-[3px] w-16 overflow-hidden rounded-full">
                <span
                  className="block h-full rounded-full bg-accent transition-[width] duration-300"
                  style={{ width: `${progress * 100}%` }}
                />
              </span>
              {MIN_WORDS - words} to go
            </span>
          )}
        </div>
      </div>

      <div className="mt-6">
        <Button full onClick={onGenerate} disabled={!ready || loading}>
          {loading ? 'Reading your notes…' : 'Generate flashcards'}
        </Button>
        <p className="mt-3 text-center text-[13px] text-muted">
          {ready ? 'Cards first, then a quiz.' : `At least ${MIN_WORDS} words needed.`}
        </p>
      </div>
    </div>
  );
}
