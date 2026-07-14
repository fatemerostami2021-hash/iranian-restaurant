import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowRight } from 'react-icons/fi';
import { useDishes } from '../hooks/useDishes';
import DishCard from '../components/menu/DishCard';

export default function CategoryPage() {
  const { categoryKey } = useParams();
  const { t } = useTranslation();
  const { dishes, loading, error } = useDishes(categoryKey);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Link to="/menu" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary transition mb-4">
        <FiArrowRight className="rtl:rotate-180" size={16} />
        {t('menu.title')}
      </Link>

      <h1 className="text-2xl font-bold text-primary-dark dark:text-primary-light mb-6">
        {t(`menu.categories.${categoryKey}`)}
      </h1>

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 dark:bg-surface-metal rounded-2xl aspect-square" />
          ))}
        </div>
      )}

      {error && <p className="text-center text-red-500 py-10">{error}</p>}

      {!loading && !error && dishes.length === 0 && (
        <p className="text-center text-gray-400 py-10">No items in this category yet.</p>
      )}

      {!loading && !error && dishes.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {dishes.map((dish) => (
            <DishCard key={dish._id} dish={dish} />
          ))}
        </div>
      )}
    </div>
  );
}
