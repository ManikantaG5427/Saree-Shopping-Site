import Review from '../models/Review.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { AppError } from '../utils/errors.js';
import { successResponse, paginatedResponse } from '../utils/response.js';

export const getProductReviews = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const { productId } = req.params;

    const [reviews, total] = await Promise.all([
      Review.find({ productId, isVisible: true })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Review.countDocuments({ productId, isVisible: true }),
    ]);

    // Populate user names
    const populated = await Promise.all(
      reviews.map(async (r) => {
        const user = await User.findById(r.userId).select('name').lean();
        return {
          ...r,
          user: { name: user?.name || 'Verified Patron' },
        };
      })
    );

    res.json(paginatedResponse({ reviews: populated, page, limit, total, totalPages: Math.ceil(total / limit) }));
  } catch (error) {
    next(error);
  }
};

export const createReview = async (req, res, next) => {
  try {
    const { rating, title, comment } = req.body;
    const { productId } = req.params;

    const review = await Review.create({
      rating,
      title,
      comment,
      userId: req.user.id,
      productId,
      isVerified: true,
      isVisible: true,
    });

    // Update product rating and review count
    const stats = await Review.aggregate([
      { $match: { productId, isVisible: true } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);

    if (stats.length) {
      await Product.findByIdAndUpdate(productId, {
        rating: Math.round(stats[0].avgRating * 10) / 10,
        reviewCount: stats[0].count,
      });
    }

    res.status(201).json(successResponse(review, 'Review published successfully'));
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const review = await Review.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!review) throw new AppError('Review not found or unauthorized', 404, 'NOT_FOUND');
    res.json(successResponse(review, 'Review updated'));
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!review) throw new AppError('Review not found or unauthorized', 404, 'NOT_FOUND');
    res.json(successResponse(null, 'Review deleted'));
  } catch (error) {
    next(error);
  }
};

export const getAdminReviews = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);

    const [reviews, total] = await Promise.all([
      Review.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Review.countDocuments(),
    ]);

    res.json(paginatedResponse({ reviews, page, limit, total, totalPages: Math.ceil(total / limit) }));
  } catch (error) {
    next(error);
  }
};

export const adminModerateReview = async (req, res, next) => {
  try {
    const { isVisible } = req.body;
    const review = await Review.findByIdAndUpdate(req.params.id, { isVisible }, { new: true });
    if (!review) throw new AppError('Review not found', 404, 'NOT_FOUND');
    res.json(successResponse(review, 'Review moderation updated'));
  } catch (error) {
    next(error);
  }
};
