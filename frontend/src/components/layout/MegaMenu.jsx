import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';
import {
  MdBreakfastDining,
  MdDinnerDining,
  MdLocalCafe,
  MdFastfood
} from 'react-icons/md';
import { GiHotMeal } from 'react-icons/gi';

const menuCategories = [
  {
    key: 'breakfast',
    labelKey: 'breakfast',
    icon: MdBreakfastDining,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    items: [
      { nameKey: 'baja_dag', slug: 'baja-dag' },
      { nameKey: 'ash_sabzi', slug: 'ash-sabzi' },
      { nameKey: 'cheese_bread', slug: 'cheese-bread' },
      { nameKey: 'foul', slug: 'foul' },
      { nameKey: 'liver', slug: 'liver' }
    ]
  },
  {
    key: 'main',
    labelKey: 'main',
    icon: GiHotMeal,
    color: 'text-red-600',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    items: [
      { nameKey: 'mix_tikka', slug: 'mix-tikka' },
      { nameKey: 'kofta', slug: 'kofta' },
      { nameKey: 'chicken_saffron', slug: 'chicken-saffron' },
      { nameKey: 'lamb_chops', slug: 'lamb-chops' },
      { nameKey: 'kabab_barg', slug: 'kabab-barg' }
    ]
  },
  {
    key: 'combo',
    labelKey: 'combo',
    icon: MdDinnerDining,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    items: [
      { nameKey: 'tray_5', slug: 'tray-5' },
      { nameKey: 'tray_10', slug: 'tray-10' },
      { nameKey: 'tray_15', slug: 'tray-15' },
      { nameKey: 'tray_20', slug: 'tray-20' }
    ]
  },
  {
    key: 'appetizer',
    labelKey: 'appetizer',
    icon: MdFastfood,
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    items: [
      { nameKey: 'salad_shirazi', slug: 'salad-shirazi' },
      { nameKey: 'yogurt_cucumber', slug: 'yogurt-cucumber' },
      { nameKey: 'hummus', slug: 'hummus' },
      { nameKey: 'tandoor_bread', slug: 'tandoor-bread' },
      { nameKey: 'french_fries', slug: 'french-fries' }
    ]
  },
  {
    key: 'drinks',
    labelKey: 'drinks',
    icon: MdLocalCafe,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    items: [
      { nameKey: 'tea', slug: 'tea' },
      { nameKey: 'soda', slug: 'soda' },
      { nameKey: 'doogh', slug: 'doogh' },
      { nameKey: 'water', slug: 'water' },
      { nameKey: 'leben', slug: 'leben' }
    ]
  }
];

export default function MegaMenu({ isOpen, onClose }) {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const timeoutRef = useRef(null);
  const menuRef = useRef(null);

  // ===== تاخیر برای بستن =====
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      onClose();
      setSelectedCategory(null);
    }, 300); // 300ms تاخیر
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // ===== پاک کردن تایمر هنگام unmount =====
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="fixed left-0 right-0 top-[64px] w-full bg-white/95 dark:bg-surface-dark/95 backdrop-blur-md shadow-2xl border-t border-gray-100 dark:border-gray-800 z-50"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {menuCategories.map(({ key, labelKey, icon: Icon, color, bgColor, items }) => {
            const isSelected = selectedCategory === key;
            return (
              <div
                key={key}
                className={`
                  ${bgColor} rounded-xl p-4 border transition-all duration-200
                  ${isSelected 
                    ? 'border-[#F4B41A] shadow-lg shadow-[#F4B41A]/20 scale-[1.02]' 
                    : 'border-gray-100 dark:border-gray-700 hover:shadow-md'
                  }
                `}
                onMouseEnter={() => setSelectedCategory(key)}
              >
                <Link
                  to={`/menu/category/${key}`}
                  className={`flex items-center gap-2 text-sm font-bold ${color} mb-3 hover:underline`}
                  onClick={() => {
                    onClose();
                    setSelectedCategory(null);
                  }}
                >
                  <Icon size={20} />
                  {t(labelKey)}
                </Link>

                <ul className="space-y-1.5">
                  {items.map((item, index) => (
                    <li key={index}>
                      <Link
                        to={`/menu/${item.slug}`}
                        className="text-sm text-gray-700 dark:text-gray-300 hover:text-[#F4B41A] transition-colors flex items-center gap-2 group"
                        onClick={() => {
                          onClose();
                          setSelectedCategory(null);
                        }}
                      >
                        <span className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full group-hover:bg-[#F4B41A] transition-colors" />
                        {t(item.nameKey)}
                      </Link>
                    </li>
                  ))}
                  <li className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
                    <Link
                      to={`/menu/category/${key}`}
                      className="text-xs font-medium text-[#F4B41A] hover:underline flex items-center gap-1"
                      onClick={() => {
                        onClose();
                        setSelectedCategory(null);
                      }}
                    >
                      {t('view_all')} &rarr;
                    </Link>
                  </li>
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
