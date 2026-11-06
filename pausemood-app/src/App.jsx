/**
 * App.jsx
 * Root component: sets up routing and wraps everything in AuthProvider.
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute, AppShell } from './routes';

import Welcome from './pages/Welcome';
import Login   from './pages/Login';
import Signup  from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Home    from './pages/Home';
import History from './pages/History';
import Profile from './pages/Profile';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* 1. Public Landing Page */}
            <Route path="/"        element={<Welcome />} />
            <Route path="/welcome" element={<Welcome />} />

            {/* 2. Login & Register / Signup */}
            <Route path="/login"   element={<Login />} />
            <Route path="/signup"  element={<Signup />} />

            {/* 3. Protected Dashboard right after login (NO bottom navbar) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* 4. Daily 1-minute mood check-in (Has bottom navbar via AppShell) */}
            <Route
              path="/checkin"
              element={
                <ProtectedRoute>
                  <AppShell>
                    <Home />
                  </AppShell>
                </ProtectedRoute>
              }
            />

            {/* 5. Full-screen mood journey & history (Has bottom navbar via AppShell) */}
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <AppShell>
                    <History />
                  </AppShell>
                </ProtectedRoute>
              }
            />

            {/* 6. User profile & settings (Has bottom navbar via AppShell) */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <AppShell>
                    <Profile />
                  </AppShell>
                </ProtectedRoute>
              }
            />

            {/* Any unknown path → redirect to landing page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
