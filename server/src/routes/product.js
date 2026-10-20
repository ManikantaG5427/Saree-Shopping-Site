import { Router } from 'express';
import { validate } from '../middleware/validation.js';
import { validators } from '../validators/index.js';
import { authenticate, optionalAuth, requireAdmin } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as productController from '../controllers/product.js';

const router = Router();

// Public routes
router.get('/', optionalAuth, validate(validators.productFilters), asyncHandler(productController.getProducts));
router.get('/featured', optionalAuth, asyncHandler(productController.getFeaturedProducts));
router.get('/filters', asyncHandler(productController.getProductFilters));
router.get('/search', asyncHandler(productController.searchProducts));
router.get('/slug/:slug', optionalAuth, asyncHandler(productController.getProductBySlug));
router.get('/:id', optionalAuth, asyncHandler(productController.getProductById));

// Admin routes
router.get('/admin/all', authenticate, requireAdmin, validate(validators.pagination), asyncHandler(productController.getAdminProducts));
router.get('/admin/:id', authenticate, requireAdmin, asyncHandler(productController.getAdminProductById));
router.post('/admin', authenticate, requireAdmin, validate(validators.createProduct), asyncHandler(productController.createProduct));
router.put('/admin/:id', authenticate, requireAdmin, validate(validators.updateProduct), asyncHandler(productController.updateProduct));
router.delete('/admin/:id', authenticate, requireAdmin, asyncHandler(productController.deleteProduct));

export default router;
