/**
 * NoteInput.jsx
 * Optional textarea with a 200-character hard limit and a live counter.
 * The counter changes style when near the limit (< 20 chars remaining).
 */
import './NoteInput.css';

const MAX = 200;

export default function NoteInput({ value, onChange }) {
  const remaining = MAX - value.length;
  const isNearLimit = remaining < 20;

  return (
    <div className="note-input">
      <label htmlFor="note-textarea" className="note-input__label">
        Add a note <span className="note-input__optional">(optional)</span>
      </label>
      <textarea
        id="note-textarea"
        className="input note-input__textarea"
        placeholder="What's on your mind?"
        value={value}
        maxLength={MAX}
        rows={3}
        onChange={e => onChange(e.target.value)}
        aria-describedby="note-counter"
      />
      {/* Live counter – aria-live so screen readers announce it */}
      <span
        id="note-counter"
        className={`note-input__counter ${isNearLimit ? 'note-input__counter--warn' : ''}`}
        aria-live="polite"
        aria-atomic="true"
      >
        {value.length}/{MAX}
      </span>
    </div>
  );
}

