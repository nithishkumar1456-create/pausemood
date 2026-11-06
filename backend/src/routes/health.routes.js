import { Router } from 'express';

const router = Router();

/**
 * Health check endpoint for uptime monitoring and container orchestration.
 */
router.get('/', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default router;

