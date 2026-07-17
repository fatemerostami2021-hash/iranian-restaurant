import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { GiKebabSpit, GiMeat, GiFireBowl } from 'react-icons/gi';
import { Link } from 'react-router-dom';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: 'easeOut' },
  }),
};

export default function About() {
  const { t } = useTranslation();

  const stats = [
    { key: 'statsYears', value: '8+' },
    { key: 'statsDishes', value: '78' },
    { key: 'statsCustomers', value: '50K+' },
    { key: 'statsRating', value: '4.8' },
  ];

  const values = [
    { key: 1, icon: GiMeat, title: t('aboutPage.value1Title'), desc: t('aboutPage.value1Desc') },
    { key: 2, icon: GiKebabSpit, title: t('aboutPage.value2Title'), desc: t('aboutPage.value2Desc') },
    { key: 3, icon: GiFireBowl, title: t('aboutPage.value3Title'), desc: t('aboutPage.value3Desc') },
  ];

  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative h-[70vh] min-h-[420px] flex items-center justify-center text-center">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.85)), url('/images/about/hero.jpg')",
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 px-4 max-w-2xl"
        >
          <span className="inline-block text-[#d4af37] text-xs tracking-[0.3em] uppercase mb-4">
            Kabab Dagh Nan Dagh
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {t('aboutPage.heroTitle')}
          </h1>
          <p className="text-gray-300 text-sm md:text-base">
            {t('aboutPage.heroSubtitle')}
          </p>
        </motion.div>
      </section>

      {/* STORY */}
      <section className="max-w-5xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-10 items-center">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-primary-dark dark:text-primary-light mb-4">
            {t('aboutPage.storyTitle')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
            {t('aboutPage.storyP1')}
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {t('aboutPage.storyP2')}
          </p>
        </motion.div>
        <motion.div
          variants={fadeUp}
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="relative"
        >
          <div className="aspect-[4/5] rounded-3xl bg-gray-100 dark:bg-surface-metal overflow-hidden border border-[#d4af37]/30 shadow-xl">
            <img
              src="/images/about/story.jpg"
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
          <div className="absolute -bottom-4 -start-4 w-20 h-20 rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/40 backdrop-blur -z-10" />
        </motion.div>
      </section>

      {/* STATS */}
      <section className="bg-surface-dark py-16">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <motion.div
              key={s.key}
              variants={fadeUp}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="text-3xl md:text-4xl font-bold text-[#d4af37] mb-1">{s.value}</div>
              <div className="text-xs md:text-sm text-gray-400">{t('aboutPage.' + s.key)}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* VALUES */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-2xl font-bold text-center text-primary-dark dark:text-primary-light mb-12"
        >
          {t('aboutPage.valuesTitle')}
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-6">
          {values.map(({ key, icon: Icon, title, desc }, i) => (
            <motion.div
              key={key}
              variants={fadeUp}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center p-6 rounded-2xl border border-gray-100 dark:border-surface-metal hover:border-[#d4af37]/50 transition group"
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-[#d4af37]/10 flex items-center justify-center mb-4 group-hover:bg-[#d4af37]/20 transition">
                <Icon size={26} className="text-[#d4af37]" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/10 to-transparent" />
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative z-10 px-4"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-primary-dark dark:text-primary-light mb-6">
            {t('aboutPage.ctaTitle')}
          </h2>
          <Link
            to="/menu"
            className="inline-block px-8 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-full transition"
          >
            {t('aboutPage.ctaButton')}
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
