# FlashGenius

Paste your notes, get flashcards and a quiz. React + Vite + Tailwind, no router,
no backend — screen switching is component state.

## Setup

```bash
npm install
cp .env.example .env      # then paste your Groq key into it
npm run dev
```

Get a key at [console.groq.com/keys](https://console.groq.com/keys). The dev
server must be restarted after editing `.env`.

Without a key the app still runs, but generating shows "Groq rejected the API
key" instead of a deck.

## How the key is handled

`GROQ_API_KEY` has no `VITE_` prefix on purpose. Variables prefixed with `VITE_`
are inlined into the bundle and readable by anyone using the app. This one is
read only by the dev-server proxy in `vite.config.js`, which attaches the
`Authorization` header to requests going to `api.groq.com`. The browser sends
its request to `/api/groq/...` and never sees the key.

**That proxy only exists in `vite dev`.** `npm run build` produces static files
with no server, so a deployed copy has nothing to attach the header and every
generation will fail. Deploying this needs a small backend — a serverless
function holding the key that the page calls instead.

## Where things live

```
src/
  App.jsx                    # appState + screen switching
  data/dummyDeck.js          # the deck shape, kept as reference
  lib/generate.js            # the Groq call, prompt and response validation
  lib/scoring.js             # scoring, difficulty breakdown, review rows
  screens/                   # landing, flashcards, quiz, results
  components/
```

`generate.js` is the only file that knows where decks come from. Everything
downstream knows just the deck shape, and renders from array length — nothing
assumes a fixed number of cards or questions.

## Scripts

| | |
|---|---|
| `npm run dev` | dev server on :5173 |
| `npm run build` | production build |
| `npm run lint` | oxlint |
| `npm run preview` | serve the build (no proxy — see above) |
