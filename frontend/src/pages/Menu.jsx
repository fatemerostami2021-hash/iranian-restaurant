import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { MdSearch } from 'react-icons/md';
import { useDishes } from '../hooks/useDishes';
import CategoryFilter from '../components/menu/CategoryFilter';
import DishCard from '../components/menu/DishCard';

export default function Menu() {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const targetSlug = searchParams.get('dish');

  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { dishes, loading, error } = useDishes(category);
  const hasScrolled = useRef(false);

  const lang = i18n.language;

  const filteredDishes = dishes.filter(dish => {
    const name = dish.name?.[lang] || dish.name?.en || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  useEffect(() => {
    if (!loading && targetSlug && !hasScrolled.current) {
      const el = document.getElementById(`dish-${targetSlug}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        hasScrolled.current = true;
      }
    }
  }, [loading, dishes, targetSlug]);

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
            placeholder="جستجو در منو..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent outline-none flex-1 text-gray-700 dark:text-gray-200"
          />
        </div>
      </div>

      <CategoryFilter active={category} onChange={setCategory} />

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
          {searchTerm ? 'هیچ غذایی با این نام پیدا نشد' : t('menu.categories.all') + ' - No items'}
        </p>
      )}

      {!loading && !error && filteredDishes.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredDishes.map((dish) => (
            <DishCard
              key={dish._id}
              dish={dish}
              id={`dish-${dish.slug}`}
              highlight={dish.slug === targetSlug}
            />
          ))}
        </div>
      )}
    </div>
  );
}
