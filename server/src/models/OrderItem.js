import mongoose from 'mongoose';

export const OrderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  productName: { type: String, required: true },
  productSku: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  total: { type: Number, required: true },
  image: { type: String },
});

export default mongoose.models.OrderItem || mongoose.model('OrderItem', OrderItemSchema);
