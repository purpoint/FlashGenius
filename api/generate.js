import { generateDeckFromNotes, DeckError, MAX_NOTES_CHARS } from './_deck.js';

// POST /api/generate  { notes } -> deck
//
// This endpoint is public and spends the project's Groq quota, so it validates
// input before forwarding anything.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Use POST.' });
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body;
  const notes = typeof body?.notes === 'string' ? body.notes : '';

  if (notes.trim().length < 20) {
    return res.status(400).json({ error: 'Send some notes to generate from.' });
  }
  if (notes.length > MAX_NOTES_CHARS) {
    return res.status(413).json({ error: 'Those notes are too long. Trim them and try again.' });
  }

  try {
    const deck = await generateDeckFromNotes(notes, {
      apiKey: process.env.GROQ_API_KEY,
      model: process.env.GROQ_MODEL,
    });
    return res.status(200).json(deck);
  } catch (err) {
    const status = err instanceof DeckError ? err.status : 500;
    // Never leak internals to the client.
    const message =
      err instanceof DeckError ? err.message : 'Something went wrong building your deck.';
    if (status >= 500) console.error('[generate]', err);
    return res.status(status).json({ error: message });
  }
}

function safeParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
