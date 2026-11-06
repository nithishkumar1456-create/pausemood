/**
 * ReplyMessage.jsx
 * Warm reply shown after a check-in is saved.
 * Uses aria-live="polite" so screen readers announce the new message.
 */
import MOODS from '../config/moods';
import './ReplyMessage.css';

export default function ReplyMessage({ mood }) {
  if (!mood) return null;

  // Look up the reply for this mood value from the single source of truth
  const moodConfig = MOODS.find(m => m.value === mood);
  if (!moodConfig) return null;

  return (
    <p
      className="reply-message"
      style={{ '--reply-color': moodConfig.color }}
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Decorative heart */}
      <span aria-hidden="true">💜 </span>
      {moodConfig.reply}
    </p>
  );
}

