import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MdVisibility, MdFavorite, MdAccessTime } from 'react-icons/md';

export default function ArticleCard({ article }) {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const title = article.title?.[lang] || article.title?.fa || 'بدون عنوان';
  const excerpt = article.excerpt?.[lang] || article.excerpt?.fa || '';
  const slug = article.slug?.[lang] || article.slug?.fa || article._id;
  const image = article.featuredImage || '/images/articles/placeholder.jpg';

  return (
    <Link
      to={`/articles/${slug}`}
      className="group block bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
    >
      {/* تصویر */}
      <div className="relative h-52 overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {article.isFeatured && (
          <span className="absolute top-3 right-3 bg-[#F4B41A] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            ویژه
          </span>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <span className="text-white text-xs font-medium bg-[#F4B41A]/80 px-3 py-1 rounded-full">
            {article.category?.[lang] || article.category?.fa}
          </span>
        </div>
      </div>

      {/* محتوا */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-primary-dark dark:text-primary-light line-clamp-2 group-hover:text-[#F4B41A] transition-colors mb-2">
          {title}
        </h3>

        {excerpt && (
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
            {excerpt}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-3">
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
            {article.readTime || 5} دقیقه
          </span>
        </div>
      </div>
    </Link>
  );
}
