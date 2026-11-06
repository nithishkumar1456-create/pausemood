import React from 'react';
import { useLocation } from 'react-router-dom';
import { SlideTabs } from './ui/SlideTabs';

export default function NavBar() {
  const location = useLocation();

  // The floating navbar must NOT be present on Dashboard (/dashboard), Landing (/ or /welcome), Login, or Signup
  if (
    location.pathname === '/' ||
    location.pathname === '/welcome' ||
    location.pathname === '/dashboard' ||
    location.pathname === '/login' ||
    location.pathname === '/signup'
  ) {
    return null;
  }

  return (
    <nav
      className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
      aria-label="Main navigation"
    >
      <div className="pointer-events-auto">
        <SlideTabs />
      </div>
    </nav>
  );
}
