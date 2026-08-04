import { useTranslation } from 'react-i18next';
import { FiPhone, FiCalendar } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';

const DELIVERY_APPS = [
  {
    id: 'snoonu',
    name: { fa: 'اسنونو', en: 'Snoonu', ar: 'سنونو' },
    url: 'https://snoonu.com/restaurants/kabab-dagh-nan-dagh-restaurant',
    color: '#e2231a',
  },
  {
    id: 'talabat',
    name: { fa: 'طلبات', en: 'Talabat', ar: 'طلبات' },
    url: 'https://www.talabat.com/qatar/kabab-dagh-reasturant',
    color: '#ff5a00',
  },
  {
    id: 'keeta',
    name: { fa: 'کیتا', en: 'Keeta', ar: 'كيتا' },
    url: 'https://courier.keeta-global.com/',
    color: '#ffcc00',
  },
];

export default function ReservationSection() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const currentLang = i18n.language;

  const bgGradient = isDark
    ? 'bg-gradient-to-br from-[#1A1A1A] via-[#2D2D2D] to-[#1A1A1A]'
    : 'bg-[#FFFBF5]';
  const overlayBg = isDark ? 'bg-black/40' : 'bg-[#FFFBF5]/50';
  const titleColor = isDark ? 'text-white' : 'text-[#1A1A1A]';
  const subtitleColor = isDark ? 'text-gray-100' : 'text-[#666666]';
  const bgEffect1 = isDark ? 'bg-[#FFD700]/5' : 'bg-[#FFF0E0]/40';
  const bgEffect2 = isDark ? 'bg-[#FFD700]/5' : 'bg-[#FFF0E0]/40';

  const getLocalizedName = (item) => {
    return item.name[currentLang] || item.name.fa || item.name.en || '';
  };

  return (
    <section className={`relative py-8 md:py-10 px-4 overflow-hidden ${bgGradient} transition-colors duration-300`}>
      <div className="absolute inset-0">
        <div className={`absolute top-[-30%] left-[-20%] w-[60%] h-[60%] ${bgEffect1} rounded-full blur-3xl`} />
        <div className={`absolute bottom-[-30%] right-[-20%] w-[60%] h-[60%] ${bgEffect2} rounded-full blur-3xl`} />
        <div className={`absolute inset-0 ${overlayBg}`} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h2 className={`text-2xl md:text-3xl lg:text-4xl font-black ${titleColor} tracking-tight leading-tight mb-3`}>
          {t('homePage.reservation.title') || 'رزرو میز'}
        </h2>
        <p className={`${subtitleColor} text-sm md:text-base mb-6 font-light max-w-xl mx-auto`}>
          {t('homePage.reservation.subtitle') || 'برای تجربه‌ای بی‌نظیر، همین حالا میز خود را رزرو کنید'}
        </p>

        {/* ===== همه دکمه‌ها در یک ردیف ===== */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {/* دکمه تماس */}
          <a
            href="tel:+97433000157"
            className={`flex items-center gap-2 px-5 py-3 rounded-full font-bold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg ${
              isDark
                ? 'bg-[#FFD700] text-black hover:bg-[#F9A825] shadow-[#FFD700]/20'
                : 'bg-[#D32F2F] text-white hover:bg-[#B71C1C] shadow-[#D32F2F]/20'
            }`}
          >
            <FiPhone size={16} />
            {t('homePage.reservation.phone') || 'تماس'}
          </a>

          {/* دکمه رزرو */}
          <a
            href="/contact"
            className={`flex items-center gap-2 px-5 py-3 rounded-full font-bold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg ${
              isDark
                ? 'border-2 border-white text-white hover:bg-white hover:text-black'
                : 'border-2 border-[#D32F2F] text-[#D32F2F] hover:bg-[#D32F2F] hover:text-white'
            }`}
          >
            <FiCalendar size={16} />
            {t('homePage.reservation.cta') || 'رزرو'}
          </a>

          {/* اپ‌های دلیوری */}
          {DELIVERY_APPS.map((app) => (
            <a
              key={app.id}
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-full font-bold text-sm text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{
                backgroundColor: app.color,
                boxShadow: `0 4px 14px ${app.color}40`,
              }}
            >
              <span
                className="flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-black shrink-0"
                style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
              >
                {app.name.en?.charAt(0) || 'D'}
              </span>
              {getLocalizedName(app)}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}