import { Router } from 'express';
import { validate } from '../middleware/validation.js';
import { validators } from '../validators/index.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as bannerController from '../controllers/banner.js';

const router = Router();

// Public routes
router.get('/', asyncHandler(bannerController.getBanners));

// Admin routes
router.get('/admin/all', authenticate, requireAdmin, validate(validators.pagination), asyncHandler(bannerController.getAdminBanners));
router.get('/admin/:id', authenticate, requireAdmin, asyncHandler(bannerController.getBannerById));
router.post('/admin', authenticate, requireAdmin, validate(validators.createBanner), asyncHandler(bannerController.createBanner));
router.put('/admin/:id', authenticate, requireAdmin, asyncHandler(bannerController.updateBanner));
router.delete('/admin/:id', authenticate, requireAdmin, asyncHandler(bannerController.deleteBanner));
router.put('/admin/reorder', authenticate, requireAdmin, asyncHandler(bannerController.reorderBanners));

export default router;
