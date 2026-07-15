import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { MdSearch } from 'react-icons/md';
import { useDishes } from '../hooks/useDishes';
import CategoryFilter from '../components/menu/CategoryFilter';
import HexDishCard from '../components/menu/HexDishCard';
import FeaturedSlider from '../components/menu/FeaturedSlider';
import QuickViewModal from '../components/menu/QuickViewModal';

export default function Menu() {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const highlightId = searchParams.get('highlight');
  const urlCategory = searchParams.get('category') || 'all';

  const [category, setCategory] = useState(urlCategory);
  const [searchTerm, setSearchTerm] = useState('');
  const [quickViewDish, setQuickViewDish] = useState(null);
  const { dishes, loading, error } = useDishes(category);
  const { dishes: allDishes } = useDishes('all');
  const hasScrolled = useRef(false);
  const lang = i18n.language;

  useEffect(() => {
    setCategory(urlCategory);
  }, [urlCategory]);

  const handleCategoryChange = (key) => {
    setCategory(key);
    setSearchParams(key === 'all' ? {} : { category: key });
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-primary-dark dark:text-primary-light">
          {t('menu.title')}
        </h1>
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-surface-metal rounded-xl px-4 py-2 flex-1 max-w-sm">
          <MdSearch className="text-gray-400" size={20} />
          <input
            type="text"
            placeholder={lang === 'fa' ? 'جستجو در منو...' : lang === 'ar' ? 'ابحث في القائمة...' : 'Search menu...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent outline-none flex-1 text-gray-700 dark:text-gray-200"
          />
        </div>
      </div>

      {category === 'all' && !searchTerm && <FeaturedSlider dishes={allDishes} />}

      <CategoryFilter active={category} onChange={handleCategoryChange} />

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 dark:bg-surface-metal rounded-2xl aspect-square" />
          ))}
        </div>
      )}

      {error && <p className="text-center text-red-500 py-10">{error}</p>}

      {!loading && !error && filteredDishes.length === 0 && (
        <p className="text-center text-gray-400 py-10">
          {searchTerm ? (lang === 'fa' ? 'هیچ غذایی با این نام پیدا نشد' : 'No items found') : t('all') + ' - No items'}
        </p>
      )}

      {!loading && !error && filteredDishes.length > 0 && (
        <div className="hex-grid">
          {filteredDishes.map((dish) => (
            <HexDishCard
              key={dish._id}
              dish={dish}
              highlight={dish._id === highlightId}
              onQuickView={setQuickViewDish}
            />
          ))}
        </div>
      )}

      <QuickViewModal dish={quickViewDish} onClose={() => setQuickViewDish(null)} />
    </div>
  );
}
