import mongoose from 'mongoose';

const clickSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  referrer: String,
  location: String,
});

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortcode: { type: String, unique: true, required: true },
  expiryDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  clicks: [clickSchema],
});

export default mongoose.model('Url', urlSchema);
