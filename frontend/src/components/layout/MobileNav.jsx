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
  MdLocalDrink,
  MdDarkMode,
  MdLightMode
} from 'react-icons/md';
import { useTheme } from '../../context/ThemeContext';

const navItems = [
  { key: 'home', icon: MdHomeFilled, href: '/' },
  { key: 'menu', icon: MdMenuBook, href: '/menu' },
  { key: 'articles', icon: MdArticle, href: '/articles' },
  { key: 'about', icon: MdInfo, href: '/about' },
  { key: 'contact', icon: MdPhoneInTalk, href: '/contact' },
];

const menuCategories = [
  { key: 'breakfast', icon: MdBreakfastDining },
  { key: 'main', icon: MdLunchDining },
  { key: 'combo', icon: MdDinnerDining },
  { key: 'drinks', icon: MdLocalDrink },
];

const languages = [
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fa', label: 'فارسی', flag: '🇮🇷' }
];

export default function MobileNav({ open, onClose }) {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const isLoggedIn = localStorage.getItem('adminToken') !== null;

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
  };

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
            className="fixed top-0 right-0 w-4/5 max-w-sm h-full bg-white dark:bg-[#1C1C1C] z-50 shadow-2xl"
          >
            <div className="flex flex-col h-full">
              {/* ===== هدر ===== */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
                <Link to="/" onClick={onClose} className="flex items-center gap-2">
                  <span className="text-lg font-bold text-[#D32F2F] dark:text-[#FFD700]">
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

              {/* ===== آیتم‌های منو ===== */}
              <div className="flex-1 overflow-y-auto p-4 space-y-1">
                {navItems.map(({ key, icon: Icon, href }) => (
                  <Link
                    key={key}
                    to={href}
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-[#FFD700]/10 dark:hover:bg-[#FFD700]/10 rounded-xl transition-all group"
                  >
                    <Icon size={22} className="text-gray-500 dark:text-gray-400 group-hover:text-[#D32F2F] dark:group-hover:text-[#FFD700] transition" />
                    <span className="font-medium">{t(`nav.${key}`)}</span>
                  </Link>
                ))}

                {/* ===== دسته‌بندی‌های منو ===== */}
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <p className="text-xs font-medium text-gray-400 dark:text-gray-500 px-4 mb-2">
                    {t('menu.categoriesTitle', 'دسته‌بندی‌ها')}
                  </p>
                  {menuCategories.map(({ key, icon: Icon }) => (
                    <Link
                      key={key}
                      to={`/menu?category=${key}`}
                      onClick={onClose}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-[#FFD700]/10 dark:hover:bg-[#FFD700]/10 rounded-xl transition-all group"
                    >
                      <Icon size={18} className="text-gray-400 group-hover:text-[#D32F2F] dark:group-hover:text-[#FFD700] transition" />
                      <span>{t(`menu.categories.${key}`)}</span>
                    </Link>
                  ))}
                </div>

                {/* ===== دکمه لاگین ادمین ===== */}
                <Link
                  to={isLoggedIn ? '/admin/dashboard' : '/admin/login'}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-[#FFD700]/10 dark:hover:bg-[#FFD700]/10 rounded-xl transition-all group mt-4 border-t border-gray-100 dark:border-gray-800 pt-4"
                >
                  <MdAdminPanelSettings size={22} className="text-gray-500 dark:text-gray-400 group-hover:text-[#D32F2F] dark:group-hover:text-[#FFD700] transition" />
                  <span className="font-medium">
                    {isLoggedIn ? t('admin.dashboard', 'پنل مدیریت') : t('admin.login', 'ورود به پنل')}
                  </span>
                </Link>

                {/* ===== دکمه‌های زبان (3 پرچم) ===== */}
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <p className="text-xs font-medium text-gray-400 dark:text-gray-500 px-4 mb-2">
                    {t('floatingBar.language', 'زبان')}
                  </p>
                  <div className="flex gap-2 px-4">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl text-xs font-bold transition-all border ${
                          i18n.language === lang.code
                            ? 'bg-[#FFD700] text-black border-[#FFD700] shadow-md'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-[#FFD700]/50'
                        }`}
                      >
                        <span className="text-base">{lang.flag}</span>
                        <span>{lang.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* ===== دکمه دارک / لایت ===== */}
                <div className="mt-3 px-4">
                  <button
                    onClick={toggleTheme}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all border ${
                      isDark
                        ? 'bg-[#FFD700]/10 text-[#FFD700] border-[#FFD700]/30 hover:bg-[#FFD700]/20'
                        : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {isDark ? <MdLightMode size={20} /> : <MdDarkMode size={20} />}
                    {isDark ? t('floatingBar.lightMode', 'حالت روشن') : t('floatingBar.darkMode', 'حالت تاریک')}
                  </button>
                </div>
              </div>

              {/* ===== فوتر — چک‌اوت ===== */}
              <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                <Link
                  to="/checkout"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#FFD700] hover:bg-[#FFC700] text-black font-bold rounded-xl transition"
                >
                  <MdShoppingCart size={20} />
                  {t('checkout.title', 'سبد خرید')}
                </Link>
              </div>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}