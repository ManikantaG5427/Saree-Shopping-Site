import Category from '../models/Category.js';
import Subcategory from '../models/Subcategory.js';
import Product from '../models/Product.js';
import { AppError } from '../utils/errors.js';
import { successResponse, paginatedResponse } from '../utils/response.js';

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1 }).lean();
    const formattedCategories = await Promise.all(
      categories.map(async (cat) => {
        const [subcategories, productCount] = await Promise.all([
          Subcategory.find({ categoryId: cat._id.toString(), isActive: true }).sort({ sortOrder: 1 }).lean(),
          Product.countDocuments({ categoryId: cat._id.toString(), isActive: true }),
        ]);
        return {
          ...cat,
          id: cat._id,
          productCount,
          subcategories,
        };
      })
    );
    res.json(successResponse(formattedCategories));
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id).lean();
    if (!category) {
      throw new AppError('Category not found', 404, 'CATEGORY_NOT_FOUND');
    }
    const subcategories = await Subcategory.find({ categoryId: category._id.toString(), isActive: true }).sort({ sortOrder: 1 });
    res.json(successResponse({ ...category, id: category._id, subcategories }));
  } catch (error) {
    next(error);
  }
};

export const getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug }).lean();
    if (!category) {
      throw new AppError('Category not found', 404, 'CATEGORY_NOT_FOUND');
    }
    const subcategories = await Subcategory.find({ categoryId: category._id.toString(), isActive: true }).sort({ sortOrder: 1 });
    res.json(successResponse({ ...category, id: category._id, subcategories }));
  } catch (error) {
    next(error);
  }
};

export const getSubcategoryBySlug = async (req, res, next) => {
  try {
    const subcategory = await Subcategory.findOne({ slug: req.params.slug }).lean();
    if (!subcategory) {
      throw new AppError('Subcategory not found', 404, 'SUBCATEGORY_NOT_FOUND');
    }
    res.json(successResponse({ ...subcategory, id: subcategory._id }));
  } catch (error) {
    next(error);
  }
};

export const getAdminCategories = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const [categories, total] = await Promise.all([
      Category.find().sort({ sortOrder: 1 }).skip((page - 1) * limit).limit(limit).lean(),
      Category.countDocuments(),
    ]);
    res.json(paginatedResponse({ categories, page, limit, total, totalPages: Math.ceil(total / limit) }));
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(successResponse(category, 'Category created successfully'));
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) throw new AppError('Category not found', 404, 'CATEGORY_NOT_FOUND');
    res.json(successResponse(category, 'Category updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) throw new AppError('Category not found', 404, 'CATEGORY_NOT_FOUND');
    res.json(successResponse(null, 'Category deleted successfully'));
  } catch (error) {
    next(error);
  }
};

export const reorderCategories = async (req, res, next) => {
  try {
    const { items } = req.body;
    if (Array.isArray(items)) {
      await Promise.all(
        items.map((item, index) =>
          Category.findByIdAndUpdate(item.id || item._id, { sortOrder: index })
        )
      );
    }
    res.json(successResponse(null, 'Categories reordered successfully'));
  } catch (error) {
    next(error);
  }
};

export const createSubcategory = async (req, res, next) => {
  try {
    const subcategory = await Subcategory.create(req.body);
    res.status(201).json(successResponse(subcategory, 'Subcategory created successfully'));
  } catch (error) {
    next(error);
  }
};

export const updateSubcategory = async (req, res, next) => {
  try {
    const subcategory = await Subcategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!subcategory) throw new AppError('Subcategory not found', 404, 'SUBCATEGORY_NOT_FOUND');
    res.json(successResponse(subcategory, 'Subcategory updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const deleteSubcategory = async (req, res, next) => {
  try {
    const subcategory = await Subcategory.findByIdAndDelete(req.params.id);
    if (!subcategory) throw new AppError('Subcategory not found', 404, 'SUBCATEGORY_NOT_FOUND');
    res.json(successResponse(null, 'Subcategory deleted successfully'));
  } catch (error) {
    next(error);
  }
};
