import { Router } from 'express';
import { validate } from '../middleware/validation.js';
import { validators } from '../validators/index.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as userController from '../controllers/user.js';

const router = Router();

// Customer address routes
router.get('/addresses', authenticate, asyncHandler(userController.getAddresses));
router.post('/addresses', authenticate, validate(validators.address), asyncHandler(userController.addAddress));
router.put('/addresses/:id', authenticate, asyncHandler(userController.updateAddress));
router.delete('/addresses/:id', authenticate, asyncHandler(userController.deleteAddress));
router.put('/addresses/:id/default', authenticate, asyncHandler(userController.setDefaultAddress));

// Profile routes
router.get('/profile', authenticate, asyncHandler(userController.getProfile));
router.put('/profile', authenticate, validate(validators.updateProfile), asyncHandler(userController.updateProfile));

// Admin routes
router.get('/admin/all', authenticate, requireAdmin, validate(validators.pagination), asyncHandler(userController.getAdminUsers));
router.get('/admin/:id', authenticate, requireAdmin, asyncHandler(userController.getAdminUserById));
router.put('/admin/:id/role', authenticate, requireAdmin, asyncHandler(userController.updateUserRole));
router.delete('/admin/:id', authenticate, requireAdmin, asyncHandler(userController.deleteUser));

export default router;
