import { env } from '../config/env.js';

/**
 * Centralized Express error handler middleware.
 * Returns consistent JSON response: { error: string, details?: Array }
 * Never leaks stack traces in production environments.
 * Strictly avoids logging request bodies or sensitive user text notes.
 */
export function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);

  // In non-production, log technical error info (without bodies) for debugging
  if (env.NODE_ENV !== 'production' && statusCode === 500) {
    // eslint-disable-next-line no-console
    console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.message);
  }

  const response = {
    error: err.message || 'An unexpected server error occurred',
  };

  if (err.details && Array.isArray(err.details)) {
    response.details = err.details;
  }

  // Include stack only in development mode for debugging
  if (env.NODE_ENV === 'development' && statusCode === 500) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

/**
 * 404 handler for undefined routes
 */
export function notFoundHandler(req, res, next) {
  res.status(404).json({ error: `Cannot ${req.method} ${req.originalUrl}` });
}

