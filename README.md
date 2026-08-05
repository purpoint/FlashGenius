# FlashGenius

Paste your lecture notes. Get flashcards and a quiz that actually test you.

**[flash-genius-sigma.vercel.app](https://flash-genius-sigma.vercel.app)**

A study app built for someone reading it at 1am: dark, mobile-first, low glare,
generous spacing. Paste any notes and a language model turns them into a deck of
flashcards and a five-question multiple-choice quiz, scored by difficulty.

---

## How it works

1. **Landing** — paste your notes. A live word count gates generation at 50
   words and warns past 3000.
2. **Flashcards** — one card at a time with a real 3D flip. Click, press Space,
   or navigate with arrow keys. Cards reset to the question side as you move.
3. **Quiz** — one question at a time. Choosing an option locks it immediately:
   your pick turns green or red, the correct answer is always revealed, and the
   explanation slides in. Questions can't be re-answered.
4. **Results** — score, a one-line verdict, a breakdown by difficulty, and a
   scrollable review of every question showing what you picked versus what was
   correct.

Nothing in the app assumes a fixed number of cards or questions — every count,
progress indicator and score denominator is derived from array length, so a deck
of 7 cards and 12 questions renders correctly with no code changes.

## Design

Eight colour tokens, declared once as CSS variables and consumed as Tailwind
utilities:

| Token | | Use |
|---|---|---|
| `--bg` | `#101317` | page |
| `--surface` | `#171B21` | cards, inputs |
| `--border` | `#252B33` | hairlines |
| `--text` | `#E8EAED` | primary text |
| `--muted` | `#9AA3AE` | secondary, labels |
| `--accent` | `#8B93F8` | periwinkle — buttons, active ticks |
| `--correct` | `#6FCF97` | right answers |
| `--wrong` | `#F2777A` | wrong answers |

Fraunces for the wordmark and card questions, Inter for everything else. Body
text never below 16px, nothing below 13px.

The signature element is the progress indicator: not a filled bar but a row of
segments, one per card — seen cards in accent, the current one taller, unseen
ones in `--border`. It reads as the spine of the deck, and the motif repeats as
the logo, the loading state, and the per-difficulty meters on results.

Accessibility is part of the build, not an afterthought: cards and options are
real `<button>` elements, focus rings are visible throughout, the layout works
at 360px with no horizontal scroll, and `prefers-reduced-motion` disables the
flip and every slide-in.

## Stack

React 19 · Vite 8 · Tailwind CSS 4 · Groq · Vercel Functions

No router — screen switching is a single state object in `App.jsx`. No state
library, no component library, no CSS framework beyond Tailwind's tokens.

## Running locally

```bash
npm install
cp .env.example .env      # paste your Groq key into it
npm run dev
```

Get a key at [console.groq.com/keys](https://console.groq.com/keys). Restart the
dev server after editing `.env` — Vite reads it once at startup.

## Deploying

Import the repo at [vercel.com/new](https://vercel.com/new). The Vite preset is
detected automatically; there are no build settings to change.

**Add `GROQ_API_KEY` under Environment Variables before deploying.** Skip it and
the site builds and loads perfectly, but every generation returns *"The server
has no Groq API key configured."* Optionally set `GROQ_MODEL` to any Groq model
supporting JSON mode (default: `llama-3.3-70b-versatile`).

Pushes to `main` redeploy automatically.

## Architecture: keeping the key out of the browser

`GROQ_API_KEY` has no `VITE_` prefix, and that is deliberate. Anything prefixed
`VITE_` is inlined into the JavaScript bundle and readable by every visitor who
opens devtools.

Instead the browser posts `{ notes }` to `/api/generate` and receives a finished
deck. The key, the prompt, and the response validation all live in `api/`, which
never ships to the client.

In production that endpoint is a Vercel function. In development there is no
Vercel, so `vite.config.js` mounts **the same handler** on the dev server rather
than reimplementing it — local and deployed behaviour cannot drift.

### Validating model output

A model can return perfectly well-formed JSON with unusable contents — a
`correctIndex` pointing past the end of the options array, a missing answer, an
invented difficulty. Every screen trusts deck data completely, so `api/_deck.js`
validates before anything reaches the UI: unusable items are dropped, difficulty
is coerced to a known value, ids are assigned server-side, and any shortfall is
reported through the deck's own `warnings` array rather than rendering broken.

### A note on abuse

`/api/generate` is public and spends the project's Groq quota. It rejects
anything but POST, requires at least 20 characters, and caps notes at 60,000
characters. That stops accidents, not a determined abuser — if this ever takes
real traffic, add per-IP rate limiting.

## Project structure

```
api/
  _deck.js                 # prompt, Groq call, response validation (server only)
  generate.js              # POST /api/generate -> deck
src/
  App.jsx                  # app state + screen switching
  index.css                # tokens, flip animation, reduced-motion
  data/dummyDeck.js        # reference deck, documents the shape
  lib/generate.js          # thin client for /api/generate
  lib/scoring.js           # scoring, difficulty breakdown, review rows
  screens/                 # Landing, Flashcards, Quiz, Results
  components/              # Flashcard, ProgressTicks, QuizQuestion, …
```

The deck shape is the contract between the model and the UI:

```jsonc
{
  "title": "Photosynthesis and Cellular Respiration",
  "sourceWordCount": 842,
  "flashcards": [{ "id": "c1", "question": "…", "answer": "…" }],
  "quiz": [{
    "id": "q1",
    "difficulty": "easy",
    "question": "…",
    "options": [{ "id": "a", "text": "…" }],
    "correctOptionId": "b",
    "explanation": "…"
  }],
  "warnings": []
}
```

Swapping model providers means editing `api/_deck.js` and nothing else.

## Scripts

| | |
|---|---|
| `npm run dev` | dev server on :5173, with the API handler mounted |
| `npm run build` | production build |
| `npm run lint` | oxlint |
| `npm run preview` | serves the build — static only, so generation will fail |
