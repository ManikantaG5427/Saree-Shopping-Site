import { Router } from 'express';
import { validate } from '../middleware/validation.js';
import { validators } from '../validators/index.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as couponController from '../controllers/coupon.js';

const router = Router();

// Customer routes
router.post('/validate', authenticate, asyncHandler(couponController.validateCoupon));

// Admin routes
router.get('/admin/all', authenticate, requireAdmin, validate(validators.pagination), asyncHandler(couponController.getAdminCoupons));
router.get('/admin/:id', authenticate, requireAdmin, asyncHandler(couponController.getCouponById));
router.get('/admin/:id/stats', authenticate, requireAdmin, asyncHandler(couponController.getCouponStats));
router.post('/admin', authenticate, requireAdmin, validate(validators.createCoupon), asyncHandler(couponController.createCoupon));
router.put('/admin/:id', authenticate, requireAdmin, asyncHandler(couponController.updateCoupon));
router.delete('/admin/:id', authenticate, requireAdmin, asyncHandler(couponController.deleteCoupon));

export default router;
