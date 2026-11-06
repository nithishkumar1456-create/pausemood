/**
 * routes.jsx
 * Defines all application routes.
 * Protected routes (Home, History, Profile) redirect to /welcome when no user.
 */
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Welcome from './pages/Welcome';
import Login   from './pages/Login';
import Signup  from './pages/Signup';
import Home    from './pages/Home';
import History from './pages/History';
import Profile from './pages/Profile';
import NavBar  from './components/NavBar';

/**
 * ProtectedRoute – wraps a page that needs an active user (guest counts).
 * If there's no user at all, redirects to /welcome.
 */
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

/**
 * AppShell – wraps all pages that should show the bottom NavBar.
 */
function AppShell({ children }) {
  return (
    <div className="min-h-screen pb-24">
      {children}
      <NavBar />
    </div>
  );
}

/**
 * Routes array consumed by createBrowserRouter in App.jsx.
 * We export a flat array so App.jsx stays simple.
 */
export { ProtectedRoute, AppShell };

