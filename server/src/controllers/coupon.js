import Coupon from '../models/Coupon.js';
import CouponUsage from '../models/CouponUsage.js';
import { AppError } from '../utils/errors.js';
import { successResponse, paginatedResponse } from '../utils/response.js';

export const validateCoupon = async (req, res, next) => {
  try {
    const { code, cartAmount } = req.body;
    const coupon = await Coupon.findOne({
      code: code.toUpperCase().trim(),
      isActive: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() },
    });

    if (!coupon) {
      throw new AppError('Invalid or expired coupon code', 400, 'INVALID_COUPON');
    }

    if (coupon.minAmount && cartAmount < coupon.minAmount) {
      throw new AppError(`Minimum order amount of ₹${coupon.minAmount} required for this coupon`, 400, 'MIN_AMOUNT_NOT_MET');
    }

    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = (cartAmount * coupon.value) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.value;
    }

    res.json(
      successResponse({
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discount,
        description: coupon.description,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const getAdminCoupons = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);

    const [coupons, total] = await Promise.all([
      Coupon.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Coupon.countDocuments(),
    ]);

    res.json(paginatedResponse({ coupons, page, limit, total, totalPages: Math.ceil(total / limit) }));
  } catch (error) {
    next(error);
  }
};

export const getCouponById = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) throw new AppError('Coupon not found', 404, 'NOT_FOUND');
    res.json(successResponse(coupon));
  } catch (error) {
    next(error);
  }
};

export const getCouponStats = async (req, res, next) => {
  try {
    const usageCount = await CouponUsage.countDocuments({ couponId: req.params.id });
    res.json(successResponse({ usageCount }));
  } catch (error) {
    next(error);
  }
};

export const createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create({
      ...req.body,
      code: req.body.code.toUpperCase().trim(),
    });
    res.status(201).json(successResponse(coupon, 'Coupon created successfully'));
  } catch (error) {
    next(error);
  }
};

export const updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!coupon) throw new AppError('Coupon not found', 404, 'NOT_FOUND');
    res.json(successResponse(coupon, 'Coupon updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) throw new AppError('Coupon not found', 404, 'NOT_FOUND');
    res.json(successResponse(null, 'Coupon deleted successfully'));
  } catch (error) {
    next(error);
  }
};
