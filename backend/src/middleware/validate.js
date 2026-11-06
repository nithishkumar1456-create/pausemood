import { HttpError } from '../utils/httpError.js';

/**
 * Higher-order middleware function to validate incoming request data using a Zod schema.
 *
 * @param {import('zod').ZodSchema} schema - The Zod schema to validate against
 * @param {'body' | 'params' | 'query'} [source='body'] - The property on `req` to validate
 */
export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const details = result.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      // Construct a clean, human-readable summary error message
      const message = details.length > 0 ? details[0].message : 'Validation failed';
      return next(new HttpError(400, message, details));
    }

    // Assign sanitized / transformed value back to the request object
    req[source] = result.data;
    next();
  };
};

