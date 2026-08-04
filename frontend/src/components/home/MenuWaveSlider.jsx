import { useMemo, useRef, useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";

/* ============================================================
   MenuWaveSlider — Single Row Marquee (RTL-Safe + Draggable/Touch)
   ============================================================ */

// لیست غذاها برای مارکی (با استفاده از تصاویر محلی پروژه)
const FOODS = [
  { id: '0013', name_en: 'Barg Kebab', name_fa: 'کباب برگ', img: '/images/dishes/main/0013.png' },
  { id: '0001', name_en: 'Mix Tikka', name_fa: 'میکس تیکا', img: '/images/dishes/main/0001.png' },
  { id: '0005', name_en: 'Lamb Chops', name_fa: 'ریش', img: '/images/dishes/main/0005.png' },
  { id: '0063', name_en: 'Baja Dagh', name_fa: 'باجه داغ', img: '/images/dishes/breakfast/0063.png' },
  { id: '0008', name_en: 'Traditional Kebab', name_fa: 'کباب', img: '/images/dishes/main/0008.png' },
  { id: '0030', name_en: 'Shirazi Salad', name_fa: 'سالاد شیرازی', img: '/images/dishes/appetizer/0030.png' },
];

// سرعت حرکت خودکار (پیکسل در هر فریم)
const AUTO_SPEED = 0.6;
// حداقل جابجایی برای اینکه "درگ" حساب بشه، نه کلیک
const DRAG_THRESHOLD = 6;

export default function MenuWaveSlider() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const isRtl = i18n.language === "fa" || i18n.language === "ar";
  const currentLang = i18n.language;

  const sectionBg = isDark ? "bg-[#1C1C1C]" : "bg-[#FFF8F0]";
  const waveFill = isDark ? "#0F0F0F" : "#F7F0E6";
  const titleColor = isDark ? "text-white" : "text-[#1A1A1A]";
  const subtitleColor = isDark ? "text-gray-400" : "text-[#666666]";

  // یک ردیف، چند بار تکرار شده برای حلقه‌ی بی‌نهایت
  const rowItems = useMemo(() => Array.from({ length: 8 }, () => FOODS).flat(), []);

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

  // جهت پیش‌فرض حرکت خودکار
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
  const handleMouseLeave = (e) => {
    pausedRef.current = false;
    endDrag({ currentTarget: containerRef.current, pointerId: pointerIdRef.current });
  };

  return (
    <section className={`relative overflow-hidden py-12 ${sectionBg} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 mb-10 text-center" dir={isRtl ? "rtl" : "ltr"}>
       <h2 className={`text-2xl md:text-4xl font-black ${titleColor} tracking-tight mb-2`}>
          {t("homePage.menuSlider.title", "مزه‌های اصیل، یک کلیک ")}
        </h2>
        <p className={`text-sm md:text-base font-light ${subtitleColor}`}>
          {t("homePage.menuSlider.subtitle", "منتظر شما در منو هستیم")}
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
          {rowItems.map((item, i) => (
            <Link
              key={i}
              to="/menu"
              draggable={false}
              className="inline-flex flex-col items-center mx-4 group"
              onClickCapture={handleClickCapture}
            >
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#FFD700] transition-all duration-300 shadow-xl">
                <img
                  src={item.img}
                  alt={item.name_en}
                  draggable={false}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 pointer-events-none"
                />
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
    </section>
  );
}