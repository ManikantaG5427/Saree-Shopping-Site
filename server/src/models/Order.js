import mongoose from 'mongoose';
import { OrderItemSchema } from './OrderItem.js';

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'], 
      default: 'pending' 
    },
    paymentStatus: { 
      type: String, 
      enum: ['pending', 'paid', 'failed', 'refunded'], 
      default: 'pending' 
    },
    paymentId: { type: String },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    subtotal: { type: Number, required: true },
    shipping: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    notes: { type: String },
    trackingNumber: { type: String },
    shippedAt: { type: Date },
    deliveredAt: { type: Date },
    cancelledAt: { type: Date },
    cancelReason: { type: String },
    items: [OrderItemSchema],
    shippingAddress: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      country: { type: String, default: 'India' },
    },
  },
  { timestamps: true }
);

OrderSchema.statics.findByUser = function (userId) {
  return this.find({ userId }).sort({ createdAt: -1 });
};

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
