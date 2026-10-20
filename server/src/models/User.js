import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, enum: ['CUSTOMER', 'ADMIN'], default: 'CUSTOMER' },
    emailVerified: { type: Boolean, default: false },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
    notifications: { type: Boolean, default: true },
    cart: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1 },
      },
    ],
    addresses: [
      {
        id: { type: String },
        name: { type: String },
        phone: { type: String },
        addressLine1: { type: String },
        addressLine2: { type: String },
        city: { type: String },
        state: { type: String },
        pincode: { type: String },
        isDefault: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
