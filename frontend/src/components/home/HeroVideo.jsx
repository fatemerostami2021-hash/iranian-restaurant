import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { FiVolume2, FiVolumeX } from 'react-icons/fi';

export default function HeroVideo() {
  const { t } = useTranslation();
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <section className="relative w-full">
      {/* ===== ویدیو ===== */}
      <div className="relative w-full h-[40vh] sm:h-[50vh] md:h-[60vh] min-h-[240px] max-h-[560px] overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/videos/hero.mp4"
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="auto"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

        {/* ===== دکمه کنترل صدا ===== */}
        <button
          onClick={toggleMute}
          className="absolute bottom-6 right-6 z-20 p-3 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-all duration-300 text-white border border-white/20"
          aria-label={isMuted ? 'فعال کردن صدا' : 'قطع کردن صدا'}
        >
          {isMuted ? <FiVolumeX size={20} /> : <FiVolume2 size={20} />}
        </button>
      </div>

      {/* ===== محتوا — زیر ویدیو، یک ردیف ===== */}
      <div className="relative z-10 bg-gradient-to-r from-[#FFF8F0] via-white to-[#FFF8F0] px-4 sm:px-8 py-5 sm:py-6 md:py-8 border-y border-[#FFD700]/20">
        <div
          dir="rtl"
          className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6"
        >
          {/* عنوان — قرمز + مشکی */}
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black leading-tight shrink-0">
            <span className="text-[#DC2626]">Authentic</span>{' '}
            <span className="text-[#1A1A1A]">Iranian</span>{' '}
            <span className="text-[#DC2626]">Taste</span>
          </h1>

          {/* دکمه View Menu */}
          <Link
            to="/menu"
            className="shrink-0 inline-block px-5 sm:px-8 md:px-10 lg:px-12 py-2.5 sm:py-3 md:py-4 bg-gradient-to-r from-[#FFD700] to-[#F9A825] hover:from-[#F9A825] hover:to-[#FFD700] text-black font-black text-sm sm:text-base md:text-lg rounded-full transition-all duration-300 shadow-lg shadow-[#FFD700]/30 hover:shadow-xl hover:shadow-[#FFD700]/50 hover:scale-105 active:scale-95 border-2 border-white/30 whitespace-nowrap"
          >
            {t('hero.cta')}
          </Link>

          {/* زیرنویس */}
          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-semibold text-[#4A4A4A] leading-relaxed shrink-0">
            {t('hero.subtitle')}
          </p>
        </div>
      </div>
    </section>
  );
}