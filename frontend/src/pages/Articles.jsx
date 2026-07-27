import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useArticles } from '../hooks/useArticles';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdArticle,
  MdSearch,
  MdTrendingUp,
  MdAccessTime,
  MdCalendarToday,
  MdArrowForward,
  MdArrowBack,
  MdAutoStories,
  MdPerson,
  MdCategory,
  MdMailOutline,
} from 'react-icons/md';

/* ── کامپوننت‌های کمکی (اگر ArticleCard, ArticleFilter, ArticlePagination 
     خارجی نباشن یا خواستی جایگزین کنی) ── */

const CATEGORIES = [
  { key: 'all', label: 'all' },
  { key: 'news', label: 'news' },
  { key: 'recipe', label: 'recipe' },
  { key: 'tips', label: 'tips' },
  { key: 'interview', label: 'interview' },
];

export default function Articles() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [searchFocused, setSearchFocused] = useState(false);
  const limit = 6;

  const { articles, loading, error, total } = useArticles(category, search, page, limit);
  const isDark = theme === 'dark';
  const isRtl = i18n.language === 'fa' || i18n.language === 'ar';

  /* رنگ‌های تم */
  const bg = isDark ? 'bg-[#0F0F0F]' : 'bg-[#F7F0E6]';
  const surface = isDark ? 'bg-[#1C1C1C]' : 'bg-white';
  const surfaceHover = isDark ? 'hover:bg-[#252525]' : 'hover:bg-gray-50';
  const textMain = isDark ? 'text-[#F7F0E6]' : 'text-[#3E2723]';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
  const gold = '#F4B41A';
  const red = '#D32F2F';
  const accent = isDark ? gold : red;

  const totalPages = Math.ceil(total / limit);
  const featured = articles?.[0];
  const rest = articles?.slice(1) || [];

  /* اسکرول به بالا هنگام تغییر صفحه */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  /* ── Hero ── */
  const Hero = () => (
    <section className="relative overflow-hidden pt-24 pb-16">
      {/* پس‌زمینه گرادیان */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at top right, rgba(244,180,26,0.15), transparent 60%), radial-gradient(ellipse at bottom left, rgba(211,47,47,0.08), transparent 50%)'
            : 'radial-gradient(ellipse at top right, rgba(244,180,26,0.12), transparent 60%), radial-gradient(ellipse at bottom left, rgba(211,47,47,0.06), transparent 50%)',
        }}
      />
      <div className="relative max-w-6xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase mb-6 border"
            style={{
              color: accent,
              borderColor: isDark ? 'rgba(244,180,26,0.3)' : 'rgba(211,47,47,0.25)',
              background: isDark ? 'rgba(244,180,26,0.08)' : 'rgba(211,47,47,0.06)',
            }}
          >
            <MdAutoStories size={14} />
            {t('articles.heroBadge', 'مجله رستوران')}
          </span>
          <h1
            className={`text-4xl md:text-6xl font-black leading-tight mb-4 ${textMain}`}
            style={{ letterSpacing: '-0.02em' }}
          >
            {t('articles.title', 'مقالات')}
          </h1>
          <p className={`text-lg md:text-xl max-w-2xl mx-auto leading-relaxed ${textMuted}`}>
            {t(
              'articles.subtitle',
              'داستان‌های پشت غذاها، رازهای آشپزی و تجربه‌های منحصربه‌فرد از دنیای کباب و سنت'
            )}
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-8 mt-10"
        >
          {[
            { icon: MdArticle, value: total || 0, label: t('articles.statArticles', 'مقاله') },
            { icon: MdCategory, value: 12, label: t('articles.statCategories', 'دسته‌بندی') },
            { icon: MdPerson, value: 8, label: t('articles.statAuthors', 'نویسنده') },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: isDark ? 'rgba(244,180,26,0.1)' : 'rgba(211,47,47,0.08)' }}
              >
                <s.icon size={18} style={{ color: accent }} />
              </div>
              <div className="text-left">
                <p className={`text-lg font-black ${textMain}`}>{s.value}</p>
                <p className={`text-xs ${textMuted}`}>{s.label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );

  /* ── Search + Filter ── */
  const FilterBar = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="max-w-6xl mx-auto px-4 mb-10"
    >
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-lg">
          <MdSearch
            size={20}
            className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-4' : 'left-4'} ${textMuted}`}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder={t('articles.searchPlaceholder', 'جستجو در مقالات...')}
            className={`w-full ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3.5 rounded-2xl text-sm font-medium outline-none transition-all duration-300 border ${
              isDark
                ? 'bg-[#1C1C1C] border-white/10 text-white placeholder-gray-500 focus:border-[#F4B41A]/50 focus:ring-2 focus:ring-[#F4B41A]/10'
                : 'bg-white border-black/5 text-[#3E2723] placeholder-gray-400 focus:border-[#D32F2F]/30 focus:ring-2 focus:ring-[#D32F2F]/10'
            } ${searchFocused ? 'shadow-lg' : 'shadow-sm'}`}
          />
          {search && (
            <button
              onClick={() => {
                setSearch('');
                setPage(1);
              }}
              className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? 'left-4' : 'right-4'} text-xs font-bold px-2 py-1 rounded-lg transition-colors ${
                isDark ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-[#D32F2F]'
              }`}
            >
              {t('clear', 'پاک کردن')}
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map((cat) => {
            const active = category === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => {
                  setCategory(cat.key);
                  setPage(1);
                }}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 border ${
                  active
                    ? isDark
                      ? 'bg-[#F4B41A] text-black border-[#F4B41A] shadow-lg shadow-[#F4B41A]/20'
                      : 'bg-[#D32F2F] text-white border-[#D32F2F] shadow-lg shadow-[#D32F2F]/20'
                    : isDark
                    ? 'bg-[#1C1C1C] text-gray-300 border-white/10 hover:border-[#F4B41A]/30'
                    : 'bg-white text-gray-600 border-black/5 hover:border-[#D32F2F]/20'
                }`}
              >
                {t(`articles.categories.${cat.key}`, cat.key)}
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );

  /* ── Featured Article ── */
  const FeaturedCard = () => {
    if (!featured) return null;
    const img = featured.images?.[0] || '/images/articles/placeholder.svg';
    const title = featured.title?.[i18n.language] || featured.title?.fa || '';
    const excerpt = featured.excerpt?.[i18n.language] || featured.excerpt?.fa || '';
    const cat = typeof featured.category === 'object'
      ? featured.category?.[i18n.language] || featured.category?.fa
      : featured.category;

    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="max-w-6xl mx-auto px-4 mb-12"
      >
        <Link
          to={`/articles/${featured.slug}`}
          className={`group block rounded-3xl overflow-hidden border transition-all duration-500 ${
            isDark
              ? 'bg-[#1C1C1C] border-white/5 hover:border-[#F4B41A]/30'
              : 'bg-white border-black/5 hover:border-[#D32F2F]/20'
          } hover:shadow-2xl`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative h-64 lg:h-auto overflow-hidden">
              <img
                src={img}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent lg:bg-gradient-to-r" />
              <span
                className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-black"
                style={{ background: accent }}
              >
                {t('articles.featured', 'برجسته')}
              </span>
            </div>
            <div className="p-8 lg:p-10 flex flex-col justify-center">
              <span className={`text-xs font-bold uppercase tracking-wider mb-3 ${textMuted}`}>
                {cat}
              </span>
              <h2 className={`text-2xl md:text-3xl font-black mb-4 leading-snug ${textMain} group-hover:text-[${accent}] transition-colors`}>
                {title}
              </h2>
              <p className={`text-sm leading-relaxed mb-6 line-clamp-3 ${textMuted}`}>
                {excerpt}
              </p>
              <div className="flex items-center gap-4 text-xs font-medium">
                <span className={`flex items-center gap-1.5 ${textMuted}`}>
                  <MdCalendarToday size={14} style={{ color: accent }} />
                  {new Date(featured.publishedAt).toLocaleDateString(
                    isRtl ? 'fa-IR' : 'en-US',
                    { year: 'numeric', month: 'long', day: 'numeric' }
                  )}
                </span>
                <span className={`flex items-center gap-1.5 ${textMuted}`}>
                  <MdAccessTime size={14} style={{ color: accent }} />
                  {featured.readTime || 5} {t('articles.minRead', 'دقیقه')}
                </span>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  };

  /* ── Article Grid ── */
  const ArticleGrid = () => (
    <div className="max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {rest.map((article, idx) => {
            const img = article.images?.[0] || '/images/articles/placeholder.svg';
            const title = article.title?.[i18n.language] || article.title?.fa || '';
            const excerpt = article.excerpt?.[i18n.language] || article.excerpt?.fa || '';
            const cat = typeof article.category === 'object'
              ? article.category?.[i18n.language] || article.category?.fa
              : article.category;

            return (
              <motion.div
                key={article._id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.08, duration: 0.4 }}
              >
                <Link
                  to={`/articles/${article.slug}`}
                  className={`group flex flex-col h-full rounded-2xl overflow-hidden border transition-all duration-400 ${surface} ${
                    isDark
                      ? 'border-white/5 hover:border-[#F4B41A]/20 hover:shadow-[0_8px_40px_-12px_rgba(244,180,26,0.15)]'
                      : 'border-black/5 hover:border-[#D32F2F]/15 hover:shadow-[0_8px_40px_-12px_rgba(211,47,47,0.12)]'
                  } hover:-translate-y-1`}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={img}
                      alt={title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span
                      className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold text-black backdrop-blur-sm"
                      style={{ background: `${accent}cc` }}
                    >
                      {cat}
                    </span>
                  </div>
                  <div className="flex flex-col flex-1 p-5">
                    <h3 className={`text-base font-bold mb-2 line-clamp-2 ${textMain} group-hover:text-[${accent}] transition-colors`}>
                      {title}
                    </h3>
                    <p className={`text-xs leading-relaxed mb-4 line-clamp-2 flex-1 ${textMuted}`}>
                      {excerpt}
                    </p>
                    <div className={`flex items-center justify-between text-[11px] font-medium ${textMuted}`}>
                      <span className="flex items-center gap-1">
                        <MdAccessTime size={12} />
                        {article.readTime || 5} {t('articles.minRead', 'دقیقه')}
                      </span>
                      <span
                        className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: accent }}
                      >
                        {t('articles.readMore', 'ادامه')}
                        {isRtl ? <MdArrowBack size={12} /> : <MdArrowForward size={12} />}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );

  /* ── Skeleton ── */
  const SkeletonGrid = () => (
    <div className="max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`rounded-2xl overflow-hidden border ${
              isDark ? 'bg-[#1C1C1C] border-white/5' : 'bg-white border-black/5'
            }`}
          >
            <div className={`h-48 ${isDark ? 'bg-gray-800' : 'bg-gray-100'} animate-pulse`} />
            <div className="p-5 space-y-3">
              <div className={`h-4 rounded-lg w-3/4 ${isDark ? 'bg-gray-800' : 'bg-gray-100'} animate-pulse`} />
              <div className={`h-3 rounded-lg w-full ${isDark ? 'bg-gray-800' : 'bg-gray-100'} animate-pulse`} />
              <div className={`h-3 rounded-lg w-2/3 ${isDark ? 'bg-gray-800' : 'bg-gray-100'} animate-pulse`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /* ── Empty State ── */
  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md mx-auto text-center py-20"
    >
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
        style={{ background: isDark ? 'rgba(244,180,26,0.08)' : 'rgba(211,47,47,0.06)' }}
      >
        <MdSearch size={32} style={{ color: accent }} />
      </div>
      <h3 className={`text-xl font-bold mb-2 ${textMain}`}>
        {t('articles.noResults', 'نتیجه‌ای یافت نشد')}
      </h3>
      <p className={`text-sm mb-6 ${textMuted}`}>
        {t('articles.noResultsDesc', 'لطفاً عبارت جستجوی دیگری امتحان کنید یا فیلتر را تغییر دهید.')}
      </p>
      <button
        onClick={() => {
          setSearch('');
          setCategory('all');
          setPage(1);
        }}
        className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:shadow-lg"
        style={{ background: accent }}
      >
        {t('articles.resetFilters', 'بازنشانی فیلترها')}
      </button>
    </motion.div>
  );

  /* ── Pagination ── */
  const Pagination = () => {
    if (totalPages <= 1) return null;
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center gap-2 mt-14"
      >
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border ${
            page === 1
              ? 'opacity-40 cursor-not-allowed'
              : isDark
              ? 'border-white/10 hover:border-[#F4B41A]/40 hover:bg-[#F4B41A]/5'
              : 'border-black/5 hover:border-[#D32F2F]/30 hover:bg-[#D32F2F]/5'
          } ${textMain}`}
        >
          {isRtl ? <MdArrowForward size={18} /> : <MdArrowBack size={18} />}
        </button>

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`w-10 h-10 rounded-xl text-sm font-bold transition-all border ${
              page === p
                ? isDark
                  ? 'bg-[#F4B41A] text-black border-[#F4B41A] shadow-lg shadow-[#F4B41A]/25'
                  : 'bg-[#D32F2F] text-white border-[#D32F2F] shadow-lg shadow-[#D32F2F]/25'
                : isDark
                ? 'border-white/10 text-gray-300 hover:border-[#F4B41A]/30 hover:bg-[#F4B41A]/5'
                : 'border-black/5 text-gray-600 hover:border-[#D32F2F]/20 hover:bg-[#D32F2F]/5'
            }`}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border ${
            page === totalPages
              ? 'opacity-40 cursor-not-allowed'
              : isDark
              ? 'border-white/10 hover:border-[#F4B41A]/40 hover:bg-[#F4B41A]/5'
              : 'border-black/5 hover:border-[#D32F2F]/30 hover:bg-[#D32F2F]/5'
          } ${textMain}`}
        >
          {isRtl ? <MdArrowBack size={18} /> : <MdArrowForward size={18} />}
        </button>
      </motion.div>
    );
  };

  /* ── Newsletter CTA ── */
  const Newsletter = () => (
    <section className="max-w-6xl mx-auto px-4 mt-20 mb-12">
      <div
        className={`relative rounded-3xl p-8 md:p-12 overflow-hidden border ${
          isDark ? 'bg-[#1C1C1C] border-white/5' : 'bg-white border-black/5'
        }`}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: isDark
              ? 'radial-gradient(circle at 20% 50%, rgba(244,180,26,0.3), transparent 50%)'
              : 'radial-gradient(circle at 20% 50%, rgba(211,47,47,0.15), transparent 50%)',
          }}
        />
        <div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-10">
          <div className="flex-1 text-center md:text-left">
            <h3 className={`text-2xl font-black mb-2 ${textMain}`}>
              {t('articles.newsletterTitle', 'از جدیدترین مقالات مطلع شوید')}
            </h3>
            <p className={`text-sm ${textMuted}`}>
              {t('articles.newsletterDesc', 'هر هفته بهترین داستان‌ها و دستورهای آشپزی را در ایمیل خود دریافت کنید.')}
            </p>
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <div className="relative flex-1 md:w-64">
              <MdMailOutline
                size={18}
                className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-4' : 'left-4'} ${textMuted}`}
              />
              <input
                type="email"
                placeholder={t('articles.emailPlaceholder', 'آدرس ایمیل شما')}
                className={`w-full ${isRtl ? 'pr-11 pl-4' : 'pl-11 pr-4'} py-3 rounded-xl text-sm outline-none border transition-all ${
                  isDark
                    ? 'bg-[#0F0F0F] border-white/10 text-white placeholder-gray-500 focus:border-[#F4B41A]/40'
                    : 'bg-[#F7F0E6] border-black/5 text-[#3E2723] placeholder-gray-400 focus:border-[#D32F2F]/30'
                }`}
              />
            </div>
            <button
              className="px-6 py-3 rounded-xl text-sm font-bold text-black transition-all hover:shadow-lg hover:scale-105 active:scale-95 shrink-0"
              style={{ background: accent }}
            >
              {t('articles.subscribe', 'عضویت')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );

  /* ═══ RENDER ═══ */
  if (loading) {
    return (
      <div className={`min-h-screen ${bg} transition-colors duration-300`}>
        <Hero />
        <FilterBar />
        <SkeletonGrid />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${bg} ${textMain} p-8`}>
        <MdTrendingUp size={48} className="mb-4 opacity-20" />
        <h2 className="text-xl font-bold mb-2">{t('articles.error', 'خطا در بارگذاری')}</h2>
        <p className={`text-sm ${textMuted} mb-6`}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 rounded-xl text-sm font-bold text-white"
          style={{ background: accent }}
        >
          {t('retry', 'تلاش مجدد')}
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bg} transition-colors duration-300`}>
      <Hero />
      <FilterBar />

      {articles.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {page === 1 && category === 'all' && !search && <FeaturedCard />}
          <ArticleGrid />
          <Pagination />
        </>
      )}

      <Newsletter />
    </div>
  );
}