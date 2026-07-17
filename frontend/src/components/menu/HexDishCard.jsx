import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiPlus } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { getDishImageUrl, PLACEHOLDER_IMAGE } from '../../services/dishService';

export default function HexDishCard({ dish, highlight, onQuickView }) {
  const { i18n, t } = useTranslation();
  const { theme } = useTheme();
  const { addItem } = useCart();
  const isDark = theme === 'dark';
  const lang = i18n.language;

  if (!dish) return null;

  const [imgSrc, setImgSrc] = useState(getDishImageUrl(dish) || PLACEHOLDER_IMAGE);

  const name = dish.name?.[lang] || dish.name?.en || '';
  const description = dish.description?.[lang] || dish.description?.en || '';

  const handleAdd = (e) => {
    e.stopPropagation();
    if (!dish) return;
    addItem({
      _id: dish._id,
      code: dish.code,
      name: dish.name,
      price: dish.price,
    });
  };

  return (
    <div
      className={`
        group relative w-full aspect-square rounded-2xl overflow-hidden 
        transition-all duration-500 cursor-pointer
        ${highlight 
          ? 'ring-4 ring-[#D32F2F] shadow-2xl shadow-[#D32F2F]/40 scale-[1.05]' 
          : 'hover:shadow-2xl hover:shadow-[#D32F2F]/20 hover:scale-[1.02]'
        }
        border-2 border-transparent hover:border-[#D32F2F]
        clip-path-hexagon
      `}
      onClick={() => onQuickView?.(dish)}
    >
      <div className="absolute inset-0 bg-gray-100 dark:bg-gray-900 overflow-hidden">
        <img
          src={imgSrc}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
          onError={() => setImgSrc(PLACEHOLDER_IMAGE)}
        />
      </div>

      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D32F2F] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D32F2F] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/5 group-hover:from-black/90 transition-all duration-500" />

      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 text-white z-10">
        <div className="absolute top-4 right-4 bg-[#D32F2F] text-white font-bold text-sm md:text-base px-3 py-1.5 rounded-full shadow-lg shadow-[#D32F2F]/30">
          {dish.price} QR
        </div>

        <h3 className="text-base md:text-lg font-bold line-clamp-1 text-white group-hover:text-[#D32F2F] transition-colors duration-300">
          {name}
        </h3>

        {description && (
          <p className="text-xs md:text-sm text-gray-300 line-clamp-2 mt-1 mb-3">
            {description}
          </p>
        )}

        <div className="flex items-center justify-between gap-2 mt-2">
          <span className="text-xs text-gray-400 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
            {dish.unit || 'سفارش'}
          </span>
          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold text-xs md:text-sm px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 shadow-lg shadow-[#D32F2F]/30 hover:shadow-[#D32F2F]/50"
            type="button"
          >
            <FiPlus size={16} />
            {t('menu.addToCart')}
          </button>
        </div>
      </div>

      <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#D32F2F] rounded-2xl transition-all duration-500 pointer-events-none" />
    </div>
  );
}
