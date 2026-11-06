import rateLimit from 'express-rate-limit';

/**
 * General API rate limiter:
 * Allows 100 requests per 15-minute window.
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
  statusCode: 429,
});

/**
 * Strict auth rate limiter:
 * Limits signup and login attempts to 10 requests per 15-minute window to mitigate brute-force attacks.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts. Please try again in 15 minutes.' },
  statusCode: 429,
});

