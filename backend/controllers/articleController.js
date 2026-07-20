import Article from '../models/Article.js';

// ===== مسیرهای عمومی (برای سایت اصلی) =====

export const getArticles = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 6 } = req.query;
    
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

export const getArticleBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const article = await Article.findOne({ slug, status: 'published' });
    
    if (!article) {
      return res.status(404).json({ message: 'مقاله یافت نشد' });
    }
    
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: 'خطا در دریافت مقاله', error: error.message });
  }
};

// ===== مسیرهای پنل ادمین =====

export const getAllAdminArticles = async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: 'خطا در دریافت لیست مقالات', error: error.message });
  }
};

export const createArticle = async (req, res) => {
  try {
    const newArticle = new Article(req.body);
    const savedArticle = await newArticle.save();
    res.status(201).json(savedArticle);
  } catch (error) {
    console.error('❌ Article Creation Error:', error);
    
    let errorMessage = 'خطا در ایجاد مقاله';
    if (error.code === 11000) {
      errorMessage = 'این اسلاگ (آدرس) قبلاً استفاده شده است. لطفاً اسلاگ دیگری انتخاب کنید.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    res.status(400).json({ message: errorMessage, error: error.message });
  }
};

export const updateArticle = async (req, res) => {
  try {
    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!updatedArticle) {
      return res.status(404).json({ message: 'مقاله یافت نشد' });
    }
    
    res.status(200).json(updatedArticle);
  } catch (error) {
    console.error('❌ Article Update Error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ message: 'این اسلاگ قبلاً استفاده شده است.' });
    }
    
    res.status(400).json({ message: 'خطا در ویرایش مقاله', error: error.message });
  }
};

export const deleteArticle = async (req, res) => {
  try {
    const deletedArticle = await Article.findByIdAndDelete(req.params.id);
    
    if (!deletedArticle) {
      return res.status(404).json({ message: 'مقاله یافت نشد' });
    }
    
    res.status(200).json({ message: 'مقاله با موفقیت حذف شد' });
  } catch (error) {
    res.status(500).json({ message: 'خطا در حذف مقاله', error: error.message });
  }
};