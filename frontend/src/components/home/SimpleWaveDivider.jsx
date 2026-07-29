import { useTheme } from "../../context/ThemeContext";

export default function SimpleWaveDivider() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // ===== رنگ‌های طلایی - قرمز - مشکی =====
  const colors = {
    // رنگ اصلی موج (با افکت گرادینت)
    waveMain: isDark ? "#FFD700" : "#D32F2F",
    waveLight: isDark ? "#FFC700" : "#E53935",
    waveDark: isDark ? "#D4A800" : "#B71C1C",
    // رنگ پس‌زمینه (شفاف برای دیده شدن محتوای پشت)
    bgStart: isDark ? "rgba(15, 15, 15, 0)" : "rgba(255, 251, 245, 0)",
    bgEnd: isDark ? "rgba(15, 15, 15, 1)" : "rgba(255, 251, 245, 1)",
  };

  return (
    <div className="relative w-full leading-[0] overflow-hidden">
      {/* ===== موج اصلی با سایه طلایی ===== */}
      <div className="relative">
        <svg 
          viewBox="0 0 1440 120" 
          preserveAspectRatio="none" 
          className="w-full h-[80px] md:h-[140px] drop-shadow-[0_10px_30px_rgba(255,215,0,0.3)]"
        >
          <defs>
            {/* گرادینت طلایی برای موج */}
            <linearGradient id="goldenWave" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colors.waveDark} stopOpacity="0.8" />
              <stop offset="30%" stopColor={colors.waveMain} stopOpacity="1" />
              <stop offset="50%" stopColor={colors.waveLight} stopOpacity="1" />
              <stop offset="70%" stopColor={colors.waveMain} stopOpacity="1" />
              <stop offset="100%" stopColor={colors.waveDark} stopOpacity="0.8" />
            </linearGradient>

            {/* گرادینت طلایی‌تر برای موج دوم */}
            <linearGradient id="goldenWave2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colors.waveMain} stopOpacity="0.4" />
              <stop offset="50%" stopColor={colors.waveLight} stopOpacity="0.6" />
              <stop offset="100%" stopColor={colors.waveMain} stopOpacity="0.4" />
            </linearGradient>

            {/* فیلتر درخشش طلایی */}
            <filter id="goldenGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* فیلتر سایه طلایی */}
            <filter id="goldenShadow">
              <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#FFD700" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* ===== موج اصلی (طلایی) ===== */}
          <path
            d="M0,80 C200,120 400,20 600,80 C800,140 1000,40 1200,80 C1300,100 1380,90 1440,85 L1440,120 L0,120 Z"
            fill="url(#goldenWave)"
            filter="url(#goldenShadow)"
            className="transition-all duration-700"
          />

          {/* ===== موج دوم (لایه شفاف طلایی برای عمق) ===== */}
          <path
            d="M0,90 C250,40 500,110 750,70 C1000,30 1200,100 1440,80 L1440,120 L0,120 Z"
            fill="url(#goldenWave2)"
            opacity="0.5"
            className="transition-all duration-700"
          />

          {/* ===== نقاط درخشان طلایی روی موج ===== */}
          <circle cx="200" cy="85" r="4" fill="#FFD700" opacity="0.8" filter="url(#goldenGlow)">
            <animate attributeName="opacity" values="0.8;0.2;0.8" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="600" cy="75" r="3" fill="#FFC700" opacity="0.6" filter="url(#goldenGlow)">
            <animate attributeName="opacity" values="0.6;0.1;0.6" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="1000" cy="65" r="5" fill="#FFD700" opacity="0.7" filter="url(#goldenGlow)">
            <animate attributeName="opacity" values="0.7;0.2;0.7" dur="3.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="1300" cy="80" r="3" fill="#FFC700" opacity="0.5" filter="url(#goldenGlow)">
            <animate attributeName="opacity" values="0.5;0.1;0.5" dur="2.5s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>

      {/* ===== المان‌های تزئینی طلایی (قطرات نور) ===== */}
      <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-[#FFD700] rounded-full shadow-[0_0_20px_#FFD700] animate-pulse"></div>
      <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-[#FFC700] rounded-full shadow-[0_0_30px_#FFC700] animate-pulse" style={{ animationDelay: "1s" }}></div>
      <div className="absolute top-2/3 left-3/4 w-0.5 h-0.5 bg-[#FFD700] rounded-full shadow-[0_0_15px_#FFD700] animate-pulse" style={{ animationDelay: "2s" }}></div>

      {/* ===== استایل‌های اضافی ===== */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .shimmer-wave {
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(255, 215, 0, 0.1) 25%, 
            rgba(255, 215, 0, 0.3) 50%, 
            rgba(255, 215, 0, 0.1) 75%, 
            transparent 100%
          );
          background-size: 200% auto;
          animation: shimmer 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}