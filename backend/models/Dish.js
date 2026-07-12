import mongoose from 'mongoose';

const dishSchema = new mongoose.Schema({
  name: {
    en: { type: String, required: true },
    fa: { type: String, required: true },
    ar: { type: String, required: true },
  },
  description: {
    en: String,
    fa: String,
    ar: String,
  },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: String,
  ingredients: [{
    en: String,
    fa: String,
    ar: String,
  }],
  rating: { type: Number, default: 0 },
  prepTime: Number,
  isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Dish', dishSchema);
