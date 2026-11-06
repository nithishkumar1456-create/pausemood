/**
 * AuthContext.jsx
 * Provides the current user object and name-based login helper to the whole app.
 * Persists user state in localStorage.
 */
import { createContext, useContext, useState, useEffect } from 'react';
import { signup as apiSignup, login as apiLogin, logout as apiLogout } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Load user from localStorage on first render
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('pm_user'));
    } catch {
      return null;
    }
  });

  // Keep localStorage in sync
  useEffect(() => {
    if (user) {
      localStorage.setItem('pm_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('pm_user');
    }
  }, [user]);

  /**
   * Log in or continue simply with a name.
   * Auto-links to a background account so check-ins seamlessly save to Supabase DB.
   */
  async function loginWithName(name) {
    const trimmed = (name || '').trim() || 'Friend';

    let userId = crypto.randomUUID();

    // Deterministic client UUID for persistent DB syncing
    let persistentId = localStorage.getItem('pm_user_pid');
    if (!persistentId) {
      persistentId = Math.random().toString(36).substring(2, 9);
      localStorage.setItem('pm_user_pid', persistentId);
    }

    const cleanSlug = trimmed.toLowerCase().replace(/[^a-z0-9]/g, '') || 'friend';
    const syntheticEmail = `${cleanSlug}.${persistentId}@gmail.com`;
    const syntheticPassword = `PausePass_${persistentId}!99`;

    try {
      // Attempt signup, or login if already created
      const res = await apiSignup(trimmed, syntheticEmail, syntheticPassword).catch(async () => {
        return await apiLogin(syntheticEmail, syntheticPassword);
      });

      if (res?.user?.id) {
        userId = res.user.id;
      }
    } catch (err) {
      // Fallback silently without blocking user
    }

    const userData = { id: userId, name: trimmed };
    setUser(userData);
    localStorage.setItem('pm_user', JSON.stringify(userData));
    return userData;
  }

  async function loginWithCredentials(email, password) {
    const res = await apiLogin(email, password);
    const u = res?.user || { id: 'user', email, name: email.split('@')[0] };
    setUser(u);
    localStorage.setItem('pm_user', JSON.stringify(u));
    return res;
  }

  async function registerWithCredentials(name, email, password, code = '') {
    const res = await apiSignup(name, email, password, code);
    const u = res?.user || { id: 'user', email, name: name || email.split('@')[0] };
    setUser(u);
    localStorage.setItem('pm_user', JSON.stringify(u));
    return res;
  }


  function logout() {
    apiLogout();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loginWithName,
        loginWithCredentials,
        registerWithCredentials,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );

}

export function useAuth() {
  return useContext(AuthContext);
}
