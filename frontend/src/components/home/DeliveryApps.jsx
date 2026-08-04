import { useMemo, useRef, useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FiPhone, FiCalendar, FiExternalLink } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";

/* ============================================================
   DeliveryApps — Single Row Marquee (RTL-Safe + Draggable/Touch)
   ============================================================ */

const APPS = [
  {
    id: "snoonu",
    name: { fa: "اسنونو", en: "Snoonu", ar: "سنونو" },
    url: "https://snoonu.com/restaurants/kabab-dagh-nan-dagh-restaurant",
    color: "#e2231a",
    letter: "S",
  },
  {
    id: "talabat",
    name: { fa: "طلبات", en: "Talabat", ar: "طلبات" },
    url: "https://www.talabat.com/qatar/kabab-dagh-reasturant",
    color: "#ff5a00",
    letter: "T",
  },
  {
    id: "keeta",
    name: { fa: "کیتا", en: "Keeta", ar: "كيتا" },
    url: "https://courier.keeta-global.com/",
    color: "#ffcc00",
    letter: "K",
  },
];

const FIXED_CTA = [
  {
    id: "call",
    name: { fa: "تماس برای رزرو", en: "Call to Reserve", ar: "اتصل للحجز" },
    url: "tel:+97433000157",
    color: "#FFD700",
    textColor: "#1A1A1A",
    icon: FiPhone,
  },
  {
    id: "book",
    name: { fa: "رزرو میز", en: "Book a Table", ar: "احجز طاولة" },
    url: "/contact",
    color: null,
    icon: FiCalendar,
  },
];

// سرعت حرکت خودکار (پیکسل در هر فریم)
const AUTO_SPEED = 0.6;
// حداقل جابجایی برای اینکه "درگ" حساب بشه، نه کلیک
const DRAG_THRESHOLD = 6;

