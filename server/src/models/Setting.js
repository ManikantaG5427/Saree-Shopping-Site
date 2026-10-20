import mongoose from 'mongoose';

const SettingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: String, required: true },
    type: { type: String, enum: ['string', 'number', 'boolean', 'json'], default: 'string' },
    group: { type: String, enum: ['general', 'shipping', 'tax', 'payment', 'returns', 'contact'], default: 'general' },
    description: { type: String },
    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Setting', SettingSchema);
