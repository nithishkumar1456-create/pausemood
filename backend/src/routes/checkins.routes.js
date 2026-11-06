import { Router } from 'express';
import {
  getCheckins,
  createCheckin,
  updateCheckin,
  deleteCheckin,
} from '../controllers/checkins.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createCheckinSchema,
  updateCheckinSchema,
  checkinIdParamSchema,
  checkinQuerySchema,
} from '../schemas/checkin.schema.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

// Apply authentication middleware to all checkin endpoints
router.use(requireAuth);

router.get('/', validate(checkinQuerySchema, 'query'), asyncHandler(getCheckins));
router.post('/', validate(createCheckinSchema, 'body'), asyncHandler(createCheckin));
router.patch(
  '/:id',
  validate(checkinIdParamSchema, 'params'),
  validate(updateCheckinSchema, 'body'),
  asyncHandler(updateCheckin)
);
router.delete('/:id', validate(checkinIdParamSchema, 'params'), asyncHandler(deleteCheckin));

export default router;

