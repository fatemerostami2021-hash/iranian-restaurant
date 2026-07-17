import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiPlus } from 'react-icons/fi';
import { getDishImageUrl, PLACEHOLDER_IMAGE } from '../../services/dishService';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';

export default function DishCard({ dish, highlight, onQuickView }) {
  const { i18n, t } = useTranslation();
  const { theme } = useTheme();
  const { addItem } = useCart();
  const isDark = theme === 'dark';
  const [imgSrc, setImgSrc] = useState(getDishImageUrl(dish) || PLACEHOLDER_IMAGE);

  const lang = i18n.language;
  const name = dish.name?.[lang] || dish.name?.en || '';
  const description = dish.description?.[lang] || dish.description?.en || '';

  // ===== کلاس‌های پویا بر اساس تم =====
  const cardBg = isDark ? 'bg-[#2D2D2D]' : 'bg-white';
  const textColor = isDark ? 'text-[#F7F0E6]' : 'text-[#1A1A1A]';
  const mutedColor = isDark ? 'text-gray-400' : 'text-[#666666]';
  const borderClass = isDark ? 'border-[#3E2723]' : 'border-[#E8DDD0]';
  const priceColor = isDark ? 'text-[#FFD700]' : 'text-[#D32F2F]';
  const highlightClass = isDark 
    ? 'ring-2 ring-[#FFD700] shadow-lg shadow-[#FFD700]/30 scale-[1.02] border-[#FFD700]' 
    : 'ring-2 ring-[#D32F2F] shadow-lg shadow-[#D32F2F]/30 scale-[1.02] border-[#D32F2F]';
  const btnBg = isDark ? 'bg-[#FFD700] hover:bg-[#F9A825] text-[#1A1A1A]' : 'bg-[#D32F2F] hover:bg-[#B71C1C] text-white';
  const unitBg = isDark ? 'bg-[#1C1C1C]' : 'bg-gray-50';

  const handleAdd = (e) => {
    e.stopPropagation();
    addItem({
      _id: dish._id,
      code: dish.code,
      name: dish.name,
      price: dish.price,
    });
  };

  const handleCardClick = () => {
    if (onQuickView) {
      onQuickView(dish);
    }
  };

  return (
    <div
      id={`dish-${dish._id}`}
      className={`
        ${cardBg} rounded-2xl overflow-hidden shadow-sm transition-all duration-300 border ${borderClass}
        ${highlight ? highlightClass : 'hover:shadow-xl hover:-translate-y-1'}
        cursor-pointer
      `}
      onClick={handleCardClick}
    >
      {/* ===== تصویر ===== */}
      <div className="aspect-square bg-gray-50 dark:bg-[#1C1C1C] overflow-hidden">
        <img
          src={imgSrc}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          loading="lazy"
          onError={() => setImgSrc(PLACEHOLDER_IMAGE)}
        />
      </div>

      {/* ===== محتوا ===== */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className={`font-bold ${textColor} text-sm leading-tight line-clamp-1`}>
            {name}
          </h3>
          <span className={`shrink-0 font-bold text-sm ${priceColor}`}>
            {dish.price} QR
          </span>
        </div>

        {description && (
          <p className={`text-xs ${mutedColor} line-clamp-2 mb-3`}>
            {description}
          </p>
        )}

        <div className="flex items-center justify-between gap-2">
          {dish.unit && dish.unit !== '-' && (
            <span className={`text-[10px] ${mutedColor} ${unitBg} px-2 py-1 rounded-full`}>
              {dish.unit}
            </span>
          )}
          <button
            onClick={handleAdd}
            className={`
              ms-auto flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full 
              transition-all duration-300 hover:scale-105
              ${btnBg}
            `}
            type="button"
          >
            <FiPlus size={14} />
            {t('menu.addToCart')}
          </button>
        </div>
      </div>
    </div>
  );
}
