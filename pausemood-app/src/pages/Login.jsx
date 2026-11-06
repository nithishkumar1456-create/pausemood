import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as api from '../api';
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import './Auth.css';

export default function Login({ initialMode }) {
  const { user, loginWithCredentials, registerWithCredentials } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Mode: 'login' | 'register' | 'register-otp' | 'forgot' | 'reset-code' | 'reset-success'
  const isSignupPath = location.pathname === '/signup' || initialMode === 'register';
  const [mode, setMode] = useState(isSignupPath ? 'register' : 'login');

  // If already logged in, redirect straight to dashboard
  useEffect(() => {
    if (user && !user.isGuest) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // OTP state
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Keep mode in sync when route changes
  useEffect(() => {
    if (location.pathname === '/signup') {
      setMode('register');
    } else if (location.pathname === '/login') {
      setMode('login');
    }
  }, [location.pathname]);

  // Resend countdown timer
  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [resendTimer]);

  // Handle OTP digit typing
  const handleOtpChange = (index, value) => {
    const cleaned = value.replace(/[^0-9]/g, '');
    if (!cleaned) {
      const next = [...otpDigits];
      next[index] = '';
      setOtpDigits(next);
      return;
    }

    const next = [...otpDigits];
    next[index] = cleaned[cleaned.length - 1];
    setOtpDigits(next);

    // Auto-focus next input
    if (index < 5) {
      const nextInput = document.getElementById(`pm-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (!pasted) return;
    const next = ['', '', '', '', '', ''];
    for (let i = 0; i < pasted.length; i++) {
      next[i] = pasted[i];
    }
    setOtpDigits(next);
    const targetIdx = Math.min(pasted.length, 5);
    document.getElementById(`pm-otp-${targetIdx}`)?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      document.getElementById(`pm-otp-${index - 1}`)?.focus();
    }
  };

  // ── SUBMIT HANDLERS ─────────────────────────────────────────────────────────

  // 1. Log In with Email & Password
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginWithCredentials(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Step A: Register submit -> Request Email OTP Verification Code
  const handleRequestRegisterOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password should be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await api.sendOtp(email, name.trim(), 'register');
      setOtpDigits(['', '', '', '', '', '']);
      setMode('register-otp');
      setResendTimer(45);
      setSuccessMsg(`We sent a 6-digit verification code to ${email}`);
    } catch (err) {
      setError(err.message || 'Could not send verification email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Step B: Verify Register OTP & Create User Account
  const handleVerifyRegisterOtp = async (e) => {
    e.preventDefault();
    setError('');

    const fullCode = otpDigits.join('');
    if (fullCode.length < 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setLoading(true);
    try {
      await registerWithCredentials(name.trim(), email, password, fullCode);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid or expired verification code. Try again.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Step A: Request Password Reset OTP
  const handleRequestResetOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      await api.forgotPassword(email);
      setOtpDigits(['', '', '', '', '', '']);
      setMode('reset-code');
      setResendTimer(45);
      setSuccessMsg(`We sent a 6-digit verification code to ${email}`);
    } catch (err) {
      setError(err.message || 'Unable to send reset code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Step B: Verify Reset OTP and Set New Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    const fullCode = otpDigits.join('');
    if (fullCode.length < 6) {
      setError('Please enter the complete 6-digit code.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await api.resetPassword(email, fullCode, newPassword);
      setMode('reset-success');
    } catch (err) {
      setError(err.message || 'Invalid or expired code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-ambient-glow-1" />
      <div className="auth-ambient-glow-2" />

      {/* Top bar with back link */}
      <div className="auth-topbar">
        <Link to="/welcome" className="auth-back-link">
          <ArrowLeft className="size-4" /> Back to Welcome
        </Link>
        <span className="auth-badge-tag">PauseMood Sanctuary</span>
      </div>

      {/* Cute sleeping kitten mascot peeking on top of the card */}
      <div className="auth-mascot-container">
        <div className="auth-mascot-wrapper">
          <svg viewBox="0 0 160 100" className="w-full h-full drop-shadow-sm">
            <ellipse cx="80" cy="92" rx="65" ry="8" fill="#ebdffc" opacity="0.6" />
            <path
              d="M 125 18 C 122 14, 116 14, 113 18 C 110 14, 104 14, 101 18 C 98 22, 101 27, 113 36 C 125 27, 128 22, 125 18 Z"
              fill="#b99de9"
            />
            <ellipse cx="80" cy="65" rx="55" ry="28" fill="#f9c784" />
            <ellipse cx="80" cy="68" rx="35" ry="18" fill="#fffaf2" />
            <ellipse cx="80" cy="50" rx="34" ry="24" fill="#f9c784" />
            <path d="M 52 40 L 60 22 L 70 38 Z" fill="#f9c784" />
            <path d="M 56 38 L 60 27 L 66 37 Z" fill="#f4a0b0" />
            <path d="M 108 40 L 100 22 L 90 38 Z" fill="#f9c784" />
            <path d="M 104 38 L 100 27 L 94 37 Z" fill="#f4a0b0" />
            <path d="M 80 34 L 80 41" stroke="#df8b42" strokeWidth="2" strokeLinecap="round" />
            <path d="M 75 35 L 76 41" stroke="#df8b42" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M 85 35 L 84 41" stroke="#df8b42" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M 66 50 Q 72 45 78 50" fill="none" stroke="#2d1f6e" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M 82 50 Q 88 45 94 50" fill="none" stroke="#2d1f6e" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="64" cy="55" r="4.5" fill="#f4a0b0" opacity="0.7" />
            <circle cx="96" cy="55" r="4.5" fill="#f4a0b0" opacity="0.7" />
            <polygon points="80,54 78,51 82,51" fill="#e07a8b" />
            <path d="M 78 56 Q 80 58 80 58 Q 82 58 82 56" fill="none" stroke="#2d1f6e" strokeWidth="1.5" strokeLinecap="round" />
            <ellipse cx="68" cy="74" rx="9" ry="6" fill="#fffaf2" stroke="#f9c784" strokeWidth="1.5" />
            <ellipse cx="92" cy="74" rx="9" ry="6" fill="#fffaf2" stroke="#f9c784" strokeWidth="1.5" />
          </svg>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="auth-card">
        {/* Navigation tabs for Login / Register */}
        {(mode === 'login' || mode === 'register') && (
          <div className="auth-nav-tabs">
            <button
              type="button"
              className={`auth-nav-tab ${mode === 'login' ? 'auth-nav-tab--active' : ''}`}
              onClick={() => {
                setMode('login');
                setError('');
                setSuccessMsg('');
              }}
            >
              Log In
            </button>
            <button
              type="button"
              className={`auth-nav-tab ${mode === 'register' ? 'auth-nav-tab--active' : ''}`}
              onClick={() => {
                setMode('register');
                setError('');
                setSuccessMsg('');
              }}
            >
              Register
            </button>
          </div>
        )}

        {/* ── 1. LOGIN VIEW ────────────────────────────────────────── */}
        {mode === 'login' && (
          <>
            <div className="auth-header">
              <h1>Welcome back! 💜</h1>
              <p>Sign in with your email and password.</p>
            </div>

            <form className="auth-form" onSubmit={handleLogin}>
              {error && <div className="auth-alert-error">{error}</div>}

              <div className="auth-field">
                <label className="auth-label">Email address</label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon"><Mail className="size-4" /></span>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="auth-input"
                  />
                </div>
              </div>

              <div className="auth-field">
                <div className="auth-field-label-row">
                  <label className="auth-label">Password</label>
                  <button
                    type="button"
                    className="auth-forgot-link"
                    onClick={() => {
                      setMode('forgot');
                      setError('');
                      setSuccessMsg('');
                    }}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon"><Lock className="size-4" /></span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="auth-input"
                  />
                  <button
                    type="button"
                    className="auth-input-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="auth-submit-btn">
                {loading ? 'Logging in…' : <>Log In <ArrowRight className="size-4" /></>}
              </button>
            </form>

            <div className="auth-card-footer">
              Don't have an account?
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError('');
                }}
              >
                Register
              </button>
            </div>
          </>
        )}

        {/* ── 2. REGISTER VIEW (Name, Email, Password) ─────────────── */}
        {mode === 'register' && (
          <>
            <div className="auth-header">
              <h1>Create your space 🌸</h1>
              <p>Enter your details. We'll send an OTP to verify your email.</p>
            </div>

            <form className="auth-form" onSubmit={handleRequestRegisterOtp}>
              {error && <div className="auth-alert-error">{error}</div>}

              <div className="auth-field">
                <label className="auth-label">Your Name</label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon"><UserIcon className="size-4" /></span>
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Maya"
                    className="auth-input"
                  />
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label">Email address</label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon"><Mail className="size-4" /></span>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="auth-input"
                  />
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label">Create Password</label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon"><Lock className="size-4" /></span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="auth-input"
                  />
                  <button
                    type="button"
                    className="auth-input-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="auth-submit-btn">
                {loading ? 'Sending code…' : <>Verify Email &amp; Continue <ArrowRight className="size-4" /></>}
              </button>
            </form>

            <div className="auth-card-footer">
              Already have an account?
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
              >
                Log In
              </button>
            </div>
          </>
        )}

        {/* ── 3. REGISTER OTP VERIFICATION ─────────────────────────── */}
        {mode === 'register-otp' && (
          <>
            <div className="auth-header">
              <h1>Verify Your Email 📬</h1>
              <p>Enter the 6-digit verification code sent to your email.</p>
            </div>

            <form className="auth-form" onSubmit={handleVerifyRegisterOtp}>
              {error && <div className="auth-alert-error">{error}</div>}
              {successMsg && <div className="auth-alert-success">{successMsg}</div>}

              <div className="auth-field">
                <label className="auth-label">6-Digit Verification Code</label>
                <div className="auth-otp-grid" onPaste={handleOtpPaste}>
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`pm-otp-${idx}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="auth-otp-input"
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-[#8e82ad] mt-1">
                  <span>Code sent to <strong>{email}</strong></span>
                  <button
                    type="button"
                    disabled={resendTimer > 0 || loading}
                    onClick={handleRequestRegisterOtp}
                    className="text-[#7c5cbf] font-semibold hover:underline disabled:opacity-50"
                  >
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend code'}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="auth-submit-btn">
                {loading ? 'Verifying…' : <>Verify &amp; Create Account <CheckCircle2 className="size-4" /></>}
              </button>
            </form>

            <div className="auth-card-footer">
              Need to change your email or details?
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError('');
                }}
              >
                Go back
              </button>
            </div>
          </>
        )}

        {/* ── 4. FORGOT PASSWORD (EMAIL INPUT) ─────────────────────── */}
        {mode === 'forgot' && (
          <>
            <div className="auth-header">
              <h1>Reset Password 🔑</h1>
              <p>Enter your email and we'll send a 6-digit OTP code to reset your password.</p>
            </div>

            <form className="auth-form" onSubmit={handleRequestResetOtp}>
              {error && <div className="auth-alert-error">{error}</div>}

              <div className="auth-field">
                <label className="auth-label">Your Email address</label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon"><Mail className="size-4" /></span>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="auth-input"
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="auth-submit-btn">
                {loading ? 'Sending code…' : <>Send Reset Code <ArrowRight className="size-4" /></>}
              </button>
            </form>

            <div className="auth-card-footer">
              Remember your password?
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
              >
                Back to Log In
              </button>
            </div>
          </>
        )}

        {/* ── 5. ENTER RESET OTP CODE & NEW PASSWORD ───────────────── */}
        {mode === 'reset-code' && (
          <>
            <div className="auth-header">
              <h1>Enter Code &amp; New Pass 📬</h1>
              <p>Check your email for the 6-digit reset code.</p>
            </div>

            <form className="auth-form" onSubmit={handleResetPassword}>
              {error && <div className="auth-alert-error">{error}</div>}
              {successMsg && <div className="auth-alert-success">{successMsg}</div>}

              <div className="auth-field">
                <label className="auth-label">6-Digit Verification Code</label>
                <div className="auth-otp-grid" onPaste={handleOtpPaste}>
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`pm-otp-${idx}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="auth-otp-input"
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-[#8e82ad] mt-1">
                  <span>Sent to <strong>{email}</strong></span>
                  <button
                    type="button"
                    disabled={resendTimer > 0 || loading}
                    onClick={handleRequestResetOtp}
                    className="text-[#7c5cbf] font-semibold hover:underline disabled:opacity-50"
                  >
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend code'}
                  </button>
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label">New Password</label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon"><Lock className="size-4" /></span>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="auth-input"
                  />
                  <button
                    type="button"
                    className="auth-input-toggle-btn"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="auth-submit-btn">
                {loading ? 'Updating password…' : <>Reset Password <CheckCircle2 className="size-4" /></>}
              </button>
            </form>

            <div className="auth-card-footer">
              Want to cancel?
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
              >
                Back to Log In
              </button>
            </div>
          </>
        )}

        {/* ── 6. RESET SUCCESS VIEW ─────────────────────────────────── */}
        {mode === 'reset-success' && (
          <div className="auth-success-box">
            <div className="auth-success-icon-badge">
              <CheckCircle2 className="size-8" />
            </div>
            <h2>Password Updated! 🎉</h2>
            <p className="text-sm text-[#7b6f93] mb-6">
              Your password has been reset successfully. You can now log in with your new credentials.
            </p>

            <button
              type="button"
              className="auth-submit-btn"
              onClick={() => {
                setMode('login');
                setPassword('');
                setError('');
                setSuccessMsg('');
              }}
            >
              Log In Now <ArrowRight className="size-4" />
            </button>
          </div>
        )}
      </div>

      {/* Demo helper hint */}
      <div className="mt-4 text-center text-xs text-[#9f8fc0] max-w-[380px] z-10">
        <p>
          OTP codes are sent to your email. (Demo code: <strong className="text-[#7c5cbf]">241806</strong> also works).
        </p>
      </div>
    </main>
  );
}
