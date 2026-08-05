// The one place the app knows where decks come from. The Groq call, the
// prompt and the response validation all live server-side in api/_deck.js —
// nothing secret is reachable from the browser.

export const MIN_WORDS = 50;
export const LONG_NOTES_WORDS = 3000;

export function countWords(text) {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export async function generateDeck(notes) {
  let response;
  try {
    response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes }),
    });
  } catch {
    throw new Error('Could not reach the server. Check your connection and try again.');
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error || `The request failed (${response.status}).`);
  }
  if (!payload?.flashcards) {
    throw new Error('The server returned an unexpected response. Try again.');
  }

  return payload;
}
