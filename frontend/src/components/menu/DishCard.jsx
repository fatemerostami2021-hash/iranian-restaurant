import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiPlus } from 'react-icons/fi';
import { getDishImageUrl, PLACEHOLDER_IMAGE } from '../../services/dishService';
import { useCart } from '../../context/CartContext';

export default function DishCard({ dish, highlight }) {
  const { i18n, t } = useTranslation();
  const { addItem } = useCart();
  const [imgSrc, setImgSrc] = useState(getDishImageUrl(dish));

  const lang = i18n.language;
  const name = dish.name?.[lang] || dish.name?.en || '';
  const description = dish.description?.[lang] || dish.description?.en || '';

  const handleAdd = (e) => {
    e.stopPropagation();
    addItem({
      _id: dish._id,
      code: dish.code,
      name: dish.name,
      price: dish.price,
    });
  };

  return (
    <div
      id={`dish-${dish._id}`}
      className={`bg-white dark:bg-surface-metal rounded-2xl overflow-hidden shadow-sm transition border ${
        highlight
          ? 'ring-2 ring-primary shadow-lg scale-[1.02] border-primary'
          : 'border-gray-100 dark:border-surface-dark hover:shadow-md'
      }`}
    >
      <div className="aspect-square bg-gray-50 dark:bg-surface-dark overflow-hidden">
        <img
          src={imgSrc}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={() => setImgSrc(PLACEHOLDER_IMAGE)}
        />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-tight">
            {name}
          </h3>
          <span className="shrink-0 text-primary font-bold text-sm">
            {dish.price} QR
          </span>
        </div>

        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
            {description}
          </p>
        )}

        <div className="flex items-center justify-between gap-2">
          {dish.unit && dish.unit !== '-' && (
            <span className="text-[10px] text-gray-400 bg-gray-50 dark:bg-surface-dark px-2 py-1 rounded-full">
              {dish.unit}
            </span>
          )}
          <button
            onClick={handleAdd}
            className="ms-auto flex items-center gap-1 bg-primary hover:bg-primary-dark text-white text-xs font-medium px-3 py-1.5 rounded-full transition"
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
