import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiHome, FiBookOpen, FiAlertTriangle } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

export default function NotFound() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const bgClass = isDark ? 'bg-[#0F0F0F]' : 'bg-[#FFFBF5]';
  const textClass = isDark ? 'text-white' : 'text-[#1A1A1A]';
  const mutedClass = isDark ? 'text-gray-400' : 'text-gray-600';
  const accentText = isDark ? 'text-[#FFD700]' : 'text-[#D32F2F]';
  const accentBg = isDark ? 'bg-[#FFD700] text-black' : 'bg-[#D32F2F] text-white';

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${bgClass} ${textClass} overflow-hidden relative`}>
      {/* افکت‌های پس‌زمینه */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#FFD700]/10 rounded-full blur-[150px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#D32F2F]/10 rounded-full blur-[150px] pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />

      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-xl"
      >
        {/* آیکون هشدار */}
        <motion.div 
          initial={{ scale: 0, rotate: -180 }} 
          animate={{ scale: 1, rotate: 0 }} 
          transition={{ delay: 0.2, type: 'spring' }}
          className={`w-24 h-24 mx-auto mb-8 rounded-full flex items-center justify-center ${isDark ? 'bg-[#FFD700]/10' : 'bg-[#D32F2F]/10'}`}
        >
          <FiAlertTriangle className={`text-5xl ${accentText}`} />
        </motion.div>

        {/* عدد ۴۰۴ */}
        <h1 className={`font-['Vazirmatn'] text-7xl md:text-9xl font-black mb-4 ${accentText}`}>
          404
        </h1>

        {/* پیام خوشمزه و مرتبط با رستوران */}
        <h2 className="font-['Vazirmatn'] text-2xl md:text-3xl font-bold mb-3">
          {t('notFound.title', 'اوپس! این صفحه روی زغال سوخت!')}
        </h2>
        <p className={`font-['Vazirmatn'] text-lg ${mutedClass} mb-10`}>
          {t('notFound.desc', 'به نظر می‌رسد آدرسی که دنبالش بودید پیدا نشد یا پاک شده است. بیایید شما را به جای دنج‌تری ببریم.')}
        </p>

        {/* دکمه‌های هدایت */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/" 
            className={`inline-flex items-center justify-center gap-2 px-8 py-4 ${accentBg} font-bold rounded-full text-lg shadow-lg hover:scale-105 transition-transform`}
          >
            <FiHome size={20} />
            {t('notFound.homeBtn', 'بازگشت به خانه')}
          </Link>
          <Link 
            to="/menu" 
            className={`inline-flex items-center justify-center gap-2 px-8 py-4 font-bold rounded-full text-lg shadow-lg border ${isDark ? 'border-white/20 hover:bg-white/5' : 'border-gray-300 hover:bg-gray-100'} transition-colors`}
          >
              <FiBookOpen size={20} />
            {t('notFound.menuBtn', 'مشاهده منو')}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}