import React from 'react';

/**
 * MoodCatAvatar – Cute SVG cat faces for each of the 5 moods
 * Matching the exact visual style from the reference design.
 */
export default function MoodCatAvatar({ mood = 3, size = 44 }) {
  const m = Number(mood);

  // Mood 5: Great (Purple / Cheerful)
  if (m === 5) {
    return (
      <svg width={size} height={size} viewBox="0 0 44 44" fill="none" aria-label="Great mood cat">
        <circle cx="22" cy="22" r="21" fill="#ede1fc" stroke="#d8c2f5" strokeWidth="1.5" />
        {/* Cat Ears */}
        <polygon points="12,18 10,9 19,14" fill="#c3a0ee" />
        <polygon points="13,16 12,11 17,14" fill="#f4a0b0" />
        <polygon points="32,18 34,9 25,14" fill="#c3a0ee" />
        <polygon points="31,16 32,11 27,14" fill="#f4a0b0" />
        {/* Cat Head */}
        <ellipse cx="22" cy="23" rx="14" ry="11.5" fill="#fcf8ff" stroke="#4a3b68" strokeWidth="1.2" />
        {/* Ears outline */}
        <path d="M 12 18 L 10 9 L 19 14" fill="none" stroke="#4a3b68" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M 32 18 L 34 9 L 25 14" fill="none" stroke="#4a3b68" strokeWidth="1.2" strokeLinejoin="round" />
        {/* Cheerful Laughing Eyes: ^ ^ */}
        <path d="M 16 20 Q 18.5 17 21 20" fill="none" stroke="#2d1f6e" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M 23 20 Q 25.5 17 28 20" fill="none" stroke="#2d1f6e" strokeWidth="1.6" strokeLinecap="round" />
        {/* Blushing cheeks */}
        <circle cx="15" cy="24" r="2.2" fill="#f4a0b0" opacity="0.8" />
        <circle cx="29" cy="24" r="2.2" fill="#f4a0b0" opacity="0.8" />
        {/* Nose */}
        <polygon points="22,23 21,22 23,22" fill="#e07a8b" />
        {/* Big Happy Open Mouth */}
        <path d="M 19.5 24 Q 22 29 24.5 24 Z" fill="#e07a8b" stroke="#2d1f6e" strokeWidth="1.2" strokeLinejoin="round" />
        <ellipse cx="22" cy="26" rx="1.5" ry="1" fill="#fff" opacity="0.6" />
      </svg>
    );
  }

  // Mood 4: Good (Mint Green / Smiling)
  if (m === 4) {
    return (
      <svg width={size} height={size} viewBox="0 0 44 44" fill="none" aria-label="Good mood cat">
        <circle cx="22" cy="22" r="21" fill="#e2f5e4" stroke="#c4ebd0" strokeWidth="1.5" />
        {/* Ears */}
        <polygon points="12,18 10,9 19,14" fill="#f9c784" />
        <polygon points="13,16 12,11 17,14" fill="#f4a0b0" />
        <polygon points="32,18 34,9 25,14" fill="#f9c784" />
        <polygon points="31,16 32,11 27,14" fill="#f4a0b0" />
        {/* Head */}
        <ellipse cx="22" cy="23" rx="14" ry="11.5" fill="#fffef8" stroke="#4a3b68" strokeWidth="1.2" />
        <path d="M 12 18 L 10 9 L 19 14" fill="none" stroke="#4a3b68" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M 32 18 L 34 9 L 25 14" fill="none" stroke="#4a3b68" strokeWidth="1.2" strokeLinejoin="round" />
        {/* Happy Smiling Eyes */}
        <path d="M 16 21 Q 18.5 18 21 21" fill="none" stroke="#2d1f6e" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M 23 21 Q 25.5 18 28 21" fill="none" stroke="#2d1f6e" strokeWidth="1.6" strokeLinecap="round" />
        {/* Cheeks */}
        <circle cx="15" cy="24" r="2.2" fill="#f4a0b0" opacity="0.8" />
        <circle cx="29" cy="24" r="2.2" fill="#f4a0b0" opacity="0.8" />
        {/* Nose & Gentle Smile */}
        <polygon points="22,23 21,22 23,22" fill="#e07a8b" />
        <path d="M 20 25 Q 22 27 24 25" fill="none" stroke="#2d1f6e" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }

  // Mood 3: Okay (Yellow / Calm)
  if (m === 3) {
    return (
      <svg width={size} height={size} viewBox="0 0 44 44" fill="none" aria-label="Okay mood cat">
        <circle cx="22" cy="22" r="21" fill="#fef4cc" stroke="#fae69e" strokeWidth="1.5" />
        {/* Ears */}
        <polygon points="12,18 10,9 19,14" fill="#f9c784" />
        <polygon points="13,16 12,11 17,14" fill="#f4a0b0" />
        <polygon points="32,18 34,9 25,14" fill="#f9c784" />
        <polygon points="31,16 32,11 27,14" fill="#f4a0b0" />
        {/* Head */}
        <ellipse cx="22" cy="23" rx="14" ry="11.5" fill="#fffef8" stroke="#4a3b68" strokeWidth="1.2" />
        <path d="M 12 18 L 10 9 L 19 14" fill="none" stroke="#4a3b68" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M 32 18 L 34 9 L 25 14" fill="none" stroke="#4a3b68" strokeWidth="1.2" strokeLinejoin="round" />
        {/* Round Calm Eyes */}
        <circle cx="18" cy="20" r="1.5" fill="#2d1f6e" />
        <circle cx="26" cy="20" r="1.5" fill="#2d1f6e" />
        {/* Cheeks */}
        <circle cx="15" cy="24" r="2.2" fill="#f4a0b0" opacity="0.6" />
        <circle cx="29" cy="24" r="2.2" fill="#f4a0b0" opacity="0.6" />
        {/* Small Nose & Straight mouth */}
        <polygon points="22,23 21,22 23,22" fill="#e07a8b" />
        <path d="M 20.5 25.5 L 23.5 25.5" stroke="#2d1f6e" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    );
  }

  // Mood 2: Low (Orange / Tired)
  if (m === 2) {
    return (
      <svg width={size} height={size} viewBox="0 0 44 44" fill="none" aria-label="Low mood cat">
        <circle cx="22" cy="22" r="21" fill="#fdebd4" stroke="#fbd3a5" strokeWidth="1.5" />
        {/* Ears */}
        <polygon points="12,18 10,9 19,14" fill="#e89843" />
        <polygon points="13,16 12,11 17,14" fill="#f4a0b0" />
        <polygon points="32,18 34,9 25,14" fill="#e89843" />
        <polygon points="31,16 32,11 27,14" fill="#f4a0b0" />
        {/* Head */}
        <ellipse cx="22" cy="23" rx="14" ry="11.5" fill="#fffef8" stroke="#4a3b68" strokeWidth="1.2" />
        <path d="M 12 18 L 10 9 L 19 14" fill="none" stroke="#4a3b68" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M 32 18 L 34 9 L 25 14" fill="none" stroke="#4a3b68" strokeWidth="1.2" strokeLinejoin="round" />
        {/* Drooped / Sleepy Eyes */}
        <path d="M 16 20 Q 18.5 22 21 20" fill="none" stroke="#2d1f6e" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 23 20 Q 25.5 22 28 20" fill="none" stroke="#2d1f6e" strokeWidth="1.5" strokeLinecap="round" />
        {/* Cheeks */}
        <circle cx="15" cy="24" r="2.2" fill="#f4a0b0" opacity="0.6" />
        <circle cx="29" cy="24" r="2.2" fill="#f4a0b0" opacity="0.6" />
        {/* Nose & Soft Downturned mouth */}
        <polygon points="22,23 21,22 23,22" fill="#e07a8b" />
        <path d="M 20.5 26 Q 22 25 23.5 26" fill="none" stroke="#2d1f6e" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    );
  }

  // Mood 1: Very Low (Pink / Sad)
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" aria-label="Very low mood cat">
      <circle cx="22" cy="22" r="21" fill="#fde2e6" stroke="#fac4cc" strokeWidth="1.5" />
      {/* Ears */}
      <polygon points="12,18 10,9 19,14" fill="#e57388" />
      <polygon points="13,16 12,11 17,14" fill="#fde2e6" />
      <polygon points="32,18 34,9 25,14" fill="#e57388" />
      <polygon points="31,16 32,11 27,14" fill="#fde2e6" />
      {/* Head */}
      <ellipse cx="22" cy="23" rx="14" ry="11.5" fill="#fffef8" stroke="#4a3b68" strokeWidth="1.2" />
      <path d="M 12 18 L 10 9 L 19 14" fill="none" stroke="#4a3b68" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M 32 18 L 34 9 L 25 14" fill="none" stroke="#4a3b68" strokeWidth="1.2" strokeLinejoin="round" />
      {/* Tearful / Sad Curved Eyes */}
      <path d="M 16.5 21.5 Q 19 19 21.5 22" fill="none" stroke="#2d1f6e" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M 22.5 22 Q 25 19 27.5 21.5" fill="none" stroke="#2d1f6e" strokeWidth="1.6" strokeLinecap="round" />
      {/* Cheeks */}
      <circle cx="15" cy="24" r="2.2" fill="#f4a0b0" opacity="0.8" />
      <circle cx="29" cy="24" r="2.2" fill="#f4a0b0" opacity="0.8" />
      {/* Small Nose & Sad Mouth */}
      <polygon points="22,23 21,22 23,22" fill="#e07a8b" />
      <path d="M 20 26.5 Q 22 24.5 24 26.5" fill="none" stroke="#2d1f6e" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

