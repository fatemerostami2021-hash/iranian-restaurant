import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      sparse: true,
    },
    author: {
      type: String,
      default: 'مدیر سایت',
    },
    category: {
      type: String,
      enum: ['news', 'blog', 'recipes', 'events', 'promotions', 'history', 'culture', 'food-stories', 'city-stories', 'fun-facts'],
      default: 'blog',
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    title: {
      fa: { type: String, required: true },
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    excerpt: {
      fa: { type: String },
      en: { type: String },
      ar: { type: String },
    },
    content: {
      fa: { type: String, required: true },
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    tags: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    images: {
      type: [String],
      default: [],
    },
    video: {
      type: String,
      default: null,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// در نسخه‌های جدید Mongoose نیازی به next() نیست
articleSchema.pre('save', function() {
  if (this.slug && typeof this.slug === 'string') {
    this.slug = this.slug.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
  }
  
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
});

const Article = mongoose.model('Article', articleSchema);
export default Article;