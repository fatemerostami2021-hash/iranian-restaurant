import { useTranslation } from 'react-i18next';

const categories = ['all', 'breakfast', 'main', 'combo', 'appetizer', 'drinks'];

export default function CategoryFilter({ active, onChange }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            active === cat
              ? 'bg-primary text-white'
              : 'bg-gray-100 dark:bg-surface-metal text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-surface-dark'
          }`}
          type="button"
        >
          {t(cat)}
        </button>
      ))}
    </div>
  );
}
