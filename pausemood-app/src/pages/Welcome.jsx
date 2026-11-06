/**
 * Welcome.jsx – PauseMood Landing Page with Crowd Hero Scroll Effect
 *
 * Integrates CrowdCanvas in the hero section representing the busy world.
 * Scrolling transitions from the bustling crowd into the calm PauseMood sanctuary,
 * followed by features, about, 5-mood preview, and simple name-based entry.
 */
import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CrowdCanvas } from '../components/ui/skiper39';
import MOODS from '../config/moods';
import './Welcome.css';

export default function Welcome() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const { loginWithName } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await loginWithName(name);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  }

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  // Calculate subtle fade and parallax for the crowd hero as user scrolls down
  const crowdOpacity = Math.max(0, 1 - scrollY / 600);
  const crowdBlur = Math.min(8, (scrollY / 400) * 8);

  return (
    <div className="landing">
      {/* ── Sticky Navigation Bar ──────────────────────────── */}
      <header className="landing-nav">
        <div className="landing-nav__inner">
          <a href="#crowd-hero" className="landing-nav__logo">
            <span className="landing-nav__logo-cat" aria-hidden="true">🐱</span>
            <span className="landing-nav__logo-text">PauseMood</span>
          </a>

          <nav className="landing-nav__menu" aria-label="Landing page links">
            <button type="button" onClick={() => scrollToSection('sanctuary')} className="landing-nav__link">
              Sanctuary
            </button>
            <button type="button" onClick={() => scrollToSection('about')} className="landing-nav__link">
              About
            </button>
            <button type="button" onClick={() => scrollToSection('features')} className="landing-nav__link">
              Features
            </button>
            <button type="button" onClick={() => scrollToSection('how-it-works')} className="landing-nav__link">
              How It Works
            </button>
            <Link to="/login" className="landing-nav__link">
              Log In
            </Link>
          </nav>

          <Link
            to="/login"
            className="btn-primary landing-nav__cta"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* ── Hero Section with Animated CrowdCanvas ──────────── */}
      <section className="crowd-hero" id="crowd-hero">
        {/* The Animated Canvas Background */}
        <div
          className="crowd-hero__canvas-wrapper"
          style={{
            opacity: crowdOpacity,
            filter: `blur(${crowdBlur}px)`,
          }}
          aria-hidden="true"
        >
          <CrowdCanvas
            src="https://cdn.21st.dev/assets/localized/abdb8990a7bef8c2f5af3e45f0a3c969c4b0603fba8be92e81347de4ea4e1ed7.png"
            rows={15}
            cols={7}
          />
        </div>

        {/* Soft atmospheric gradient overlay */}
        <div className="crowd-hero__gradient-overlay" aria-hidden="true"></div>

        {/* Floating Hero Content */}
        <div className="crowd-hero__content">
          <div className="crowd-hero__badge">
            <span className="badge-pulse" aria-hidden="true"></span>
            <span>Step away from the crowd</span>
          </div>

          <h1 className="crowd-hero__title">
            PauseMood
          </h1>

          <p className="crowd-hero__tagline">
            A one-minute mood check-in for a calmer mind 💜
          </p>

          <p className="crowd-hero__desc">
            In a rushing, noisy world, take sixty seconds to pause, notice how you feel, and be gentle with yourself.
          </p>

          {/* Action CTAs in the hero: redirects directly into login */}
          <div className="crowd-hero__action-box card" id="enter-name">
            <p className="crowd-hero__cta-lead">
              Ready to take a gentle pause? 🌸
            </p>
            <div className="crowd-hero__btn-group">
              <Link to="/login" className="btn-primary crowd-hero__btn-cta">
                Start Check-in →
              </Link>
              <Link to="/login" className="btn-ghost crowd-hero__btn-cta">
                Sign In / Register
              </Link>
            </div>
            <div style={{ marginTop: '8px', textAlign: 'center' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                New to PauseMood? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Create Free Account</Link>
              </span>
            </div>
          </div>

          {/* Scroll Down Indicator */}
          <button
            type="button"
            onClick={() => scrollToSection('sanctuary')}
            className="crowd-hero__scroll-hint"
            aria-label="Scroll down to explore"
          >
            <span>SCROLL TO PAUSE</span>
            <div className="scroll-chevron" aria-hidden="true">↓</div>
          </button>
        </div>
      </section>

      {/* ── Transition Section: The PauseMood Sanctuary ────── */}
      <section className="sanctuary-section" id="sanctuary">
        <div className="sanctuary-container">
          <div className="sanctuary-visual">
            <div className="cat-illustration-box">
              <div className="cat-floating-heart" aria-hidden="true">💜</div>

              <div className="cat-speech-bubble" role="note">
                <p>It's okay to feel whatever you feel. 💜</p>
                <div className="cat-speech-arrow" aria-hidden="true"></div>
              </div>

              {/* Friendly Cat SVG Artwork */}
              <div className="cat-figure">
                <svg viewBox="0 0 240 180" className="cat-svg" aria-label="Calm cat resting peacefully">
                  <ellipse cx="120" cy="155" rx="105" ry="24" fill="#faebd7" />
                  <ellipse cx="120" cy="150" rx="95" ry="18" fill="#ffe5cc" opacity="0.6" />
                  <path d="M 40 145 C 32 135 44 125 48 135 C 52 145 42 148 40 145 Z" fill="#90d4a8" />
                  <path d="M 195 145 C 205 135 192 125 188 135 C 185 145 194 148 195 145 Z" fill="#90d4a8" />
                  <ellipse cx="120" cy="115" rx="60" ry="45" fill="#f9c784" />
                  <ellipse cx="120" cy="122" rx="36" ry="28" fill="#fffaf2" />
                  <ellipse cx="120" cy="80" rx="50" ry="40" fill="#f9c784" />
                  <path d="M 80 62 L 95 30 L 110 55 Z" fill="#f9c784" />
                  <path d="M 85 58 L 95 37 L 105 54 Z" fill="#f4a0b0" />
                  <path d="M 160 62 L 145 30 L 130 55 Z" fill="#f9c784" />
                  <path d="M 155 58 L 145 37 L 135 54 Z" fill="#f4a0b0" />
                  <path d="M 120 48 L 120 60" stroke="#df8b42" strokeWidth="3" strokeLinecap="round" />
                  <path d="M 112 50 L 114 60" stroke="#df8b42" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M 128 50 L 126 60" stroke="#df8b42" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M 98 80 Q 106 74 114 80" fill="none" stroke="#2d1f6e" strokeWidth="3" strokeLinecap="round" />
                  <path d="M 126 80 Q 134 74 142 80" fill="none" stroke="#2d1f6e" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="95" cy="88" r="6" fill="#f4a0b0" opacity="0.6" />
                  <circle cx="145" cy="88" r="6" fill="#f4a0b0" opacity="0.6" />
                  <polygon points="120,86 116,82 124,82" fill="#e07a8b" />
                  <path d="M 116 88 Q 120 92 120 92 Q 124 92 124 88" fill="none" stroke="#2d1f6e" strokeWidth="2" strokeLinecap="round" />
                  <line x1="84" y1="84" x2="68" y2="80" stroke="#2d1f6e" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="84" y1="88" x2="66" y2="88" stroke="#2d1f6e" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="156" y1="84" x2="172" y2="80" stroke="#2d1f6e" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="156" y1="88" x2="174" y2="88" stroke="#2d1f6e" strokeWidth="1.5" strokeLinecap="round" />
                  <ellipse cx="102" cy="140" rx="14" ry="10" fill="#fffaf2" stroke="#f9c784" strokeWidth="2" />
                  <ellipse cx="138" cy="140" rx="14" ry="10" fill="#fffaf2" stroke="#f9c784" strokeWidth="2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="sanctuary-text">
            <span className="chip">Your Daily Pause</span>
            <h2>A calmer mind, one check-in at a time</h2>
            <p>
              When you take a minute out of the noise, you give yourself permission to breathe. PauseMood is designed to be your quiet corner of the internet.
            </p>
          </div>
        </div>

        {/* ── 3 Pill Feature Cards (From Reference Image 1) ──── */}
        <div className="landing-hero__pills">
          <div className="hero-pill-card">
            <span className="hero-pill-card__icon" aria-hidden="true">💜</span>
            <div>
              <p className="hero-pill-card__title">Quick &amp; Easy</p>
              <p className="hero-pill-card__subtitle">(1 Minute)</p>
            </div>
          </div>

          <div className="hero-pill-card">
            <span className="hero-pill-card__icon" aria-hidden="true">📅</span>
            <div>
              <p className="hero-pill-card__title">Track Your Mood</p>
              <p className="hero-pill-card__subtitle">Over Time</p>
            </div>
          </div>

          <div className="hero-pill-card">
            <span className="hero-pill-card__icon" aria-hidden="true">🛡️</span>
            <div>
              <p className="hero-pill-card__title">You're Not Alone</p>
              <p className="hero-pill-card__subtitle">Helpline: 14416</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── What We Are (About Section) ────────────────────── */}
      <section className="landing-section" id="about">
        <div className="landing-section__header">
          <span className="chip">What We Are</span>
          <h2 className="landing-section__title">
            A quiet sanctuary in a noisy world
          </h2>
          <p className="landing-section__subtitle">
            Most mental wellness apps overwhelm you with 40-question questionnaires, streaks that cause anxiety, or clinical jargon. PauseMood is the exact opposite.
          </p>
        </div>

        <div className="about-grid">
          <div className="about-card card">
            <div className="about-card__emoji" aria-hidden="true">🌱</div>
            <h3>Gentle &amp; Non-Clinical</h3>
            <p>
              We never diagnose, assign clinical labels, or tell you how you "should" feel. Every feeling is valid, whether it’s a calm Tuesday or a really hard day.
            </p>
          </div>

          <div className="about-card card">
            <div className="about-card__emoji" aria-hidden="true">🔒</div>
            <h3>Privacy First</h3>
            <p>
              Your thoughts and personal notes are never mined, analyzed, or shared. Check in with your name — you retain full ownership of your history.
            </p>
          </div>

          <div className="about-card card">
            <div className="about-card__emoji" aria-hidden="true">🌸</div>
            <h3>Warm Human Tone</h3>
            <p>
              Every saved mood receives a kind, heartfelt affirmation crafted in a gentle voice to bring a little warmth and reassurance to your day.
            </p>
          </div>
        </div>
      </section>

      {/* ── Features Section ───────────────────────────────── */}
      <section className="landing-section landing-section--alt" id="features">
        <div className="landing-section__header">
          <span className="chip">Core Features</span>
          <h2 className="landing-section__title">
            Designed for ease and peace of mind
          </h2>
          <p className="landing-section__subtitle">
            Everything you need for daily emotional grounding, thoughtfully built without clutter.
          </p>
        </div>

        <div className="features-container">
          {/* Feature 1: The 5 Moods */}
          <div className="feature-block card">
            <div className="feature-block__text">
              <span className="feature-badge">1. Simple 5-Mood Scale</span>
              <h3>Tap what fits best right now</h3>
              <p>
                From <em>Very Low</em> to <em>Great</em>, select your feeling with a single tap. Each option is distinct with its own warm color palette.
              </p>
            </div>
            <div className="feature-block__preview-moods">
              {MOODS.map(m => (
                <div key={m.value} className="preview-mood-chip" style={{ background: m.color }}>
                  <span className="preview-mood-emoji">{m.emoji}</span>
                  <span className="preview-mood-label">{m.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Feature 2: 200-char Notes & Tags */}
          <div className="feature-block card">
            <div className="feature-block__text">
              <span className="feature-badge">2. Brief Mindful Note &amp; Tags</span>
              <h3>Keep it concise: 200 characters</h3>
              <p>
                A gentle character limit prevents doom-scrolling or overwhelming journaling. Add optional helpful tags like <em>Sleep, Walk, Music, Friends, or Rest</em> to see what brightened your day.
              </p>
            </div>
            <div className="feature-block__preview-tags">
              {['Sleep', 'Friends', 'Family', 'Walk', 'Music', 'Work done', 'Rest', 'Nothing'].map(t => (
                <span key={t} className="preview-tag-pill">{t}</span>
              ))}
            </div>
          </div>

          {/* Feature 3: 7-Day History Strip */}
          <div className="feature-block card">
            <div className="feature-block__text">
              <span className="feature-badge">3. 7-Day Emotional Journey</span>
              <h3>Notice your natural rhythms</h3>
              <p>
                View the last 7 days at a glance through our soft colored dots strip. Spot patterns in how your week felt without judgment or pressure.
              </p>
            </div>
            <div className="feature-block__preview-strip">
              <div className="preview-dot" style={{ background: '#f4a0b0' }}><span>M</span></div>
              <div className="preview-dot" style={{ background: '#f9c784' }}><span>T</span></div>
              <div className="preview-dot" style={{ background: '#b5d99c' }}><span>W</span></div>
              <div className="preview-dot" style={{ background: '#c4a8e8' }}><span>T</span></div>
              <div className="preview-dot" style={{ background: '#90d4a8' }}><span>F</span></div>
              <div className="preview-dot" style={{ background: '#c4a8e8' }}><span>S</span></div>
              <div className="preview-dot" style={{ background: '#90d4a8' }}><span>S</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works Section ───────────────────────────── */}
      <section className="landing-section" id="how-it-works">
        <div className="landing-section__header">
          <span className="chip">Simple Flow</span>
          <h2 className="landing-section__title">
            How your one minute unfolds
          </h2>
          <p className="landing-section__subtitle">
            Four quick steps to center yourself whenever you need a mindful pause.
          </p>
        </div>

        <div className="steps-grid">
          <div className="step-card card">
            <div className="step-number">1</div>
            <h4>Take a Breath &amp; Pick</h4>
            <p>Select your mood from 1 to 5. There are no wrong answers.</p>
          </div>

          <div className="step-card card">
            <div className="step-number">2</div>
            <h4>Add What Helped</h4>
            <p>Jot down a sentence or tap a tag like <em>Walk</em> or <em>Rest</em>.</p>
          </div>

          <div className="step-card card">
            <div className="step-number">3</div>
            <h4>Receive Kind Words</h4>
            <p>Get an immediate, soothing affirmation crafted for your state of mind.</p>
          </div>

          <div className="step-card card">
            <div className="step-number">4</div>
            <h4>Review Over Time</h4>
            <p>Watch your emotional journey in History whenever you want clarity.</p>
          </div>
        </div>
      </section>

      {/* ── Safety & Care Callout ───────────────────────────── */}
      <section className="landing-care">
        <div className="landing-care__card">
          <div className="landing-care__icon" aria-hidden="true">📞</div>
          <div className="landing-care__content">
            <h3>You're never alone on tough days</h3>
            <p>
              If you’re ever going through a crisis or feeling overwhelmed, PauseMood surfaces a direct, free support connection:
            </p>
            <div className="landing-care__helpline">
              <strong>Tele-MANAS: 14416</strong>
              <span>Toll-free, 24 hours a day, 7 days a week</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final Call to Action ───────────────────────────── */}
      <section className="landing-cta">
        <div className="landing-cta__card card">
          <span className="landing-cta__cat" aria-hidden="true">🐾</span>
          <h2>Begin your Pause journey today</h2>
          <p>It takes only one minute to be kind to yourself.</p>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', marginTop: '24px', flexWrap: 'wrap' }}>
            <Link to="/login" className="btn-primary" style={{ padding: '14px 32px', fontSize: '16px', borderRadius: '9999px', textDecoration: 'none' }}>
              Start Check-in Free →
            </Link>
            <Link to="/login" className="btn-ghost" style={{ padding: '14px 28px', fontSize: '16px', borderRadius: '9999px', textDecoration: 'none' }}>
              Sign In / Register
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="landing-footer">
        <div className="landing-footer__inner">
          <div className="landing-footer__brand">
            <span aria-hidden="true">🐱</span>
            <strong>PauseMood</strong>
            <p>A calmer mind, one check-in at a time.</p>
          </div>

          <div className="landing-footer__note">
            <p>PauseMood is a compassionate self-reflection tool, not a clinical medical service.</p>
            <p>Need immediate support? Call Tele-MANAS at <strong>14416</strong> (24/7, free).</p>
          </div>

          <div className="landing-footer__copy">
            &copy; {new Date().getFullYear()} PauseMood. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
