import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { successResponse } from '../utils/response.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const [totalRevenueResult, totalOrders, totalProducts, totalCustomers] = await Promise.all([
      Order.aggregate([
        { $match: { status: { $ne: 'CANCELLED' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Order.countDocuments(),
      Product.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'CUSTOMER' }),
    ]);

    const totalRevenue = totalRevenueResult[0]?.total || 0;

    res.json(
      successResponse({
        totalRevenue,
        totalOrders,
        totalProducts,
        totalCustomers,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const getSalesAnalytics = async (req, res, next) => {
  try {
    const salesByMonth = await Order.aggregate([
      { $match: { status: { $ne: 'CANCELLED' } } },
      {
        $group: {
          _id: { $month: '$createdAt' },
          totalSales: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { '_id': 1 } },
    ]);
    res.json(successResponse(salesByMonth));
  } catch (error) {
    next(error);
  }
};

export const getCustomerAnalytics = async (req, res, next) => {
  try {
    const totalCustomers = await User.countDocuments({ role: 'CUSTOMER' });
    const recentSignups = await User.find({ role: 'CUSTOMER' }).sort({ createdAt: -1 }).limit(10).select('-password');
    res.json(successResponse({ totalCustomers, recentSignups }));
  } catch (error) {
    next(error);
  }
};

export const getProductAnalytics = async (req, res, next) => {
  try {
    const topProducts = await Product.find({ isActive: true }).sort({ soldCount: -1 }).limit(5).lean();
    const lowStockProducts = await Product.find({ isActive: true, stock: { $lte: 5 } }).limit(10).lean();
    res.json(successResponse({ topProducts, lowStockProducts }));
  } catch (error) {
    next(error);
  }
};
