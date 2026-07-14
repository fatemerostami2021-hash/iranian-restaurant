import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useArticles } from '../hooks/useArticles';
import ArticleCard from '../components/articles/ArticleCard';
import ArticleFilter from '../components/articles/ArticleFilter';
import ArticlePagination from '../components/articles/ArticlePagination';
import { MdArticle } from 'react-icons/md';

export default function Articles() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 6;

  const { articles, loading, error, total } = useArticles(category, search, page, limit);

  const bgClass = theme === 'dark' ? 'bg-[#1C1C1C]' : 'bg-[#F7F0E6]';
  const textClass = theme === 'dark' ? 'text-[#F7F0E6]' : 'text-[#3E2723]';
  const mutedClass = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';

  const totalPages = Math.ceil(total / limit);

  if (loading) {
    return (
      <section className={`max-w-6xl mx-auto px-4 py-12 ${bgClass}`}>
        <div className="flex items-center gap-3 mb-8">
          <MdArticle size={32} className="text-[#F4B41A] animate-pulse" />
          <h1 className={`text-3xl font-bold ${textClass}`}>{t('articles.title')}</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-2xl h-64 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={`max-w-6xl mx-auto px-4 py-12 ${bgClass}`}>
        <p className="text-center text-red-500 py-10">خطا در دریافت مقالات: {error}</p>
      </section>
    );
  }

  return (
    <section className={`max-w-6xl mx-auto px-4 py-12 ${bgClass} transition-colors duration-300`}>
      <div className="flex items-center gap-3 mb-8">
        <MdArticle size={32} className="text-[#F4B41A]" />
        <h1 className={`text-3xl font-bold ${textClass}`}>
          {t('articles.title')}
        </h1>
        <span className={`text-sm ${mutedClass}`}>({total})</span>
      </div>

      <ArticleFilter
        activeCategory={category}
        onCategoryChange={(cat) => {
          setCategory(cat);
          setPage(1);
        }}
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
      />

      {articles.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-gray-300 dark:border-gray-700 rounded-3xl">
          <p className={`${mutedClass}`}>{t('articles.noArticles') || 'مقاله‌ای یافت نشد'}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
          <ArticlePagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </section>
  );
}
