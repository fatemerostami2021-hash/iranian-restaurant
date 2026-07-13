import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MdMenuBook, MdSearch } from 'react-icons/md';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

const categories = [
  { key: 'all', label: 'همه' },
  { key: 'breakfast', label: 'صبحانه' },
  { key: 'main', label: 'غذای اصلی' },
  { key: 'combo', label: 'سینی‌ها' },
  { key: 'appetizer', label: 'پیش‌غذا' },
  { key: 'drinks', label: 'نوشیدنی‌ها' },
];

export default function Menu() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const lang = i18n.language;

  useEffect(() => {
    fetchDishes();
  }, []);

  const fetchDishes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/dishes');
      setDishes(response.data);
    } catch (error) {
      console.error('Error fetching dishes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDishes = dishes.filter(dish => {
    const matchesCategory = activeCategory === 'all' || dish.category === activeCategory;
    const name = dish.name?.[lang] || dish.name?.en || '';
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // کلاس‌های تم
  const bgClass = theme === 'dark' ? 'bg-[#1C1C1C]' : 'bg-[#F7F0E6]';
  const cardBgClass = theme === 'dark' ? 'bg-[#2D2D2D]' : 'bg-white';
  const textClass = theme === 'dark' ? 'text-[#F7F0E6]' : 'text-[#3E2723]';
  const textMutedClass = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const borderClass = theme === 'dark' ? 'border-[#3E2723]' : 'border-[#E0D5C8]';
  const inputBgClass = theme === 'dark' ? 'bg-[#2D2D2D]' : 'bg-gray-100';

  if (loading) {
    return (
      <section className={`max-w-6xl mx-auto px-4 py-12 ${bgClass}`}>
        <div className="flex items-center gap-3 mb-8">
          <MdMenuBook size={32} className="text-[#F4B41A] animate-pulse" />
          <h1 className="text-3xl font-bold text-[#F4B41A]">
            {t('menu.title')}
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className={`${cardBgClass} rounded-2xl h-48 animate-pulse ${borderClass} border`} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className={`max-w-6xl mx-auto px-4 py-12 ${bgClass} transition-colors duration-300`}>
      {/* هدر */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <MdMenuBook size={32} className="text-[#F4B41A]" />
          <h1 className={`text-3xl font-bold ${textClass}`}>
            {t('menu.title')}
          </h1>
          <span className={`text-sm ${textMutedClass}`}>
            ({filteredDishes.length})
          </span>
        </div>

        {/* جستجو */}
        <div className={`flex items-center gap-2 ${inputBgClass} rounded-xl px-4 py-2 flex-1 max-w-md transition-colors duration-300`}>
          <MdSearch className={`${textMutedClass}`} size={20} />
          <input
            type="text"
            placeholder={t('menu.search') || 'جستجو...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`bg-transparent outline-none flex-1 ${textClass} placeholder:${textMutedClass}`}
          />
        </div>
      </div>

      {/* دسته‌بندی‌ها */}
      <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto pb-2">
        {categories.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
              ${activeCategory === key 
                ? 'bg-[#F4B41A] text-white shadow-lg shadow-[#F4B41A]/30' 
                : `${cardBgClass} ${textClass} hover:bg-[#F4B41A]/10 hover:text-[#F4B41A] ${borderClass} border`
              }
            `}
          >
            {label}
          </button>
        ))}
      </div>

      {/* لیست غذاها */}
      {filteredDishes.length === 0 ? (
        <div className="text-center py-12">
          <p className={`${textMutedClass}`}>هیچ غذایی پیدا نشد</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDishes.map((dish) => (
            <div 
              key={dish._id}
              className={`
                ${cardBgClass} rounded-2xl p-6 border ${borderClass}
                transition-all duration-300 ease-out
                hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02]
                hover:border-[#F4B41A]/50
                group relative overflow-hidden
              `}
            >
              {/* افکت گرادیان در هاور */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-[#F4B41A]/5 to-[#E67E22]/5 pointer-events-none" />
              
              {/* خط طلایی بالای کارت در هاور */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F4B41A] to-[#E67E22] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

              <div className="flex justify-between items-start mb-3 relative z-10">
                <h3 className={`text-lg font-bold ${textClass} group-hover:text-[#F4B41A] transition-colors duration-300`}>
                  {dish.name?.[lang] || dish.name?.en || 'Unnamed'}
                </h3>
                <span className="text-sm font-bold text-[#F4B41A] bg-[#F4B41A]/10 px-3 py-1 rounded-full">
                  {dish.price} QR
                </span>
              </div>

              {dish.description?.[lang] && (
                <p className={`text-sm ${textMutedClass} mb-3 line-clamp-2 relative z-10`}>
                  {dish.description[lang]}
                </p>
              )}

              <div className="flex items-center justify-between text-xs mt-4 pt-3 border-t border-[var(--border-color)] relative z-10">
                <span className={textMutedClass}>
                  {dish.unit || '-'}
                </span>
                <span className={`px-2 py-0.5 rounded-full ${
                  dish.inStock 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                    : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                }`}>
                  {dish.inStock ? 'موجود' : 'ناموجود'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
