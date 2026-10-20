import mongoose from 'mongoose';

const CouponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    description: { type: String },
    type: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
    value: { type: Number, required: true },
    minAmount: { type: Number },
    maxDiscount: { type: Number },
    usageLimit: { type: Number },
    usedCount: { type: Number, default: 0 },
    userLimit: { type: Number, default: 1 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    applicableCategories: [{ type: String, default: [] }],
    applicableProducts: [{ type: String, default: [] }],
  },
  { timestamps: true }
);

export default mongoose.model('Coupon', CouponSchema);
