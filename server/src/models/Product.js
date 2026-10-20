import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    shortDesc: { type: String },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    sku: { type: String, required: true, unique: true },
    stock: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 5 },
    weight: { type: Number },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    soldCount: { type: Number, default: 0 },
    fabric: { type: String },
    occasion: { type: String },
    work: { type: String },
    color: { type: String },
    category: { type: String },
    categoryId: { type: String },
    subcategoryId: { type: String },
    images: [{ type: String }],
    variants: [
      {
        name: { type: String },
        value: { type: String },
        sku: { type: String },
        price: { type: Number },
        stock: { type: Number, default: 0 },
      },
    ],
    tags: [{ type: String }],
  },
  { timestamps: true }
);

ProductSchema.statics.searchProducts = function (query) {
  return this.find({
    isActive: true,
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { tags: { $regex: query, $options: 'i' } },
    ],
  });
};

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
