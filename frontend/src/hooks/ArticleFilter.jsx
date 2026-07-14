import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { MdSearch } from 'react-icons/md';

const categories = [
  { key: 'all', label: 'همه' },
  { key: 'food-stories', label: 'داستان‌های غذا' },
  { key: 'history', label: 'تاریخ و تمدن' },
  { key: 'culture', label: 'فرهنگ و آداب' },
  { key: 'city-stories', label: 'داستان شهرها' },
  { key: 'fun-facts', label: 'سرگرمی و دانستنی‌ها' },
];

export default function ArticleFilter({ activeCategory, onCategoryChange, search, onSearchChange }) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const inputBg = theme === 'dark' ? 'bg-[#2D2D2D]' : 'bg-gray-100';
  const textColor = theme === 'dark' ? 'text-[#F7F0E6]' : 'text-[#3E2723]';
  const mutedColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const borderColor = theme === 'dark' ? 'border-[#3E2723]' : 'border-[#E0D5C8]';
  const cardBg = theme === 'dark' ? 'bg-surface-dark' : 'bg-white';

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
      {/* دسته‌بندی‌ها */}
      <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 w-full md:w-auto">
        {categories.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onCategoryChange(key)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
              ${activeCategory === key 
                ? 'bg-[#F4B41A] text-white shadow-lg shadow-[#F4B41A]/30' 
                : `${cardBg} ${textColor} hover:bg-[#F4B41A]/10 hover:text-[#F4B41A] border ${borderColor}`
              }
            `}
          >
            {label}
          </button>
        ))}
      </div>

      {/* جستجو */}
      <div className={`flex items-center gap-2 ${inputBg} rounded-xl px-4 py-2 w-full md:w-72 transition-colors duration-300 border ${borderColor}`}>
        <MdSearch className={mutedColor} size={20} />
        <input
          type="text"
          placeholder={t('articles.search') || 'جستجو در مقالات...'}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className={`bg-transparent outline-none flex-1 ${textColor} placeholder:${mutedColor}`}
        />
      </div>
    </div>
  );
}
