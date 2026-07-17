import { useTranslation } from 'react-i18next';
import { FiX, FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';

export default function CartDrawer({ isOpen, onClose }) {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const { cart, updateQuantity, removeItem, totalItems, totalPrice } = useCart();
  const isDark = theme === 'dark';
  const lang = i18n.language;

  const bgDrawer = isDark ? 'bg-[#1C1C1C]' : 'bg-[#FFF8F0]';
  const textColor = isDark ? 'text-[#F7F0E6]' : 'text-[#1A1A1A]';
  const mutedColor = isDark ? 'text-gray-400' : 'text-[#666666]';
  const borderColor = isDark ? 'border-[#3E2723]' : 'border-[#E8DDD0]';
  const itemBg = isDark ? 'bg-[#2D2D2D]' : 'bg-white';
  const primaryColor = isDark ? '#FFD700' : '#D32F2F';

  // ===== هزینه ارسال: بالای ۵۰ QR رایگان =====
  const deliveryFee = totalPrice >= 50 ? 0 : 10;
  const grandTotal = totalPrice + deliveryFee; // بدون مالیات

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed top-0 right-0 z-50 w-full max-w-md h-full ${bgDrawer} shadow-2xl border-l ${borderColor} transition-colors duration-300`}
          >
            {/* ===== هدر ===== */}
            <div className={`flex items-center justify-between p-4 border-b ${borderColor}`}>
              <div>
                <h2 className={`text-xl font-bold ${textColor}`}>{t('cart.title')}</h2>
                <p className={`text-xs ${mutedColor}`}>{totalItems} {t('cart.items') || 'آیتم'}</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors duration-300">
                <FiX size={24} className={textColor} />
              </button>
            </div>

            {/* ===== لیست آیتم‌ها ===== */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[calc(100vh-300px)]">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🛒</div>
                  <p className={`${mutedColor} text-sm`}>{t('cart.empty')}</p>
                  <Link to="/menu" onClick={onClose} className="inline-block mt-4 px-6 py-2 bg-[#FFD700] text-[#1A1A1A] font-bold rounded-full hover:bg-[#F9A825] transition-colors duration-300">
                    {t('menu.title')}
                  </Link>
                </div>
              ) : (
                cart.map((item) => {
                  const itemName = item.name?.[lang] || item.name?.en || '';
                  const itemTotal = item.price * item.quantity;
                  return (
                    <motion.div key={item._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className={`${itemBg} rounded-2xl p-4 border ${borderColor} transition-all duration-300 hover:shadow-lg`}>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                          <img src={item.images?.[0] || '/images/dishes/placeholder.svg'} alt={itemName} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`text-sm font-bold ${textColor} truncate`}>{itemName}</h4>
                          <p className={`text-xs ${mutedColor}`}>{item.price} QR</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="p-1 rounded-full hover:bg-white/10"><FiMinus size={14} className={mutedColor} /></button>
                          <span className={`text-sm font-bold ${textColor} w-6 text-center`}>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="p-1 rounded-full hover:bg-white/10"><FiPlus size={14} className={mutedColor} /></button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold ${textColor} min-w-[60px] text-right`}>{itemTotal} QR</span>
                          <button onClick={() => removeItem(item._id)} className="p-1.5 rounded-full hover:bg-red-500/20 transition-colors duration-300 group">
                            <FiTrash2 size={16} className="text-red-500 group-hover:scale-110 transition-transform duration-300" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* ===== جمع‌بندی ===== */}
            {cart.length > 0 && (
              <div className={`border-t ${borderColor} p-4 space-y-3 ${bgDrawer}`}>
                {/* ===== کد تخفیف ===== */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={t('cart.discountCode') || 'کد تخفیف'}
                    className={`flex-1 px-4 py-2 text-sm rounded-xl border ${borderColor} ${bgDrawer} ${textColor} placeholder:${mutedColor} focus:outline-none focus:ring-2 focus:ring-[${primaryColor}]/30 transition-all duration-300`}
                  />
                  <button className="px-4 py-2 bg-[#FFD700] text-[#1A1A1A] font-bold text-sm rounded-xl hover:bg-[#F9A825] transition-colors duration-300">
                    {t('cart.apply') || 'اعمال'}
                  </button>
                </div>

                {/* ===== قیمت‌ها (بدون مالیات) ===== */}
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className={mutedColor}>{t('cart.subtotal') || 'جمع کل'}</span>
                    <span className={textColor}>{totalPrice.toFixed(1)} QR</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={mutedColor}>{t('cart.delivery') || 'هزینه ارسال'}</span>
                    <span className={textColor}>{deliveryFee === 0 ? 'رایگان' : `${deliveryFee} QR`}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-white/10">
                    <span className={`text-base font-bold ${textColor}`}>{t('cart.total')}</span>
                    <span className={`text-lg font-black text-[${primaryColor}]`}>
                      {grandTotal.toFixed(1)} QR
                    </span>
                  </div>
                  {/* ===== توضیح بدون مالیات ===== */}
                  <p className={`text-[10px] ${mutedColor} text-center opacity-50`}>
                    {t('cart.noTax') || 'بدون مالیات - مطابق قوانین قطر'}
                  </p>
                </div>

                {/* ===== دکمه پرداخت ===== */}
                <Link
                  to="/checkout"
                  onClick={onClose}
                  className="w-full py-3.5 bg-[#FFD700] hover:bg-[#F9A825] text-[#1A1A1A] font-bold text-center rounded-2xl transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-[#FFD700]/30 hover:shadow-[#FFD700]/50 flex items-center justify-center gap-2"
                >
                  {t('cart.checkout')}
                  <span className="text-sm opacity-70">→</span>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
