/**
 * MoodPicker.jsx
 * Renders 5 clickable mood buttons. Only one can be selected at a time.
 * Selected state uses a ring + scale transform (not colour alone) for accessibility.
 * Uses aria-pressed on each button so screen readers know the state.
 */
import MOODS from '../config/moods';
import './MoodPicker.css';

export default function MoodPicker({ selected, onChange }) {
  return (
    <div className="mood-picker" role="group" aria-label="Pick your mood">
      {MOODS.map(mood => {
        const isSelected = selected === mood.value;
        return (
          <button
            key={mood.value}
            type="button"
            className={`mood-btn ${isSelected ? 'mood-btn--selected' : ''}`}
            style={{ '--mood-color': mood.color }}
            aria-pressed={isSelected}
            onClick={() => onChange(mood.value)}
          >
            {/* Coloured circle background */}
            <span className="mood-btn__circle">
              <span className="mood-btn__emoji" aria-hidden="true">
                {mood.emoji}
              </span>
            </span>
            <span className="mood-btn__label">{mood.label}</span>
          </button>
        );
      })}
    </div>
  );
}

