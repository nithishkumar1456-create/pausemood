/**
 * EmptyState.jsx
 * Friendly message shown when there are no check-ins yet.
 */
import './EmptyState.css';

export default function EmptyState({ onSeed }) {
  return (
    <div className="empty-state" role="status">
      <span className="empty-state__cat" aria-hidden="true">🐱</span>
      <p className="empty-state__title">No check-ins yet.</p>
      <p className="empty-state__subtitle">
        Your first one takes a minute. 🌸
      </p>
      {/* Optional: load demo data to explore the app */}
      {onSeed && (
        <button
          type="button"
          className="btn-ghost empty-state__seed"
          onClick={onSeed}
        >
          Load demo check-ins
        </button>
      )}
    </div>
  );
}

