import Order from '../models/Order.js';
import OrderItem from '../models/OrderItem.js';
import ReturnRequest from '../models/ReturnRequest.js';
import Product from '../models/Product.js';
import { AppError } from '../utils/errors.js';
import { successResponse, paginatedResponse } from '../utils/response.js';
import { razorpayService } from '../services/razorpay.js';
import { emailService } from '../services/email.js';

export const getOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);

    const [orders, total] = await Promise.all([
      Order.find({ userId: req.user.id })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('items')
        .lean(),
      Order.countDocuments({ userId: req.user.id }),
    ]);

    res.json(paginatedResponse({ orders, page, limit, total, totalPages: Math.ceil(total / limit) }));
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.id })
      .populate('items')
      .lean();
    if (!order) {
      throw new AppError('Order not found', 404, 'ORDER_NOT_FOUND');
    }
    res.json(successResponse(order));
  } catch (error) {
    next(error);
  }
};

export const getOrderStats = async (req, res, next) => {
  try {
    const [totalOrders, completedOrders, pendingOrders] = await Promise.all([
      Order.countDocuments({ userId: req.user.id }),
      Order.countDocuments({ userId: req.user.id, status: 'DELIVERED' }),
      Order.countDocuments({ userId: req.user.id, status: { $in: ['PENDING', 'PROCESSING', 'SHIPPED'] } }),
    ]);
    res.json(successResponse({ totalOrders, completedOrders, pendingOrders }));
  } catch (error) {
    next(error);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod, notes } = req.body;
    if (!items || !items.length) {
      throw new AppError('Cart items are required', 400, 'NO_ITEMS');
    }

    let subtotal = 0;
    const createdItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId || item.product?.id || item.product?._id);
      if (!product) throw new AppError('Product not found in cart', 404, 'PRODUCT_NOT_FOUND');

      const price = product.price;
      const quantity = item.quantity || 1;
      subtotal += price * quantity;

      const orderItem = await OrderItem.create({
        productId: product._id.toString(),
        name: product.name,
        price,
        quantity,
        total: price * quantity,
        image: product.images?.[0] || '',
      });
      createdItems.push(orderItem);
    }

    const shippingCharge = subtotal > 2999 ? 0 : 150;
    const totalAmount = subtotal + shippingCharge;
    const orderNumber = `SLSH-${Date.now().toString().slice(-6)}`;

    let razorpayOrderId = null;
    if (paymentMethod === 'razorpay') {
      try {
        const rzOrder = await razorpayService.createOrder({
          amount: Math.round(totalAmount * 100),
          currency: 'INR',
          receipt: orderNumber,
        });
        razorpayOrderId = rzOrder.id;
      } catch (err) {
        console.warn('Razorpay order creation fallback:', err.message);
      }
    }

    const order = await Order.create({
      orderNumber,
      userId: req.user.id,
      items: createdItems.map((i) => i._id),
      subtotal,
      shippingCharge,
      totalAmount,
      shippingAddress: shippingAddress || {
        fullName: req.user.name || 'Valued Patron',
        addressLine: 'Default Registered Address',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500001',
      },
      paymentMethod: paymentMethod || 'cod',
      paymentStatus: paymentMethod === 'cod' ? 'PENDING' : 'PENDING',
      razorpayOrderId,
      notes,
    });

    res.status(201).json(
      successResponse(
        {
          order,
          razorpayOrderId,
        },
        'Order placed successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;
    const isValid = await razorpayService.verifyPayment({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    if (!isValid) {
      throw new AppError('Payment verification failed', 400, 'PAYMENT_VERIFICATION_FAILED');
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus: 'PAID',
        razorpayPaymentId,
        razorpaySignature,
        status: 'PROCESSING',
      },
      { new: true }
    );

    res.json(successResponse(order, 'Payment verified successfully'));
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.id });
    if (!order) throw new AppError('Order not found', 404, 'ORDER_NOT_FOUND');
    if (order.status !== 'PENDING' && order.status !== 'PROCESSING') {
      throw new AppError('Order cannot be cancelled at this stage', 400, 'CANNOT_CANCEL');
    }

    order.status = 'CANCELLED';
    await order.save();

    res.json(successResponse(order, 'Order cancelled successfully'));
  } catch (error) {
    next(error);
  }
};

export const createReturnRequest = async (req, res, next) => {
  try {
    const { orderId, productId, reason, comments, evidenceImages } = req.body;
    const order = await Order.findOne({ _id: orderId, userId: req.user.id });
    if (!order) throw new AppError('Order not found', 404, 'ORDER_NOT_FOUND');

    const returnRequest = await ReturnRequest.create({
      orderId,
      userId: req.user.id,
      productId,
      reason,
      comments,
      evidenceImages: evidenceImages || [],
      status: 'PENDING',
    });

    res.status(201).json(successResponse(returnRequest, 'Inspection & Return request submitted under 7-day assurance'));
  } catch (error) {
    next(error);
  }
};

export const getReturnRequests = async (req, res, next) => {
  try {
    const requests = await ReturnRequest.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(successResponse(requests));
  } catch (error) {
    next(error);
  }
};

export const cancelReturnRequest = async (req, res, next) => {
  try {
    const request = await ReturnRequest.findOne({ _id: req.params.id, userId: req.user.id });
    if (!request) throw new AppError('Return request not found', 404, 'NOT_FOUND');
    request.status = 'REJECTED';
    await request.save();
    res.json(successResponse(request, 'Return request withdrawn'));
  } catch (error) {
    next(error);
  }
};

export const getAdminOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const [orders, total] = await Promise.all([
      Order.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).populate('items').lean(),
      Order.countDocuments(),
    ]);
    res.json(paginatedResponse({ orders, page, limit, total, totalPages: Math.ceil(total / limit) }));
  } catch (error) {
    next(error);
  }
};

export const getAdminOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('items').lean();
    if (!order) throw new AppError('Order not found', 404, 'ORDER_NOT_FOUND');
    res.json(successResponse(order));
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, trackingNumber, courierName } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, trackingNumber, courierName },
      { new: true }
    );
    if (!order) throw new AppError('Order not found', 404, 'ORDER_NOT_FOUND');
    res.json(successResponse(order, 'Order status updated'));
  } catch (error) {
    next(error);
  }
};

export const updatePaymentStatus = async (req, res, next) => {
  try {
    const { paymentStatus } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { paymentStatus }, { new: true });
    if (!order) throw new AppError('Order not found', 404, 'ORDER_NOT_FOUND');
    res.json(successResponse(order, 'Payment status updated'));
  } catch (error) {
    next(error);
  }
};
