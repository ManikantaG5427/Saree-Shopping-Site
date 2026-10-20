import User from '../models/User.js';
import Product from '../models/Product.js';
import { AppError } from '../utils/errors.js';
import { successResponse } from '../utils/response.js';

export const getCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.productId').lean();
    if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');

    const items = (user.cart || [])
      .filter((item) => item.productId)
      .map((item) => {
        const prod = item.productId;
        const unitPrice = prod.price || 0;
        const quantity = item.quantity || 1;
        return {
          id: item._id,
          productId: prod._id,
          product: {
            id: prod._id,
            name: prod.name,
            slug: prod.slug,
            price: prod.price,
            originalPrice: prod.originalPrice,
            image: prod.images?.[0] || '',
            images: prod.images || [],
            fabric: prod.fabric,
            stock: prod.stock,
          },
          quantity,
          unitPrice,
          totalPrice: unitPrice * quantity,
        };
      });

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const shipping = subtotal >= 2999 ? 0 : 150;
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + shipping + tax;

    res.json(
      successResponse({
        items,
        summary: {
          itemCount,
          subtotal,
          shipping,
          tax,
          total,
        },
      })
    );
  } catch (error) {
    next(error);
  }
};

export const getCartCount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).lean();
    const count = (user?.cart || []).reduce((sum, item) => sum + (item.quantity || 1), 0);
    res.json(successResponse({ count }));
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      throw new AppError('Product not found or unavailable', 404, 'PRODUCT_NOT_FOUND');
    }

    const user = await User.findById(req.user.id);
    if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');

    const existingIndex = user.cart.findIndex(
      (item) => item.productId && item.productId.toString() === productId
    );

    if (existingIndex > -1) {
      user.cart[existingIndex].quantity += quantity;
    } else {
      user.cart.push({ productId, quantity });
    }

    await user.save();
    res.json(successResponse(user.cart, 'Product added to shopping bag'));
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');

    const item = user.cart.id(req.params.id);
    if (!item) throw new AppError('Cart item not found', 404, 'NOT_FOUND');

    if (quantity <= 0) {
      item.deleteOne();
    } else {
      item.quantity = quantity;
    }

    await user.save();
    res.json(successResponse(user.cart, 'Shopping bag updated'));
  } catch (error) {
    next(error);
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');

    user.cart.pull(req.params.id);
    await user.save();

    res.json(successResponse(user.cart, 'Item removed from bag'));
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { $set: { cart: [] } });
    res.json(successResponse(null, 'Shopping bag cleared'));
  } catch (error) {
    next(error);
  }
};

export const checkProductInCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).lean();
    const inCart = (user?.cart || []).some(
      (item) => item.productId && item.productId.toString() === req.params.productId
    );
    res.json(successResponse({ inCart }));
  } catch (error) {
    next(error);
  }
};
