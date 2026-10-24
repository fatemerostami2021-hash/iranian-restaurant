import { useMemo, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import KebabShowcase3D from "../kebab/KebabShowcase3D";

/* ============================================================
   MenuWaveSlider — Single Row Marquee (RTL-Safe + Draggable/Touch)
   Perf: the position is written straight to the DOM (no React state),
   so the page no longer re-renders 60 times per second. The loop
   pauses when off-screen / tab hidden / reduced-motion.
   ============================================================ */

// thumb = 320px-wide copy made by _archive/perf-patch/optimize-media.sh (falls back to img)
const FOODS = [
  { id: '0013', name_en: 'Barg Kebab', name_fa: 'کباب برگ', img: '/images/dishes/main/0013.webp', thumb: '/images/dishes/thumb/0013.webp' },
  { id: '0001', name_en: 'Mix Tikka', name_fa: 'میکس تیکا', img: '/images/dishes/main/0001.webp', thumb: '/images/dishes/thumb/0001.webp' },
  { id: '0005', name_en: 'Lamb Chops', name_fa: 'ریش', img: '/images/dishes/main/0005.webp', thumb: '/images/dishes/thumb/0005.webp' },
  { id: '0063', name_en: 'Baja Dagh', name_fa: 'باجه داغ', img: '/images/dishes/breakfast/0063.webp', thumb: '/images/dishes/thumb/0063.webp' },
  { id: '0008', name_en: 'Traditional Kebab', name_fa: 'کباب', img: '/images/dishes/main/0008.webp', thumb: '/images/dishes/thumb/0008.webp' },
  { id: '0030', name_en: 'Shirazi Salad', name_fa: 'سالاد شیرازی', img: '/images/dishes/appetizer/0030.webp', thumb: '/images/dishes/thumb/0030.webp' },
];

// px per 16.7ms frame
const AUTO_SPEED = 0.6;
const DRAG_THRESHOLD = 6;

export default function MenuWaveSlider() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const isRtl = i18n.language === "fa" || i18n.language === "ar";
  const currentLang = i18n.language;

  const sectionBg = isDark ? "bg-[#1C1C1C]" : "bg-[#FFF8F0]";
  const waveFill = isDark ? "#0F0F0F" : "#F7F0E6";

  // 6 copies (was 8): half of the track is 3 copies, wider than any screen
  const rowItems = useMemo(() => Array.from({ length: 6 }, () => FOODS).flat(), []);

  const trackRef = useRef(null);
  const containerRef = useRef(null);
  const positionRef = useRef(0);
  const halfWidthRef = useRef(0);
  const rafRef = useRef(null);
  const visibleRef = useRef(true);

  const draggingRef = useRef(false);
  const pausedRef = useRef(false);
  const startXRef = useRef(0);
  const startPosRef = useRef(0);
  const movedDistanceRef = useRef(0);
  const pointerIdRef = useRef(null);

  const autoDirection = isRtl ? 1 : -1;

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

  const normalizePosition = (pos) => {
    const half = halfWidthRef.current;
    if (!half) return pos;
    let p = pos;
    while (p <= -half) p += half;
    while (p > 0) p -= half;
    return p;
  };

  const applyPosition = (p) => {
    positionRef.current = p;
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${p}px,0,0)`;
    }
  };

  // only animate while the marquee is on screen
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;
    const io = new IntersectionObserver(([e]) => { visibleRef.current = e.isIntersecting; });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let last = performance.now();
    const loop = (now) => {
      const dt = Math.min(now - last, 50);
      last = now;
      if (!reduce && visibleRef.current && !document.hidden && !draggingRef.current && !pausedRef.current) {
        applyPosition(
          normalizePosition(positionRef.current + autoDirection * AUTO_SPEED * (dt / 16.67))
        );
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoDirection]);

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
    applyPosition(normalizePosition(startPosRef.current + dx));
  };

  const endDrag = (e) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (pointerIdRef.current != null) {
      e.currentTarget.releasePointerCapture?.(pointerIdRef.current);
      pointerIdRef.current = null;
    }
  };

  const handleClickCapture = (e) => {
    if (movedDistanceRef.current > DRAG_THRESHOLD) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleMouseEnter = () => {
    pausedRef.current = true;
  };
  const handleMouseLeave = () => {
    pausedRef.current = false;
    endDrag({ currentTarget: containerRef.current, pointerId: pointerIdRef.current });
  };

  return (
    <section className={`relative overflow-hidden py-12 ${sectionBg} transition-colors duration-300`}>
      <KebabShowcase3D
        title={t("homePage.menuSlider.title", "مزه‌های اصیل، یک کلیک ")}
        subtitle={t("homePage.menuSlider.subtitle", "منتظر شما در منو هستیم")}
        lang={currentLang}
        isRtl={isRtl}
        isDark={isDark}
      />

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
          style={{ width: "max-content" }}
        >
          {rowItems.map((item, i) => (
            <Link
              key={i}
              to="/menu"
              draggable={false}
              className="inline-flex flex-col items-center mx-3 sm:mx-5 group"
              onClickCapture={handleClickCapture}
            >
              <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#FFD700] transition-all duration-300 shadow-xl">
                <img
                  src={item.thumb}
                  alt={item.name_en}
                  width={160}
                  height={160}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  onError={(e) => {
                    const el = e.currentTarget;
                    if (!el.dataset.fb) { el.dataset.fb = "1"; el.src = item.img; }
                  }}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 pointer-events-none"
                />
              </div>
              <span className="mt-3 text-sm sm:text-base font-bold text-current opacity-80 group-hover:opacity-100 transition-opacity whitespace-nowrap">
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
