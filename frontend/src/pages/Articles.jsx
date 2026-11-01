import { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useArticles } from '../hooks/useArticles';
import { Link } from 'react-router-dom';
import {
  MdSearch,
  MdAccessTime,
  MdCalendarToday,
  MdArrowForward,
  MdArrowBack,
  MdChevronLeft,
  MdChevronRight,
  MdRestaurantMenu,
} from 'react-icons/md';

const API_URL = import.meta.env.VITE_API_URL || '';

// Hero banner (made by tools/perf12.cjs from read_our_articles_202607271435.jpeg)
const HERO_BASE = '/images/articles/featured/read-our-articles';
const HERO_FALLBACK = '/images/articles/featured/read_our_articles_202607271435.jpeg';

function getArticleImageUrl(article) {
  const raw = article.images?.[0];
  if (!raw) return '/images/articles/placeholder.svg';
  if (raw.startsWith('http')) return raw;
  return `${API_URL}${raw.startsWith('/') ? '' : '/'}${raw}`;
}

// Used only when the API gives no categories we can read
const FALLBACK_CATEGORIES = [
  'news', 'blog', 'recipes', 'events', 'promotions', 'history', 'culture', 'food-stories', 'city-stories', 'fun-facts',
];

// Texts of this page (fa / en / ar)
const L = {
  fa: {
    badge: 'مجله رستوران', title: 'مقالات',
    subtitle: 'داستان غذاها، رازهای آشپزی و فرهنگ کباب ایرانی',
    browse: 'مشاهده مقاله‌ها', latest: 'تازه‌ترین مقاله‌ها', all: 'همه مقاله‌ها', count: 'مقاله',
    search: 'جستجو در مقاله‌ها...', clear: 'پاک کردن', min: 'دقیقه', read: 'خواندن مقاله',
    prev: 'اسلاید قبلی', next: 'اسلاید بعدی', slide: 'اسلاید', allCats: 'همه',
    noResults: 'نتیجه‌ای یافت نشد', noResultsDesc: 'عبارت دیگری را امتحان کنید یا فیلتر را بردارید.', reset: 'بازنشانی فیلترها',
    error: 'خطا در بارگذاری', retry: 'تلاش مجدد',
    ctaTitle: 'بعد از خواندن، گرسنه شدید؟', ctaDesc: 'منوی کامل کباب ایرانی را ببینید و آنلاین سفارش دهید.', ctaBtn: 'مشاهده منو',
  },
  en: {
    badge: 'Restaurant magazine', title: 'Articles',
    subtitle: 'Stories behind the dishes, kitchen secrets and the culture of Persian kebab',
    browse: 'Browse articles', latest: 'Latest articles', all: 'All articles', count: 'articles',
    search: 'Search articles...', clear: 'Clear', min: 'min read', read: 'Read article',
    prev: 'Previous slide', next: 'Next slide', slide: 'Slide', allCats: 'All',
    noResults: 'No articles found', noResultsDesc: 'Try another search or remove the filter.', reset: 'Reset filters',
    error: 'Could not load articles', retry: 'Try again',
    ctaTitle: 'Hungry after reading?', ctaDesc: 'See the full Persian kebab menu and order online.', ctaBtn: 'View menu',
  },
  ar: {
    badge: 'مجلة المطعم', title: 'مقالات',
    subtitle: 'قصص وراء الأطباق وأسرار المطبخ وثقافة الكباب الفارسي',
    browse: 'تصفح المقالات', latest: 'أحدث المقالات', all: 'كل المقالات', count: 'مقالة',
    search: 'ابحث في المقالات...', clear: 'مسح', min: 'دقيقة', read: 'اقرأ المقال',
    prev: 'الشريحة السابقة', next: 'الشريحة التالية', slide: 'شريحة', allCats: 'الكل',
    noResults: 'لا توجد نتائج', noResultsDesc: 'جرّب عبارة أخرى أو أزل التصفية.', reset: 'إعادة ضبط التصفية',
    error: 'تعذّر تحميل المقالات', retry: 'حاول مرة أخرى',
    ctaTitle: 'جائع بعد القراءة؟', ctaDesc: 'شاهد قائمة الكباب الفارسي كاملة واطلب أونلاين.', ctaBtn: 'عرض القائمة',
  },
};

