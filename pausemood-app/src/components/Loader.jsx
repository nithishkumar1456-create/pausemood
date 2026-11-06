/**
 * Loader.jsx
 * Simple spinner shown during async operations.
 */
import './Loader.css';

export default function Loader({ message = 'Loading…' }) {
  return (
    <div className="loader" role="status" aria-label={message}>
      <div className="loader__spinner" aria-hidden="true" />
      <span className="loader__text">{message}</span>
    </div>
  );
}

