import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MdHomeFilled,
  MdMenuBook,
  MdArticle,
  MdInfo,
  MdPhoneInTalk,
  MdClose,
  MdShoppingCart,
  MdAdminPanelSettings,
  MdBreakfastDining,
  MdLunchDining,
  MdDinnerDining,
  MdLocalDrink
} from 'react-icons/md';

const navItems = [
  { key: 'home', icon: MdHomeFilled, href: '/' },
  { key: 'menu', icon: MdMenuBook, href: '/menu' },
  { key: 'articles', icon: MdArticle, href: '/articles' },
  { key: 'about', icon: MdInfo, href: '/about' },
  { key: 'contact', icon: MdPhoneInTalk, href: '/contact' },
];

const menuCategories = [
  { key: 'breakfast', label: 'صبحانه', icon: MdBreakfastDining },
  { key: 'main', label: 'غذای اصلی', icon: MdLunchDining },
  { key: 'combo', label: 'سینی‌ها', icon: MdDinnerDining },
  { key: 'drinks', label: 'نوشیدنی‌ها', icon: MdLocalDrink },
];

export default function MobileNav({ open, onClose }) {
  const { t } = useTranslation();
  const isLoggedIn = localStorage.getItem('adminToken') !== null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />
          <motion.nav 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed top-0 right-0 w-4/5 max-w-sm h-full bg-white dark:bg-surface-dark z-50 shadow-2xl"
          >
            <div className="flex flex-col h-full">
              {/* هدر موبایل */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-surface-metal">
                <Link to="/" onClick={onClose} className="flex items-center gap-2">
                  <span className="text-lg font-bold text-primary-dark dark:text-primary-light">
                    {t('restaurant.name')}
                  </span>
                </Link>
                <button 
                  onClick={onClose}
                  className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                >
                  <MdClose size={24} />
                </button>
              </div>

              {/* آیتم‌های منو */}
              <div className="flex-1 overflow-y-auto p-4 space-y-1">
                {navItems.map(({ key, icon: Icon, href }) => (
                  <Link
                    key={key}
                    to={href}
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-primary/10 dark:hover:bg-primary/20 rounded-xl transition-all group"
                  >
                    <Icon size={22} className="text-gray-500 dark:text-gray-400 group-hover:text-primary transition" />
                    <span className="font-medium">{t(`nav.${key}`)}</span>
                  </Link>
                ))}

                {/* ===== دکمه لاگین ادمین در موبایل ===== */}
                <Link
                  to={isLoggedIn ? '/admin/dashboard' : '/admin/login'}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-primary/10 dark:hover:bg-primary/20 rounded-xl transition-all group mt-4 border-t border-gray-100 dark:border-gray-700 pt-4"
                >
                  <MdAdminPanelSettings size={22} className="text-gray-500 dark:text-gray-400 group-hover:text-primary transition" />
                  <span className="font-medium">
                    {isLoggedIn ? 'پنل مدیریت' : 'ورود به پنل'}
                  </span>
                </Link>

                {/* دسته‌بندی‌های منو در موبایل */}
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-xs font-medium text-gray-400 dark:text-gray-500 px-4 mb-2">
                    دسته‌بندی منو
                  </p>
                  {menuCategories.map(({ key, label, icon: Icon }) => (
                    <Link
                      key={key}
                      to={`/menu/category/${key}`}
                      onClick={onClose}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-primary/10 dark:hover:bg-primary/20 rounded-xl transition-all group"
                    >
                      <Icon size={18} className="text-gray-400 group-hover:text-primary transition" />
                      <span>{label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* فوتر موبایل */}
              <div className="p-4 border-t border-gray-100 dark:border-surface-metal space-y-2">
                <Link
                  to="/cart"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition"
                >
                  <MdShoppingCart size={20} />
                  {t('nav.cart')}
                </Link>
              </div>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
