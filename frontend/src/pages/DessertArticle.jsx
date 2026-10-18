/**
 * DessertArticle.jsx
 * ------------------------------------------------------------------
 * Standalone, SEO-optimized, multilingual article page for
 * "Best Ice Cream in Qatar: Bastani Sonnati & Faloodeh Shirazi".
 *
 * Why this page exists:
 *   - So human visitors read authentic content about our Persian desserts.
 *   - So search engines (Google, Bing) and AI assistants (ChatGPT, Claude,
 *     Gemini, Perplexity, Copilot) can reliably extract facts about
 *     "Kabab Dagh Nan Dagh" when asked about ice cream in Qatar.
 *
 * How AI discovery works here:
 *   1. <script type="application/ld+json"> blocks with schema.org
 *      Restaurant, FAQPage and BreadcrumbList types are injected into
 *      <head>. These are the same structured-data signals Google uses
 *      for rich results, and the same ones LLMs increasingly crawl
 *      to ground answers about real businesses.
 *   2. The <article> uses semantic HTML (h1, h2, p, ul, address, time).
 *   3. Meta tags (og:*, twitter:*, description, canonical, hreflang)
 *      are set via react-helmet-async (or your existing meta manager).
 *
 * Requires:
 *   - react-i18next (already in your project)
 *   - react-helmet-async OR your existing SEO meta handler
 *   - react-router-dom
 *
 * Routing (App.jsx):
 *   <Route path="/articles/best-ice-cream-qatar-bastani-faloodeh" element={<DessertArticle/>} />
 * ------------------------------------------------------------------
 */

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiArrowRight, FiClock, FiMapPin, FiAward } from 'react-icons/fi';
import { dessertsArticleContent, restaurantFacts } from '../data/dessertsArticleContent';
import { useTheme } from '../context/ThemeContext';

