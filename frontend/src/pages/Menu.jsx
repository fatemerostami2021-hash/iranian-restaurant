import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { MdSearch } from 'react-icons/md';
import { useDishes } from '../hooks/useDishes';
import CategoryFilter from '../components/menu/CategoryFilter';
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
  const [quickViewDish, setQuickViewDish] = useState(null);
  const { dishes, loading, error } = useDishes(category);
  const hasScrolled = useRef(false);
  const lang = i18n.language;

  const bgClass = isDark ? 'bg-[#1C1C1C]' : 'bg-[#FFF8F0]';
  const textClass = isDark ? 'text-[#F7F0E6]' : 'text-[#1A1A1A]';
  const mutedClass = isDark ? 'text-gray-400' : 'text-[#666666]';
  const inputBg = isDark ? 'bg-[#2D2D2D]' : 'bg-gray-100';
  const inputText = isDark ? 'text-[#F7F0E6]' : 'text-[#1A1A1A]';
  const borderClass = isDark ? 'border-[#3E2723]' : 'border-[#E8DDD0]';

  useEffect(() => {
    setCategory(urlCategory);
  }, [urlCategory]);

  const handleCategoryChange = (key) => {
    setCategory(key);
  };

  const filteredDishes = dishes.filter((dish) => {
    if (!searchTerm) return true;
    const name = dish.name?.[lang] || dish.name?.en || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase());
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
      <section className={`max-w-6xl mx-auto px-4 py-12 ${bgClass}`}>
        <div className="flex items-center gap-3 mb-8">
          <h1 className={`text-3xl font-bold ${textClass}`}>{t('menu.title')}</h1>
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
    return <p className="text-center text-red-500 py-10">{error}</p>;
  }

  return (
    <section className={`max-w-6xl mx-auto px-4 py-12 ${bgClass} transition-colors duration-300`}>
      {/* ===== هدر ===== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className={`text-3xl font-bold ${textClass}`}>
          {t('menu.title')}
        </h1>
        <div className={`flex items-center gap-2 ${inputBg} rounded-xl px-4 py-2 flex-1 max-w-sm transition-colors duration-300 border ${borderClass}`}>
          <MdSearch className={mutedClass} size={20} />
          <input
            type="text"
            placeholder={lang === 'fa' ? 'جستجو در منو...' : lang === 'ar' ? 'ابحث في القائمة...' : 'Search menu...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`bg-transparent outline-none flex-1 ${inputText}`}
          />
        </div>
      </div>

      {/* ===== فیلتر ===== */}
      <CategoryFilter active={category} onChange={handleCategoryChange} />

      {/* ===== لیست غذاها ===== */}
      {filteredDishes.length === 0 ? (
        <p className={`text-center ${mutedClass} py-10`}>
          {searchTerm ? 'هیچ غذایی با این نام پیدا نشد' : t('all') + ' - No items'}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDishes.map((dish) => (
            <DishCard
              key={dish._id}
              dish={dish}
              highlight={dish._id === highlightId}
              onQuickView={setQuickViewDish}
            />
          ))}
        </div>
      )}

      {/* ===== مودال ===== */}
      <QuickViewModal 
        dish={quickViewDish} 
        onClose={() => setQuickViewDish(null)} 
      />
    </section>
  );
}
