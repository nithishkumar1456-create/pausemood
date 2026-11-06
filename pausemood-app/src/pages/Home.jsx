/**
 * Home.jsx – /
 * Main check-in screen: mood picker, note, tag, save, reply, care message.
 *
 * Flow:
 *  1. User picks a mood → enables the Save button.
 *  2. User optionally writes a note (200 char limit) and picks a tag chip.
 *  3. Clicks "Save My Mood" → saves to API (or localStorage fallback).
 *  4. Kind reply appears below the button.
 *  5. If isStruggling() is true, the CareMessage card also appears.
 */
import { useState } from 'react';
import MoodPicker   from '../components/MoodPicker';
import NoteInput    from '../components/NoteInput';
import TagPicker    from '../components/TagPicker';
import ReplyMessage from '../components/ReplyMessage';
import CareMessage  from '../components/CareMessage';
import Toast        from '../components/Toast';
import { saveCheckin } from '../api';
import { isStruggling } from '../utils/safety';
import { useAuth } from '../context/AuthContext';
import './Home.css';

export default function Home() {
  const { user } = useAuth();

  // Form state
  const [mood, setMood]     = useState(null);
  const [note, setNote]     = useState('');
  const [tag, setTag]       = useState(null);

  // After-save state
  const [savedMood, setSavedMood]       = useState(null);
  const [showCare, setShowCare]         = useState(false);

  // UI state
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState(null);  // { message, type }
  const [error, setError]     = useState('');

  async function handleSave() {
    if (!mood) return; // button is disabled, but guard anyway
    setSaving(true);
    setError('');

    try {
      await saveCheckin({ mood, note, tag });

      // Show the reply and optionally the care card
      setSavedMood(mood);
      setShowCare(isStruggling(mood, note));
      setToast({ message: 'Check-in saved! 🌸', type: 'success' });

      // Reset the form for next time
      setMood(null);
      setNote('');
      setTag(null);
    } catch (err) {
      setError('Could not save. Please try again.');
      setToast({ message: 'Save failed. Try again.', type: 'error' });
    } finally {
      setSaving(false);
    }
  }

  // Greeting changes by time of day
  function greeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  }

  return (
    <main className="home page-wrapper">
      {/* Header */}
      <header className="home__header">
        <div>
          <h1 className="home__greeting">
            Hello{user && !user.isGuest ? `, ${user.name.split(' ')[0]}` : ' there'}! 👋
          </h1>
          <p className="home__sub">How are you feeling today?</p>
        </div>
        {/* Cat illustration */}
        <span className="home__cat" aria-hidden="true">🐱</span>
      </header>

      {/* Mood picker */}
      <section className="home__section" aria-label="Mood check-in">
        <MoodPicker selected={mood} onChange={setMood} />
      </section>

      {/* Note textarea */}
      <section className="home__section">
        <NoteInput value={note} onChange={setNote} />
      </section>

      {/* Tag chips */}
      <section className="home__section">
        <TagPicker selected={tag} onChange={setTag} />
      </section>

      {/* Error message */}
      {error && <p className="error-text" role="alert">{error}</p>}

      {/* Save button – disabled until a mood is selected */}
      <button
        type="button"
        className="btn-primary home__save"
        onClick={handleSave}
        disabled={!mood || saving}
        aria-busy={saving}
      >
        {saving ? 'Saving…' : '💾 Save My Mood'}
      </button>

      {/* Reply + care – shown after saving, uses aria-live from each component */}
      {savedMood && (
        <div className="home__after-save">
          <ReplyMessage mood={savedMood} />
          {showCare && <CareMessage />}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}
    </main>
  );
}

