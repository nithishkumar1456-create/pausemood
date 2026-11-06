/**
 * ConfirmDialog.jsx
 * Keyboard-accessible confirmation dialog for delete actions.
 * Uses the HTML <dialog> element for proper focus trapping.
 * Pressing Escape closes it (native dialog behaviour).
 */
import { useEffect, useRef } from 'react';
import './ConfirmDialog.css';

export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  const dialogRef = useRef(null);

  // Open the dialog when it mounts; focus is managed by the dialog element
  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="confirm-dialog"
      onCancel={onCancel} /* native Escape key handler */
      aria-labelledby="confirm-dialog-title"
    >
      <p id="confirm-dialog-title" className="confirm-dialog__message">
        {message}
      </p>
      <div className="confirm-dialog__actions">
        <button
          type="button"
          className="btn-ghost confirm-dialog__btn"
          onClick={onCancel}
          autoFocus
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn-primary confirm-dialog__btn confirm-dialog__btn--danger"
          onClick={onConfirm}
        >
          Delete
        </button>
      </div>
    </dialog>
  );
}

