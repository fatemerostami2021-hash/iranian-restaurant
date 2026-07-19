import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  title: {
    fa: { type: String, required: true },
    en: { type: String, required: true },
    ar: { type: String, required: true }
  },
  // اسلاگ به صورت متن ساده ذخیره می‌شود
  slug: {
    type: String,
    unique: true,
    sparse: true // اجازه می‌دهد اگر خالی بود ارور ندهد
  },
  excerpt: {
    fa: String,
    en: String,
    ar: String
  },
  content: {
    fa: String,
    en: String,
    ar: String
  },
  // دسته‌بندی به صورت متن ساده ذخیره می‌شود
  category: {
    type: String,
    enum: ['news', 'blog', 'recipes', 'events', 'promotions', 'history', 'culture', 'food-stories', 'city-stories', 'fun-facts'],
    default: 'blog'
  },
  tags: [String],
  // وضعیت به صورت متن ذخیره می‌شود
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  // مقاله ویژه
  featured: {
    type: Boolean,
    default: false
  },
  images: [String],
  video: String,
  author: String,
  publishedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default mongoose.model('Article', articleSchema);