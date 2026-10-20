import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as dashboardController from '../controllers/dashboard.js';

const router = Router();

router.get('/stats', authenticate, requireAdmin, asyncHandler(dashboardController.getDashboardStats));
router.get('/sales', authenticate, requireAdmin, asyncHandler(dashboardController.getSalesAnalytics));
router.get('/customers', authenticate, requireAdmin, asyncHandler(dashboardController.getCustomerAnalytics));
router.get('/products', authenticate, requireAdmin, asyncHandler(dashboardController.getProductAnalytics));

export default router;
