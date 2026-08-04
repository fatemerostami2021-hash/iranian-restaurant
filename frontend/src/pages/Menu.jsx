import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFilter, FiX, FiAward, FiTrash2, FiShoppingBag, FiPlus, FiMinus, FiArrowRight } from 'react-icons/fi';
import { useDishes } from '../hooks/useDishes';
import DishCard from '../components/menu/DishCard';
import QuickViewModal from '../components/menu/QuickViewModal';
import ReviewsSection from '../components/home/ReviewsSection';
import ReservationBar from '../components/home/ReservationBar';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';

// ===== کمک‌کننده: گرفتن عکس غذا (مشابه dishService.js) =====
const CATEGORY_IMAGE_MAP = {
  breakfast: 'breakfast',
  main: 'main',
  combo: 'combo',
  appetizer: 'appetizer',
  drinks: 'drinks',
};

function getDishImageUrl(dish) {
  if (dish.images && dish.images.length > 0 && dish.images[0]) {
    const img = dish.images[0];
    if (img.startsWith('http')) return img;
    return img.startsWith('/') ? img : `/${img}`;
  }
  const folder = CATEGORY_IMAGE_MAP[dish.category] || 'main';
  const key = dish.code || dish._id;
  return `/images/dishes/${folder}/${key}.png`;
}

