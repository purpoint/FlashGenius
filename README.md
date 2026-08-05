# FlashGenius

Paste your notes, get flashcards and a quiz. React + Vite + Tailwind, no router
— screen switching is component state. Generation runs through one serverless
function so the API key never reaches the browser.

## Setup

```bash
npm install
cp .env.example .env      # then paste your Groq key into it
npm run dev
```

Get a key at [console.groq.com/keys](https://console.groq.com/keys). The dev
server must be restarted after editing `.env`.

## Deploying to Vercel

1. Push to GitHub.
2. On [vercel.com/new](https://vercel.com/new), import the repo. The Vite preset
   is detected automatically — no settings to change.
3. Under **Environment Variables**, add `GROQ_API_KEY` with your key. Optionally
   `GROQ_MODEL`. Apply them to Production, Preview and Development.
4. Deploy. Every later push to `main` redeploys.

If you add the key after the first deploy, redeploy for it to take effect —
environment variables are read at request time by the function, but the build
must exist first.

## How the key is handled

`GROQ_API_KEY` has no `VITE_` prefix on purpose. Anything prefixed `VITE_` is
inlined into the bundle and readable by every visitor. This one is read only by
`api/_deck.js`, which runs on the server.

The browser posts `{ notes }` to `/api/generate` and gets a finished deck back.
The key, the prompt and the response validation all stay server-side.

In production that endpoint is a Vercel function. In development there is no
Vercel, so `vite.config.js` mounts the *same handler* on the dev server — local
and deployed behaviour cannot drift.

**The endpoint is public and spends your Groq quota.** It rejects anything but
POST, requires at least 20 characters of notes, and caps them at 60,000. That is
enough to stop accidents, not a determined abuser — if this gets traffic, add
rate limiting per IP.

## Where things live

```
api/
  _deck.js                 # prompt, Groq call, response validation (server only)
  generate.js              # POST /api/generate -> deck
src/
  App.jsx                  # appState + screen switching
  data/dummyDeck.js        # the deck shape, kept as reference
  lib/generate.js          # thin client for /api/generate
  lib/scoring.js           # scoring, difficulty breakdown, review rows
  screens/                 # landing, flashcards, quiz, results
  components/
```

Everything downstream of `generate.js` knows only the deck shape and renders
from array length — nothing assumes a fixed number of cards or questions.

## Scripts

| | |
|---|---|
| `npm run dev` | dev server on :5173, with the API handler mounted |
| `npm run build` | production build |
| `npm run lint` | oxlint |
| `npm run preview` | serve the build — static only, so generation will fail |
