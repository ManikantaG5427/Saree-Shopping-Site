import { Router } from 'express';
import { validate } from '../middleware/validation.js';
import { validators } from '../validators/index.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as cartController from '../controllers/cart.js';

const router = Router();

router.get('/', authenticate, asyncHandler(cartController.getCart));
router.get('/count', authenticate, asyncHandler(cartController.getCartCount));
router.post('/', authenticate, validate(validators.addToCart), asyncHandler(cartController.addToCart));
router.put('/:id', authenticate, validate(validators.updateCart), asyncHandler(cartController.updateCartItem));
router.delete('/:id', authenticate, asyncHandler(cartController.removeFromCart));
router.delete('/', authenticate, asyncHandler(cartController.clearCart));
router.get('/check/:productId', authenticate, asyncHandler(cartController.checkProductInCart));

export default router;
