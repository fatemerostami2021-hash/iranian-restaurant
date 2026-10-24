/**
 * MenuHero.jsx (v3 — SEO-optimized with bold, large title)
 * ------------------------------------------------------------------
 * Designed so that when a user searches "کباب" / "kabab" / "kebab" in
 * Qatar, Google lands them on /menu — this page is now optimized for
 * the keyword "Kabab Dagh" and "Kabab Dagh Nan Dagh".
 *
 * Features:
 *   - Extra-large, bold title with brand keywords
 *   - SEO-optimized subtitle with secondary keywords in 3 languages
 *   - Multi-slide background with ken-burns effect
 *   - JSON-LD Restaurant + Menu schema injected via Helmet
 *   - Dark/light theme aware, RTL/LTR aware
 *
 * To adjust height, change the `h-[55vh]` value in the section className.
 * ------------------------------------------------------------------
 */

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FiChevronDown, FiArrowRight } from 'react-icons/fi';

// ===== Slides configuration =====
const SLIDES = [
  {
    image: '/images/hero/picture/Kebab-Dagh-menu-hero.webp',
    alt: 'Kabab Dagh Nan Dagh authentic Persian kebab menu — kebab koobideh, joojeh, and chelow kebab with saffron rice',
  },
];

const SLIDE_DURATION_MS = 6000;
const KEN_BURNS_DURATION_S = 20;

// ===== SEO content per language =====
// Primary keywords are placed prominently in H1; secondary keywords in subtitle.
// Keywords: kabab / kabab dagh / kabab dagh nan dagh / Persian kebab / Iranian kebab / Doha kebab
const SEO_CONTENT = {
  en: {
    badge: 'Kabab Dagh Nan Dagh',
    // H1 — contains brand name + primary keyword + location
    title: 'Kabab Dagh — Best Persian Kebab in Doha',
    // Subtitle — contains secondary keywords, natural language
    subtitle:
      'Authentic Iranian kebab menu at Kabab Dagh Nan Dagh — Koobideh kebab, Joojeh kebab, Chelow kebab, and saffron rice, grilled the traditional Persian way.',
    cta: 'Browse Our Kebab Menu',
  },
  fa: {
    badge: 'کباب داغ نان داغ',
    // H1 — نام برند + کلمه‌ی کلیدی اصلی + مکان
    title: 'کباب داغ — بهترین کباب ایرانی در دوحه',
    // Subtitle — کلمات کلیدی ثانویه به‌صورت طبیعی
    subtitle:
      'منوی اصیل کباب ایرانی در کباب داغ نان داغ — کباب کوبیده، جوجه کباب، چلوکباب با برنج زعفرانی، به روش سنتی ایرانی روی آتش زغال.',
    cta: 'مشاهده منوی کباب‌ها',
  },
  ar: {
    badge: 'كباب داغ نان داغ',
    // H1 — اسم العلامة التجارية + الكلمة المفتاحية الرئيسية + الموقع
    title: 'كباب داغ — أفضل كباب إيراني في الدوحة',
    // Subtitle — الكلمات المفتاحية الثانوية بلغة طبيعية
    subtitle:
      'قائمة الكباب الإيراني الأصيل في كباب داغ نان داغ — كباب كوبيده، كباب جوجيه، تشلو كباب مع أرز الزعفران، مشوي على الطريقة الفارسية التقليدية.',
    cta: 'تصفح قائمة الكباب',
  },
};

// ===== JSON-LD: Restaurant + Menu schema (for SEO/AI discovery) =====
const RESTAURL = 'https://kababdagh.com'; // ← change to your real domain
const restaurantSchema = {
  '@context': 'https://schema.org',
  '@type': ['Restaurant'],
  '@id': `${RESTAURL}/menu#restaurant`,
  name: 'Kabab Dagh Nan Dagh',
  alternateName: 'کباب داغ نان داغ',
  description:
    'Authentic Persian kebab restaurant in Doha, Qatar, serving Kabab Dagh, Koobideh, Joojeh, and Chelow kebab with saffron rice.',
  servesCuisine: ['Persian', 'Iranian', 'Kebab', 'Middle Eastern'],
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Doha',
    addressCountry: 'QA',
  },
  url: `${RESTAURL}/menu`,
  menu: `${RESTAURL}/menu`,
  acceptsReservations: true,
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '12:00',
      closes: '23:00',
    },
  ],
};

