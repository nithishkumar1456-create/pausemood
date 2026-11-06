import { app } from './app.js';
import { env } from './config/env.js';

const server = app.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`\x1b[32m[Server] PauseMood backend running at http://localhost:${env.PORT}\x1b[0m`);
  // eslint-disable-next-line no-console
  console.log(`[Environment] ${env.NODE_ENV}`);
});

// Graceful shutdown
function shutdown(signal) {
  // eslint-disable-next-line no-console
  console.log(`\n[Server] Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    // eslint-disable-next-line no-console
    console.log('[Server] HTTP server closed. Process exiting.');
    process.exit(0);
  });

  // Force close after 10 seconds if lingering connections exist
  setTimeout(() => {
    // eslint-disable-next-line no-console
    console.error('[Server] Forcing shutdown after timeout.');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

