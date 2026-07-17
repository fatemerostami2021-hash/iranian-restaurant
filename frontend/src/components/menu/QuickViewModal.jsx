import { useTranslation } from 'react-i18next';
import { FiX, FiPlus, FiMinus, FiHeart, FiShare2, FiStar } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { getDishImageUrl, PLACEHOLDER_IMAGE } from '../../services/dishService';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuickViewModal({ dish, onClose }) {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const { addItem } = useCart();
  const isDark = theme === 'dark';
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imgSrc, setImgSrc] = useState(PLACEHOLDER_IMAGE);

  useEffect(() => {
    if (dish) {
      setImgSrc(getDishImageUrl(dish) || PLACEHOLDER_IMAGE);
    }
  }, [dish]);

  if (!dish) return null;

  const lang = i18n.language;
  const name = dish.name?.[lang] || dish.name?.en || '';
  const description = dish.description?.[lang] || dish.description?.en || '';

  const handleAddToCart = () => {
    if (!dish) return;
    addItem({
      _id: dish._id,
      code: dish.code,
      name: dish.name,
      price: dish.price,
      quantity: quantity,
    });
    onClose();
  };

  // ===== کلاس‌های تم =====
  const bgModal = isDark ? 'bg-[#1C1C1C]' : 'bg-[#FFF8F0]';
  const textColor = isDark ? 'text-[#F7F0E6]' : 'text-[#1A1A1A]';
  const mutedColor = isDark ? 'text-gray-400' : 'text-[#666666]';
  const borderColor = isDark ? 'border-[#FFD700]/30' : 'border-[#D32F2F]/30';
  const primaryColor = isDark ? '#FFD700' : '#D32F2F';
  const primaryHover = isDark ? '#F9A825' : '#B71C1C';
  const shadowColor = isDark ? 'shadow-[#FFD700]/30' : 'shadow-[#D32F2F]/30';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ duration: 0.4, type: 'spring', damping: 25 }}
          className={`relative max-w-3xl w-full rounded-3xl ${bgModal} overflow-hidden shadow-2xl border ${borderColor}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ===== دکمه بستن ===== */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white transition-all duration-300 border border-white/10"
          >
            <FiX size={22} />
          </motion.button>

          {/* ===== دکمه‌های اشتراک و علاقه‌مندی ===== */}
          <div className="absolute top-4 left-4 z-20 flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-2.5 rounded-full backdrop-blur-sm border transition-all duration-300 ${
                isFavorite 
                  ? 'bg-[#D32F2F] border-[#D32F2F] text-white' 
                  : 'bg-black/50 border-white/10 text-white hover:bg-black/70'
              }`}
            >
              <FiHeart size={18} fill={isFavorite ? 'white' : 'none'} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-white hover:bg-black/70 transition-all duration-300"
            >
              <FiShare2 size={18} />
            </motion.button>
          </div>

          {/* ===== تصویر ===== */}
          <div className="relative aspect-[4/3] overflow-hidden bg-gray-900">
            <motion.img
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6 }}
              src={imgSrc}
              alt={name}
              className="w-full h-full object-cover"
              onError={() => setImgSrc(PLACEHOLDER_IMAGE)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            
            {/* ===== قیمت روی تصویر ===== */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="absolute bottom-4 left-4 bg-[#FFD700] text-[#1A1A1A] font-black text-2xl px-5 py-2.5 rounded-full shadow-2xl shadow-[#FFD700]/40"
            >
              {dish.price} QR
            </motion.div>

            {/* ===== وضعیت موجودی ===== */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className={`absolute top-4 left-1/2 transform -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                dish.inStock 
                  ? 'bg-green-500/90 text-white' 
                  : 'bg-red-500/90 text-white'
              } backdrop-blur-sm`}
            >
              {dish.inStock ? '✅ موجود' : '❌ ناموجود'}
            </motion.div>
          </div>

          {/* ===== محتوا ===== */}
          <div className="p-6 md:p-8">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h2 className={`text-2xl md:text-3xl font-black ${textColor} tracking-tight leading-tight`}>
                  {name}
                </h2>
                {/* ===== امتیاز ===== */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex text-[#FFD700]">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <FiStar key={i} size={14} fill="#FFD700" />
                    ))}
                  </div>
                  <span className={`text-xs ${mutedColor}`}>(۱۲۴ نظر)</span>
                </div>
              </div>
              <span className={`text-xs ${mutedColor} bg-white/10 px-3 py-1.5 rounded-full border border-white/5 whitespace-nowrap`}>
                {dish.unit || 'سفارش'}
              </span>
            </div>

            {description && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className={`${mutedColor} text-sm md:text-base leading-relaxed mb-6 max-w-xl`}
              >
                {description}
              </motion.p>
            )}

            {/* ===== مشخصات اضافی ===== */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className={`text-xs ${mutedColor} bg-white/5 px-3 py-1 rounded-full border border-white/5`}>
                🍽️ {dish.category || 'غذای اصلی'}
              </span>
              <span className={`text-xs ${mutedColor} bg-white/5 px-3 py-1 rounded-full border border-white/5`}>
                🔥 {dish.spice || 'معتدل'}
              </span>
            </div>

            {/* ===== انتخاب تعداد ===== */}
            <div className="flex items-center gap-4 mb-6 p-4 bg-white/5 rounded-2xl border border-white/5">
              <span className={`text-sm font-medium ${textColor}`}>تعداد:</span>
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className={`p-2 rounded-full bg-[${primaryColor}]/20 hover:bg-[${primaryColor}]/30 text-[${primaryColor}] transition-all duration-300`}
                >
                  <FiMinus size={16} />
                </motion.button>
                <span className={`text-xl font-black ${textColor} w-8 text-center`}>
                  {quantity}
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(quantity + 1)}
                  className={`p-2 rounded-full bg-[${primaryColor}]/20 hover:bg-[${primaryColor}]/30 text-[${primaryColor}] transition-all duration-300`}
                >
                  <FiPlus size={16} />
                </motion.button>
              </div>
              <span className={`text-xs ${mutedColor} mr-auto`}>
                {quantity * dish.price} QR
              </span>
            </div>

            {/* ===== دکمه افزودن ===== */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className={`w-full py-4 bg-[${primaryColor}] hover:bg-[${primaryHover}] text-[#1A1A1A] font-black text-lg rounded-2xl transition-all duration-300 shadow-2xl ${shadowColor} hover:shadow-[${primaryColor}]/50 flex items-center justify-center gap-3`}
            >
              <FiPlus size={22} />
              {t('cart.addToCart') || 'افزودن به سبد خرید'}
              <span className="text-sm opacity-70">• {quantity * dish.price} QR</span>
            </motion.button>

            {/* ===== اطلاعات اضافی ===== */}
            <p className={`text-center text-[10px] ${mutedColor} mt-4 opacity-50 tracking-wider uppercase`}>
              {t('cart.freeDelivery') || 'تحویل رایگان برای سفارش‌های بالای ۵۰ QR'}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
