import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FiPlus, FiHeart, FiEye } from 'react-icons/fi';
import { getDishImageUrl, PLACEHOLDER_IMAGE } from '../../services/dishService';
import { useCart } from '../../context/CartContext';

export default function HexDishCard({ dish, highlight, onQuickView }) {
  const { i18n, t } = useTranslation();
  const { addItem } = useCart();
  const [imgSrc, setImgSrc] = useState(getDishImageUrl(dish));
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [liked, setLiked] = useState(false);
  const ref = useRef(null);
  const lang = i18n.language;
  const name = dish.name?.[lang] || dish.name?.en || '';
  const description = dish.description?.[lang] || dish.description?.en || '';

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -8, y: px * 8 });
  };
  const resetTilt = () => setTilt({ x: 0, y: 0 });

  const handleAdd = () => {
    addItem({ _id: dish._id, code: dish.code, name: dish.name, price: dish.price });
  };

  return (
    <div id={`dish-${dish._id}`} className={`hex-item ${highlight ? 'hex-item--highlight' : ''}`}>
      <div className="hex-item__stage" style={{ perspective: '1000px' }}>
        <div
          ref={ref}
          onMouseMove={handleMove}
          onMouseLeave={resetTilt}
          className="hex-card"
          style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
        >
          <div className="hex-card__frame">
            <div className="hex-card__face">
              <img
                src={imgSrc}
                alt={name}
                onError={() => setImgSrc(PLACEHOLDER_IMAGE)}
                className="hex-card__img"
                loading="lazy"
              />
              <div className="hex-card__shine" />
            </div>
          </div>

          <div className="hex-card__actions">
            <button
              type="button"
              onClick={() => setLiked((v) => !v)}
              className={`hex-icon-btn ${liked ? 'hex-icon-btn--active' : ''}`}
              aria-label="like"
            >
              <FiHeart size={15} fill={liked ? 'currentColor' : 'none'} />
            </button>
            <button
              type="button"
              onClick={() => onQuickView?.(dish)}
              className="hex-icon-btn"
              aria-label="quick view"
            >
              <FiEye size={15} />
            </button>
          </div>
        </div>
      </div>

      <div className="hex-item__info">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight line-clamp-1">
            {name}
          </h3>
          <span className="shrink-0 text-xs font-bold text-[#d4af37]">{dish.price} QR</span>
        </div>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
            {description}
          </p>
        )}
        <button
          type="button"
          onClick={handleAdd}
          className="mt-3 w-full flex items-center justify-center gap-1.5 bg-primary hover:bg-primary-dark text-white text-xs font-semibold py-2 rounded-full transition"
        >
          <FiPlus size={14} />
          {t('menu.addToCart')}
        </button>
      </div>
    </div>
  );
}