const menuSchema = {
  '@context': 'https://schema.org',
  '@type': 'Menu',
  name: 'Kabab Dagh Nan Dagh Menu',
  description:
    'Authentic Persian kebab menu featuring Kabab Dagh, Koobideh, Joojeh kebab, Chelow kebab, saffron rice, and traditional Iranian dishes.',
  hasMenuSection: [
    {
      '@type': 'MenuSection',
      name: 'Main Dishes',
      description: 'Traditional Persian kebab main dishes',
    },
    {
      '@type': 'MenuSection',
      name: 'Combos',
      description: 'Kebab combination platters',
    },
    {
      '@type': 'MenuSection',
      name: 'Breakfast',
      description: 'Persian breakfast dishes',
    },
    {
      '@type': 'MenuSection',
      name: 'Appetizers',
      description: 'Persian appetizers and side dishes',
    },
    {
      '@type': 'MenuSection',
      name: 'Beverages',
      description: 'Traditional Persian drinks',
    },
    {
      '@type': 'MenuSection',
      name: 'Desserts',
      description: 'Persian desserts including Bastani Sonnati and Faloodeh Shirazi',
    },
  ],
};

export default function MenuHero({ isDark = false }) {
  const { i18n } = useTranslation();
  const [current, setCurrent] = useState(0);
  const lang = (i18n.language || 'en').slice(0, 2);
  const supportedLang = ['en', 'fa', 'ar'].includes(lang) ? lang : 'en';
  const content = SEO_CONTENT[supportedLang];
  const isRtl = supportedLang === 'fa' || supportedLang === 'ar';
  const isMultiSlide = SLIDES.length > 1;

  // ===== Theme-aware style tokens =====
  const accentButton = isDark
    ? 'bg-[#FFD700] text-black hover:bg-[#FFE8A3]'
    : 'bg-[#D32F2F] text-white hover:bg-[#8B2020]';

  const titleGradient = isDark
    ? 'bg-gradient-to-r from-[#FFD700] via-[#FFE8A3] to-[#FFD700]'
    : 'bg-gradient-to-r from-[#FFD700] via-white to-[#FFD700]';

  const bottomFadeColor = isDark ? '#1C1C1C' : '#FFF8F0';

  // ===== Auto-rotate slides (only if multiple) =====
  useEffect(() => {
    if (!isMultiSlide) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(interval);
  }, [isMultiSlide]);

  const scrollToMenu = useCallback(() => {
    const el = document.getElementById('menu-content');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <>
      {/* ===== SEO meta tags + JSON-LD structured data ===== */}
      <Helmet>
        <html lang={supportedLang} dir={isRtl ? 'rtl' : 'ltr'} />
        <title>{content.title} | Kabab Dagh Nan Dagh Doha</title>
        <meta name="description" content={content.subtitle} />
        <meta
          name="keywords"
          content="kabab, kabab, kebab, kabab dagh, kabab dagh nan dagh, Persian kebab, Iranian kebab, Doha kebab, Qatar kebab, koobideh, joojeh, chelow kebab, کباب, کباب داغ, کباب داغ نان داغ, کباب ایرانی, كباب, كباب داغ, كباب داغ نان داغ, كباب إيراني"
        />
        <link rel="canonical" href={`${RESTAURL}/menu`} />

        {/* Open Graph */}
        <meta property="og:type" content="restaurant.menu" />
        <meta property="og:title" content={content.title} />
        <meta property="og:description" content={content.subtitle} />
        <meta property="og:image" content={`${RESTAURL}${SLIDES[0].image}`} />
        <meta property="og:url" content={`${RESTAURL}/menu`} />
        <meta property="og:locale" content={supportedLang === 'en' ? 'en_US' : supportedLang === 'fa' ? 'fa_IR' : 'ar_QA'} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={content.title} />
        <meta name="twitter:description" content={content.subtitle} />
        <meta name="twitter:image" content={`${RESTAURL}${SLIDES[0].image}`} />

        {/* Robots — encourage AI crawlers */}
        <meta
          name="robots"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />

        {/* JSON-LD: Restaurant schema */}
        <script type="application/ld+json">{JSON.stringify(restaurantSchema)}</script>
        {/* JSON-LD: Menu schema */}
        <script type="application/ld+json">{JSON.stringify(menuSchema)}</script>
      </Helmet>

      <section
        aria-label="Menu hero"
        className="relative w-full h-[38vh] min-h-[340px] max-h-[480px] overflow-hidden"
      >
        {/* ===== Background slides ===== */}
        <div className="absolute inset-0">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              className="absolute inset-0"
            >
              <motion.img
                src={SLIDES[current].image}
                alt={SLIDES[current].alt}
                className="w-full h-full object-cover"
                initial={{ scale: 1 }}
                animate={{ scale: 1.1 }}
                transition={{
                  duration: isMultiSlide ? SLIDE_DURATION_MS / 1000 : KEN_BURNS_DURATION_S,
                  repeat: isMultiSlide ? 0 : Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut',
                }}
                loading="eager"
                fetchpriority="high"
              />
            </motion.div>
          </AnimatePresence>

          {/* Vertical gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/75" />

          {/* Cinematic radial vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_25%,_rgba(0,0,0,0.55)_100%)]" />

          {/* Bottom fade into page background */}
          <div
            className="absolute inset-x-0 bottom-0 h-40"
            style={{ background: `linear-gradient(to top, ${bottomFadeColor}, transparent)` }}
          />
        </div>

        {/* ===== Content overlay — big, bold, SEO-optimized text ===== */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col justify-center items-center text-center">
          {/* Eyebrow badge with pulsing dot — brand name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-bold tracking-wider uppercase mb-3 sm:mb-4 bg-white/10 backdrop-blur-md text-white border border-white/20 shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700] animate-pulse" />
              {content.badge}
            </span>
          </motion.div>

          {/* ===== BIG, BOLD H1 with primary SEO keywords ===== */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
            className={`text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-3 sm:mb-4 bg-clip-text text-transparent ${titleGradient} drop-shadow-2xl leading-[1.05] tracking-tight`}
          >
            {content.title}
          </motion.h1>

          {/* ===== Subtitle with secondary keywords ===== */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
            className="text-sm sm:text-lg md:text-xl text-white/95 max-w-2xl mb-5 sm:mb-7 drop-shadow-lg leading-relaxed font-medium"
          >
            {content.subtitle}
          </motion.p>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45, ease: 'easeOut' }}
            onClick={scrollToMenu}
            className={`inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-black text-sm sm:text-base shadow-2xl hover:scale-105 transition-all duration-300 ${accentButton}`}
            aria-label={content.cta}
          >
            <span>{content.cta}</span>
            <FiArrowRight className={`text-lg ${isRtl ? 'rotate-180' : ''}`} />
          </motion.button>
        </div>

        {/* ===== Navigation dots (only if multi-slide) ===== */}
        {isMultiSlide && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === current ? 'w-8 bg-[#FFD700]' : 'w-2 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        )}

        {/* ===== Animated scroll-down indicator ===== */}
        <motion.button
          onClick={scrollToMenu}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 hover:text-white transition-colors"
          aria-label="Scroll to menu"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <FiChevronDown size={28} />
          </motion.div>
        </motion.button>
      </section>
    </>
  );
}
