import React, { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

export const SlideTabs = () => {
  const location = useLocation();
  const { isDarkMode } = useTheme();

  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const [hoveredTo, setHoveredTo] = useState(null);
  const activeTabRef = useRef(null);

  // Sync cursor position to active route
  const syncActivePosition = () => {
    setHoveredTo(null);
    if (activeTabRef.current) {
      const { width } = activeTabRef.current.getBoundingClientRect();
      setPosition({
        left: activeTabRef.current.offsetLeft,
        width,
        opacity: 1,
      });
    }
  };

  useEffect(() => {
    // Small timeout to allow DOM measure after route transition
    const timer = setTimeout(syncActivePosition, 50);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const currentActiveOrHovered = hoveredTo ?? location.pathname;

  return (
    <ul
      onMouseLeave={syncActivePosition}
      className={`relative mx-auto flex w-fit items-center rounded-full border-2 p-1.5 shadow-2xl select-none transition-colors duration-300 ${
        isDarkMode
          ? "border-zinc-700 bg-zinc-900/95 shadow-purple-950/40 text-white"
          : "border-black bg-white/95 shadow-xl text-black"
      }`}
    >
      <Tab
        to="/dashboard"
        label="Dashboard"
        isActive={currentActiveOrHovered === "/dashboard"}
        setPosition={setPosition}
        setHoveredTo={setHoveredTo}
        setRef={(el) => {
          if (location.pathname === "/dashboard") activeTabRef.current = el;
        }}
        isDarkMode={isDarkMode}
      >
        Dashboard
      </Tab>

      <Tab
        to="/checkin"
        label="Check-In"
        isActive={currentActiveOrHovered === "/checkin"}
        setPosition={setPosition}
        setHoveredTo={setHoveredTo}
        setRef={(el) => {
          if (location.pathname === "/checkin") activeTabRef.current = el;
        }}
        isDarkMode={isDarkMode}
      >
        Check-In
      </Tab>

      <Tab
        to="/history"
        label="History"
        isActive={currentActiveOrHovered === "/history"}
        setPosition={setPosition}
        setHoveredTo={setHoveredTo}
        setRef={(el) => {
          if (location.pathname === "/history") activeTabRef.current = el;
        }}
        isDarkMode={isDarkMode}
      >
        History
      </Tab>

      <Tab
        to="/profile"
        label="Profile"
        isActive={currentActiveOrHovered === "/profile"}
        setPosition={setPosition}
        setHoveredTo={setHoveredTo}
        setRef={(el) => {
          if (location.pathname === "/profile") activeTabRef.current = el;
        }}
        isDarkMode={isDarkMode}
      >
        Profile
      </Tab>

      <Cursor position={position} isDarkMode={isDarkMode} />
    </ul>
  );
};

const Tab = ({ children, to, setPosition, setRef, isActive, setHoveredTo, label, isDarkMode }) => {
  const ref = useRef(null);
  const navigate = useNavigate();

  const handleMouseEnter = () => {
    if (!ref?.current) return;
    setHoveredTo(to);
    const { width } = ref.current.getBoundingClientRect();
    setPosition({
      left: ref.current.offsetLeft,
      width,
      opacity: 1,
    });
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (to) navigate(to);
  };

  return (
    <li
      ref={(el) => {
        ref.current = el;
        if (setRef) setRef(el);
      }}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      className={`relative z-10 block cursor-pointer px-4 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-colors duration-200 whitespace-nowrap ${
        isActive
          ? isDarkMode
            ? "text-black"
            : "text-white"
          : isDarkMode
            ? "text-zinc-300 hover:text-white"
            : "text-zinc-700 hover:text-black"
      }`}
      title={`Navigate to ${label}`}
    >
      {children}
    </li>
  );
};

const Cursor = ({ position, isDarkMode }) => {
  return (
    <motion.li
      animate={{
        ...position,
      }}
      transition={{
        type: "spring",
        stiffness: 450,
        damping: 32,
      }}
      className={`absolute z-0 h-8 sm:h-10 rounded-full pointer-events-none transition-colors duration-300 ${
        isDarkMode ? "bg-white" : "bg-black"
      }`}
    />
  );
};

export default SlideTabs;
