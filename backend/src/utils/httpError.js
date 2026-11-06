/**
 * Custom operational HTTP error class.
 * Carries an HTTP status code and optional details array (for validation errors).
 */
export class HttpError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = 'HttpError';
  }
}

