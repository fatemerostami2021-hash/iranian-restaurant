import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';

// ===== کلیدهای ترجمه برای هر نقل قول =====
const quoteKeys = [
  { textKey: 'homePage.quotes.q1', authorKey: 'homePage.quotes.a1' },
  { textKey: 'homePage.quotes.q2', authorKey: 'homePage.quotes.a2' },
  { textKey: 'homePage.quotes.q3', authorKey: 'homePage.quotes.a3' },
  { textKey: 'homePage.quotes.q4', authorKey: 'homePage.quotes.a4' },
  { textKey: 'homePage.quotes.q5', authorKey: 'homePage.quotes.a5' },
  { textKey: 'homePage.quotes.q6', authorKey: 'homePage.quotes.a6' },
];

export default function TypingQuotes() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const currentLang = i18n.language;

  const [index, setIndex] = useState(0);
  const [display, setDisplay] = useState('');
  const [phase, setPhase] = useState('typing');

  // ===== دریافت متن و نویسنده بر اساس زبان فعلی =====
  const currentQuote = quoteKeys[index];
  const fullText = t(currentQuote.textKey);
  const author = t(currentQuote.authorKey);

  // ===== کلاس‌های پویا بر اساس تم =====
  const textColor = isDark ? 'text-white' : 'text-[#1A1A1A]';
  const authorColor = isDark ? 'text-[#FFD700]' : 'text-[#D32F2F]';
  const cursorColor = isDark ? 'bg-[#FFD700]' : 'bg-[#D32F2F]';
  const borderColor = isDark ? 'border-white/10' : 'border-[#D32F2F]/10';
  const bgQuote = isDark ? 'bg-white/5' : 'bg-[#D32F2F]/5';
  const shadowQuote = isDark ? 'shadow-[#FFD700]/5' : 'shadow-[#D32F2F]/5';

  useEffect(() => {
    let timeout;

    if (phase === 'typing') {
      if (display.length < fullText.length) {
        timeout = setTimeout(() => setDisplay(fullText.slice(0, display.length + 1)), 55);
      } else {
        timeout = setTimeout(() => setPhase('pausing'), 2200);
      }
    } else if (phase === 'pausing') {
      timeout = setTimeout(() => setPhase('deleting'), 200);
    } else if (phase === 'deleting') {
      if (display.length > 0) {
        timeout = setTimeout(() => setDisplay(display.slice(0, -1)), 25);
      } else {
        setIndex((i) => (i + 1) % quoteKeys.length);
        setPhase('typing');
      }
    }

    return () => clearTimeout(timeout);
  }, [display, phase, index, fullText]);

  // ===== وقتی زبان تغییر می‌کند، متن را ریست کن =====
  useEffect(() => {
    setDisplay('');
    setPhase('typing');
  }, [currentLang]);

  return (
    <div className={`relative py-10 md:py-14 px-4 my-8 rounded-3xl ${bgQuote} backdrop-blur-sm border ${borderColor} shadow-xl ${shadowQuote} transition-colors duration-300`}>
      {/* ===== افکت تزئینی ===== */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className={`w-12 h-12 rounded-full ${isDark ? 'bg-[#FFD700]/20' : 'bg-[#D32F2F]/20'} blur-xl`} />
      </div>
      
      {/* ===== آیکون نقل قول ===== */}
      <div className="absolute top-4 left-6 text-4xl opacity-10 select-none">
        <span className={isDark ? 'text-[#FFD700]' : 'text-[#D32F2F]'}>"</span>
      </div>
      <div className="absolute bottom-4 right-6 text-4xl opacity-10 select-none">
        <span className={isDark ? 'text-[#FFD700]' : 'text-[#D32F2F]'}>"</span>
      </div>

      {/* ===== متن تایپینگ ===== */}
      <div className="text-center">
        <p className={`text-xl md:text-2xl lg:text-3xl font-extrabold ${textColor} min-h-[3.5rem] md:min-h-[4.5rem] leading-relaxed transition-colors duration-300`}>
          {display}
          <span className={`inline-block w-[2px] h-6 md:h-8 ${cursorColor} align-middle ms-1 animate-pulse transition-colors duration-300`} />
        </p>
        <p className={`${authorColor} text-sm md:text-base mt-4 font-medium transition-colors duration-300`}>
          — {author}
        </p>
      </div>
    </div>
  );
}
