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
    <section className="relative w-full h-[60vh] md:h-[75vh] min-h-[380px] max-h-[720px] overflow-hidden">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/videos/hero.mp4"
        autoPlay
        loop
        muted={isMuted}
        playsInline
        preload="auto"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />

      {/* ===== دکمه کنترل صدا ===== */}
      <button
        onClick={toggleMute}
        className="absolute bottom-6 right-6 z-20 p-3 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-all duration-300 text-white border border-white/20"
        aria-label={isMuted ? 'فعال کردن صدا' : 'قطع کردن صدا'}
      >
        {isMuted ? <FiVolumeX size={20} /> : <FiVolume2 size={20} />}
      </button>

      <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            {t('hero.title')}
          </h1>
          <p className="text-gray-200 text-sm md:text-base mb-6">
            {t('hero.subtitle')}
          </p>
          <Link
            to="/menu"
            className="inline-block px-8 py-3 bg-[#FFD700] hover:bg-[#F9A825] text-black font-semibold rounded-full transition-all duration-300 shadow-lg shadow-[#FFD700]/20 hover:shadow-[#FFD700]/40 hover:scale-105"
          >
            {t('hero.cta')}
          </Link>
        </div>
      </div>
    </section>
  );
}