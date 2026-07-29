import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";

// لیست غذاها برای مارکی (با استفاده از تصاویر محلی پروژه)
const FOODS = [
  { id: '0013', name_en: 'Barg Kebab', name_fa: 'کباب برگ', img: '/images/dishes/main/0013.png' },
  { id: '0001', name_en: 'Mix Tikka', name_fa: 'میکس تیکا', img: '/images/dishes/main/0001.png' },
  { id: '0005', name_en: 'Lamb Chops', name_fa: 'ریش', img: '/images/dishes/main/0005.png' },
  { id: '0063', name_en: 'Baja Dagh', name_fa: 'باجه داغ', img: '/images/dishes/breakfast/0063.png' },
  { id: '0008', name_en: 'Traditional Kebab', name_fa: 'کباب', img: '/images/dishes/main/0008.png' },
  { id: '0030', name_en: 'Shirazi Salad', name_fa: 'سالاد شیرازی', img: '/images/dishes/appetizer/0030.png' },
];

export default function MenuWaveSlider() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const isRtl = i18n.language === "fa" || i18n.language === "ar";

  // تکرار آیتم‌ها برای لوپ بی‌نهایت
  const row = Array.from({ length: 8 }, () => FOODS).flat();

  const sectionBg = isDark ? "bg-[#1C1C1C]" : "bg-[#FFF8F0]";
  const waveFill = isDark ? "#0F0F0F" : "#F7F0E6"; // رنگ پس‌زمینه بخش بعدی
  const titleColor = isDark ? "text-white" : "text-[#1A1A1A]";
  const subtitleColor = isDark ? "text-gray-400" : "text-[#666666]";

  return (
    <section className={`relative overflow-hidden py-12 ${sectionBg} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 mb-10 text-center" dir={isRtl ? "rtl" : "ltr"}>
        <h2 className={`text-2xl md:text-4xl font-black ${titleColor} tracking-tight mb-2`}>
          {t("homePage.menuSlider.title", "مزه‌های اصیل، یک کلیک دورتر")}
        </h2>
        <p className={`text-sm md:text-base font-light ${subtitleColor}`}>
          {t("homePage.menuSlider.subtitle", "منتظر شما در منو هستیم")}
        </p>
      </div>

      {/* مارکی */}
      <div className="relative overflow-hidden" dir="ltr">
        <div className="flex whitespace-nowrap animate-marquee-ltr" style={{ width: "max-content" }}>
          {row.map((item, i) => (
            <Link key={i} to="/menu" className="inline-flex flex-col items-center mx-4 group">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#FFD700] transition-all duration-300 shadow-xl">
                <img src={item.img} alt={item.name_en} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="mt-3 text-xs md:text-sm font-bold text-current opacity-80 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {isRtl ? item.name_fa : item.name_en}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* موج پایین */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none rotate-180">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full h-16 md:h-24">
          <path d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,80C1120,85,1280,75,1360,69.3L1440,64L1440,120L0,120Z" fill={waveFill} opacity="0.1" />
        </svg>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes marquee-ltr {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-ltr { animation: marquee-ltr 40s linear infinite; }
        .animate-marquee-ltr:hover { animation-play-state: paused; }
      `}</style>
    </section>
  );
}