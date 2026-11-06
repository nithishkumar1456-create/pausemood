import React from 'react';
import MOODS from '../config/moods';
import { formatDateTime } from '../utils/date';
import MoodCatAvatar from './MoodCatAvatar';
import { Trash2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './HistoryCard.css';

export default function HistoryCard({ checkin, onDelete }) {
  const { isDarkMode } = useTheme();
  const moodConfig = MOODS.find((m) => m.value === checkin.mood) || MOODS[2];

  // Soft pastel card backgrounds in light mode, dark glowing pastel in dark mode
  const getCardBg = (val, dark) => {
    if (dark) {
      switch (val) {
        case 5: return { bg: 'rgba(192, 132, 252, 0.12)', border: 'rgba(192, 132, 252, 0.28)' }; // Great (Purple)
        case 4: return { bg: 'rgba(52, 211, 153, 0.12)', border: 'rgba(52, 211, 153, 0.28)' }; // Good (Mint)
        case 3: return { bg: 'rgba(250, 204, 21, 0.12)', border: 'rgba(250, 204, 21, 0.28)' }; // Okay (Yellow)
        case 2: return { bg: 'rgba(251, 146, 60, 0.12)', border: 'rgba(251, 146, 60, 0.28)' }; // Low (Peach/Orange)
        case 1: return { bg: 'rgba(251, 113, 133, 0.12)', border: 'rgba(251, 113, 133, 0.28)' }; // Very Low (Pink)
        default: return { bg: 'rgba(255, 255, 255, 0.05)', border: 'rgba(255, 255, 255, 0.12)' };
      }
    }
    switch (val) {
      case 5: return { bg: '#f5eeff', border: '#ebdffc' }; // Great (Purple)
      case 4: return { bg: '#ecf8ea', border: '#d9f2d6' }; // Good (Mint)
      case 3: return { bg: '#fffde8', border: '#fef3c7' }; // Okay (Yellow)
      case 2: return { bg: '#fff6eb', border: '#fedec0' }; // Low (Peach/Orange)
      case 1: return { bg: '#ffeef1', border: '#fed2d9' }; // Very Low (Pink)
      default: return { bg: '#faf7ff', border: '#ebdffc' };
    }
  };

  const colors = getCardBg(checkin.mood, isDarkMode);

  // Default pleasant notes if user didn't write one
  const getNoteText = () => {
    if (checkin.note && checkin.note.trim()) return checkin.note;
    switch (checkin.mood) {
      case 5: return 'Had a wonderful day!';
      case 4: return 'A bright, peaceful day.';
      case 3: return 'A calm day.';
      case 2: return 'Feeling a bit low today.';
      case 1: return 'A tough day...';
      default: return 'Checked in.';
    }
  };

  return (
    <article
      className="history-pill-card"
      style={{
        backgroundColor: colors.bg,
        borderColor: colors.border,
      }}
      aria-label={`Check-in: ${moodConfig.label} on ${formatDateTime(checkin.created_at)}`}
    >
      {/* Mood Cat Avatar */}
      <div className="history-pill-avatar" aria-hidden="true">
        <MoodCatAvatar mood={checkin.mood} size={42} />
      </div>

      {/* Mood text & Note */}
      <div className="history-pill-text">
        <span className="history-pill-label">{moodConfig.label}</span>
        <p className="history-pill-note">{getNoteText()}</p>
      </div>

      {/* Timestamp & Delete Action */}
      <div className="history-pill-right">
        <span className="history-pill-time">{formatDateTime(checkin.created_at)}</span>
        <button
          type="button"
          className="history-pill-delete-btn"
          onClick={() => onDelete(checkin)}
          aria-label={`Delete check-in from ${formatDateTime(checkin.created_at)}`}
          title="Delete entry"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </article>
  );
}
