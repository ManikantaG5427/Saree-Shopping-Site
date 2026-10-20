import { Router } from 'express';
import { validate } from '../middleware/validation.js';
import { validators } from '../validators/index.js';
import { authenticate, optionalAuth, requireAdmin } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as categoryController from '../controllers/category.js';

const router = Router();

// Public routes
router.get('/', optionalAuth, asyncHandler(categoryController.getCategories));
router.get('/slug/:slug', optionalAuth, asyncHandler(categoryController.getCategoryBySlug));
router.get('/subcategory/:slug', optionalAuth, asyncHandler(categoryController.getSubcategoryBySlug));
router.get('/:id', optionalAuth, asyncHandler(categoryController.getCategoryById));

// Admin routes
router.get('/admin/all', authenticate, requireAdmin, validate(validators.pagination), asyncHandler(categoryController.getAdminCategories));
router.post('/admin', authenticate, requireAdmin, validate(validators.createCategory), asyncHandler(categoryController.createCategory));
router.put('/admin/:id', authenticate, requireAdmin, asyncHandler(categoryController.updateCategory));
router.delete('/admin/:id', authenticate, requireAdmin, asyncHandler(categoryController.deleteCategory));
router.put('/admin/reorder', authenticate, requireAdmin, asyncHandler(categoryController.reorderCategories));

// Subcategory admin routes
router.post('/admin/subcategory', authenticate, requireAdmin, asyncHandler(categoryController.createSubcategory));
router.put('/admin/subcategory/:id', authenticate, requireAdmin, asyncHandler(categoryController.updateSubcategory));
router.delete('/admin/subcategory/:id', authenticate, requireAdmin, asyncHandler(categoryController.deleteSubcategory));

export default router;
