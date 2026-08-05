import dummyDeck from '../data/dummyDeck';

// Stand-in for the real generation call. Same signature and same return shape
// as the eventual AI-backed version, so only this file changes later.
// eslint-disable-next-line no-unused-vars -- `notes` is what the real call will send.
export async function generateDeck(notes) {
  await new Promise((r) => setTimeout(r, 1200));
  return dummyDeck;
}

export function countWords(text) {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export const MIN_WORDS = 50;
export const LONG_NOTES_WORDS = 3000;