export default function DeliveryApps() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();

  const isDark = theme === "dark";
  const isRtl = i18n.language === "fa" || i18n.language === "ar";
  const currentLang = i18n.language;

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

  // یک ردیف، چند بار تکرار شده برای حلقه‌ی بی‌نهایت
  const rowItems = useMemo(
    () => Array.from({ length: 8 }, () => baseItems).flat(),
    [baseItems]
  );

  // ===== state/refهای مربوط به حرکت =====
  const trackRef = useRef(null);
  const containerRef = useRef(null);
  const [position, setPosition] = useState(0);
  const positionRef = useRef(0);
  const halfWidthRef = useRef(0);
  const rafRef = useRef(null);

  const draggingRef = useRef(false);
  const pausedRef = useRef(false);
  const startXRef = useRef(0);
  const startPosRef = useRef(0);
  const movedDistanceRef = useRef(0);
  const pointerIdRef = useRef(null);

  // جهت پیش‌فرض حرکت خودکار (مطابق منطق قبلی marquee-ltr / marquee-rtl)
  const autoDirection = isRtl ? 1 : -1;

  // محاسبه‌ی عرض یک "نصف" مسیر برای حلقه‌ی بی‌نهایت (چون rowItems محتوا رو تکرار کرده)
  const recalcWidth = useCallback(() => {
    if (trackRef.current) {
      halfWidthRef.current = trackRef.current.scrollWidth / 2;
    }
  }, []);

  useEffect(() => {
    recalcWidth();
    window.addEventListener("resize", recalcWidth);
    return () => window.removeEventListener("resize", recalcWidth);
  }, [recalcWidth, rowItems, currentLang]);

  // نرمال‌سازی موقعیت داخل بازه‌ی (-halfWidth, 0] برای حلقه‌ی بی‌نهایت
  const normalizePosition = (pos) => {
    const half = halfWidthRef.current;
    if (!half) return pos;
    let p = pos;
    while (p <= -half) p += half;
    while (p > 0) p -= half;
    return p;
  };

  // ===== حلقه‌ی انیمیشن (requestAnimationFrame) =====
  useEffect(() => {
    const loop = () => {
      if (!draggingRef.current && !pausedRef.current) {
        positionRef.current = normalizePosition(
          positionRef.current + autoDirection * AUTO_SPEED
        );
        setPosition(positionRef.current);
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoDirection]);

  // ===== هندلرهای Pointer (پوشش‌دهنده‌ی تاچ + ماوس) =====
  const handlePointerDown = (e) => {
    draggingRef.current = true;
    movedDistanceRef.current = 0;
    startXRef.current = e.clientX;
    startPosRef.current = positionRef.current;
    pointerIdRef.current = e.pointerId;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - startXRef.current;
    movedDistanceRef.current = Math.abs(dx);
    positionRef.current = normalizePosition(startPosRef.current + dx);
    setPosition(positionRef.current);
  };

  const endDrag = (e) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (pointerIdRef.current != null) {
      e.currentTarget.releasePointerCapture?.(pointerIdRef.current);
      pointerIdRef.current = null;
    }
  };

  // جلوگیری از باز شدن لینک وقتی کاربر واقعاً درگ کرده (نه کلیک ساده)
  const handleClickCapture = (e) => {
    if (movedDistanceRef.current > DRAG_THRESHOLD) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // مکث با هاور روی دسکتاپ (اختیاری، تجربه‌ی بهتر)
  const handleMouseEnter = () => {
    pausedRef.current = true;
  };
  const handleMouseLeave = () => {
    pausedRef.current = false;
    endDrag({ currentTarget: containerRef.current, pointerId: pointerIdRef.current });
  };

  // ===== تابع دریافت نام به زبان جاری =====
  const getLocalizedName = (item) => {
    if (item.name && typeof item.name === "object") {
      return item.name[currentLang] || item.name.fa || item.name.en || "";
    }
    return item.name_en || item.name_fa || "";
  };

  const renderItem = (item, index) => {
    const isApp = item.type === "app";
    const label = getLocalizedName(item);

    const isExternal = item.url.startsWith("http://") || item.url.startsWith("https://");
    const isPhone = item.url.startsWith("tel:");

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
        {isExternal && (
          <FiExternalLink size={14} className="shrink-0 opacity-70" />
        )}
      </span>
    );

    const commonProps = {
      key: `${item.id}-${index}`,
      href: item.url,
      className: "inline-flex mx-2 md:mx-3",
      draggable: false,
      onClickCapture: handleClickCapture,
    };

    if (isExternal) {
      return (
        <a {...commonProps} target="_blank" rel="noopener noreferrer">
          {pill}
        </a>
      );
    }

    if (isPhone) {
      return <a {...commonProps}>{pill}</a>;
    }

    return <a {...commonProps}>{pill}</a>;
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
      {/* ===== هدر ===== */}
      <div
        className="max-w-7xl mx-auto px-4 mb-8 text-center"
        dir={isRtl ? "rtl" : "ltr"}
      >
        <h2
          className={`text-3xl md:text-4xl lg:text-5xl font-black ${titleColor} tracking-tight leading-tight mb-2 transition-colors duration-300`}
        >
          {t("homePage.delivery.title", "سفارش آنلاین از طریق")}
        </h2>
        <p
          className={`text-sm md:text-base font-light ${subtitleColor} transition-colors duration-300`}
        >
          {t("homePage.delivery.subtitle", "سفارش آنلاین از طریق اپلیکیشن‌ها و رزرو میز")}
        </p>
      </div>

      {/* ===== مارکی — یک ردیف، قابل کشیدن با تاچ/ماوس ===== */}
      <div
        ref={containerRef}
        className="relative overflow-hidden cursor-grab active:cursor-grabbing"
        dir="ltr"
        style={{ touchAction: "pan-y" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={trackRef}
          className="flex whitespace-nowrap will-change-transform"
          style={{
            width: "max-content",
            transform: `translateX(${position}px)`,
          }}
        >
          {rowItems.map((item, i) => renderItem(item, i))}
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
    </section>
  );
}