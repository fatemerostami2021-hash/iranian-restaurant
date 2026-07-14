import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { MdArrowBack, MdVisibility, MdFavorite, MdAccessTime, MdCalendarToday } from 'react-icons/md';

export default function ArticleDetail() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const lang = i18n.language;

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/articles/${slug}`);
        setArticle(response.data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  const bgClass = theme === 'dark' ? 'bg-[#1C1C1C]' : 'bg-[#F7F0E6]';
  const cardBg = theme === 'dark' ? 'bg-[#2D2D2D]' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-[#F7F0E6]' : 'text-[#3E2723]';
  const mutedColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const borderColor = theme === 'dark' ? 'border-[#3E2723]' : 'border-[#E0D5C8]';

  if (loading) {
    return (
      <section className={`max-w-4xl mx-auto px-4 py-12 ${bgClass}`}>
        <div className={`${cardBg} rounded-2xl p-8 animate-pulse`}>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6" />
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded mb-6" />
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !article) {
    return (
      <section className={`max-w-4xl mx-auto px-4 py-12 ${bgClass}`}>
        <div className="text-center py-12">
          <p className="text-red-500">خطا در دریافت مقاله</p>
          <Link to="/articles" className="text-[#F4B41A] hover:underline mt-4 inline-block">
            {t('articles.backToList') || 'بازگشت به لیست مقالات'}
          </Link>
        </div>
      </section>
    );
  }

  const title = article.title?.[lang] || article.title?.fa || 'بدون عنوان';
  const content = article.content?.[lang] || article.content?.fa || '';
  const category = article.category?.[lang] || article.category?.fa || '';
  const image = article.featuredImage || '/images/articles/placeholder.jpg';
  const date = article.publishedAt ? new Date(article.publishedAt) : new Date();

  return (
    <section className={`max-w-4xl mx-auto px-4 py-12 ${bgClass} transition-colors duration-300`}>
      {/* دکمه بازگشت */}
      <Link
        to="/articles"
        className={`inline-flex items-center gap-2 text-sm ${mutedColor} hover:text-[#F4B41A] transition-colors mb-6`}
      >
        <MdArrowBack size={20} />
        {t('articles.backToList') || 'بازگشت به لیست مقالات'}
      </Link>

      {/* مقاله */}
      <article className={`${cardBg} rounded-2xl overflow-hidden shadow-lg border ${borderColor}`}>
        {/* تصویر شاخص */}
        <div className="relative h-80 overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
          {article.isFeatured && (
            <span className="absolute top-4 right-4 bg-[#F4B41A] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              {t('articles.featured') || 'ویژه'}
            </span>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <span className="text-white text-sm font-medium bg-[#F4B41A]/80 px-3 py-1 rounded-full">
              {category}
            </span>
          </div>
        </div>

        {/* محتوای مقاله */}
        <div className="p-6 md:p-8">
          {/* عنوان */}
          <h1 className={`text-3xl md:text-4xl font-bold ${textColor} mb-4`}>
            {title}
          </h1>

          {/* متادیتا */}
          <div className={`flex flex-wrap items-center gap-4 text-sm ${mutedColor} mb-6 pb-6 border-b ${borderColor}`}>
            <span className="flex items-center gap-1">
              <MdCalendarToday size={16} />
              {date.toLocaleDateString(lang === 'fa' ? 'fa-IR' : lang === 'ar' ? 'ar-SA' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            <span className="flex items-center gap-1">
              <MdVisibility size={16} />
              {article.views || 0} {t('articles.views') || 'بازدید'}
            </span>
            <span className="flex items-center gap-1">
              <MdFavorite size={16} />
              {article.likes || 0} {t('articles.likes') || 'پسندیده'}
            </span>
            <span className="flex items-center gap-1">
              <MdAccessTime size={16} />
              {article.readTime || 5} {t('articles.readTime') || 'دقیقه مطالعه'}
            </span>
          </div>

          {/* متن مقاله */}
          <div className={`prose prose-lg max-w-none ${textColor} dark:prose-invert`}>
            {content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </article>
    </section>
  );
}
