import mongoose from 'mongoose';

const ReturnRequestSchema = new mongoose.Schema(
  {
    reason: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['requested', 'approved', 'rejected', 'received', 'refunded'], 
      default: 'requested' 
    },
    images: { type: [String], default: [] },
    adminNotes: { type: String },
    userId: { type: String, required: true },
    orderId: { type: String, required: true },
    productId: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.ReturnRequest || mongoose.model('ReturnRequest', ReturnRequestSchema);
