import { useTranslation } from 'react-i18next';
import { FiPhone, FiCalendar } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';

const apps = [
  { name: 'Snoonu', url: 'https://snoonu.com/restaurants/kabab-dagh-nan-dagh-restaurant', color: '#e2231a' },
  { name: 'Talabat', url: 'https://www.talabat.com/qatar/kabab-dagh-nan-dagh-reasturant', color: '#ff5a00' },
  { name: 'Keeta', url: 'https://courier.keeta-global.com/', color: '#ffcc00' },
];

export default function DeliveryApps() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  // ===== کلاس‌های پویا بر اساس تم =====
  const isDark = theme === 'dark';
  
  const borderColor = isDark ? 'border-white/5' : 'border-[#D32F2F]/10';
  const titleColor = isDark ? 'text-white' : 'text-[#1A1A1A]';
  const subtitleColor = isDark ? 'text-gray-400' : 'text-[#666666]';
  const bgSection = isDark ? 'bg-transparent' : 'bg-[#FFF8F0]';
  
  // رنگ دکمه Book a Table بر اساس تم
  const bookBtnBg = isDark 
    ? 'bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white hover:text-[#1A1A1A]'
    : 'bg-[#D32F2F]/10 backdrop-blur-sm border border-[#D32F2F]/20 text-[#1A1A1A] hover:bg-[#D32F2F] hover:text-white';

  return (
    <section className={`py-8 md:py-10 ${bgSection} border-y ${borderColor} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 overflow-hidden">
        {/* ===== هدلاین ===== */}
        <h2 className={`text-center text-3xl md:text-4xl lg:text-5xl font-black ${titleColor} tracking-tight leading-[1.1] mb-1 transition-colors duration-300`}>
          {t('homePage.delivery.title')}
        </h2>
        <p className={`text-center ${subtitleColor} text-sm md:text-base font-light mb-6 transition-colors duration-300`}>
          {t('homePage.delivery.subtitle')}
        </p>

        {/* ===== ریل متحرک ===== */}
        <div className="relative overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap gap-4 md:gap-6">
            {/* ===== اپلیکیشن‌ها (۳ بار تکرار) ===== */}
            {[...apps, ...apps, ...apps].map((app, index) => (
              <a
                key={`app-${index}`}
                href={app.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center px-6 md:px-8 py-3 rounded-full font-bold text-sm md:text-base text-white transition-all duration-300 hover:scale-110 hover:shadow-2xl shadow-lg"
                style={{ backgroundColor: app.color }}
              >
                {app.name}
              </a>
            ))}

            {/* ===== Call to Reserve (طلایی ثابت) ===== */}
            <a
              href="tel:+97433000157"
              className="inline-flex items-center gap-2 px-6 md:px-8 py-3 rounded-full font-bold text-sm md:text-base bg-[#FFD700] text-[#1A1A1A] transition-all duration-300 hover:scale-110 hover:shadow-2xl shadow-lg hover:shadow-[#FFD700]/30"
            >
              <FiPhone size={18} />
              {t('homePage.delivery.call')}
            </a>

            {/* ===== Book a Table (پویا بر اساس تم) ===== */}
            <a
              href="/contact"
              className={`inline-flex items-center gap-2 px-6 md:px-8 py-3 rounded-full font-bold text-sm md:text-base transition-all duration-300 hover:scale-110 hover:shadow-2xl shadow-lg ${bookBtnBg}`}
            >
              <FiCalendar size={18} />
              {t('homePage.delivery.book')}
            </a>

            {/* ===== تکرار برای حلقه بی‌نهایت ===== */}
            {[...apps, ...apps, ...apps].map((app, index) => (
              <a
                key={`app-dup-${index}`}
                href={app.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center px-6 md:px-8 py-3 rounded-full font-bold text-sm md:text-base text-white transition-all duration-300 hover:scale-110 hover:shadow-2xl shadow-lg"
                style={{ backgroundColor: app.color }}
              >
                {app.name}
              </a>
            ))}

            <a
              href="tel:+97433000157"
              className="inline-flex items-center gap-2 px-6 md:px-8 py-3 rounded-full font-bold text-sm md:text-base bg-[#FFD700] text-[#1A1A1A] transition-all duration-300 hover:scale-110 hover:shadow-2xl shadow-lg hover:shadow-[#FFD700]/30"
            >
              <FiPhone size={18} />
              {t('homePage.delivery.call')}
            </a>

            <a
              href="/contact"
              className={`inline-flex items-center gap-2 px-6 md:px-8 py-3 rounded-full font-bold text-sm md:text-base transition-all duration-300 hover:scale-110 hover:shadow-2xl shadow-lg ${bookBtnBg}`}
            >
              <FiCalendar size={18} />
              {t('homePage.delivery.book')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
