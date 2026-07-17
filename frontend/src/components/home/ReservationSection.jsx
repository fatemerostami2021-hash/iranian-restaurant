import { useTranslation } from 'react-i18next';
import { FiPhone, FiCalendar } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';

export default function ReservationSection() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // ===== کلاس‌های پویا بر اساس تم =====
  const bgGradient = isDark
    ? 'bg-gradient-to-br from-[#1A1A1A] via-[#2D2D2D] to-[#1A1A1A]'
    : 'bg-gradient-to-br from-[#FFF8F0] via-[#F5EDE0] to-[#FFF8F0]';
  
  const overlayBg = isDark ? 'bg-black/40' : 'bg-[#D32F2F]/5';
  
  const titleColor = isDark ? 'text-white' : 'text-[#1A1A1A]';
  const subtitleColor = isDark ? 'text-gray-100' : 'text-[#666666]';
  
  const phoneBtnBg = isDark 
    ? 'bg-[#FFD700] hover:bg-[#F9A825] text-black'
    : 'bg-[#D32F2F] hover:bg-[#B71C1C] text-white';
  
  const bookBtnBg = isDark
    ? 'border-2 border-white text-white hover:bg-white hover:text-black'
    : 'border-2 border-[#D32F2F] text-[#D32F2F] hover:bg-[#D32F2F] hover:text-white';

  const shadowColor = isDark ? 'shadow-[#FFD700]/20' : 'shadow-[#D32F2F]/20';

  return (
    <section className={`relative py-16 md:py-20 px-4 overflow-hidden ${bgGradient} transition-colors duration-300`}>
      {/* ===== افکت‌های پس‌زمینه ===== */}
      <div className="absolute inset-0">
        <div className={`absolute top-[-30%] left-[-20%] w-[60%] h-[60%] ${isDark ? 'bg-[#FFD700]/5' : 'bg-[#D32F2F]/10'} rounded-full blur-3xl`} />
        <div className={`absolute bottom-[-30%] right-[-20%] w-[60%] h-[60%] ${isDark ? 'bg-[#FFD700]/5' : 'bg-[#D32F2F]/10'} rounded-full blur-3xl`} />
        <div className={`absolute inset-0 ${overlayBg}`} />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <h2 className={`text-3xl md:text-4xl lg:text-5xl font-black ${titleColor} tracking-tight leading-[1.1] mb-4 drop-shadow-lg transition-colors duration-300`}>
          {t('homePage.reservation.title') || 'رزرو میز'}
        </h2>
        <p className={`${subtitleColor} text-base md:text-lg mb-8 font-light max-w-xl mx-auto transition-colors duration-300`}>
          {t('homePage.reservation.subtitle') || 'برای تجربه‌ای بی‌نظیر، همین حالا میز خود را رزرو کنید'}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* ===== دکمه تماس ===== */}
          <a
            href="tel:+97433000157"
            className={`flex items-center gap-2.5 px-8 py-4 ${phoneBtnBg} font-bold text-lg rounded-full transition-all duration-300 shadow-2xl ${shadowColor} hover:shadow-xl hover:scale-105`}
          >
            <FiPhone size={22} />
            {t('homePage.reservation.phone') || 'تماس بگیرید'}
          </a>

          {/* ===== دکمه رزرو آنلاین ===== */}
          <a
            href="/contact"
            className={`flex items-center gap-2.5 px-8 py-4 ${bookBtnBg} font-bold text-lg rounded-full transition-all duration-300 hover:scale-105`}
          >
            <FiCalendar size={20} />
            {t('homePage.reservation.cta') || 'رزرو آنلاین'}
          </a>
        </div>
      </div>
    </section>
  );
}
