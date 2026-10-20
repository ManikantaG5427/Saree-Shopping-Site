import Banner from '../models/Banner.js';
import { AppError } from '../utils/errors.js';
import { successResponse, paginatedResponse } from '../utils/response.js';

export const getBanners = async (req, res, next) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ position: 1 }).lean();
    res.json(successResponse(banners));
  } catch (error) {
    next(error);
  }
};

export const getAdminBanners = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);

    const [banners, total] = await Promise.all([
      Banner.find().sort({ position: 1 }).skip((page - 1) * limit).limit(limit).lean(),
      Banner.countDocuments(),
    ]);

    res.json(paginatedResponse({ banners, page, limit, total, totalPages: Math.ceil(total / limit) }));
  } catch (error) {
    next(error);
  }
};

export const getBannerById = async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) throw new AppError('Banner not found', 404, 'NOT_FOUND');
    res.json(successResponse(banner));
  } catch (error) {
    next(error);
  }
};

export const createBanner = async (req, res, next) => {
  try {
    const banner = await Banner.create(req.body);
    res.status(201).json(successResponse(banner, 'Banner created successfully'));
  } catch (error) {
    next(error);
  }
};

export const updateBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!banner) throw new AppError('Banner not found', 404, 'NOT_FOUND');
    res.json(successResponse(banner, 'Banner updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const deleteBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) throw new AppError('Banner not found', 404, 'NOT_FOUND');
    res.json(successResponse(null, 'Banner deleted successfully'));
  } catch (error) {
    next(error);
  }
};

export const reorderBanners = async (req, res, next) => {
  try {
    const { items } = req.body;
    if (Array.isArray(items)) {
      await Promise.all(
        items.map((item, index) => Banner.findByIdAndUpdate(item.id || item._id, { position: index }))
      );
    }
    res.json(successResponse(null, 'Banners reordered'));
  } catch (error) {
    next(error);
  }
};
