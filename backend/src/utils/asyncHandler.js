/**
 * Wraps async Express route handlers to forward unhandled promise rejections
 * directly to the central error handling middleware.
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

