import express from 'express';
import { getArticles, getArticleBySlug } from '../controllers/articleController.js';

const router = express.Router();

// مسیرهای عمومی
router.get('/', getArticles);
router.get('/:slug', getArticleBySlug);

export default router;