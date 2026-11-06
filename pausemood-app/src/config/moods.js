/**
 * moods.js – single source of truth for all 5 mood options.
 * Every component that needs mood data reads from this array.
 * Nothing about moods is hardcoded anywhere else.
 *
 * value  : 1–5 (integer stored in DB / localStorage)
 * label  : display name
 * emoji  : rendered on the picker button
 * color  : CSS token name (from tokens.css)
 * colorHex : raw hex for inline styles when needed
 * reply  : kind line shown after saving this mood
 */
const MOODS = [
  {
    value: 1,
    label: 'Very low',
    emoji: '😿',
    color: 'var(--mood-1)',
    colorLight: 'var(--mood-1-light)',
    colorHex: '#f4a0b0',
    reply: "It's okay to have hard days. You showed up for yourself today — that matters. 💜",
  },
  {
    value: 2,
    label: 'Low',
    emoji: '😔',
    color: 'var(--mood-2)',
    colorLight: 'var(--mood-2-light)',
    colorHex: '#f9c784',
    reply: "Even quiet days count. Take it easy and be gentle with yourself. 🌿",
  },
  {
    value: 3,
    label: 'Okay',
    emoji: '😐',
    color: 'var(--mood-3)',
    colorLight: 'var(--mood-3-light)',
    colorHex: '#b5d99c',
    reply: "Okay is perfectly fine. You're moving through it one moment at a time. ☁️",
  },
  {
    value: 4,
    label: 'Good',
    emoji: '😊',
    color: 'var(--mood-4)',
    colorLight: 'var(--mood-4-light)',
    colorHex: '#90d4a8',
    reply: "Great to hear you're feeling good! Carry that warmth with you. 🌸",
  },
  {
    value: 5,
    label: 'Great',
    emoji: '😄',
    color: 'var(--mood-5)',
    colorLight: 'var(--mood-5-light)',
    colorHex: '#c4a8e8',
    reply: "Love that energy! You're doing great — keep shining. ✨",
  },
];

export default MOODS;

