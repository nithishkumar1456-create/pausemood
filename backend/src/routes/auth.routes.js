import { Router } from 'express';
import { signup, login, getMe, sendOtp, verifyOtp, forgotPassword, resetPassword } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiters.js';
import { signupSchema, loginSchema, sendOtpSchema, verifyOtpSchema, forgotPasswordSchema, resetPasswordSchema } from '../schemas/auth.schema.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

// Passwordless OTP email routes
router.post('/send-otp', authLimiter, validate(sendOtpSchema), asyncHandler(sendOtp));
router.post('/verify-otp', authLimiter, validate(verifyOtpSchema), asyncHandler(verifyOtp));

// Password recovery with OTP
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), asyncHandler(forgotPassword));
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), asyncHandler(resetPassword));

// Public routes with stricter rate limiting
router.post('/signup', authLimiter, validate(signupSchema), asyncHandler(signup));
router.post('/login', authLimiter, validate(loginSchema), asyncHandler(login));



// Protected profile route
router.get('/me', requireAuth, asyncHandler(getMe));

export default router;

