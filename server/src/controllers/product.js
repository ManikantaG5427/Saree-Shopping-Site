import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { AppError } from '../utils/errors.js';
import { successResponse, paginatedResponse } from '../utils/response.js';

export const getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const { category, subcategory, minPrice, maxPrice, fabric, occasion, search, isFeatured, inStock } = req.query;

    const filter = { isActive: true };

    if (category) filter.category = category;
    if (subcategory) filter.subcategoryId = subcategory;
    if (fabric) filter.fabric = { $regex: new RegExp(`^${fabric}$`, 'i') };
    if (occasion) filter.occasion = { $regex: new RegExp(`^${occasion}$`, 'i') };
    if (isFeatured === 'true' || isFeatured === true) filter.isFeatured = true;
    if (inStock === 'true' || inStock === true) filter.stock = { $gt: 0 };

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { fabric: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    const sortObj = {};
    sortObj[sortBy] = sortOrder;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sortObj)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    res.json(
      paginatedResponse({
        products,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      })
    );
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || !product.isActive) {
      throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
    }
    res.json(successResponse(product));
  } catch (error) {
    next(error);
  }
};

export const getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true });
    if (!product) {
      throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
    }
    res.json(successResponse(product));
  } catch (error) {
    next(error);
  }
};

export const getFeaturedProducts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    const products = await Product.find({ isActive: true, isFeatured: true }).limit(limit).lean();
    res.json(successResponse(products));
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, categoryId } = req.body;
    if (!name || !description || price === undefined || !categoryId) {
      throw new AppError('Name, description, price, and categoryId are required', 400, 'MISSING_FIELDS');
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const sku = req.body.sku || `SKU-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const product = await Product.create({
      ...req.body,
      slug,
      sku,
    });

    res.status(201).json(successResponse(product, 'Product created successfully'));
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) {
      throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
    }
    res.json(successResponse(product, 'Product updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
    }
    res.json(successResponse(null, 'Product deleted successfully'));
  } catch (error) {
    next(error);
  }
};

export const getAdminProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const [products, total] = await Promise.all([
      Product.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Product.countDocuments(),
    ]);

    res.json(
      paginatedResponse({
        products,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      })
    );
  } catch (error) {
    next(error);
  }
};

export const getAdminProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
    }
    res.json(successResponse(product));
  } catch (error) {
    next(error);
  }
};

export const searchProducts = async (req, res, next) => {
  try {
    const query = req.query.q || '';
    if (!query || query.length < 2) {
      return res.json(paginatedResponse({ products: [], page: 1, limit: 10, total: 0 }));
    }

    const products = await Product.find({
      isActive: true,
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { fabric: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } },
      ],
    }).limit(20);

    res.json(successResponse(products));
  } catch (error) {
    next(error);
  }
};

export const getProductFilters = async (req, res, next) => {
  try {
    const [fabrics, occasions] = await Promise.all([
      Product.distinct('fabric', { isActive: true, fabric: { $ne: null } }),
      Product.distinct('occasion', { isActive: true, occasion: { $ne: null } }),
    ]);

    res.json(
      successResponse({
        fabrics: fabrics.filter(Boolean),
        occasions: occasions.filter(Boolean),
      })
    );
  } catch (error) {
    next(error);
  }
};
