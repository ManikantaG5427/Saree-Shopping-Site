import { Router } from 'express';
import { validate } from '../middleware/validation.js';
import { validators } from '../validators/index.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as authController from '../controllers/auth.js';

const router = Router();

router.post('/register', validate(validators.register), asyncHandler(authController.register));
router.post('/login', validate(validators.login), asyncHandler(authController.login));
router.post('/logout', asyncHandler(authController.logout));
router.post('/refresh-token', validate(validators.refreshToken), asyncHandler(authController.refreshToken));
router.get('/me', authenticate, asyncHandler(authController.getMe));
router.post('/forgot-password', validate(validators.forgotPassword), asyncHandler(authController.forgotPassword));
router.post('/reset-password', validate(validators.resetPassword), asyncHandler(authController.resetPassword));
router.post('/change-password', authenticate, validate(validators.changePassword), asyncHandler(authController.changePassword));

export default router;
