import mongoose from 'mongoose';

const CouponUsageSchema = new mongoose.Schema(
  {
    couponId: { type: String, required: true },
    userId: { type: String, required: true },
    orderId: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('CouponUsage', CouponUsageSchema);
