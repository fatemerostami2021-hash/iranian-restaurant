import Article from '../models/Article.js';

export const getArticles = async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: 'خطا در دریافت مقالات', error });
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
