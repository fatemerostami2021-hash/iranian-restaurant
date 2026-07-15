import { useTranslation } from 'react-i18next';
import { FiX, FiPlus } from 'react-icons/fi';
import { useState } from 'react';
import { getDishImageUrl, PLACEHOLDER_IMAGE } from '../../services/dishService';
import { useCart } from '../../context/CartContext';

export default function QuickViewModal({ dish, onClose }) {
  const { i18n, t } = useTranslation();
  const { addItem } = useCart();
  const [imgSrc, setImgSrc] = useState(dish ? getDishImageUrl(dish) : '');

  if (!dish) return null;
  const lang = i18n.language;
  const name = dish.name?.[lang] || dish.name?.en || '';
  const description = dish.description?.[lang] || dish.description?.en || '';

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-surface-metal rounded-2xl overflow-hidden max-w-md w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-video bg-gray-50 dark:bg-surface-dark">
          <img
            src={imgSrc}
            alt={name}
            onError={() => setImgSrc(PLACEHOLDER_IMAGE)}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-3 end-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition"
            type="button"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{name}</h2>
            <span className="text-lg font-bold text-[#d4af37]">{dish.price} QR</span>
          </div>

          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{description}</p>
          )}

          {dish.unit && dish.unit !== '-' && (
            <span className="inline-block text-xs text-gray-400 bg-gray-50 dark:bg-surface-dark px-3 py-1 rounded-full mb-4">
              {dish.unit}
            </span>
          )}

          <button
            onClick={() => {
              addItem({ _id: dish._id, code: dish.code, name: dish.name, price: dish.price });
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-full transition"
            type="button"
          >
            <FiPlus size={16} />
            {t('menu.addToCart')}
          </button>
        </div>
      </div>
    </div>
  );
}