export default function Menu() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const highlightId = searchParams.get('highlight');
  const urlCategory = searchParams.get('category') || 'all';
  const urlSearch = searchParams.get('search') || '';

  // ✅ دریافت اطلاعات سبد خرید
  const { cart, totalPrice, clearCart, updateQuantity, removeItem } = useCart();
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const [category, setCategory] = useState(urlCategory);
  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [specialFilter, setSpecialFilter] = useState('all');
  const [quickViewDish, setQuickViewDish] = useState(null);
  const { dishes, loading, error } = useDishes(category);
  const hasScrolled = useRef(false);
  const lang = i18n.language;

  // ===== استایل‌های پویا بر اساس تم =====
  const bgClass = isDark ? 'bg-[#1C1C1C]' : 'bg-[#FFF8F0]';
  const textClass = isDark ? 'text-[#F7F0E6]' : 'text-[#1A1A1A]';
  const mutedClass = isDark ? 'text-gray-400' : 'text-[#666666]';
  const cardBg = isDark ? 'bg-[#2D2D2D] border-[#3E2723]' : 'bg-white border-[#E8DDD0]';
  const accentBg = isDark ? 'bg-[#FFD700] text-black' : 'bg-[#D32F2F] text-white';
  const cardDepth = isDark
    ? 'shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset,0_14px_30px_-12px_rgba(0,0,0,0.65)] hover:shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset,0_18px_36px_-10px_rgba(0,0,0,0.75)]'
    : 'shadow-[0_1px_0_0_rgba(255,255,255,0.9)_inset,0_14px_28px_-10px_rgba(0,0,0,0.12)] hover:shadow-[0_1px_0_0_rgba(255,255,255,0.9)_inset,0_18px_34px_-8px_rgba(0,0,0,0.18)]';
  const heroGradient = isDark
    ? 'bg-gradient-to-r from-[#FFD700] via-[#FFE8A3] to-[#FFD700]'
    : 'bg-gradient-to-r from-[#D32F2F] via-[#8B2020] to-[#D32F2F]';

  // ===== همگام‌سازی با URL =====
  useEffect(() => { setCategory(urlCategory); }, [urlCategory]);
  useEffect(() => { setSearchTerm(urlSearch); }, [urlSearch]);

  // ===== کدهای پرفروش =====
  const bestSellerCodes = ['0018', '0029', '0010', '0064'];

  // ===== فیلتر کردن غذاها =====
  const filteredDishes = dishes.filter((dish) => {
    const searchableValues = [dish.name?.fa, dish.name?.ar, dish.name?.en, dish.code].filter(Boolean);
    const matchesSearch = searchTerm
      ? searchableValues.some((val) => val.toString().toLowerCase().includes(searchTerm.toLowerCase()))
      : true;
    let matchesSpecial = true;
    if (specialFilter === 'best') {
      matchesSpecial = bestSellerCodes.includes(dish.code);
    }
    return matchesSearch && matchesSpecial;
  });

  // ===== تغییر جستجو =====
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    const next = new URLSearchParams(searchParams);
    if (value) next.set('search', value); else next.delete('search');
    setSearchParams(next, { replace: true });
  };

  // ===== اسکرول به غذای هایلایت شده =====
  useEffect(() => {
    if (!loading && highlightId && !hasScrolled.current) {
      const el = document.getElementById(`dish-${highlightId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        hasScrolled.current = true;
      }
    }
  }, [loading, dishes, highlightId]);

  // ===== نمایش لودینگ =====
  if (loading) {
    return (
      <section className={`max-w-7xl mx-auto px-4 py-12 ${bgClass}`}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="hidden lg:block h-96 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-2xl h-64 animate-pulse" />)}
          </div>
        </div>
      </section>
    );
  }

  // ===== نمایش خطا =====
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>;

  // ===== دسته‌بندی‌ها (غذای اصلی و سینی‌ها اول) =====
  const categories = [
    { key: 'all', label: t('menu.categories.all') },
    { key: 'main', label: t('menu.categories.main') },
    { key: 'combo', label: t('menu.categories.combo') },
    { key: 'breakfast', label: t('menu.categories.breakfast') },
    { key: 'appetizer', label: t('menu.categories.appetizer') },
    { key: 'drinks', label: t('menu.categories.drinks') },
  ];

  // ===== رندر اصلی =====
  return (
    <section className={`max-w-7xl mx-auto px-4 py-12 ${bgClass} transition-colors duration-300`}>
      {/* ===== هدر ===== */}
      <div className="mb-10 text-center lg:text-right">
        <h1 className={`text-4xl font-black mb-2 bg-clip-text text-transparent ${heroGradient}`}>
          {t('menu.title')}
        </h1>
        <p className={mutedClass}>{t('menu.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* ===== سایدبار فیلترینگ (دسکتاپ) ===== */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* جستجو */}
            <div className={`p-4 rounded-2xl border ${cardBg} ${cardDepth} transition-all duration-300 hover:-translate-y-0.5`}>
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl px-3 py-2">
                <FiSearch className={mutedClass} />
                <input
                  type="text"
                  placeholder={t('menu.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="bg-transparent outline-none flex-1 text-sm"
                />
                {searchTerm && <FiX onClick={() => handleSearchChange('')} className="cursor-pointer" />}
              </div>
            </div>

            {/* دسته‌بندی‌ها */}
            <div className={`p-4 rounded-2xl border ${cardBg} ${cardDepth} transition-all duration-300 hover:-translate-y-0.5`}>
              <h3 className={`font-bold mb-4 flex items-center gap-2 ${textClass}`}>
                <FiFilter /> {t('menu.categoriesTitle')}
              </h3>
              <div className="flex flex-col gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => { setCategory(cat.key); setSpecialFilter('all'); }}
                    className={`text-right px-4 py-2 rounded-xl transition-all duration-300 text-sm font-medium ${
                      category === cat.key && specialFilter === 'all'
                        ? accentBg
                        : `${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-100'} ${textClass}`
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* پیشنهادهای ویژه */}
            <div className={`p-4 rounded-2xl border ${cardBg} ${cardDepth} transition-all duration-300 hover:-translate-y-0.5`}>
              <h3 className={`font-bold mb-4 flex items-center gap-2 ${textClass}`}>
                <FiAward className="text-[#FFD700]" /> {t('menu.specialOffers')}
              </h3>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setSpecialFilter('best')}
                  className={`text-right px-4 py-3 rounded-xl transition-all duration-300 text-sm font-bold border ${
                    specialFilter === 'best'
                      ? `border-transparent ${accentBg}`
                      : `border-dashed ${isDark ? 'border-white/20 hover:bg-white/5' : 'border-gray-300 hover:bg-gray-50'} ${textClass}`
                  }`}
                >
                  🍴 {t('menu.bestSellers')}
                </button>
              </div>
              {specialFilter === 'best' && (
                <p className="text-xs mt-3 text-gray-500">{t('menu.bestSellersDesc')}</p>
              )}
            </div>
          </div>
        </aside>

        {/* ===== لیست غذاها ===== */}
        <div className="lg:col-span-3">
          {/* فیلترهای موبایل */}
          <div className="lg:hidden mb-6 overflow-x-auto pb-2">
            <div className="flex gap-2 min-w-max">
              <button
                onClick={() => { setSpecialFilter('best'); }}
                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${
                  specialFilter === 'best' ? accentBg : `${cardBg} ${textClass}`
                }`}
              >
                🍴 {t('menu.bestSellers')}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => { setCategory(cat.key); setSpecialFilter('all'); }}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                    category === cat.key && specialFilter === 'all'
                      ? accentBg
                      : `${cardBg} ${textClass}`
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* نتایج */}
          {filteredDishes.length === 0 ? (
            <div className={`text-center py-20 border-2 border-dashed rounded-3xl ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
              <p className={`${mutedClass} text-lg`}>{t('menu.noResults')}</p>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredDishes.map((dish) => (
                <DishCard
                  key={dish._id}
                  dish={dish}
                  highlight={dish._id === highlightId}
                  onQuickView={setQuickViewDish}
                />
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* ===== نظرات مشتریان ===== */}
      <ReviewsSection />

 {/* ===== رزرو و دلیوری ===== */}
      <ReservationBar />

      {/* ===== مودال ===== */}
      <QuickViewModal dish={quickViewDish} onClose={() => setQuickViewDish(null)} />
      {/* ===== نوار پایین سبد خرید ===== */}
      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-0 right-0 mx-auto z-40 w-[98%] max-w-4xl rounded-2xl shadow-2xl border overflow-hidden ${
              isDark ? 'bg-[#1C1C1C] border-[#FFD700]/30' : 'bg-white border-[#D32F2F]/20'
            }`}
          >
            {/* ردیف عکس‌ها و کنترل تعداد (اسکرول افقی) */}
            <div className={`flex gap-3 overflow-x-auto px-3 pt-3 pb-2 scrollbar-hide ${
              isDark ? 'bg-[#252525]' : 'bg-gray-50'
            }`}>
              {cart.map((item) => {
                const itemName = item.name?.[lang] || item.name?.en || '';
                const imageUrl = getDishImageUrl(item);
                return (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`flex-shrink-0 flex items-center gap-2 p-2 rounded-xl border ${
                      isDark ? 'bg-[#1C1C1C] border-gray-700' : 'bg-white border-gray-200'
                    }`}
                  >
                    {/* عکس غذا */}
                    <div className="relative">
                      <img
                        src={imageUrl}
                        alt={itemName}
                        className="w-12 h-12 rounded-lg object-cover border border-gray-600"
                        onError={(e) => { e.target.src = '/images/dishes/placeholder.svg'; }}
                      />
                      {/* تعداد روی عکس */}
                      <span className="absolute -top-1.5 -right-1.5 bg-[#FFD700] text-black text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                        {item.quantity}
                      </span>
                    </div>

                    {/* نام (مخفی توی موبایل) */}
                    <div className="hidden sm:block min-w-[80px]">
                      <p className={`text-xs font-bold truncate ${textClass}`}>{itemName}</p>
                      <p className="text-[10px] text-[#FFD700]">{item.price} QR</p>
                    </div>

                    {/* دکمه + و - */}
                    <div className={`flex items-center gap-1 rounded-lg px-1 py-0.5 ${
                      isDark ? 'bg-white/10' : 'bg-gray-100'
                    }`}>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className={`p-1 rounded transition-colors ${
                          isDark ? 'hover:bg-white/20 text-white' : 'hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        <FiMinus size={12} />
                      </button>
                      <span className={`text-xs font-bold w-4 text-center ${textClass}`}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className={`p-1 rounded transition-colors ${
                          isDark ? 'hover:bg-white/20 text-white' : 'hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        <FiPlus size={12} />
                      </button>
                    </div>

                    {/* حذف */}
                    <button
                      onClick={() => removeItem(item._id)}
                      className="p-1 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </motion.div>
                );
              })}
            </div>

            {/* ردیف جمع‌بندی و Checkout */}
            <div className={`flex items-center justify-between gap-3 px-4 py-3 ${
              isDark ? 'bg-[#1C1C1C]' : 'bg-white'
            }`}>
              {/* دکمه خالی کردن */}
              <button
                onClick={clearCart}
                className={`p-2.5 rounded-xl transition-colors shrink-0 ${
                  isDark ? 'hover:bg-white/10 text-red-500' : 'hover:bg-gray-100 text-red-500'
                }`}
                title={t('cart.clear')}
              >
                <FiTrash2 size={20} />
              </button>

              {/* اطلاعات */}
              <div className="flex-1 text-center sm:text-right">
                <p className={`text-xs ${mutedClass}`}>
                  {cartItemCount} {t('cart.items')}
                </p>
                <p className={`text-lg font-black ${textClass}`}>
                  {totalPrice.toFixed(1)} <span className="text-sm font-normal">QR</span>
                </p>
              </div>

              {/* دکمه Checkout */}
              <button
                onClick={() => navigate('/checkout')}
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105 shrink-0 ${accentBg}`}
              >
                <FiShoppingBag size={18} />
                <span>{t('cart.checkout')}</span>
                <FiArrowRight className="rotate-180" size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}