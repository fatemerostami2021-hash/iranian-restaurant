import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiX, FiAward } from 'react-icons/fi';
import { useDishes } from '../hooks/useDishes';
import DishCard from '../components/menu/DishCard';
import QuickViewModal from '../components/menu/QuickViewModal';
import { useTheme } from '../context/ThemeContext';

export default function Menu() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get('highlight');
  const urlCategory = searchParams.get('category') || 'all';

  const [category, setCategory] = useState(urlCategory);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialFilter, setSpecialFilter] = useState('all'); // all, best
  const [quickViewDish, setQuickViewDish] = useState(null);
  const { dishes, loading, error } = useDishes(category);
  const hasScrolled = useRef(false);
  const lang = i18n.language;

  // استایل‌های theme
  const bgClass = isDark ? 'bg-[#1C1C1C]' : 'bg-[#FFF8F0]';
  const textClass = isDark ? 'text-[#F7F0E6]' : 'text-[#1A1A1A]';
  const mutedClass = isDark ? 'text-gray-400' : 'text-[#666666]';
  const cardBg = isDark ? 'bg-[#2D2D2D] border-[#3E2723]' : 'bg-white border-[#E8DDD0]';
  const accentBg = isDark ? 'bg-[#FFD700] text-black' : 'bg-[#D32F2F] text-white';

  useEffect(() => { setCategory(urlCategory); }, [urlCategory]);

  // کدهای غذاهای پرفروش (بر اساس دیتابیس)
  const bestSellerCodes = ['0018', '0029', '0010', '0064'];

  const filteredDishes = dishes.filter((dish) => {
    // فیلتر جستجو
    const name = dish.name?.[lang] || dish.name?.en || '';
    const matchesSearch = searchTerm ? name.toLowerCase().includes(searchTerm.toLowerCase()) : true;

    // فیلتر پیشنهادهای ویژه
    let matchesSpecial = true;
    if (specialFilter === 'best') {
      matchesSpecial = bestSellerCodes.includes(dish.code);
    }

    return matchesSearch && matchesSpecial;
  });

  useEffect(() => {
    if (!loading && highlightId && !hasScrolled.current) {
      const el = document.getElementById(`dish-${highlightId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        hasScrolled.current = true;
      }
    }
  }, [loading, dishes, highlightId]);

  if (loading) {
    return (
      <section className={`max-w-7xl mx-auto px-4 py-12 ${bgClass}`}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="hidden lg:block h-96 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-2xl h-64 animate-pulse" />)}
          </div>
        </div>
      </section>
    );
  }

  if (error) return <p className="text-center text-red-500 py-10">{error}</p>;

  const categories = [
    { key: 'all', label: t('menu.categories.all') },
    { key: 'breakfast', label: t('menu.categories.breakfast') },
    { key: 'main', label: t('menu.categories.main') },
    { key: 'combo', label: t('menu.categories.combo') },
    { key: 'appetizer', label: t('menu.categories.appetizer') },
    { key: 'drinks', label: t('menu.categories.drinks') },
  ];

  return (
    <section className={`max-w-7xl mx-auto px-4 py-12 ${bgClass} transition-colors duration-300`}>
      {/* هدر صفحه */}
      <div className="mb-10 text-center lg:text-right">
        <h1 className={`text-4xl font-black mb-2 ${textClass}`}>{t('menu.title')}</h1>
        <p className={mutedClass}>بهترین طعم‌های اصیل ایرانی و عربی در انتظار شماست</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* ===== سایدبار فیلترینگ ===== */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            
            {/* جستجو */}
            <div className={`p-4 rounded-2xl border ${cardBg} shadow-sm`}>
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl px-3 py-2">
                <FiSearch className={mutedClass} />
                <input
                  type="text"
                  placeholder={lang === 'fa' ? 'جستجو در منو...' : 'Search menu...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent outline-none flex-1 text-sm"
                />
                {searchTerm && <FiX onClick={() => setSearchTerm('')} className="cursor-pointer" />}
              </div>
            </div>

            {/* دسته‌بندی‌ها */}
            <div className={`p-4 rounded-2xl border ${cardBg} shadow-sm`}>
              <h3 className={`font-bold mb-4 flex items-center gap-2 ${textClass}`}><FiFilter /> دسته‌بندی‌ها</h3>
              <div className="flex flex-col gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => { setCategory(cat.key); setSpecialFilter('all'); }}
                    className={`text-right px-4 py-2 rounded-xl transition-all duration-300 text-sm font-medium ${
                      category === cat.key && specialFilter === 'all'
                        ? accentBg
                        : `${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-100'} ${textClass}`
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* پیشنهادهای ویژه (پرفروش‌ترین‌ها) */}
            <div className={`p-4 rounded-2xl border ${cardBg} shadow-sm`}>
              <h3 className={`font-bold mb-4 flex items-center gap-2 ${textClass}`}><FiAward className="text-[#FFD700]" /> پیشنهادهای ویژه</h3>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setSpecialFilter('best')}
                  className={`text-right px-4 py-3 rounded-xl transition-all duration-300 text-sm font-bold border ${
                    specialFilter === 'best' 
                      ? `border-transparent ${accentBg}`
                      : `border-dashed ${isDark ? 'border-white/20 hover:bg-white/5' : 'border-gray-300 hover:bg-gray-50'} ${textClass}`
                  }`}
                >
                  🍴 پرفروش‌ترین‌ها
                </button>
              </div>
              {specialFilter === 'best' && (
                <p className="text-xs mt-3 text-gray-500">
                  شامل: باجه داغ، مهیاوه، مشکل گریل و اش سبزی
                </p>
              )}
            </div>

          </div>
        </aside>

        {/* ===== لیست غذاها ===== */}
        <div className="lg:col-span-3">
          
          {/* فیلتر موبایل (فقط در موبایل نمایش داده می‌شود) */}
          <div className="lg:hidden mb-6 overflow-x-auto pb-2">
            <div className="flex gap-2 min-w-max">
              <button
                onClick={() => { setSpecialFilter('best'); }}
                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${specialFilter === 'best' ? accentBg : `${cardBg} ${textClass}`}`}
              >
                🍴پرفروش‌ترین‌ها
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => { setCategory(cat.key); setSpecialFilter('all'); }}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                    category === cat.key && specialFilter === 'all' ? accentBg : `${cardBg} ${textClass}`
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {filteredDishes.length === 0 ? (
            <div className={`text-center py-20 border-2 border-dashed rounded-3xl ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
              <p className={`${mutedClass} text-lg`}>هیچ غذایی با این مشخصات یافت نشد</p>
            </div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {filteredDishes.map((dish) => (
                <DishCard
                  key={dish._id}
                  dish={dish}
                  highlight={dish._id === highlightId}
                  onQuickView={setQuickViewDish}
                />
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* مودال */}
      <QuickViewModal dish={quickViewDish} onClose={() => setQuickViewDish(null)} />
    </section>
  );
}