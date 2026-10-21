/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {number} price
 * @property {number} [originalPrice]
 * @property {string[]} images
 * @property {string} category
 * @property {string} [subcategory]
 * @property {number} stock
 * @property {boolean} isActive
 * @property {boolean} [isFeatured]
 * @property {number} rating
 * @property {number} reviewCount
 * @property {string[]} tags
 * @property {string} [fabric]
 * @property {string} [occasion]
 * @property {string} [work]
 * @property {string} [color]
 * @property {string} [badge]
 * @property {string} [subtitle]
 * @property {string} createdAt
 */

/**
 * @typedef {Object} Category
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {string} [subtitle]
 * @property {string} image
 * @property {number} productCount
 * @property {boolean} isActive
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {'customer' | 'admin'} role
 * @property {Array} addresses
 * @property {string} createdAt
 */

export const RoleTypes = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
};

export const OrderStatus = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

export const PaymentStatus = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};