/* ───────────────────────── Hero slider ───────────────────────── */
// slide 0 = the banner image; the next slides = the newest articles
function HeroSlider({ slides, isRtl, tx, accent, onBrowse }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;
  const cur = count ? idx % count : 0;
  const reduce = typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (reduce || paused || count < 2) return undefined;
    const id = setInterval(() => setIdx((i) => (i + 1) % count), 6000);
    return () => clearInterval(id);
  }, [reduce, paused, count]);

  const go = (d) => setIdx((i) => (i + d + count) % count);
  const PrevIcon = isRtl ? MdChevronRight : MdChevronLeft;
  const NextIcon = isRtl ? MdChevronLeft : MdChevronRight;

  return (
    <section
      aria-roledescription="carousel"
      aria-label={tx.latest}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative h-[340px] sm:h-[400px] md:h-[470px] overflow-hidden bg-[#1a0d10]"
    >
      {slides.map((s, i) => {
        const active = i === cur;
        return (
          <div
            key={s.key}
            aria-hidden={active ? undefined : 'true'}
            className={`absolute inset-0 transition-opacity duration-700 ${active ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
          >
            <img
              src={s.src}
              srcSet={s.srcSet}
              sizes="100vw"
              alt=""
              width="1600"
              height="640"
              loading={i === 0 ? 'eager' : 'lazy'}
              fetchPriority={i === 0 ? 'high' : 'auto'}
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.removeAttribute('srcset');
                e.currentTarget.src = s.fallback || '/images/articles/placeholder.svg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />

            <div className="absolute inset-x-0 bottom-0 pb-14 md:pb-16">
              <div className="max-w-6xl mx-auto px-5 sm:px-8">
                {s.type === 'banner' ? (
                  <>
                    <span
                      className="inline-block px-3 py-1 rounded-full text-xs font-bold text-black mb-3"
                      style={{ background: accent }}
                    >
                      {tx.badge}
                    </span>
                    <p className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight drop-shadow-lg">
                      {tx.title}
                    </p>
                    <p className="mt-3 max-w-2xl text-sm sm:text-base md:text-lg text-white/90 leading-relaxed">
                      {tx.subtitle}
                    </p>
                    <button
                      type="button"
                      tabIndex={active ? 0 : -1}
                      onClick={onBrowse}
                      className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-black shadow-lg transition-transform hover:scale-105 active:scale-95"
                      style={{ background: accent }}
                    >
                      {tx.browse}
                      {isRtl ? <MdArrowBack size={16} /> : <MdArrowForward size={16} />}
                    </button>
                  </>
                ) : (
                  <>
                    {s.category && (
                      <span
                        className="inline-block px-3 py-1 rounded-full text-xs font-bold text-black mb-3"
                        style={{ background: accent }}
                      >
                        {s.category}
                      </span>
                    )}
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-snug max-w-3xl drop-shadow-lg line-clamp-2">
                      {s.title}
                    </h2>
                    {s.text && (
                      <p className="mt-2 max-w-2xl text-sm md:text-base text-white/90 leading-relaxed line-clamp-2">
                        {s.text}
                      </p>
                    )}
                    <Link
                      to={s.href}
                      tabIndex={active ? 0 : -1}
                      className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-black shadow-lg transition-transform hover:scale-105 active:scale-95"
                      style={{ background: accent }}
                    >
                      {tx.read}
                      {isRtl ? <MdArrowBack size={16} /> : <MdArrowForward size={16} />}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {count > 1 && (
        <>
          <button
            type="button"
            aria-label={tx.prev}
            onClick={() => go(-1)}
            className={`hidden sm:flex absolute top-1/2 -translate-y-1/2 z-20 w-11 h-11 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition-colors ${isRtl ? 'right-4' : 'left-4'}`}
          >
            <PrevIcon size={26} />
          </button>
          <button
            type="button"
            aria-label={tx.next}
            onClick={() => go(1)}
            className={`hidden sm:flex absolute top-1/2 -translate-y-1/2 z-20 w-11 h-11 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition-colors ${isRtl ? 'left-4' : 'right-4'}`}
          >
            <NextIcon size={26} />
          </button>
          <div className="absolute bottom-4 inset-x-0 z-20 flex justify-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.key}
                type="button"
                aria-label={`${tx.slide} ${i + 1}`}
                aria-current={i === cur ? 'true' : undefined}
                onClick={() => setIdx(i)}
                className={`h-2.5 rounded-full transition-all duration-300 ${i === cur ? 'w-8 bg-white' : 'w-2.5 bg-white/50 hover:bg-white/80'}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

/* ───────────────────────── Page ───────────────────────── */
export default function Articles() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 9;
  const listRef = useRef(null);

  const lang = (i18n.language || 'en').slice(0, 2);
  const tx = L[lang] || L.en;
  const isRtl = lang === 'fa' || lang === 'ar';
  const isDark = theme === 'dark';
  const locale = lang === 'fa' ? 'fa-IR' : lang === 'ar' ? 'ar-QA' : 'en-US';

  // text of a multilingual field (the old code used i18n.language directly, so "en-US" fell back to Persian)
  const pick = (v) => {
    if (!v) return '';
    if (typeof v === 'string') return v;
    return v[lang] || v.en || v.fa || v.ar || '';
  };
  const catLabel = (key) => t(`articles.categories.${key}`, key.replace(/-/g, ' '));
  const articleCategory = (a) => (typeof a.category === 'object' && a.category ? pick(a.category) : a.category ? catLabel(a.category) : '');

  const { articles, loading, error, total } = useArticles(category, search, page, limit);
  // one extra request: newest articles for the slider + which categories really have articles
  const { articles: pool } = useArticles('all', '', 1, 100);

  const accent = isDark ? '#F4B41A' : '#D32F2F';
  const bg = isDark ? 'bg-[#0F0F0F]' : 'bg-[#F7F0E6]';
  const surface = isDark ? 'bg-[#1C1C1C]' : 'bg-white';
  const textMain = isDark ? 'text-[#F7F0E6]' : 'text-[#3E2723]';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-600';

  const cats = useMemo(() => {
    const counts = {};
    (pool || []).forEach((a) => {
      if (typeof a.category === 'string' && a.category) counts[a.category] = (counts[a.category] || 0) + 1;
    });
    const keys = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
    return keys.length ? keys.map((k) => ({ key: k, count: counts[k] })) : FALLBACK_CATEGORIES.map((k) => ({ key: k }));
  }, [pool]);

  const slides = useMemo(() => {
    const banner = {
      key: 'banner',
      type: 'banner',
      src: `${HERO_BASE}-1600.webp`,
      srcSet: `${HERO_BASE}-800.webp 800w, ${HERO_BASE}-1600.webp 1600w`,
      fallback: HERO_FALLBACK,
    };
    const items = (pool || []).slice(0, 3).map((a) => ({
      key: a._id || a.slug,
      type: 'article',
      src: getArticleImageUrl(a),
      title: pick(a.title),
      text: pick(a.excerpt),
      category: articleCategory(a),
      href: `/articles/${a.slug}`,
    }));
    return [banner, ...items];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool, lang]);

  const totalPages = Math.ceil((total || 0) / limit);

  const scrollToList = () => listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const goPage = (p) => {
    setPage(p);
    requestAnimationFrame(scrollToList);
  };

  const fmtDate = (d) => {
    const dt = new Date(d);
    return Number.isNaN(dt.getTime()) ? '' : dt.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const chip = (active) =>
    `px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors border ${
      active
        ? isDark
          ? 'bg-[#F4B41A] text-black border-[#F4B41A]'
          : 'bg-[#D32F2F] text-white border-[#D32F2F]'
        : isDark
        ? 'bg-[#1C1C1C] text-gray-200 border-white/10 hover:border-[#F4B41A]/40'
        : 'bg-white text-gray-700 border-black/10 hover:border-[#D32F2F]/40'
    }`;

  return (
    <div className={`min-h-screen ${bg} ${textMain} transition-colors duration-300`}>
      <h1 className="sr-only">{tx.title} | Kabab Dagh Nan Dagh</h1>

      <HeroSlider slides={slides} isRtl={isRtl} tx={tx} accent={accent} onBrowse={scrollToList} />

      <div ref={listRef} className="max-w-6xl mx-auto px-4 pt-10 pb-6 scroll-mt-20">
        {/* title + search */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-black">{tx.all}</h2>
            <p className={`mt-1 text-sm ${textMuted}`}>
              {total || 0} {tx.count}
            </p>
          </div>
          <div className="relative w-full md:max-w-sm">
            <MdSearch
              size={20}
              aria-hidden="true"
              className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-4' : 'left-4'} ${textMuted}`}
            />
            <input
              type="search"
              value={search}
              aria-label={tx.search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={tx.search}
              className={`w-full ${isRtl ? 'pr-12 pl-16' : 'pl-12 pr-16'} py-3 rounded-2xl text-sm font-medium outline-none border transition-shadow focus:shadow-lg ${
                isDark
                  ? 'bg-[#1C1C1C] border-white/10 text-white placeholder-gray-500 focus:border-[#F4B41A]/50'
                  : 'bg-white border-black/10 text-[#3E2723] placeholder-gray-500 focus:border-[#D32F2F]/40'
              }`}
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setPage(1);
                }}
                className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? 'left-3' : 'right-3'} text-xs font-bold px-2 py-1 rounded-lg ${
                  isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-[#D32F2F]'
                }`}
              >
                {tx.clear}
              </button>
            )}
          </div>
        </div>

        {/* categories (only those that really have articles) */}
        <div className="flex gap-2 overflow-x-auto py-5 scrollbar-hide">
          <button
            type="button"
            onClick={() => {
              setCategory('all');
              setPage(1);
            }}
            className={chip(category === 'all')}
          >
            {tx.allCats}
          </button>
          {cats.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => {
                setCategory(c.key);
                setPage(1);
              }}
              className={chip(category === c.key)}
            >
              {catLabel(c.key)}
              {c.count ? ` (${c.count})` : ''}
            </button>
          ))}
        </div>

        {/* list */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-busy="true">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`rounded-2xl overflow-hidden border ${isDark ? 'bg-[#1C1C1C] border-white/5' : 'bg-white border-black/5'}`}>
                <div className={`h-48 ${isDark ? 'bg-gray-800' : 'bg-gray-100'} animate-pulse`} />
                <div className="p-5 space-y-3">
                  <div className={`h-4 rounded-lg w-3/4 ${isDark ? 'bg-gray-800' : 'bg-gray-100'} animate-pulse`} />
                  <div className={`h-3 rounded-lg w-full ${isDark ? 'bg-gray-800' : 'bg-gray-100'} animate-pulse`} />
                  <div className={`h-3 rounded-lg w-2/3 ${isDark ? 'bg-gray-800' : 'bg-gray-100'} animate-pulse`} />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-bold mb-2">{tx.error}</h3>
            <p className={`text-sm ${textMuted} mb-6`}>{String(error)}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white"
              style={{ background: isDark ? '#B8860B' : '#D32F2F' }}
            >
              {tx.retry}
            </button>
          </div>
        ) : !articles || articles.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-16">
            <h3 className="text-xl font-bold mb-2">{tx.noResults}</h3>
            <p className={`text-sm mb-6 ${textMuted}`}>{tx.noResultsDesc}</p>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setCategory('all');
                setPage(1);
              }}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white"
              style={{ background: isDark ? '#B8860B' : '#D32F2F' }}
            >
              {tx.reset}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((a) => (
              <Link
                key={a._id || a.slug}
                to={`/articles/${a.slug}`}
                className={`group flex flex-col h-full rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${surface} ${
                  isDark ? 'border-white/5 hover:border-[#F4B41A]/30' : 'border-black/5 hover:border-[#D32F2F]/20'
                }`}
              >
                <div className="relative h-48 overflow-hidden bg-gray-200">
                  <img
                    src={getArticleImageUrl(a)}
                    alt={pick(a.title)}
                    width="640"
                    height="384"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/images/articles/placeholder.svg';
                    }}
                  />
                  {articleCategory(a) && (
                    <span
                      className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'} px-2.5 py-1 rounded-lg text-[11px] font-bold text-black`}
                      style={{ background: accent }}
                    >
                      {articleCategory(a)}
                    </span>
                  )}
                </div>
                <div className="flex flex-col flex-1 p-5">
                  <h3 className="text-base md:text-lg font-bold mb-2 line-clamp-2">{pick(a.title)}</h3>
                  <p className={`text-sm leading-relaxed mb-4 line-clamp-3 flex-1 ${textMuted}`}>{pick(a.excerpt)}</p>
                  <div className={`flex items-center justify-between text-xs font-medium ${textMuted}`}>
                    <span className="flex items-center gap-1.5">
                      <MdAccessTime size={14} aria-hidden="true" />
                      {a.readTime || 5} {tx.min}
                    </span>
                    {a.publishedAt && fmtDate(a.publishedAt) && (
                      <span className="flex items-center gap-1.5">
                        <MdCalendarToday size={13} aria-hidden="true" />
                        {fmtDate(a.publishedAt)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* pagination */}
        {!loading && !error && totalPages > 1 && (
          <nav className="flex items-center justify-center gap-2 mt-12" aria-label="Pagination">
            <button
              type="button"
              aria-label={tx.prev}
              onClick={() => goPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className={`w-10 h-10 rounded-xl flex items-center justify-center border ${page === 1 ? 'opacity-40 cursor-not-allowed' : ''} ${
                isDark ? 'border-white/10' : 'border-black/10'
              }`}
            >
              {isRtl ? <MdArrowForward size={18} /> : <MdArrowBack size={18} />}
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} type="button" onClick={() => goPage(p)} aria-current={page === p ? 'page' : undefined} className={`w-10 h-10 rounded-xl text-sm font-bold border ${chip(page === p).split(' ').filter((c) => !c.startsWith('px-') && !c.startsWith('py-')).join(' ')}`}>
                {p}
              </button>
            ))}
            <button
              type="button"
              aria-label={tx.next}
              onClick={() => goPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className={`w-10 h-10 rounded-xl flex items-center justify-center border ${page === totalPages ? 'opacity-40 cursor-not-allowed' : ''} ${
                isDark ? 'border-white/10' : 'border-black/10'
              }`}
            >
              {isRtl ? <MdArrowBack size={18} /> : <MdArrowForward size={18} />}
            </button>
          </nav>
        )}
      </div>

      {/* call to action: menu */}
      <section className="max-w-6xl mx-auto px-4 pb-14 pt-4">
        <div className={`flex flex-col md:flex-row items-center justify-between gap-5 rounded-3xl p-8 md:p-10 border ${surface} ${isDark ? 'border-white/5' : 'border-black/5'}`}>
          <div className="text-center md:text-start">
            <h2 className="text-xl md:text-2xl font-black">{tx.ctaTitle}</h2>
            <p className={`mt-2 text-sm md:text-base ${textMuted}`}>{tx.ctaDesc}</p>
          </div>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-bold text-black shadow-lg transition-transform hover:scale-105 active:scale-95 shrink-0"
            style={{ background: accent }}
          >
            <MdRestaurantMenu size={18} aria-hidden="true" />
            {tx.ctaBtn}
          </Link>
        </div>
      </section>
    </div>
  );
}
