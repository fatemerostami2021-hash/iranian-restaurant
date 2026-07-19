import Article from '../models/Article.js';

// ===== مسیرهای عمومی (برای سایت اصلی) =====

// دریافت لیست مقالات (با فیلتر و صفحه‌بندی)
export const getArticles = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 6 } = req.query;
    
    // فقط مقالات منتشر شده برای عموم نمایش داده می‌شوند
    const filter = { status: 'published' };

    if (category && category !== 'all') {
      filter.category = category;
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

    res.status(200).json({ articles, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    console.error('Error in /api/articles:', error);
    res.status(500).json({ message: 'خطا در دریافت مقالات', error: error.message });
  }
};

// دریافت یک مقاله بر اساس اسلاگ (String ساده)
export const getArticleBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    // چون اسلاگ الان یک متن ساده است، مستقیم آن را جستجو می‌کنیم
    const article = await Article.findOne({ slug: slug, status: 'published' });
    
    if (!article) {
      return res.status(404).json({ message: 'مقاله یافت نشد' });
    }
    
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: 'خطا در دریافت مقاله', error });
  }
};

// ===== مسیرهای پنل ادمین =====

export const getAllAdminArticles = async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: 'خطا در دریافت لیست مقالات', error });
  }
};

export const createArticle = async (req, res) => {
  try {
    const newArticle = new Article(req.body);
    const savedArticle = await newArticle.save();
    res.status(201).json(savedArticle);
  } catch (error) {
    res.status(400).json({ message: 'خطا در ایجاد مقاله', error });
  }
};

export const updateArticle = async (req, res) => {
  try {
    const updatedArticle = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedArticle);
  } catch (error) {
    res.status(400).json({ message: 'خطا در ویرایش مقاله', error });
  }
};

export const deleteArticle = async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'مقاله حذف شد' });
  } catch (error) {
    res.status(500).json({ message: 'خطا در حذف مقاله', error });
  }
};