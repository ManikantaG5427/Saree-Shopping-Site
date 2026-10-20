import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as settingController from '../controllers/setting.js';

const router = Router();

// Public routes
router.get('/public', asyncHandler(settingController.getPublicSettings));

// Admin routes
router.get('/admin/all', authenticate, requireAdmin, asyncHandler(settingController.getAdminSettings));
router.get('/admin/:key', authenticate, requireAdmin, asyncHandler(settingController.getSettingByKey));
router.post('/admin', authenticate, requireAdmin, asyncHandler(settingController.createSetting));
router.put('/admin/:key', authenticate, requireAdmin, asyncHandler(settingController.updateSetting));
router.put('/admin/bulk', authenticate, requireAdmin, asyncHandler(settingController.bulkUpdateSettings));
router.delete('/admin/:key', authenticate, requireAdmin, asyncHandler(settingController.deleteSetting));

export default router;
