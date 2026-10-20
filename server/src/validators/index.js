import { body, query, param } from 'express-validator';

export const validators = {
  // Auth validators
  register: [
    body('name')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('phone')
      .matches(/^[6-9]\d{9}$/)
      .withMessage('Please provide a valid 10-digit Indian phone number'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('confirmPassword')
      .custom((value, { req }) => value === req.body.password)
      .withMessage('Passwords do not match'),
  ],

  login: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
  ],

  refreshToken: [
    body('refreshToken')
      .notEmpty()
      .withMessage('Refresh token is required'),
  ],

  forgotPassword: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
  ],

  resetPassword: [
    body('token')
      .notEmpty()
      .withMessage('Reset token is required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('confirmPassword')
      .custom((value, { req }) => value === req.body.password)
      .withMessage('Passwords do not match'),
  ],

  changePassword: [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('confirmPassword')
      .custom((value, { req }) => value === req.body.newPassword)
      .withMessage('Passwords do not match'),
  ],

  // User profile validators
  updateProfile: [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    body('phone')
      .optional()
      .matches(/^[6-9]\d{9}$/)
      .withMessage('Please provide a valid 10-digit Indian phone number'),
  ],

  // Address validators
  address: [
    body('name')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    body('phone')
      .matches(/^[6-9]\d{9}$/)
      .withMessage('Please provide a valid 10-digit Indian phone number'),
    body('addressLine1')
      .trim()
      .isLength({ min: 5, max: 200 })
      .withMessage('Address line 1 must be between 5 and 200 characters'),
    body('addressLine2')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Address line 2 must be less than 200 characters'),
    body('city')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('City must be between 2 and 100 characters'),
    body('state')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('State must be between 2 and 100 characters'),
    body('pincode')
      .matches(/^\d{6}$/)
      .withMessage('Please provide a valid 6-digit pincode'),
    body('country')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Country must be between 2 and 100 characters'),
    body('type')
      .optional()
      .isIn(['home', 'office', 'other'])
      .withMessage('Address type must be home, office, or other'),
    body('isDefault')
      .optional()
      .isBoolean()
      .withMessage('isDefault must be a boolean'),
  ],

  // Product validators
  createProduct: [
    body('name')
      .trim()
      .isLength({ min: 3, max: 200 })
      .withMessage('Product name must be between 3 and 200 characters'),
    body('description')
      .trim()
      .isLength({ min: 20, max: 5000 })
      .withMessage('Description must be between 20 and 5000 characters'),
    body('shortDesc')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Short description must be less than 500 characters'),
    body('price')
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    body('originalPrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Original price must be a positive number'),
    body('categoryId')
      .notEmpty()
      .withMessage('Category is required'),
    body('subcategoryId')
      .optional()
      .isString()
      .withMessage('Invalid subcategory'),
    body('stock')
      .isInt({ min: 0 })
      .withMessage('Stock must be a non-negative integer'),
    body('lowStockThreshold')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Low stock threshold must be at least 1'),
    body('weight')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Weight must be a positive number'),
    body('fabric')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Fabric must be less than 100 characters'),
    body('occasion')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Occasion must be less than 100 characters'),
    body('work')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Work must be less than 100 characters'),
    body('color')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('Color must be less than 50 characters'),
    body('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array'),
    body('tags.*')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('Each tag must be less than 50 characters'),
    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be a boolean'),
    body('isFeatured')
      .optional()
      .isBoolean()
      .withMessage('isFeatured must be a boolean'),
  ],

  updateProduct: [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 3, max: 200 })
      .withMessage('Product name must be between 3 and 200 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ min: 20, max: 5000 })
      .withMessage('Description must be between 20 and 5000 characters'),
    body('price')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    body('originalPrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Original price must be a positive number'),
    body('stock')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Stock must be a non-negative integer'),
  ],

  // Category validators
  createCategory: [
    body('name')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Category name must be between 2 and 100 characters'),
    body('slug')
      .trim()
      .isLength({ min: 2, max: 100 })
      .matches(/^[a-z0-9-]+$/)
      .withMessage('Slug must contain only lowercase letters, numbers, and hyphens'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description must be less than 1000 characters'),
    body('image')
      .isURL()
      .withMessage('Image must be a valid URL'),
    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be a boolean'),
    body('sortOrder')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Sort order must be a non-negative integer'),
  ],

  // Order validators
  createOrder: [
    body('shippingAddressId')
      .notEmpty()
      .withMessage('Shipping address is required'),
    body('billingAddressId')
      .optional()
      .isString()
      .withMessage('Invalid billing address'),
    body('paymentMethod')
      .isIn(['razorpay', 'cod'])
      .withMessage('Invalid payment method'),
    body('couponCode')
      .optional()
      .trim()
      .isLength({ min: 3, max: 50 })
      .withMessage('Coupon code must be between 3 and 50 characters'),
    body('notes')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Notes must be less than 1000 characters'),
  ],

  // Cart validators
  addToCart: [
    body('productId')
      .notEmpty()
      .withMessage('Product ID is required'),
    body('quantity')
      .optional()
      .isInt({ min: 1, max: 99 })
      .withMessage('Quantity must be between 1 and 99'),
    body('variantId')
      .optional()
      .isString()
      .withMessage('Invalid variant ID'),
  ],

  updateCart: [
    body('quantity')
      .isInt({ min: 1, max: 99 })
      .withMessage('Quantity must be between 1 and 99'),
  ],

  // Return validators
  createReturn: [
    body('orderId')
      .notEmpty()
      .withMessage('Order ID is required'),
    body('productId')
      .notEmpty()
      .withMessage('Product ID is required'),
    body('reason')
      .isIn(['wrong_item', 'damaged', 'not_as_described', 'size_issue', 'changed_mind', 'better_price', 'other'])
      .withMessage('Invalid return reason'),
    body('details')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Details must be less than 1000 characters'),
  ],

  // Review validators
  createReview: [
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),
    body('title')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Title must be less than 200 characters'),
    body('comment')
      .optional()
      .trim()
      .isLength({ max: 2000 })
      .withMessage('Comment must be less than 2000 characters'),
  ],

  // Query validators
  pagination: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer')
      .toInt(),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100')
      .toInt(),
    query('sortBy')
      .optional()
      .isString()
      .withMessage('Sort by must be a string'),
    query('sortOrder')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('Sort order must be asc or desc'),
  ],

  productFilters: [
    query('category')
      .optional()
      .isString()
      .withMessage('Category must be a string'),
    query('subcategory')
      .optional()
      .isString()
      .withMessage('Subcategory must be a string'),
    query('minPrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Min price must be a positive number')
      .toFloat(),
    query('maxPrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Max price must be a positive number')
      .toFloat(),
    query('fabric')
      .optional()
      .isString()
      .withMessage('Fabric must be a string'),
    query('occasion')
      .optional()
      .isString()
      .withMessage('Occasion must be a string'),
    query('search')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Search query must be between 1 and 100 characters'),
    query('isFeatured')
      .optional()
      .isBoolean()
      .withMessage('isFeatured must be a boolean')
      .toBoolean(),
    query('inStock')
      .optional()
      .isBoolean()
      .withMessage('inStock must be a boolean')
      .toBoolean(),
  ],

  // ID param validator
  idParam: [
    param('id')
      .notEmpty()
      .withMessage('ID is required'),
  ],

  // Coupon validators
  createCoupon: [
    body('code')
      .trim()
      .isLength({ min: 3, max: 50 })
      .matches(/^[A-Z0-9]+$/)
      .withMessage('Coupon code must be uppercase alphanumeric, 3-50 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description must be less than 500 characters'),
    body('type')
      .isIn(['percentage', 'fixed'])
      .withMessage('Type must be percentage or fixed'),
    body('value')
      .isFloat({ min: 0 })
      .withMessage('Value must be a positive number'),
    body('minAmount')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Minimum amount must be a positive number'),
    body('maxDiscount')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Maximum discount must be a positive number'),
    body('usageLimit')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Usage limit must be at least 1'),
    body('userLimit')
      .optional()
      .isInt({ min: 1 })
      .withMessage('User limit must be at least 1'),
    body('startDate')
      .isISO8601()
      .withMessage('Start date must be a valid ISO date'),
    body('endDate')
      .isISO8601()
      .withMessage('End date must be a valid ISO date'),
    body('applicableCategories')
      .optional()
      .isArray()
      .withMessage('Applicable categories must be an array'),
    body('applicableProducts')
      .optional()
      .isArray()
      .withMessage('Applicable products must be an array'),
  ],

  // Banner validators
  createBanner: [
    body('title')
      .trim()
      .isLength({ min: 3, max: 200 })
      .withMessage('Title must be between 3 and 200 characters'),
    body('subtitle')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Subtitle must be less than 500 characters'),
    body('image')
      .isURL()
      .withMessage('Image must be a valid URL'),
    body('link')
      .optional()
      .isURL()
      .withMessage('Link must be a valid URL'),
    body('position')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Position must be a non-negative integer'),
    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be a boolean'),
    body('startDate')
      .optional()
      .isISO8601()
      .withMessage('Start date must be a valid ISO date'),
    body('endDate')
      .optional()
      .isISO8601()
      .withMessage('End date must be a valid ISO date'),
  ],
};
