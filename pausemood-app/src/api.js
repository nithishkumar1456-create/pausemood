/**
 * api.js – ALL network calls live here.
 *
 * Base URL comes from the environment variable VITE_API_URL.
 * When that variable is not set or when acting as a guest (no token),
 * check-in functions fall back to localStorage so the app works standalone.
 *
 * Token storage: we keep the JWT in localStorage for simplicity.
 * Trade-off: localStorage tokens are readable by any JS on the page (XSS risk).
 * A production app should use httpOnly cookies instead.
 */

const BASE = import.meta.env.VITE_API_URL; // e.g. "http://localhost:4000"

// ── Token helpers ─────────────────────────────────────────────────────────────
export function getToken() {
  return localStorage.getItem('pm_token');
}

function setToken(token) {
  localStorage.setItem('pm_token', token);
}

function clearToken() {
  localStorage.removeItem('pm_token');
}

// Build headers, adding Authorization when a token is present.
function headers() {
  const h = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
}

// ── Generic fetch wrapper ─────────────────────────────────────────────────────
async function request(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: headers(),
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null; // No body on DELETE success

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.message || `HTTP ${res.status}`);
  return data;
}

// ── localStorage fallback helpers ─────────────────────────────────────────────
const LS_KEY = 'pm_checkins';

function lsGetAll() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY)) || [];
  } catch {
    return [];
  }
}

function lsSave(items) {
  localStorage.setItem(LS_KEY, JSON.stringify(items));
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export async function signup(name, email, password, code = '') {
  if (!BASE) {
    // Fallback: store a fake user, no real auth
    const user = { id: crypto.randomUUID(), name, email };
    localStorage.setItem('pm_user', JSON.stringify(user));
    return { user };
  }
  const data = await request('POST', '/api/auth/signup', { name, email, password, code });
  if (data.token) setToken(data.token);
  return data;
}


export async function login(email, password) {
  if (!BASE) {
    const user = { id: 'guest', name: 'Guest', email };
    localStorage.setItem('pm_user', JSON.stringify(user));
    return { user };
  }
  const data = await request('POST', '/api/auth/login', { email, password });
  if (data.token) setToken(data.token);
  return data;
}

export async function sendOtp(email, name = '') {
  if (!BASE) {
    return { success: true, simulated: true };
  }
  return request('POST', '/api/auth/send-otp', { email, name });
}

export async function verifyOtp(email, code) {
  if (!BASE) {
    const rawName = (email.split('@')[0] || 'Friend').replace(/[^a-zA-Z]/g, ' ').trim();
    const user = {
      id: 'local_' + Math.random().toString(36).substring(2, 9),
      name: rawName.charAt(0).toUpperCase() + rawName.slice(1) || 'Friend',
      email,
    };
    localStorage.setItem('pm_user', JSON.stringify(user));
    return { user, token: 'local_token' };
  }
  const data = await request('POST', '/api/auth/verify-otp', { email, code });
  if (data.token) setToken(data.token);
  if (data.user) localStorage.setItem('pm_user', JSON.stringify(data.user));
  return data;
}

export async function forgotPassword(email) {
  if (!BASE) {
    return { success: true, message: 'Password reset code sent' };
  }
  return request('POST', '/api/auth/forgot-password', { email });
}

export async function resetPassword(email, code, newPassword) {
  if (!BASE) {
    return { success: true, message: 'Password reset successfully' };
  }
  return request('POST', '/api/auth/reset-password', { email, code, newPassword });
}

export function logout() {
  clearToken();
  localStorage.removeItem('pm_user');
}

// ── Check-ins ─────────────────────────────────────────────────────────────────
export async function getCheckins() {
  // Guests (without token) or standalone mode without backend use localStorage
  if (!BASE || !getToken()) {
    const all = lsGetAll();
    return [...all].reverse();
  }
  return request('GET', '/api/checkins');
}

export async function saveCheckin({ mood, note, tag }) {
  if (!BASE || !getToken()) {
    const checkin = {
      id: crypto.randomUUID(),
      mood,
      note: note || '',
      tag: tag || null,
      created_at: new Date().toISOString(),
    };
    const all = lsGetAll();
    all.push(checkin); // push to end; getCheckins reverses for display
    lsSave(all);
    return checkin;
  }
  return request('POST', '/api/checkins', { mood, note, tag });
}

export async function deleteCheckin(id) {
  if (!BASE || !getToken()) {
    const all = lsGetAll().filter(c => c.id !== id);
    lsSave(all);
    return null;
  }
  return request('DELETE', `/api/checkins/${id}`);
}

// ── Demo seed ─────────────────────────────────────────────────────────────────
/**
 * seedDemoData() – loads 7 made-up check-ins covering the last 7 days.
 * Called by a button in the History page when there is no data.
 * Uses made-up notes only; no real personal or health information.
 */
export function seedDemoData() {
  const demo = [
    { mood: 1, note: 'A tough day...', tag: 'Rest' },
    { mood: 3, note: 'A calm day.', tag: null },
    { mood: 2, note: 'Feeling a bit tired.', tag: 'Sleep' },
    { mood: 4, note: 'Finished my project.', tag: 'Work done' },
    { mood: 5, note: 'Had a productive day!', tag: 'Friends' },
    { mood: 3, note: 'Just an average Tuesday.', tag: 'Music' },
    { mood: 4, note: 'Went for a nice walk.', tag: 'Walk' },
  ];

  const existing = lsGetAll();
  if (existing.length > 0) return; // Don't overwrite real data

  const items = demo.map((d, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i)); // spread across last 7 days
    date.setHours(18 + i, 10 * i % 60, 0, 0);
    return {
      id: crypto.randomUUID(),
      ...d,
      created_at: date.toISOString(),
    };
  });

  lsSave(items);
  return items;
}
