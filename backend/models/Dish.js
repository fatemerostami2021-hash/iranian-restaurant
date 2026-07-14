import mongoose from 'mongoose';

const dishSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true
  },
  name: {
    en: String,
    fa: String,
    ar: String
  },
  slug: {
    type: String,
    unique: true,
    sparse: true
  },
  category: {
    type: String,
    enum: ['breakfast', 'main', 'combo', 'appetizer', 'drinks'],
    required: true
  },
  price: Number,
  unit: String,
  weight: String,
  description: {
    en: String,
    fa: String,
    ar: String
  },
  inStock: {
    type: Boolean,
    default: true
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Dish = mongoose.model('Dish', dishSchema);
export default Dish;
