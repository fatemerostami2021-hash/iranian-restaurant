import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
  MdBreakfastDining,
  MdDinnerDining,
  MdLocalCafe,
  MdFastfood
} from 'react-icons/md';
import { GiHotMeal } from 'react-icons/gi';

const categoryIcons = {
  breakfast: MdBreakfastDining,
  main: GiHotMeal,
  combo: MdDinnerDining,
  appetizer: MdFastfood,
  drinks: MdLocalCafe,
};

const categoryColors = {
  breakfast: 'text-amber-600',
  main: 'text-red-600',
  combo: 'text-orange-600',
  appetizer: 'text-green-600',
  drinks: 'text-blue-600',
};

const categoryBgColors = {
  breakfast: 'bg-amber-50 dark:bg-amber-900/20',
  main: 'bg-red-50 dark:bg-red-900/20',
  combo: 'bg-orange-50 dark:bg-orange-900/20',
  appetizer: 'bg-green-50 dark:bg-green-900/20',
  drinks: 'bg-blue-50 dark:bg-blue-900/20',
};

export default function MegaMenu({ isOpen, onClose }) {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const timeoutRef = useRef(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (isOpen && !hasFetched.current) {
      hasFetched.current = true;
      const fetchCategories = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/dishes/categories');
          setCategories(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching categories:', error);
          setLoading(false);
        }
      };
      fetchCategories();
    }
  }, [isOpen]);

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      onClose();
      setSelectedCategory(null);
    }, 300);
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed left-0 right-0 top-[64px] w-full bg-white/95 dark:bg-surface-dark/95 backdrop-blur-md shadow-2xl border-t border-gray-100 dark:border-gray-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 h-32 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed left-0 right-0 top-[64px] w-full bg-white/95 dark:bg-surface-dark/95 backdrop-blur-md shadow-2xl border-t border-gray-100 dark:border-gray-800 z-50"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((category) => {
            const Icon = categoryIcons[category.key] || MdFastfood;
            const color = categoryColors[category.key] || 'text-gray-600';
            const bgColor = categoryBgColors[category.key] || 'bg-gray-50 dark:bg-gray-900/20';
            const isSelected = selectedCategory === category.key;

            return (
              <div
                key={category.key}
                className={`
                  ${bgColor} rounded-xl p-4 border transition-all duration-200
                  ${isSelected 
                    ? 'border-[#F4B41A] shadow-lg shadow-[#F4B41A]/20 scale-[1.02]' 
                    : 'border-gray-100 dark:border-gray-700 hover:shadow-md'
                  }
                `}
                onMouseEnter={() => setSelectedCategory(category.key)}
              >
                <Link
                  to={`/menu#category-${category.key}`}
                  className={`flex items-center gap-2 text-sm font-bold ${color} mb-3 hover:underline`}
                  onClick={() => {
                    onClose();
                    setSelectedCategory(null);
                  }}
                >
                  <Icon size={20} />
                  {t(category.key)}
                  <span className="text-xs font-normal text-gray-400 mr-auto">
                    ({category.count})
                  </span>
                </Link>

                <ul className="space-y-1.5">
                  {category.items?.slice(0, 5).map((item, index) => {
                    const slug = item?.slug || '';
                    return (
                      <li key={index}>
                        <Link
                          to={`/menu?dish=${slug}`}
                          className="text-sm text-gray-700 dark:text-gray-300 hover:text-[#F4B41A] transition-colors flex items-center gap-2 group"
                          onClick={() => {
                            onClose();
                            setSelectedCategory(null);
                          }}
                        >
                          <span className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full group-hover:bg-[#F4B41A] transition-colors" />
                          {item.name?.fa || item.name?.en || 'بدون نام'}
                        </Link>
                      </li>
                    );
                  })}
                  {category.items?.length > 5 && (
                    <li className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
                      <Link
                        to={`/menu#category-${category.key}`}
                        className="text-xs font-medium text-[#F4B41A] hover:underline flex items-center gap-1"
                        onClick={() => {
                          onClose();
                          setSelectedCategory(null);
                        }}
                      >
                        {t('view_all')} ({category.items.length - 5} more) &rarr;
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
