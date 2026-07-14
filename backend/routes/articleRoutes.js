import express from 'express';
import Article from '../models/Article.js';

const router = express.Router();

// دریافت همه مقالات (با فیلتر و صفحه‌بندی)
router.get('/', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 6 } = req.query;
    const filter = { isPublished: true };

    if (category && category !== 'all') {
      filter.categoryKey = category;
    }

    if (search) {
      filter.$or = [
        { 'title.fa': { $regex: search, $options: 'i' } },
        { 'title.en': { $regex: search, $options: 'i' } },
        { 'title.ar': { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [articles, total] = await Promise.all([
      Article.find(filter).skip(skip).limit(Number(limit)).sort({ publishedAt: -1 }),
      Article.countDocuments(filter),
    ]);

    res.json({ articles, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    console.error('Error in /api/articles:', error);
    res.status(500).json({ error: error.message });
  }
});

// دریافت یک مقاله با slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const article = await Article.findOne({
      $or: [
        { 'slug.fa': slug },
        { 'slug.en': slug },
        { 'slug.ar': slug },
      ],
    });
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
