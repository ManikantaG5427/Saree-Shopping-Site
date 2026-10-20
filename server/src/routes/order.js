import { Router } from 'express';
import { validate } from '../middleware/validation.js';
import { validators } from '../validators/index.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as orderController from '../controllers/order.js';

const router = Router();

// Customer routes
router.get('/', authenticate, validate(validators.pagination), asyncHandler(orderController.getOrders));
router.get('/stats', authenticate, asyncHandler(orderController.getOrderStats));
router.get('/:id', authenticate, asyncHandler(orderController.getOrderById));
router.post('/', authenticate, validate(validators.createOrder), asyncHandler(orderController.createOrder));
router.post('/verify-payment', authenticate, asyncHandler(orderController.verifyPayment));
router.post('/:id/cancel', authenticate, asyncHandler(orderController.cancelOrder));

// 7-day buyer inspection & return assurance routes
router.post('/returns', authenticate, validate(validators.createReturn), asyncHandler(orderController.createReturnRequest));
router.get('/returns', authenticate, validate(validators.pagination), asyncHandler(orderController.getReturnRequests));
router.post('/returns/:id/cancel', authenticate, asyncHandler(orderController.cancelReturnRequest));

// Admin routes
router.get('/admin/all', authenticate, requireAdmin, validate(validators.pagination), asyncHandler(orderController.getAdminOrders));
router.get('/admin/:id', authenticate, requireAdmin, asyncHandler(orderController.getAdminOrderById));
router.put('/admin/:id/status', authenticate, requireAdmin, asyncHandler(orderController.updateOrderStatus));
router.put('/admin/:id/payment-status', authenticate, requireAdmin, asyncHandler(orderController.updatePaymentStatus));

export default router;
