/**
 * Toast.jsx
 * Brief confirmation message (slide-in banner).
 * Auto-dismisses after a few seconds; parent decides when to remove it.
 */
import { useEffect } from 'react';
import './Toast.css';

export default function Toast({ message, type = 'success', onDismiss }) {
  // Auto-dismiss after 3 seconds
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      className={`toast toast--${type}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="toast__icon" aria-hidden="true">
        {type === 'success' ? '✓' : '✕'}
      </span>
      {message}
    </div>
  );
}

