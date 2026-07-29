import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FiPhone, FiCalendar } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";

/* ============================================================
   DeliveryApps — Infinite Marquee (RTL-Safe)
   ============================================================ */

const APPS = [
  {
    id: "snoonu",
    name_en: "Snoonu",
    name_fa: "اسنونو",
    url: "https://snoonu.com/restaurants/kabab-dagh-nan-dagh-restaurant",
    color: "#e2231a",
    letter: "S",
  },
  {
    id: "talabat",
    name_en: "Talabat",
    name_fa: "طلبات",
    url: "https://www.talabat.com/qatar/kabab-dagh-reasturant",
    color: "#ff5a00",
    letter: "T",
  },
  {
    id: "keeta",
    name_en: "Keeta",
    name_fa: "کیتا",
    url: "https://courier.keeta-global.com/",
    color: "#ffcc00",
    letter: "K",
  },
];

const FIXED_CTA = [
  {
    id: "call",
    name_en: "Call to Reserve",
    name_fa: "تماس برای رزرو",
    url: "tel:+97433000157",
    color: "#FFD700",
    textColor: "#1A1A1A",
    icon: FiPhone,
  },
  {
    id: "book",
    name_en: "Book a Table",
    name_fa: "رزرو میز",
    url: "/contact",
    color: null,
    icon: FiCalendar,
  },
];

export default function DeliveryApps() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();

  const isDark = theme === "dark";
  const isRtl = i18n.language === "fa" || i18n.language === "ar";

  const bookBtnTheme = isDark
    ? { bg: "#F4B41A", text: "#1A1A1A" }
    : { bg: "#D32F2F", text: "#FFFFFF" };

  const baseItems = useMemo(() => {
    const items = APPS.map((a) => ({ ...a, type: "app" }));
    items.push({ ...FIXED_CTA[0], type: "cta" });
    items.push({
      ...FIXED_CTA[1],
      type: "cta",
      color: bookBtnTheme.bg,
      textColor: bookBtnTheme.text,
    });
    return items;
  }, [bookBtnTheme.bg, bookBtnTheme.text]);

  const rowTop = useMemo(
    () => Array.from({ length: 6 }, () => baseItems).flat(),
    [baseItems]
  );
  const rowBottom = useMemo(() => {
    const shifted = [...baseItems.slice(2), ...baseItems.slice(0, 2)];
    return Array.from({ length: 6 }, () => shifted).flat();
  }, [baseItems]);

  const renderItem = (item, index) => {
    const isApp = item.type === "app";
    const label = isRtl ? item.name_fa : item.name_en;

    const pill = (
      <span
        className="inline-flex items-center gap-2.5 px-6 md:px-8 py-3 rounded-full font-bold text-sm md:text-base transition-all duration-300 hover:scale-110 hover:shadow-2xl shadow-lg whitespace-nowrap select-none"
        style={{
          backgroundColor: item.color,
          color: isApp ? "#fff" : item.textColor || "#fff",
          boxShadow: isApp
            ? `0 8px 24px ${item.color}40`
            : `0 8px 24px ${item.color}30`,
        }}
      >
        {isApp ? (
          <span
            className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-black"
            style={{ backgroundColor: "rgba(255,255,255,0.25)", color: "#fff" }}
          >
            {item.letter}
          </span>
        ) : (
          <item.icon size={18} className="shrink-0" />
        )}
        {label}
      </span>
    );

    return (
      <a
        key={`${item.id}-${index}`}
        href={item.url}
        target={item.url.startsWith("http") ? "_blank" : undefined}
        rel={item.url.startsWith("http") ? "noopener noreferrer" : undefined}
        className="inline-flex mx-2 md:mx-3"
      >
        {pill}
      </a>
    );
  };

  const sectionBg = isDark ? "bg-[#0F0F0F]" : "bg-[#FFF8F0]";
  const borderColor = isDark ? "border-white/5" : "border-[#D32F2F]/10";
  const titleColor = isDark ? "text-white" : "text-[#1A1A1A]";
  const subtitleColor = isDark ? "text-gray-400" : "text-[#666666]";
  const waveFill = isDark ? "#ffffff" : "#D32F2F";

  return (
    <section
      className={`relative overflow-hidden py-10 md:py-14 ${sectionBg} border-y ${borderColor} transition-colors duration-300`}
    >
      {/* ===== هدر — dir فقط اینجا برای تراز متن ===== */}
      <div
        className="max-w-7xl mx-auto px-4 mb-8 text-center"
        dir={isRtl ? "rtl" : "ltr"}
      >
        <h2
          className={`text-3xl md:text-4xl lg:text-5xl font-black ${titleColor} tracking-tight leading-tight mb-2 transition-colors duration-300`}
        >
          {t("homePage.delivery.title", "Order Online Via")}
        </h2>
        <p
          className={`text-sm md:text-base font-light ${subtitleColor} transition-colors duration-300`}
        >
          {t("homePage.delivery.subtitle", "Fast delivery to your doorstep in Doha")}
        </p>
      </div>

      {/* ===== مارکی ردیف ۱ — اجباری LTR ===== */}
      <div className="relative overflow-hidden mb-4" dir="ltr">
        <div
          className={`flex whitespace-nowrap ${
            isRtl ? "animate-marquee-rtl" : "animate-marquee-ltr"
          }`}
          style={{ width: "max-content" }}
        >
          {rowTop.map((item, i) => renderItem(item, i))}
        </div>
      </div>

      {/* ===== مارکی ردیف ۲ — اجباری LTR ===== */}
      <div className="relative overflow-hidden" dir="ltr">
        <div
          className={`flex whitespace-nowrap ${
            isRtl ? "animate-marquee-ltr" : "animate-marquee-rtl"
          }`}
          style={{ width: "max-content" }}
        >
          {rowBottom.map((item, i) => renderItem(item, i))}
        </div>
      </div>

      {/* ===== Wave SVG ===== */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="w-full h-16 md:h-24"
        >
          <path
            d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,80C1120,85,1280,75,1360,69.3L1440,64L1440,120L0,120Z"
            fill={waveFill}
            opacity={isDark ? "0.03" : "0.06"}
          />
        </svg>
      </div>

      {/* ===== Keyframes ===== */}
      <style>{`
        @keyframes marquee-ltr {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-rtl {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-ltr {
          animation: marquee-ltr 35s linear infinite;
        }
        .animate-marquee-rtl {
          animation: marquee-rtl 35s linear infinite;
        }
        .animate-marquee-ltr:hover,
        .animate-marquee-rtl:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}