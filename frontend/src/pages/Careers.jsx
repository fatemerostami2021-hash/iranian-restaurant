import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiUser, FiPhone, FiBriefcase, FiSend, FiCheckCircle, FiZap, FiTrendingUp, FiUsers } from 'react-icons/fi';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Careers() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', position: '', experience: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const bgClass = isDark ? 'bg-[#0F0F0F]' : 'bg-[#FFFBF5]';
  const textClass = isDark ? 'text-white' : 'text-[#1A1A1A]';
  const mutedClass = isDark ? 'text-gray-400' : 'text-gray-700';
  const accentText = isDark ? 'text-[#FFD700]' : 'text-[#D32F2F]';
  const accentBorder = isDark ? 'border-[#FFD700]' : 'border-[#D32F2F]';
  const btnClass = isDark ? 'bg-[#FFD700] text-black hover:bg-[#FFC700]' : 'bg-[#D32F2F] text-white hover:bg-[#B71C1C]';
  const cardBg = isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200';

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/api/admin/jobs`, formData);
      setIsSuccess(true);
      setFormData({ name: '', phone: '', email: '', position: '', experience: '' });
    } catch (err) {
      alert('خطا در ثبت درخواست. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = `w-full p-3.5 rounded-xl bg-transparent border focus:outline-none focus:ring-2 font-['Vazirmatn'] transition-all ${
    isDark ? 'border-white/20 text-white focus:border-[#FFD700] focus:ring-[#FFD700]/20 bg-white/5' : 'border-gray-300 text-[#1A1A1A] focus:border-[#D32F2F] focus:ring-[#D32F2F]/20 bg-white'
  }`;

  const values = [
    { icon: FiZap, title: t('careersPage.value1Title'), desc: t('careersPage.value1Desc') },
    { icon: FiTrendingUp, title: t('careersPage.value2Title'), desc: t('careersPage.value2Desc') },
    { icon: FiUsers, title: t('careersPage.value3Title'), desc: t('careersPage.value3Desc') },
  ];

  return (
    <div className={`min-h-screen pt-24 pb-20 overflow-hidden relative transition-colors duration-500 ${bgClass} ${textClass}`}>
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#FFD700]/10 rounded-full blur-[150px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />

      {/* ===== HERO SECTION ===== */}
      <div className="relative z-10 mb-20">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: "url('/images/about/hero.jpg')" }}></div>
        <div className={`absolute inset-0 ${isDark ? 'bg-black/70' : 'bg-white/70'} backdrop-blur-sm`}></div>
        
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 max-w-4xl mx-auto px-4 text-center py-20">
          <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 border ${accentBorder} ${accentText}`}>
            {t('careersPage.badge')}
          </span>
          <h1 className="font-['Vazirmatn'] text-4xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight leading-tight">
            {t('careersPage.heroTitle')} <span className={accentText}>{t('careersPage.heroTitleHighlight')}</span>
          </h1>
          <p className={`font-['Vazirmatn'] text-lg md:text-xl max-w-2xl mx-auto ${mutedClass}`}>
            {t('careersPage.heroSubtitle')}
          </p>
        </motion.div>
      </div>

      {/* ===== VALUES SECTION ===== */}
      <div className="max-w-6xl mx-auto px-4 mb-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((value, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-6 rounded-3xl border ${cardBg} backdrop-blur-xl text-center`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 mx-auto ${isDark ? 'bg-[#FFD700]/10' : 'bg-[#D32F2F]/10'}`}>
                <value.icon className={`text-2xl ${accentText}`} />
              </div>
              <h3 className="font-bold text-lg mb-2">{value.title}</h3>
              <p className={`text-sm ${mutedClass}`}>{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ===== APPLICATION FORM SECTION ===== */}
      <div className="max-w-3xl mx-auto px-4 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <h2 className="font-['Vazirmatn'] text-3xl md:text-4xl font-black mb-3">
            {t('careersPage.formTitle')}
          </h2>
          <p className={mutedClass}>{t('careersPage.formDesc')}</p>
        </motion.div>

        {isSuccess ? (
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className={`p-10 rounded-3xl border ${accentBorder} flex flex-col items-center text-center ${cardBg}`}>
            <FiCheckCircle className={`text-6xl mb-4 ${accentText}`} />
            <h2 className="text-2xl font-bold mb-2">{t('careersPage.successTitle')}</h2>
            <p className={mutedClass}>{t('careersPage.successDesc')}</p>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`p-8 md:p-10 rounded-3xl backdrop-blur-xl border shadow-2xl ${cardBg}`}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${mutedClass}`}>{t('careersPage.name')} *</label>
                  <div className="relative">
                    <FiUser className={`absolute top-1/2 -translate-y-1/2 right-3 ${mutedClass}`} />
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className={`${inputClass} pr-10`} required />
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${mutedClass}`}>{t('careersPage.phone')} *</label>
                  <div className="relative">
                    <FiPhone className={`absolute top-1/2 -translate-y-1/2 right-3 ${mutedClass}`} />
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={`${inputClass} pr-10`} required />
                  </div>
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${mutedClass}`}>{t('careersPage.email')}</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${mutedClass}`}>{t('careersPage.position')} *</label>
                <div className="relative">
                  <FiBriefcase className={`absolute top-1/2 -translate-y-1/2 right-3 ${mutedClass}`} />
                  <select name="position" value={formData.position} onChange={handleChange} className={`${inputClass} pr-10`} required>
                    <option value="" disabled>{t('careersPage.selectPosition')}</option>
                    <option value="chef">{t('careersPage.posChef')}</option>
                    <option value="grill_master">{t('careersPage.posGrill')}</option>
                    <option value="waiter">{t('careersPage.posWaiter')}</option>
                    <option value="delivery">{t('careersPage.posDelivery')}</option>
                    <option value="other">{t('careersPage.posOther')}</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${mutedClass}`}>{t('careersPage.experience')}</label>
                <textarea name="experience" rows="4" value={formData.experience} onChange={handleChange} className={`${inputClass} resize-none`} placeholder={t('careersPage.placeholderExperience')}></textarea>
              </div>
              
              <motion.button whileTap={{ scale: 0.98 }} type="submit" disabled={isSubmitting} className={`w-full flex items-center justify-center gap-2 font-['Vazirmatn'] font-bold py-4 rounded-xl transition-all duration-300 shadow-lg disabled:opacity-70 ${btnClass}`}>
                <FiSend className="text-lg" />
                {isSubmitting ? t('careersPage.submitting') : t('careersPage.submit')}
              </motion.button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
}