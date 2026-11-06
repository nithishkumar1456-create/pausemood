/**
 * safety.js – basic heuristic for detecting when a user may be struggling.
 *
 * IMPORTANT: This is a simple keyword/mood check, NOT a clinical risk assessment.
 * It is intended only to surface a helpline number alongside the normal reply.
 * It must never be used to diagnose, label, or treat anyone.
 */

// Phrases that suggest the user may need extra support.
// This list is intentionally short and conservative.
const DANGER_PHRASES = [
  'suicide',
  'kill myself',
  'end it all',
  'no point living',
  'hurt myself',
  'want to die',
  'can\'t go on',
  'better off dead',
];

/**
 * isStruggling(mood, note)
 * Returns true if mood === 1 OR the note contains any danger phrase.
 * Both parameters are optional (safe defaults).
 *
 * @param {number} mood   – 1–5 integer
 * @param {string} note   – free-text note (may be empty)
 * @returns {boolean}
 */
export function isStruggling(mood, note = '') {
  if (mood === 1) return true;

  const lowerNote = (note || '').toLowerCase();
  return DANGER_PHRASES.some(phrase => lowerNote.includes(phrase));
}

