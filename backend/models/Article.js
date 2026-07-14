import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  // ===== عنوان به ۳ زبان =====
  title: {
    fa: { type: String, required: true },
    en: { type: String, required: true },
    ar: { type: String, required: true }
  },
  // ===== اسلاگ به ۳ زبان =====
  slug: {
    fa: { type: String, required: true, unique: true },
    en: { type: String, required: true, unique: true },
    ar: { type: String, required: true, unique: true }
  },
  // ===== دسته‌بندی به ۳ زبان =====
  category: {
    fa: { type: String, required: true },
    en: { type: String, required: true },
    ar: { type: String, required: true }
  },
  // ===== کلید دسته‌بندی (یکسان برای همه زبان‌ها) =====
  categoryKey: {
    type: String,
    enum: ['food-stories', 'history', 'culture', 'city-stories', 'fun-facts'],
    required: true
  },
  // ===== محتوای اصلی به ۳ زبان =====
  content: {
    fa: { type: String, required: true },
    en: { type: String, required: true },
    ar: { type: String, required: true }
  },
  // ===== خلاصه به ۳ زبان =====
  excerpt: {
    fa: { type: String, maxlength: 200 },
    en: { type: String, maxlength: 200 },
    ar: { type: String, maxlength: 200 }
  },
  // ===== تصویر شاخص (مشترک) =====
  featuredImage: { type: String, default: '' },
  gallery: [String],
  // ===== آمار (مشترک) =====
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  readTime: { type: Number, default: 5 },
  // ===== وضعیت (مشترک) =====
  isPublished: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  publishedAt: { type: Date, default: Date.now },
  // ===== SEO به ۳ زبان =====
  seo: {
    title: { fa: String, en: String, ar: String },
    description: { fa: String, en: String, ar: String },
    keywords: { fa: [String], en: [String], ar: [String] }
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Article = mongoose.model('Article', articleSchema);
export default Article;
