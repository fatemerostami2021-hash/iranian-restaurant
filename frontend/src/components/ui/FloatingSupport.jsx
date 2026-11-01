import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { FiPhone, FiMessageCircle, FiX, FiChevronRight, FiArrowRight } from 'react-icons/fi';
import { FaInstagram, FaTelegramPlane } from 'react-icons/fa';
import { MdSupportAgent } from 'react-icons/md';
import { siteSettings } from '../../config/siteSettings';
import { useTheme } from '../../context/ThemeContext';

export default function FloatingSupport() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const reduce = useReducedMotion();
  const isDark = theme === 'dark';
  const lang = i18n.language;
  const isRtl = lang === 'fa' || lang === 'ar';

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [openQuestion, setOpenQuestion] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  // live "ticker": every few seconds the bubble next to the button shows the next channel
  const [tickerOn, setTickerOn] = useState(false);
  const [tick, setTick] = useState(0);
  const [wiggle, setWiggle] = useState(false);

  const accentBg = isDark ? 'bg-[#FFD700] text-black' : 'bg-[#D32F2F] text-white';
  const cardBg = isDark ? 'bg-[#1C1C1C] border-white/10' : 'bg-white border-gray-200';
  const textClass = isDark ? 'text-white' : 'text-[#1A1A1A]';
  const mutedClass = isDark ? 'text-gray-400' : 'text-gray-600';
  const hoverClass = isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50';

  const actions = [
    { key: 'support', icon: MdSupportAgent, label: t('supportAgent.actions.support', 'پشتیبانی'), color: accentBg, onClick: () => { setIsChatOpen(true); setIsMenuOpen(false); } },
    { key: 'whatsapp', icon: FiMessageCircle, label: t('supportAgent.actions.whatsapp', 'واتساپ'), color: 'bg-[#25D366]', ring: '#25D366', href: `https://wa.me/${siteSettings.whatsappNumber}` },
    { key: 'call', icon: FiPhone, label: t('supportAgent.actions.call', 'تماس'), color: 'bg-[#007EE5]', ring: '#007EE5', href: `tel:${siteSettings.phoneNumber.replace(/\s/g, '')}` },
    { key: 'telegram', icon: FaTelegramPlane, label: t('supportAgent.actions.telegram', 'تلگرام'), color: 'bg-[#229ED9]', ring: '#229ED9', href: siteSettings.telegram },
    { key: 'instagram', icon: FaInstagram, label: t('supportAgent.actions.instagram', 'اینستاگرام'), color: 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]', ring: '#DD2A7B', href: siteSettings.instagram },
  ];

  // channels shown one after another in the bubble (only the ones that have a link)
  const channels = actions.filter((a) => a.href);
  const current = channels.length ? channels[tick % channels.length] : null;

  // start the ticker a little after the page has loaded (keeps the first load light)
  useEffect(() => {
    if (reduce) return undefined;
    const id = setTimeout(() => setTickerOn(true), 2500);
    return () => clearTimeout(id);
  }, [reduce]);

  useEffect(() => {
    if (!tickerOn || isMenuOpen || channels.length < 2) return undefined;
    const id = setInterval(() => setTick((i) => i + 1), 2600);
    return () => clearInterval(id);
  }, [tickerOn, isMenuOpen, channels.length]);

  // the main button wiggles now and then
  useEffect(() => {
    if (reduce || isMenuOpen) return undefined;
    let off;
    const id = setInterval(() => {
      setWiggle(true);
      off = setTimeout(() => setWiggle(false), 900);
    }, 7000);
    return () => { clearInterval(id); clearTimeout(off); };
  }, [reduce, isMenuOpen]);

  const categories = [
    { key: 'hours', icon: '🕐' },
    { key: 'menu', icon: '🍽️' },
    { key: 'order', icon: '🛵' },
    { key: 'reservation', icon: '🪑' },
    { key: 'payment', icon: '💳' }
  ];

  const questions = activeCategory 
    ? Object.entries(t('supportAgent.questions', { returnObjects: true }))
        .filter(([key]) => key.startsWith(activeCategory))
        .map(([key, value]) => ({ id: key, ...value }))
    : [];

  return (
    <>
      {/* دکمه شناور و منو */}
      <div className={`fixed bottom-48 md:bottom-32 ${isRtl ? 'left-5 md:left-8 items-start' : 'right-5 md:right-8 items-end'} z-50 flex flex-col gap-3`}>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className={`flex flex-col gap-2 p-3 rounded-2xl border shadow-2xl ${cardBg}`}
            >
              {actions.map((action, i) => {
                const inner = (
                  <>
                    <motion.div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-white ${action.color}`}
                      animate={reduce ? undefined : { scale: [1, 1.12, 1] }}
                      transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.25, ease: 'easeInOut' }}
                    >
                      <action.icon size={18} />
                    </motion.div>
                    <span className="font-medium text-sm">{action.label}</span>
                  </>
                );
                const common = {
                  initial: { opacity: 0, x: isRtl ? 20 : -20 },
                  animate: { opacity: 1, x: 0, transition: { delay: i * 0.05 } },
                  className: `flex items-center gap-3 p-2 rounded-xl ${textClass} ${hoverClass} cursor-pointer w-40 ${isRtl ? 'text-right' : 'text-left'}`,
                };
                return action.href ? (
                  <motion.a key={action.key} href={action.href} target="_blank" rel="noreferrer" {...common}>
                    {inner}
                  </motion.a>
                ) : (
                  <motion.button key={action.key} type="button" onClick={action.onClick} {...common}>
                    {inner}
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* دکمه اصلی + حباب زنده‌ی شبکه‌های اجتماعی */}
        <div
          className="relative flex items-center gap-3"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* حباب: هر چند ثانیه یک کانال (واتساپ، تماس، تلگرام، اینستاگرام) */}
          {tickerOn && !isMenuOpen && current && (
            <div className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? 'left-full ml-3' : 'right-full mr-3'}`}>
              <AnimatePresence mode="wait">
                <motion.a
                  key={current.key}
                  href={current.href}
                  target="_blank"
                  rel="noreferrer"
                  tabIndex={-1}
                  aria-hidden="true"
                  initial={{ opacity: 0, x: isRtl ? -14 : 14, scale: 0.92 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: isRtl ? 14 : -14, scale: 0.92 }}
                  transition={{ duration: 0.28 }}
                  className={`flex items-center gap-2 ps-1.5 pe-3 py-1.5 rounded-full shadow-xl border whitespace-nowrap ${cardBg} ${textClass}`}
                >
                  <span className={`relative flex h-8 w-8 items-center justify-center rounded-full text-white ${current.color}`}>
                    {current.ring && (
                      <span className="absolute inset-0 rounded-full animate-ping opacity-40" style={{ backgroundColor: current.ring }} />
                    )}
                    <current.icon size={16} className="relative" />
                  </span>
                  <span className="text-xs font-bold">{current.label}</span>
                </motion.a>
              </AnimatePresence>
            </div>
          )}

          {/* تولتیپ Keep in Touch - فقط موقع هاور */}
          <AnimatePresence>
            {isHovered && !isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className={`absolute bottom-full mb-2 ${isRtl ? 'left-0' : 'right-0'} px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap shadow-xl border ${cardBg} ${textClass}`}
              >
                {t('supportAgent.keepInTouch', 'Keep in Touch')}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.08 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={t('supportAgent.title', 'پشتیبانی')}
            aria-expanded={isMenuOpen}
            className={`relative w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-2xl text-white transition-all duration-300 ${
              isMenuOpen ? 'bg-gray-700' : (isHovered ? 'bg-[#25D366]' : accentBg)
            }`}
          >
            {/* حلقه‌ی نور چشمک‌زن */}
            {!isMenuOpen && (
              <>
                <span className={`absolute inset-0 rounded-full ${isHovered ? 'bg-[#25D366]' : 'bg-[#D32F2F]'} opacity-30 animate-ping pointer-events-none transition-colors duration-300`} />
                <span className={`absolute -inset-1 rounded-full ${isHovered ? 'bg-[#25D366]' : 'bg-[#D32F2F]'} opacity-20 blur-md pointer-events-none transition-colors duration-300`} />
              </>
            )}

            {/* نقطه سبز وضعیت آنلاین */}
            {!isMenuOpen && (
              <span className={`absolute top-0.5 ${isRtl ? 'right-0.5' : 'left-0.5'} flex h-3.5 w-3.5 z-20`}>
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping" />
                <span className={`relative inline-flex rounded-full h-3.5 w-3.5 bg-green-500 border-2 ${isDark ? 'border-[#1C1C1C]' : 'border-white'}`} />
              </span>
            )}

            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} className="relative z-10">
                  <FiX size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="agent"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: wiggle ? [0, -14, 14, -10, 10, 0] : 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: wiggle ? 0.8 : 0.3 }}
                  className="relative z-10"
                >
                  <MdSupportAgent size={28} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* پنجره چت پشتیبانی */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setIsChatOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-end md:items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 50 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-md h-[75vh] md:h-[600px] rounded-3xl flex flex-col shadow-2xl border ${cardBg} ${textClass}`}
            >
              {/* هدر چت */}
              <div className={`p-4 border-b ${isDark ? 'border-white/10' : 'border-gray-200'} flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  {activeCategory && (
                    <button type="button" aria-label="Back" onClick={() => setActiveCategory(null)} className={`p-1 rounded-full ${mutedClass} ${hoverClass}`}>
                      {isRtl ? <FiArrowRight /> : <FiChevronRight style={{ transform: 'rotate(180deg)' }} />}
                    </button>
                  )}
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    {t('supportAgent.title', 'پشتیبانی')}
                    <span className="flex items-center gap-1 text-xs font-medium text-green-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      {t('supportAgent.online', 'آنلاین')}
                    </span>
                  </h3>
                </div>
                <button type="button" aria-label="Close" onClick={() => setIsChatOpen(false)} className={`p-2 rounded-full ${mutedClass} ${hoverClass}`}>
                  <FiX />
                </button>
              </div>

              {/* بدنه چت */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <div className={`max-w-[80%] p-3 rounded-2xl ${isDark ? 'bg-white/10' : 'bg-gray-100'} ${isRtl ? 'rounded-tl-none' : 'rounded-tr-none'}`}>
                  {t('supportAgent.subtitle')}
                </div>

                {!activeCategory && (
                  <div className="grid grid-cols-1 gap-2 mt-4">
                    {categories.map(cat => (
                      <button 
                        key={cat.key}
                        type="button"
                        onClick={() => setActiveCategory(cat.key)}
                        className={`w-full ${isRtl ? 'text-right' : 'text-left'} p-3 rounded-xl border ${isDark ? 'border-white/10' : 'border-gray-200'} ${hoverClass} flex items-center justify-between transition-colors`}
                      >
                        <span className="flex items-center gap-3 font-medium">
                          <span className="text-xl">{cat.icon}</span>
                          {t(`supportAgent.categories.${cat.key}`)}
                        </span>
                        <FiChevronRight className={mutedClass} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
                      </button>
                    ))}
                  </div>
                )}

                {activeCategory && (
                  <div className="space-y-2 mt-4">
                    {questions.map(q => (
                      <div key={q.id} className={`rounded-xl border ${isDark ? 'border-white/10' : 'border-gray-200'} overflow-hidden`}>
                        <button 
                          type="button"
                          onClick={() => setOpenQuestion(openQuestion === q.id ? null : q.id)}
                          className={`w-full ${isRtl ? 'text-right' : 'text-left'} p-3 flex items-center justify-between font-medium text-sm ${hoverClass}`}
                        >
                          {q.q}
                          <FiChevronRight 
                            className={`transition-transform ${mutedClass}`} 
                            style={{ transform: openQuestion === q.id ? 'rotate(90deg)' : (isRtl ? 'scaleX(-1)': 'none') }} 
                          />
                        </button>
                        <AnimatePresence>
                          {openQuestion === q.id && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className={`overflow-hidden ${isDark ? 'bg-black/20' : 'bg-gray-50'}`}
                            >
                              <p className="p-3 text-sm">{q.a}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* فوتر چت */}
              <div className={`p-4 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                <p className={`text-center text-sm mb-3 ${mutedClass}`}>{t('supportAgent.stillNeedHelp')}</p>
                <a 
                  href={`https://wa.me/${siteSettings.whatsappNumber}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold bg-[#25D366] hover:bg-[#1da851] transition-colors"
                >
                  <FiMessageCircle /> {t('supportAgent.chatOnWhatsapp')}
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
