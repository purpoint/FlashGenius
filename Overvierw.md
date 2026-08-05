Build a study web app called FlashGenius. React + Vite + Tailwind, no backend, no router library — screen switching is component state. Dummy data only; I will wire up the AI later.

## Screens

1. **Landing** — product name, one line of copy, a large textarea for pasting notes (placeholder: "Paste your notes here — a lecture, a chapter, a summary."), a live word count that turns amber past 3000 words, and a "Generate flashcards" button that is disabled until there are at least 50 words. Clicking it shows a brief loading state, then goes to flashcards.

2. **Flashcards** — one card at a time, centred. "Card 3 of 10" plus a segmented progress indicator at the top. Click or press Space/Enter to flip the card (real 3D flip, ~450ms, backface hidden). Prev/Next buttons and arrow-key support. Cards reset to the question side when you move on. After the last card, a "Start quiz" button appears.

3. **Quiz** — one MCQ at a time. Show the difficulty as a small pill. Tapping an option locks the question immediately: the chosen option turns green or red, the correct one is always revealed in green, and the explanation slides in below. Then a "Next question" button. Questions cannot be re-answered.

4. **Results** — score out of 5, a one-line verdict, a breakdown by difficulty, and a scrollable review of every question showing what was picked vs. what was correct. Buttons: "Retake quiz" and "New notes".

## File structure

```
src/
  main.jsx
  App.jsx                 # holds appState, switches screens
  data/dummyDeck.js
  lib/generate.js
  lib/scoring.js
  screens/LandingScreen.jsx
  screens/FlashcardsScreen.jsx
  screens/QuizScreen.jsx
  screens/ResultsScreen.jsx
  components/Flashcard.jsx
  components/ProgressTicks.jsx
  components/QuizQuestion.jsx
  components/DifficultyPill.jsx
  components/Button.jsx
```

State lives in one object in App.jsx:

```js
{
  screen: 'landing' | 'loading' | 'flashcards' | 'quiz' | 'results',
  notes: '',
  deck: null,
  cardIndex: 0,
  quizIndex: 0,
  answers: {}   // { [questionId]: selectedOptionId }
}
```

## Data

Create `src/data/dummyDeck.js` exporting one realistic deck — 10 flashcards and 5 quiz questions (2 easy, 2 medium, 1 hard) on a real subject, written as if a student pasted lecture notes about it. It must match this exact shape, because the AI will return the same shape later:

```json
{
  "title": "Photosynthesis and Cellular Respiration",
  "sourceWordCount": 842,
  "flashcards": [
    {
      "id": "c1",
      "question": "What are the two stages of photosynthesis?",
      "answer": "The light-dependent reactions, which occur in the thylakoid membrane, and the Calvin cycle, which occurs in the stroma."
    }
  ],
  "quiz": [
    {
      "id": "q1",
      "difficulty": "easy",
      "question": "Where do the light-dependent reactions take place?",
      "options": [
        { "id": "a", "text": "The stroma" },
        { "id": "b", "text": "The thylakoid membrane" },
        { "id": "c", "text": "The mitochondrial matrix" },
        { "id": "d", "text": "The cell wall" }
      ],
      "correctOptionId": "b",
      "explanation": "The thylakoid membrane holds the chlorophyll and photosystems that capture light."
    }
  ],
  "warnings": []
}
```

Put the fake generation behind `src/lib/generate.js`:

```js
export async function generateDeck(notes) {
  await new Promise(r => setTimeout(r, 1200));
  return dummyDeck;
}
```

Everything else must treat that as the only source of truth — nothing outside this file may assume there are exactly 10 cards or 5 questions. Render from array length.

## Design direction

Dark, mobile-first, minimal. Built for someone reading it at 1am, so low glare and generous spacing matter more than contrast punch.

Tokens — use these exactly, as CSS variables:

```
--bg        #101317   page
--surface   #171B21   cards, inputs
--border    #252B33   hairlines
--text      #E8EAED   primary
--muted     #9AA3AE   secondary, labels
--accent    #8B93F8   periwinkle — buttons, active progress ticks
--correct   #6FCF97
--wrong     #F2777A
```

Type: "Fraunces" for the wordmark and card questions only, "Inter" for everything else. Both from Google Fonts. Body 16px minimum, generous line-height, nothing smaller than 13px.

Signature element: the progress indicator. Not a filled bar — a row of small segments, one per card, where seen cards are accent-coloured, the current one is accent and taller, and unseen ones are --border. It reads as the spine of the deck. Keep the rest of the interface quiet so this is the thing people notice.

Cards: 16px radius, 1px --border, subtle lift on hover, no glow, no gradients. Buttons: solid --accent with dark text, full-width on mobile.

## Quality floor

- Works at 360px wide; nothing scrolls horizontally.
- Visible keyboard focus rings; the flashcard is a real `<button>`.
- `prefers-reduced-motion` disables the flip animation and slide-ins.
- Options and cards are semantic buttons, not clickable divs.
- No dead ends — every screen has a way forward and a way back.

Start by showing me the file tree and the dummy deck, then build.
