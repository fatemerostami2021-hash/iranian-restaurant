import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPhone, FiMessageCircle, FiX, FiChevronRight, FiArrowRight } from 'react-icons/fi';
import { FaInstagram, FaTelegramPlane } from 'react-icons/fa';
import { MdSupportAgent } from 'react-icons/md';
import { siteSettings } from '../../config/siteSettings';
import { useTheme } from '../../context/ThemeContext';

export default function FloatingSupport() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const lang = i18n.language;
  const isRtl = lang === 'fa' || lang === 'ar';

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [openQuestion, setOpenQuestion] = useState(null);

  const accentBg = isDark ? 'bg-[#FFD700] text-black' : 'bg-[#D32F2F] text-white';
  const cardBg = isDark ? 'bg-[#1C1C1C] border-white/10' : 'bg-white border-gray-200';
  const textClass = isDark ? 'text-white' : 'text-[#1A1A1A]';
  const mutedClass = isDark ? 'text-gray-400' : 'text-gray-600';
  const hoverClass = isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50';

  const actions = [
    { icon: MdSupportAgent, label: t('supportAgent.actions.support', 'پشتیبانی'), color: accentBg, onClick: () => { setIsChatOpen(true); setIsMenuOpen(false); } },
    { icon: FiMessageCircle, label: t('supportAgent.actions.whatsapp', 'واتساپ'), color: 'bg-[#25D366]', href: `https://wa.me/${siteSettings.whatsappNumber}` },
    { icon: FiPhone, label: t('supportAgent.actions.call', 'تماس'), color: 'bg-[#007EE5]', href: `tel:${siteSettings.phoneNumber.replace(/\s/g, '')}` },
    { icon: FaTelegramPlane, label: t('supportAgent.actions.telegram', 'تلگرام'), color: 'bg-[#229ED9]', href: siteSettings.telegram },
    { icon: FaInstagram, label: t('supportAgent.actions.instagram', 'اینستاگرام'), color: 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]', href: siteSettings.instagram },
  ];

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
      {/* دکمه شناور و منو - ارتفاع بیشتر برای موبایل و دسکتاپ */}
      <div className={`fixed bottom-24 md:bottom-10 ${isRtl ? 'right-5 md:right-8' : 'left-5 md:left-8'} z-50 flex flex-col items-${isRtl ? 'end' : 'start'} gap-3`}>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className={`flex flex-col gap-2 p-3 rounded-2xl border shadow-2xl ${cardBg}`}
            >
              {actions.map((action, i) => (
                <motion.button 
                  key={i}
                  onClick={() => action.onClick ? action.onClick() : null}
                  initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0, transition: { delay: i * 0.05 } }}
                  className={`flex items-center gap-3 p-2 rounded-xl ${textClass} ${hoverClass} cursor-pointer w-36 text-${isRtl ? 'right' : 'left'}`}
                >
                  <a 
                    href={action.href || '#'} 
                    target={action.href ? '_blank' : undefined} 
                    rel="noreferrer" 
                    className="flex items-center gap-3 w-full"
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white ${action.color}`}>
                      <action.icon size={18} />
                    </div>
                    <span className="font-medium text-sm">{action.label}</span>
                  </a>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-2xl text-white ${isMenuOpen ? 'bg-gray-700' : accentBg}`}
        >
          <AnimatePresence mode="wait">
            {isMenuOpen ? (
              <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                <FiX size={24} />
              </motion.div>
            ) : (
              <motion.div key="agent" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                <MdSupportAgent size={28} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
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
                    <button onClick={() => setActiveCategory(null)} className={`p-1 rounded-full ${mutedClass} ${hoverClass}`}>
                      {isRtl ? <FiArrowRight /> : <FiChevronRight style={{ transform: 'rotate(180deg)' }} />}
                    </button>
                  )}
                  <h3 className="font-bold text-lg">{t('supportAgent.title', 'پشتیبانی')}</h3>
                </div>
                <button onClick={() => setIsChatOpen(false)} className={`p-2 rounded-full ${mutedClass} ${hoverClass}`}>
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
                        onClick={() => setActiveCategory(cat.key)}
                        className={`w-full text-${isRtl ? 'right' : 'left'} p-3 rounded-xl border ${isDark ? 'border-white/10' : 'border-gray-200'} ${hoverClass} flex items-center justify-between transition-colors`}
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
                          onClick={() => setOpenQuestion(openQuestion === q.id ? null : q.id)}
                          className={`w-full text-${isRtl ? 'right' : 'left'} p-3 flex items-center justify-between font-medium text-sm ${hoverClass}`}
                        >
                          {q.q}
                          <FiChevronRight 
                            className={`transition-transform ${mutedClass}`} 
                            style={{ transform: openQuestion === q.id ? 'rotate(90deg)' : (isRtl ? 'scaleX(-1)' : 'none') }} 
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