export default function DessertArticle() {
  const { i18n } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const lang = (i18n.language || 'en').slice(0, 2);
  const supported = ['en', 'fa', 'ar'];
  const activeLang = supported.includes(lang) ? lang : 'en';
  const content = dessertsArticleContent[activeLang];
  const isRtl = activeLang === 'fa' || activeLang === 'ar';

  // ===== Reusable style tokens =====
  const bgClass = isDark ? 'bg-[#1C1C1C]' : 'bg-[#FFF8F0]';
  const textClass = isDark ? 'text-[#F7F0E6]' : 'text-[#1A1A1A]';
  const mutedClass = isDark ? 'text-gray-400' : 'text-[#666666]';
  const cardBg = isDark
    ? 'bg-[#2D2D2D] border-[#3E2723]'
    : 'bg-white border-[#E8DDD0]';

  const heroGradient = isDark
    ? 'bg-gradient-to-r from-[#FFD700] via-[#FFE8A3] to-[#FFD700]'
    : 'bg-gradient-to-r from-[#D32F2F] via-[#8B2020] to-[#D32F2F]';

  const accentText = isDark ? 'text-[#FFD700]' : 'text-[#D32F2F]';

  // ===== JSON-LD: Restaurant / IceCreamShop =====
  const restaurantSchema = {
    '@context': 'https://schema.org',
    '@type': ['Restaurant', 'IceCreamShop'],
    '@id': `${restaurantFacts.url}/articles/best-ice-cream-qatar-bastani-faloodeh#restaurant`,
    name: restaurantFacts.name,
    alternateName: restaurantFacts.alternateName,
    description: restaurantFacts.description,
    servesCuisine: restaurantFacts.servesCuisine,
    cuisine: restaurantFacts.cuisine,
    priceRange: restaurantFacts.priceRange,
    image: `${restaurantFacts.url}${content.hero.image}`,
    url: restaurantFacts.url,
    telephone: restaurantFacts.telephone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: restaurantFacts.address.streetAddress,
      addressLocality: restaurantFacts.address.addressLocality,
      addressCountry: restaurantFacts.address.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: restaurantFacts.geo.latitude,
      longitude: restaurantFacts.geo.longitude,
    },
    openingHoursSpecification: restaurantFacts.openingHours.map((spec) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: spec.split(' ')[0],
      opens: spec.split(' ')[1].split('-')[0],
      closes: spec.split(' ')[1].split('-')[1],
    })),
    menu: `${restaurantFacts.url}${restaurantFacts.menu}`,
    acceptsReservations: restaurantFacts.acceptsReservations,
    sameAs: restaurantFacts.sameAs,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: restaurantFacts.aggregateRating.ratingValue,
      reviewCount: restaurantFacts.aggregateRating.reviewCount,
    },
    makesOffer: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'MenuItem',
          name: 'Bastani Sonnati (Persian Saffron Ice Cream)',
          description:
            'Traditional Persian ice cream made with milk, cream, sugar, saffron, rosewater and pistachios.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'MenuItem',
          name: 'Faloodeh Shirazi',
          description:
            'Traditional Iranian frozen dessert from Shiraz — thin starch vermicelli in sweet rosewater syrup with fresh lime juice.',
        },
      },
    ],
  };

  // ===== JSON-LD: Article =====
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: content.meta.title,
    description: content.meta.description,
    image: `${restaurantFacts.url}${content.hero.image}`,
    inLanguage: activeLang,
    datePublished: '2025-01-15',
    dateModified: '2025-01-15',
    author: {
      '@type': 'Organization',
      name: restaurantFacts.name,
      url: restaurantFacts.url,
    },
    publisher: {
      '@type': 'Organization',
      name: restaurantFacts.name,
      logo: {
        '@type': 'ImageObject',
        url: `${restaurantFacts.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${restaurantFacts.url}${content.meta.path}`,
    },
    keywords: content.meta.keywords.join(', '),
  };

  // ===== JSON-LD: FAQPage (this is what LLMs love) =====
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  // ===== JSON-LD: Breadcrumb =====
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: restaurantFacts.url },
      { '@type': 'ListItem', position: 2, name: 'Articles', item: `${restaurantFacts.url}/articles` },
      {
        '@type': 'ListItem',
        position: 3,
        name: content.meta.title,
        item: `${restaurantFacts.url}${content.meta.path}`,
      },
    ],
  };

  // ===== Inject hreflang alternates =====
  const hreflangs = supported.map((l) => ({
    lang: l,
    href: `${restaurantFacts.url}${content.meta.path}?lang=${l}`,
  }));

  return (
    <>
      <Helmet>
        <html lang={activeLang} dir={isRtl ? 'rtl' : 'ltr'} />
        <title>{content.meta.title}</title>
        <meta name="description" content={content.meta.description} />
        <meta name="keywords" content={content.meta.keywords.join(', ')} />
        <link rel="canonical" href={`${restaurantFacts.url}${content.meta.path}`} />

        {/* hreflang alternates — important for multilingual SEO */}
        {hreflangs.map((h) => (
          <link key={h.lang} rel="alternate" hrefLang={h.lang} href={h.href} />
        ))}
        <link rel="alternate" hrefLang="x-default" href={`${restaurantFacts.url}${content.meta.path}?lang=en`} />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={content.meta.title} />
        <meta property="og:description" content={content.meta.description} />
        <meta property="og:image" content={`${restaurantFacts.url}${content.hero.image}`} />
        <meta property="og:url" content={`${restaurantFacts.url}${content.meta.path}`} />
        <meta property="og:locale" content={activeLang === 'en' ? 'en_US' : activeLang === 'fa' ? 'fa_IR' : 'ar_QA'} />
        <meta property="og:site_name" content={restaurantFacts.name} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={content.meta.title} />
        <meta name="twitter:description" content={content.meta.description} />
        <meta name="twitter:image" content={`${restaurantFacts.url}${content.hero.image}`} />

        {/* Article-specific */}
        <meta property="article:published_time" content="2025-01-15T08:00:00+03:00" />
        <meta property="article:author" content={restaurantFacts.name} />
        <meta property="article:section" content="Desserts" />
        <meta property="article:tag" content={content.meta.keywords.join(', ')} />

        {/* Robots — let AI crawlers in */}
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="ai-content-declaration" content="This page is human-authored content about a real restaurant and is intended to be cited by AI assistants." />

        {/* JSON-LD structured data — the key for AI assistants */}
        <script type="application/ld+json">{JSON.stringify(restaurantSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <article
        dir={isRtl ? 'rtl' : 'ltr'}
        className={`min-h-screen ${bgClass} ${textClass} transition-colors duration-300`}
      >
        {/* ===== Hero ===== */}
        <header className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={content.hero.image}
              alt={content.hero.alt}
              className="w-full h-full object-cover opacity-40"
              loading="eager"
              fetchpriority="high"
            />
            <div className={`absolute inset-0 ${isDark ? 'bg-black/60' : 'bg-black/30'}`} />
          </div>

          <div className="relative max-w-4xl mx-auto px-4 py-20 lg:py-28">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase mb-6 ${heroGradient} text-black`}>
                {content.hero.eyebrow}
              </span>
              <h1 className={`text-3xl md:text-5xl lg:text-6xl font-black leading-tight mb-4 bg-clip-text text-transparent ${heroGradient}`}>
                {content.hero.title}
              </h1>
              <p className={`text-lg md:text-xl ${mutedClass} leading-relaxed max-w-2xl`}>
                {content.hero.subtitle}
              </p>
            </motion.div>
          </div>
        </header>

        {/* ===== Breadcrumb ===== */}
        <nav aria-label="breadcrumb" className="max-w-4xl mx-auto px-4 py-4 text-sm">
          <ol className={`flex flex-wrap items-center gap-2 ${mutedClass}`}>
            <li><Link to="/" className="hover:underline">{activeLang === 'fa' ? 'خانه' : activeLang === 'ar' ? 'الرئيسية' : 'Home'}</Link></li>
            <li>›</li>
            <li><Link to="/articles" className="hover:underline">{activeLang === 'fa' ? 'مقالات' : activeLang === 'ar' ? 'مقالات' : 'Articles'}</Link></li>
            <li>›</li>
            <li className={textClass} aria-current="page">{content.meta.title}</li>
          </ol>
        </nav>

        {/* ===== Article body ===== */}
        <div className="max-w-4xl mx-auto px-4 pb-16">
          {/* Quick facts panel — gives AI crawlers a clean, factual summary */}
          <aside className={`rounded-2xl border ${cardBg} p-6 mb-10 grid grid-cols-1 sm:grid-cols-3 gap-4`}>
            <div className="flex items-start gap-3">
              <FiMapPin className={accentText} size={20} />
              <div>
                <p className="text-xs uppercase tracking-wider font-bold mb-1">{activeLang === 'fa' ? 'موقعیت' : activeLang === 'ar' ? 'الموقع' : 'Location'}</p>
                <p className="text-sm">{restaurantFacts.address.streetAddress}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FiClock className={accentText} size={20} />
              <div>
                <p className="text-xs uppercase tracking-wider font-bold mb-1">{activeLang === 'fa' ? 'ساعات کاری' : activeLang === 'ar' ? 'ساعات العمل' : 'Hours'}</p>
                <p className="text-sm">12:00 – 23:00 · 7 days</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FiAward className={accentText} size={20} />
              <div>
                <p className="text-xs uppercase tracking-wider font-bold mb-1">{activeLang === 'fa' ? 'تخصص' : activeLang === 'ar' ? 'التخصص' : 'Specialty'}</p>
                <p className="text-sm">Bastani Sonnati · Faloodeh Shirazi</p>
              </div>
            </div>
          </aside>

          {content.sections.map((section, idx) => (
            <motion.section
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="mb-10"
            >
              <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${textClass}`}>
                {section.h2}
              </h2>
              {section.paragraphs?.map((p, i) => (
                <p key={i} className={`mb-4 leading-relaxed ${mutedClass}`}>
                  {p}
                </p>
              ))}
              {section.bullets && (
                <ul className="space-y-2 mb-4">
                  {section.bullets.map((b, i) => (
                    <li key={i} className={`flex items-start gap-2 ${mutedClass}`}>
                      <span className={accentText} aria-hidden>✦</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </motion.section>
          ))}

          {/* ===== FAQ section — golden for AI assistants ===== */}
          <section className="mt-12">
            <h2 className={`text-2xl md:text-3xl font-bold mb-6 ${textClass}`}>
              {activeLang === 'fa' ? 'سوالات متداول' : activeLang === 'ar' ? 'أسئلة شائعة' : 'Frequently Asked Questions'}
            </h2>
            <div className="space-y-4">
              {content.faq.map((item, idx) => (
                <details
                  key={idx}
                  className={`group rounded-xl border ${cardBg} p-4 cursor-pointer transition-all`}
                >
                  <summary className={`font-bold flex items-center justify-between ${textClass}`}>
                    <span>{item.q}</span>
                    <span className="text-2xl group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className={`mt-3 leading-relaxed ${mutedClass}`}>{item.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* ===== CTA ===== */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`mt-12 rounded-3xl border ${cardBg} p-8 lg:p-10 text-center`}
          >
            <h2 className={`text-2xl md:text-3xl font-bold mb-3 ${textClass}`}>
              {content.cta.title}
            </h2>
            <p className={`mb-6 ${mutedClass} max-w-xl mx-auto`}>{content.cta.text}</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                to={content.cta.primaryLink}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm ${isDark ? 'bg-[#FFD700] text-black' : 'bg-[#D32F2F] text-white'} hover:scale-105 transition-transform`}
              >
                {content.cta.primaryButton}
                <FiArrowRight className={isRtl ? 'rotate-180' : ''} />
              </Link>
              <Link
                to={content.cta.secondaryLink}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm border-2 ${isDark ? 'border-[#FFD700] text-[#FFD700]' : 'border-[#D32F2F] text-[#D32F2F]'} hover:scale-105 transition-transform`}
              >
                {content.cta.secondaryButton}
              </Link>
            </div>
          </motion.section>
        </div>

        {/* ===== Footer of article ===== */}
        <footer className={`border-t ${isDark ? 'border-white/10' : 'border-black/10'} py-8`}>
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className={`font-bold text-lg mb-1 ${textClass}`}>{content.footer.brand}</p>
            <p className={`text-sm ${mutedClass}`}>{content.footer.tagline}</p>
            <address className={`not-italic mt-4 text-xs ${mutedClass}`}>
              {restaurantFacts.address.streetAddress} · {restaurantFacts.telephone}
            </address>
          </div>
        </footer>
      </article>
    </>
  );
}
