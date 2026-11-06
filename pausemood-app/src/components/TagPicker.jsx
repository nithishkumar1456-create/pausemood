/**
 * TagPicker.jsx
 * Optional "What helped today?" chip selector.
 * Only one tag can be selected at a time (clicking the same chip deselects it).
 */
import './TagPicker.css';

const TAGS = [
  'Sleep', 'Friends', 'Family', 'Walk',
  'Music', 'Work done', 'Rest', 'Nothing',
];

export default function TagPicker({ selected, onChange }) {
  function handleClick(tag) {
    // Click the same tag again → deselect (toggle)
    onChange(selected === tag ? null : tag);
  }

  return (
    <div className="tag-picker">
      <p className="tag-picker__label">What helped today? <span className="tag-picker__optional">(optional)</span></p>
      <div className="tag-picker__chips" role="group" aria-label="What helped today?">
        {TAGS.map(tag => (
          <button
            key={tag}
            type="button"
            className={`tag-chip ${selected === tag ? 'tag-chip--selected' : ''}`}
            aria-pressed={selected === tag}
            onClick={() => handleClick(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}

