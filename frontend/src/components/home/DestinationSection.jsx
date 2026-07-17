import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import TypingQuotes from './TypingQuotes';

const destinationImages = {
  doha: [
    '/images/destinations/doha/Museum-of-Islamic-Art.png',
    '/images/destinations/doha/Doha-Corniche.png',
    '/images/destinations/doha/West-Bay-Towers.png',
    '/images/destinations/doha/Souq-Waqif.png',
  ],
  shiraz: [
    '/images/destinations/shiraz/Hafezieh.png',
    '/images/destinations/shiraz/Nasir-al-Mulk-Mosque.png',
    '/images/destinations/shiraz/Eram-Garden.png',
    '/images/destinations/shiraz/Persepolis.png',
  ],
};

export default function DestinationSection({ namespace, dark }) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const items = destinationImages[namespace] || [];
  const labels = items.map((_, index) => ({
    key: index + 1,
    label: t(`homePage.${namespace}.item${index + 1}`),
    img: items[index],
  }));

  // ===== کلاس‌های پویا =====
  const bgSection = dark 
    ? (isDark ? 'bg-black' : 'bg-[#FFF8F0]') 
    : (isDark ? 'bg-black/30' : 'bg-[#F5EDE0]/30');
  
  const titleColor = isDark ? 'text-white' : 'text-[#1A1A1A]';
  const subtitleColor = isDark ? 'text-gray-300' : 'text-[#666666]';
  const borderColor = isDark ? 'border-white/10' : 'border-[#D32F2F]/10';
  const hoverBorder = isDark ? 'hover:border-[#FFD700]/50' : 'hover:border-[#D32F2F]/50';
  const shadowColor = isDark ? 'shadow-[#FFD700]/10' : 'shadow-[#D32F2F]/10';
  const cardBg = isDark ? 'bg-white/5' : 'bg-[#D32F2F]/5';

  return (
    <section className={`py-16 md:py-20 ${bgSection} border-y ${borderColor} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4">
        {/* ===== هدر ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-black ${titleColor} tracking-tight leading-[1.1] transition-colors duration-300`}>
            {t(`homePage.${namespace}.title`)}
          </h2>
          <p className={`text-base md:text-lg ${subtitleColor} mt-4 max-w-2xl mx-auto font-light transition-colors duration-300`}>
            {t(`homePage.${namespace}.subtitle`)}
          </p>
        </motion.div>

        {/* ===== کارت‌ها ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {labels.map((item, i) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className={`group relative rounded-2xl overflow-hidden ${cardBg} backdrop-blur-sm border ${borderColor} ${hoverBorder} transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${shadowColor} aspect-[3/4]`}
            >
              <img
                src={item.img}
                alt={item.label}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  e.currentTarget.src = '/images/placeholder.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <h3 className="text-xl font-bold">{item.label}</h3>
                <p className="text-gray-300 text-sm mt-1 opacity-80">
                  {t(`homePage.${namespace}.explore`) || 'کاوش کنید →'}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ===== نقل قول تایپینگ (بین دو بخش) ===== */}
        {namespace === 'shiraz' && <TypingQuotes />}
      </div>
    </section>
  );
}
