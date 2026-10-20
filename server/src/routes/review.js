import { Router } from 'express';
import { validate } from '../middleware/validation.js';
import { validators } from '../validators/index.js';
import { authenticate, optionalAuth, requireAdmin } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as reviewController from '../controllers/review.js';

const router = Router();

// Public routes
router.get('/product/:productId', optionalAuth, validate(validators.pagination), asyncHandler(reviewController.getProductReviews));

// Customer routes
router.post('/product/:productId', authenticate, validate(validators.createReview), asyncHandler(reviewController.createReview));
router.put('/:id', authenticate, asyncHandler(reviewController.updateReview));
router.delete('/:id', authenticate, asyncHandler(reviewController.deleteReview));

// Admin routes
router.get('/admin/all', authenticate, requireAdmin, validate(validators.pagination), asyncHandler(reviewController.getAdminReviews));
router.put('/admin/:id/moderate', authenticate, requireAdmin, asyncHandler(reviewController.adminModerateReview));

export default router;
