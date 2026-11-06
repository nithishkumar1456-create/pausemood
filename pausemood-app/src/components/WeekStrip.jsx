import React from 'react';
import MOODS from '../config/moods';
import { getLast7Days, getDayAbbrev, isSameDay } from '../utils/date';
import './WeekStrip.css';

export default function WeekStrip({ checkins = [] }) {
  const days = getLast7Days(); // Array of 7 Date objects, oldest -> newest

  // Color lookup for mood values
  const getDotColor = (moodValue) => {
    switch (moodValue) {
      case 5: return '#a881f3'; // Great (Purple)
      case 4: return '#98d89a'; // Good (Green)
      case 3: return '#ffdf78'; // Okay (Yellow)
      case 2: return '#ffbc71'; // Low (Orange)
      case 1: return '#ffaab6'; // Very low (Pink)
      default: return '#ded8eb'; // Soft muted lavender dot
    }
  };

  return (
    <div className="week-strip-card" aria-label="Last 7 days mood summary">
      <div className="week-strip-columns">
        {days.map((day, i) => {
          // Find check-ins on this day; take the most recent one
          const dayCheckins = checkins.filter((c) =>
            isSameDay(new Date(c.created_at), day)
          );
          const latest = dayCheckins[0];
          const mood = latest ? MOODS.find((m) => m.value === latest.mood) : null;
          const dotColor = getDotColor(latest?.mood);

          return (
            <div key={i} className="week-strip-col">
              {/* Mood Dot */}
              <div
                className="week-strip-dot"
                style={{ backgroundColor: dotColor }}
                title={mood ? `${getDayAbbrev(day)}: ${mood.label}` : `${getDayAbbrev(day)}: No check-in`}
              />
              {/* Weekday Label: Mon, Tue, etc. */}
              <span className="week-strip-day-label">
                {getDayAbbrev(day)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
