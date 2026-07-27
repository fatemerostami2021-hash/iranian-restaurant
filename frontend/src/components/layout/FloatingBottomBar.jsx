import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MdWorkOutline, MdDarkMode, MdLightMode } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';

export default function FloatingBottomBar() {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [langOpen, setLangOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const isDark = theme === 'dark';
  const isRtl = i18n.language === 'fa' || i18n.language === 'ar';

  const languages = [
    { code: 'ar', label: 'العربية', flag: '🇶🇦' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fa', label: 'فارسی', flag: '🇮🇷' }
  ];

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setLangOpen(false);
  };

  // ✅ متن‌ها (Tooltip) فقط در دسکتاپ (sm:flex) نمایش داده می‌شوند تا در موبایل متنی نباشد
  const Tooltip = ({ text }) => (
    <motion.div
      initial={{ opacity: 0, x: isRtl ? -10 : 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: isRtl ? -10 : 10 }}
      className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-full mr-3' : 'left-full ml-3'} px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shadow-xl pointer-events-none hidden sm:flex ${
        isDark ? 'bg-white text-black' : 'bg-black text-white'
      }`}
    >
      {text}
    </motion.div>
  );

  const btnBaseClass = `flex items-center justify-center transition-all duration-300 hover:scale-110`;

  return (
    // ✅ نوار دائمی است و دیگر فید نمی‌شود
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`fixed bottom-48 md:bottom-36 ${isRtl ? 'right-5 md:right-8' : 'left-5 md:left-8'} z-40 flex flex-col items-center gap-4`}
    >
      {/* دکمه فرصت‌های شغلی */}
      <div
        className="relative flex items-center justify-center"
        onMouseEnter={() => setHoveredItem('careers')}
        onMouseLeave={() => setHoveredItem(null)}
      >
        {hoveredItem === 'careers' && <Tooltip text={t('floatingBar.careers', 'فرصت‌های شغلی')} />}
        <Link
          to="/careers"
          className={`${btnBaseClass} ${isDark ? 'text-[#FFD700]' : 'text-[#D32F2F]'}`}
        >
          <MdWorkOutline size={24} />
        </Link>
      </div>

      {/* تغییر زبان */}
      <div className="relative flex items-center justify-center">
        <button
          onClick={() => setLangOpen(!langOpen)}
          aria-label={t('floatingBar.language', 'زبان')}
          className={`${btnBaseClass} text-2xl ${
            isDark ? 'text-white' : 'text-black'
          }`}
        >
          {currentLang.flag}
        </button>

        <AnimatePresence>
          {langOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={`absolute bottom-full mb-2 ${isRtl ? 'right-0' : 'left-0'} w-36 rounded-xl shadow-2xl border overflow-hidden ${
                isDark ? 'bg-[#1C1C1C] border-white/10' : 'bg-white border-gray-200'
              }`}
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                    i18n.language === lang.code
                      ? (isDark ? 'bg-[#FFD700]/10 text-[#FFD700]' : 'bg-[#D32F2F]/10 text-[#D32F2F]')
                      : (isDark ? 'text-white hover:bg-white/5' : 'text-black hover:bg-gray-100')
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  {lang.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* تغییر تم */}
      <div
        className="relative flex items-center justify-center"
        onMouseEnter={() => setHoveredItem('theme')}
        onMouseLeave={() => setHoveredItem(null)}
      >
        {hoveredItem === 'theme' && (
          <Tooltip text={isDark ? t('floatingBar.lightMode', 'حالت روشن') : t('floatingBar.darkMode', 'حالت تاریک')} />
        )}
        <button
          onClick={toggleTheme}
          aria-label={isDark ? t('floatingBar.lightMode', 'حالت روشن') : t('floatingBar.darkMode', 'حالت تاریک')}
          className={`${btnBaseClass} ${isDark ? 'text-[#FFD700]' : 'text-[#D32F2F]'}`}
        >
          {isDark ? <MdLightMode size={24} /> : <MdDarkMode size={24} />}
        </button>
      </div>
    </motion.div>
  );
}