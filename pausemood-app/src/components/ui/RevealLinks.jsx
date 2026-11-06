import React from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import PullCord from "../kokonutui/pull-cord";
import { Sparkles, ArrowUpRight, LogOut, Sun, Moon } from "lucide-react";

const DURATION = 0.25;
const STAGGER = 0.025;

const FlipLink = ({ children, to, destinationHint, onClick, isDarkMode }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    }
  };

  const text = String(children);

  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline items-center justify-center gap-2 sm:gap-4 group">
      <motion.a
        initial="initial"
        whileHover="hovered"
        href={to || "#"}
        onClick={handleClick}
        className={`relative block overflow-hidden whitespace-nowrap text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight cursor-pointer select-none transition-colors ${
          isDarkMode ? "hover:text-emerald-400" : "hover:text-black/80"
        }`}
        style={{
          lineHeight: 0.85,
        }}
      >
        <div>
          {text.split("").map((l, i) => (
            <motion.span
              variants={{
                initial: {
                  y: 0,
                },
                hovered: {
                  y: "-100%",
                },
              }}
              transition={{
                duration: DURATION,
                ease: "easeInOut",
                delay: STAGGER * i,
              }}
              className="inline-block"
              key={i}
            >
              {l === " " ? "\u00A0" : l}
            </motion.span>
          ))}
        </div>
        <div className="absolute inset-0">
          {text.split("").map((l, i) => (
            <motion.span
              variants={{
                initial: {
                  y: "100%",
                },
                hovered: {
                  y: 0,
                },
              }}
              transition={{
                duration: DURATION,
                ease: "easeInOut",
                delay: STAGGER * i,
              }}
              className="inline-block"
              key={i}
            >
              {l === " " ? "\u00A0" : l}
            </motion.span>
          ))}
        </div>
      </motion.a>

      {/* Target redirection hint */}
      {destinationHint && (
        <span
          className={`text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-opacity duration-200 flex items-center gap-1 opacity-70 group-hover:opacity-100 ${
            isDarkMode ? "text-emerald-400" : "text-black/80"
          }`}
        >
          <ArrowUpRight className="size-3.5" />
          {destinationHint}
        </span>
      )}
    </div>
  );
};

export const RevealLinks = () => {
  const { user, logout } = useAuth();
  const userName = user?.name || "Friend";

  // Global Light vs Dark Theme toggle via Kokonut UI PullCord
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <section
      className={`relative h-screen w-full flex flex-col items-center justify-center px-6 sm:px-12 font-sans overflow-hidden select-none transition-colors duration-500 ${
        isDarkMode
          ? "bg-[#0b0f19] text-white"
          : "bg-green-300 text-black"
      }`}
    >
      {/* Top Right Hanging Pull-Cord Lamp */}
      <div className="absolute top-0 right-0 sm:right-6 z-30 pointer-events-auto flex flex-col items-center">
        <PullCord
          checked={!isDarkMode}
          onCheckedChange={() => toggleTheme()}
          label="Mood Switch"
          className="scale-75 sm:scale-90 origin-top bg-transparent border-none shadow-none"
        />
      </div>

      {/* Top Header Bar (Positioned at top) */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 sm:px-12 py-6 max-w-7xl mx-auto pr-24 sm:pr-40">
        <div className="flex items-center gap-3">
          <div
            className={`size-10 rounded-2xl flex items-center justify-center font-bold text-lg shadow-md transition-colors ${
              isDarkMode ? "bg-white text-black" : "bg-black text-white"
            }`}
          >
            🐱
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight block leading-tight">
              PauseMood
            </span>
            <span
              className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-1 ${
                isDarkMode ? "text-white/60" : "text-black/70"
              }`}
            >
              Dashboard <Sparkles className="size-3" />
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`hidden md:flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${
              isDarkMode
                ? "bg-white/10 text-white border-white/20"
                : "bg-black/10 text-black border-black/15"
            }`}
          >
            {isDarkMode ? <Moon className="size-3.5 text-emerald-400" /> : <Sun className="size-3.5 text-amber-500" />}
            <span>{isDarkMode ? "Night Calm" : "Day Zen"}</span>
          </div>

          <span
            className={`text-sm font-bold backdrop-blur-sm px-4 py-1.5 rounded-full border ${
              isDarkMode
                ? "bg-white/10 text-white border-white/20"
                : "bg-black/10 text-black border-black/15"
            }`}
          >
            Hello, {userName}
          </span>

          <button
            onClick={logout}
            className={`size-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              isDarkMode
                ? "bg-white/10 hover:bg-white/20 text-white"
                : "bg-black/10 hover:bg-black/20 text-black"
            }`}
            title="Log Out"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </header>

      {/* Main Content Area: Exactly in the dead center of the screen */}
      <main className="z-10 flex flex-col items-center justify-center text-center max-w-4xl mx-auto my-auto">
        <div
          className={`text-xs font-black uppercase tracking-widest mb-4 sm:mb-6 ${
            isDarkMode ? "text-white/50" : "text-black/60"
          }`}
        >
          Select Destination
        </div>

        <div className="flex flex-col items-start gap-4 sm:gap-5 w-fit">
          <FlipLink
            to="/checkin"
            destinationHint="1-Minute Daily Mood Logger"
            isDarkMode={isDarkMode}
          >
            Check-In
          </FlipLink>

          <FlipLink
            to="/history"
            destinationHint="Mood Journey & Weekly Strip"
            isDarkMode={isDarkMode}
          >
            History
          </FlipLink>

          <FlipLink
            to="/welcome"
            destinationHint="Zen Sanctuary & Floating Island"
            isDarkMode={isDarkMode}
          >
            Sanctuary
          </FlipLink>

          <FlipLink
            to="/profile"
            destinationHint="Account & Feelings Summary"
            isDarkMode={isDarkMode}
          >
            Profile
          </FlipLink>
        </div>
      </main>
    </section>
  );
};

export default RevealLinks;
