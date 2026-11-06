import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import HistoryCard from '../components/HistoryCard';
import WeekStrip from '../components/WeekStrip';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import Toast from '../components/Toast';
import MOODS from '../config/moods';
import { getCheckins, deleteCheckin, seedDemoData } from '../api';
import { User, Sparkles } from 'lucide-react';
import './History.css';

export default function History() {
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Mood filter: null = all
  const [filter, setFilter] = useState(null);

  // Staged check-in for deletion
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  // Load check-ins on mount
  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      let data = await getCheckins();
      // If user has no entries yet, seed demo check-ins matching the screenshot
      if (!data || data.length === 0) {
        seedDemoData();
        data = await getCheckins();
      }
      setCheckins(data || []);
    } catch (err) {
      setError('Could not load check-ins.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Filter check-ins
  const visible = filter
    ? checkins.filter((c) => c.mood === filter)
    : checkins;

  function handleDeleteRequest(checkin) {
    setToDelete(checkin);
  }

  async function handleDeleteConfirm() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteCheckin(toDelete.id);
      setCheckins((prev) => prev.filter((c) => c.id !== toDelete.id));
      setToast({ message: 'Check-in deleted.', type: 'success' });
    } catch {
      setToast({ message: 'Delete failed. Try again.', type: 'error' });
    } finally {
      setDeleting(false);
      setToDelete(null);
    }
  }

  function handleSeed() {
    seedDemoData();
    load();
  }

  return (
    <main className="history-page">
      <div className="history-inner-shell">
        {/* Top bar (Brand + Profile Avatar) */}
        <div className="history-topbar">
          <Link to="/dashboard" className="history-brand">
            <div className="history-brand-logo">
              <svg viewBox="0 0 36 36" className="w-8 h-8">
                {/* Cat face */}
                <ellipse cx="18" cy="20" rx="14" ry="12" fill="#f9c784" />
                <ellipse cx="18" cy="22" rx="9" ry="7" fill="#fffaf2" />
                {/* Ears */}
                <polygon points="6,15 4,6 14,10" fill="#f9c784" />
                <polygon points="7,13 6,8 12,11" fill="#f4a0b0" />
                <polygon points="30,15 32,6 22,10" fill="#f9c784" />
                <polygon points="29,13 30,8 24,11" fill="#f4a0b0" />
                {/* Cheerful eyes */}
                <path d="M 11 18 Q 14 15 17 18" fill="none" stroke="#2d1f6e" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M 19 18 Q 22 15 25 18" fill="none" stroke="#2d1f6e" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="10" cy="21" r="2" fill="#f4a0b0" opacity="0.8" />
                <circle cx="26" cy="21" r="2" fill="#f4a0b0" opacity="0.8" />
                <polygon points="18,20 17,19 19,19" fill="#e07a8b" />
                <path d="M 17 21 Q 18 23 19 21" fill="none" stroke="#2d1f6e" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="history-brand-name">PauseMood</span>
          </Link>

          <Link to="/profile" className="history-profile-avatar-btn" title="Your Profile" aria-label="Your Profile">
            <User size={18} strokeWidth={2.2} />
          </Link>
        </div>

        {/* Heading Section */}
        <section className="history-heading-section">
          <h1 className="history-title">Your Mood History</h1>
          <p className="history-subtitle">
            A little journey of your feelings <Sparkles size={14} className="text-[#eab308] inline" />
          </p>
        </section>

        {/* 7-Day Week Strip */}
        {!loading && <WeekStrip checkins={checkins} />}

        {/* Mood Filter Pills */}
        <div className="history-filter-row" role="group" aria-label="Filter by mood">
          <button
            type="button"
            className={`history-filter-pill ${!filter ? 'history-filter-pill--active' : ''}`}
            onClick={() => setFilter(null)}
          >
            All Entries
          </button>
          {MOODS.map((m) => (
            <button
              key={m.value}
              type="button"
              className={`history-filter-pill ${filter === m.value ? 'history-filter-pill--active' : ''}`}
              onClick={() => setFilter(filter === m.value ? null : m.value)}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Loader */}
        {loading && <Loader label="Loading your check-ins…" />}

        {/* Error message */}
        {error && !loading && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl mb-4 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && visible.length === 0 && (
          <EmptyState
            filtered={filter !== null}
            onResetFilter={() => setFilter(null)}
            onSeed={handleSeed}
          />
        )}

        {/* List of Capsule Pill Cards (Newest first) */}
        {!loading && !error && visible.length > 0 && (
          <ul className="history-items-stack" aria-label="Check-in entries">
            {visible.map((item) => (
              <li key={item.id}>
                <HistoryCard
                  checkin={item}
                  onDelete={handleDeleteRequest}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Confirmation Dialog */}
      {toDelete && (
        <ConfirmDialog
          message="Delete this check-in? It will be removed from your history."
          onConfirm={handleDeleteConfirm}
          onCancel={() => setToDelete(null)}
          loading={deleting}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </main>
  );
}
