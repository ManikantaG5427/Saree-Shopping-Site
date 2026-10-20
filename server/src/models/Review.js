import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema(
  {
    rating: { type: Number, min: 1, max: 5, required: true },
    title: { type: String },
    comment: { type: String },
    isVerified: { type: Boolean, default: false },
    isVisible: { type: Boolean, default: true },
    userId: { type: String, required: true },
    productId: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);
