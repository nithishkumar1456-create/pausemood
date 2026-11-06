import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

import { env } from './config/env.js';
import { generalLimiter } from './middleware/rateLimiters.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';
import checkinsRoutes from './routes/checkins.routes.js';

export const app = express();

// Security HTTP headers
app.use(helmet());

// CORS configuration
const allowedOrigins = env.CLIENT_ORIGIN.split(',').map((origin) => origin.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      // If wildcard, configured origins, Vercel deployments, or localhost
      if (
        allowedOrigins.includes('*') ||
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        origin.includes('localhost')
      ) {
        return callback(null, true);
      }

      callback(null, false);
    },
    credentials: true,
  })
);

// Body parser with safe payload size limit
app.use(express.json({ limit: '10kb' }));

// Logging: logs only method, path, status code, and duration (never logs body or note contents)
if (env.NODE_ENV !== 'test') {
  app.use(morgan(':method :url :status - :response-time ms'));
}

// Global general rate limiter for all standard API routes
app.use('/api', generalLimiter);

// API route mounts
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/checkins', checkinsRoutes);

// Catch 404s
app.use(notFoundHandler);

// Central error handler
app.use(errorHandler);

