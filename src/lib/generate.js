// The one place that knows where decks come from. Everything downstream only
// knows the deck shape, so swapping providers means editing this file alone.
//
// The request goes to the dev server's /api/groq proxy, which attaches the
// key (see vite.config.js) — the key is never present in the browser.

export const MIN_WORDS = 50;
export const LONG_NOTES_WORDS = 3000;

const ENDPOINT = '/api/groq/openai/v1/chat/completions';
const CARD_TARGET = 10;
const QUIZ_TARGET = 5;

const SYSTEM_PROMPT = `You turn a student's notes into study material.

Return ONLY a JSON object with exactly this shape:

{
  "title": "short title for the material",
  "flashcards": [{ "question": "...", "answer": "..." }],
  "quiz": [{
    "difficulty": "easy" | "medium" | "hard",
    "question": "...",
    "options": [{ "text": "..." }, { "text": "..." }, { "text": "..." }, { "text": "..." }],
    "correctIndex": 0,
    "explanation": "..."
  }]
}

Rules:
- ${CARD_TARGET} flashcards and ${QUIZ_TARGET} quiz questions: 2 easy, 2 medium, 1 hard.
- Every question must be answerable from the notes alone. Never invent facts
  that are not in the notes.
- Exactly 4 options per question. Wrong options must be plausible, not filler.
- correctIndex is the 0-based index of the correct option.
- Answers and explanations are one or two sentences, plain and specific.
- If the notes are too thin to support this, return fewer items rather than
  padding with vague or repeated questions.`;

export function countWords(text) {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

const str = (value) => (typeof value === 'string' ? value.trim() : '');

const DIFFICULTIES = ['easy', 'medium', 'hard'];

// A model can return well-formed JSON with unusable contents, and every screen
// trusts this data. Anything that would render broken is dropped here and
// reported through the deck's own warnings.
function normalizeDeck(raw, notes) {
  const warnings = [];

  const flashcards = (Array.isArray(raw?.flashcards) ? raw.flashcards : [])
    .map((card) => ({ question: str(card?.question), answer: str(card?.answer) }))
    .filter((card) => card.question && card.answer)
    .map((card, i) => ({ id: `c${i + 1}`, ...card }));

  const quiz = [];
  for (const item of Array.isArray(raw?.quiz) ? raw.quiz : []) {
    const question = str(item?.question);
    const options = (Array.isArray(item?.options) ? item.options : [])
      .map((option) => str(typeof option === 'string' ? option : option?.text))
      .filter(Boolean)
      .map((text, i) => ({ id: 'abcdefgh'[i], text }));

    const index = Number(item?.correctIndex);
    const valid =
      question && options.length >= 2 && Number.isInteger(index) && options[index] != null;

    if (!valid) continue;

    const difficulty = str(item?.difficulty).toLowerCase();
    quiz.push({
      id: `q${quiz.length + 1}`,
      difficulty: DIFFICULTIES.includes(difficulty) ? difficulty : 'medium',
      question,
      options,
      correctOptionId: options[index].id,
      explanation: str(item?.explanation) || 'No explanation was provided for this one.',
    });
  }

  if (!flashcards.length && !quiz.length) {
    throw new Error('The model did not return any usable cards or questions.');
  }
  if (!quiz.length) {
    warnings.push('No quiz questions could be generated from these notes — cards only.');
  } else if (flashcards.length < CARD_TARGET || quiz.length < QUIZ_TARGET) {
    warnings.push(
      `These notes supported ${flashcards.length} cards and ${quiz.length} questions rather than the usual ${CARD_TARGET} and ${QUIZ_TARGET}.`,
    );
  }
  if (countWords(notes) > LONG_NOTES_WORDS) {
    warnings.push('Your notes are long, so some detail may not be covered.');
  }

  return {
    title: str(raw?.title) || 'Your study deck',
    sourceWordCount: countWords(notes),
    flashcards,
    quiz,
    warnings,
  };
}

export async function generateDeck(notes) {
  let response;
  try {
    response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: import.meta.env.VITE_GROQ_MODEL || 'llama-3.3-70b-versatile',
        temperature: 0.4,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: notes },
        ],
      }),
    });
  } catch {
    throw new Error('Could not reach the model. Check your connection and try again.');
  }

  if (response.status === 401 || response.status === 403) {
    throw new Error(
      'Groq rejected the API key. Check GROQ_API_KEY in .env and restart the dev server.',
    );
  }
  if (response.status === 429) {
    throw new Error('Groq is rate limiting this key right now. Wait a moment and try again.');
  }
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`The model request failed (${response.status}). ${detail.slice(0, 140)}`.trim());
  }

  const payload = await response.json().catch(() => null);
  const content = payload?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('The model returned an empty response. Try again.');
  }

  let raw;
  try {
    raw = JSON.parse(content);
  } catch {
    throw new Error('The model returned something that was not valid JSON. Try again.');
  }

  return normalizeDeck(raw, notes);
}
