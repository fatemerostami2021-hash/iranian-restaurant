import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { MdVisibility, MdFavorite, MdAccessTime } from 'react-icons/md';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ArticleCard({ article }) {
  const { i18n, t } = useTranslation();
  const { theme } = useTheme();
  const lang = i18n.language;

  const title = article.title?.[lang] || article.title?.fa || 'بدون عنوان';
  const excerpt = article.excerpt?.[lang] || article.excerpt?.fa || '';
  
  // هندل اسلاگ استرینگ یا آبجکت
  const slug = typeof article.slug === 'object' 
    ? (article.slug?.[lang] || article.slug?.fa || article._id) 
    : (article.slug || article._id);
    
  // هندل دسته‌بندی استرینگ یا آبجکت
  const category = typeof article.category === 'object' 
    ? (article.category?.[lang] || article.category?.fa || '') 
    : (article.category || '');
    
  // دریافت عکس از آرایه images
  const image = article.images && article.images.length > 0
    ? (article.images[0].startsWith('http') ? article.images[0] : `${API_URL}${article.images[0]}`)
    : '/images/articles/placeholder.jpg';

  const cardBg = theme === 'dark' ? 'bg-surface-dark' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-primary-light' : 'text-primary-dark';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-100';
  const mutedColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';

  return (
    <Link
      to={`/articles/${slug}`}
      className={`group block ${cardBg} rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border ${borderColor}`}
    >
      <div className="relative h-52 overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {article.featured && (
          <span className="absolute top-3 right-3 bg-[#F4B41A] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            {t('articles.featured') || 'ویژه'}
          </span>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <span className="text-white text-xs font-medium bg-[#F4B41A]/80 px-3 py-1 rounded-full">
            {category}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className={`text-lg font-bold ${textColor} line-clamp-2 group-hover:text-[#F4B41A] transition-colors mb-2`}>
          {title}
        </h3>

        {excerpt && (
          <p className={`text-sm ${mutedColor} line-clamp-2 mb-4`}>{excerpt}</p>
        )}

        <div className={`flex items-center justify-between text-xs ${mutedColor} border-t ${borderColor} pt-3`}>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <MdVisibility size={14} />
              {article.views || 0}
            </span>
            <span className="flex items-center gap-1">
              <MdFavorite size={14} />
              {article.likes || 0}
            </span>
          </div>
          <span className="flex items-center gap-1">
            <MdAccessTime size={14} />
            {article.readTime || 5} {t('articles.readTime') || 'دقیقه'}
          </span>
        </div>
      </div>
    </Link>
  );
}