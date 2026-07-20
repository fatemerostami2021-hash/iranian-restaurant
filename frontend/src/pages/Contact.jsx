import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend, FiUser, FiHome, FiNavigation, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { siteSettings } from '../config/siteSettings';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Contact() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '',
    street: '', building: '', unit: '',
    description: ''
  });
  
  const [locationLink, setLocationLink] = useState('');
  const [isLocLoading, setIsLocLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGetLocation = () => {
    setIsLocLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocationLink(`https://maps.google.com/?q=${latitude},${longitude}`);
          setIsLocLoading(false);
          setNotification({ type: 'success', msg: 'موقعیت مکانی با موفقیت دریافت شد.' });
        },
        () => {
          setNotification({ type: 'error', msg: 'خطا در دریافت موقعیت. لطفاً دسترسی مرورگر را بررسی کنید.' });
          setIsLocLoading(false);
        }
      );
    } else {
      setNotification({ type: 'error', msg: 'مرورگر شما از دریافت موقعیت پشتیبانی نمی‌کند.' });
      setIsLocLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setNotification({ type: 'info', msg: 'در حال ارسال اطلاعات...' });

    try {
      await axios.post(`${API_URL}/api/contact/send-email`, { ...formData, locationLink });
    } catch (err) {
      console.log('خطا در ارسال ایمیل، اما ادامه می‌دهیم تا واتساپ باز شود');
    }

    const text = 
`*${t('contact.waTitle', 'اطلاعات تماس/سفارش جدید')}* 📋
----------------------------
👤 *${t('contact.form.name')}:* ${formData.name}
📞 *${t('contact.form.phone')}:* ${formData.phone}
✉️ *${t('contact.form.email')}:* ${formData.email}
----------------------------
📍 *${t('contact.form.addressSection')}:*
  - ${t('contact.form.street')}: ${formData.street}
  - ${t('contact.form.building')}: ${formData.building}
  - ${t('contact.form.unit')}: ${formData.unit}
  - 🌍 *GPS:* ${locationLink || 'ثبت نشده'}
----------------------------
📝 *${t('contact.form.message')}:*
 ${formData.description}`;

    window.open(`https://wa.me/${siteSettings.whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
    
    setIsSending(false);
    setNotification({ type: 'success', msg: 'اطلاعات با موفقیت در واتساپ و ایمیل ارسال شد!' });
    setFormData({ name: '', phone: '', email: '', street: '', building: '', unit: '', description: '' });
    setLocationLink('');
  };

  const contactCards = [
    { 
      icon: FiMapPin, 
      title: t('contact.info.addressTitle', 'آدرس'), 
      value: t('contact.info.address', 'سالوا روود، دوحه، قطر'),
      link: siteSettings.mapLink || '#',
      isLtr: false, 
      delay: 0.1,
      type: 'address'
    },
    { 
      icon: FiPhone, 
      title: t('contact.info.phoneTitle', 'تلفن تماس'), 
      value: siteSettings.phoneNumber, 
      link: `tel:${siteSettings.phoneNumber.replace(/\s/g, '')}`,
      isLtr: true, 
      delay: 0.2,
      type: 'phone'
    },
    { 
      icon: FiMail, 
      title: t('contact.info.emailTitle', 'ایمیل'), 
      value: siteSettings.email, 
      link: `mailto:${siteSettings.email}`,
      isLtr: true, 
      delay: 0.3,
      type: 'email'
    },
    { 
      icon: FiClock, 
      title: t('contact.info.hoursTitle', 'ساعات کاری'), 
      value: t('contact.info.hours', 'هر روز ۸ صبح تا ۲ بامداد'), 
      link: null,
      isLtr: false, 
      delay: 0.4,
      type: 'hours'
    },
  ];

  // متغیرهای رنگی هماهنگ با صفحه About
  const bgClass = isDark ? 'bg-[#0F0F0F]' : 'bg-[#FFFBF5]';
  const textClass = isDark ? 'text-white' : 'text-[#1A1A1A]';
  const mutedClass = isDark ? 'text-gray-400' : 'text-gray-700';
  const accentText = isDark ? 'text-[#FFD700]' : 'text-[#D32F2F]';
  const accentBorder = isDark ? 'border-[#FFD700]' : 'border-[#D32F2F]';
  const accentBg = isDark ? 'bg-[#FFD700]/5' : 'bg-[#D32F2F]/5';
  const btnClass = isDark ? 'bg-[#FFD700] text-black hover:bg-[#FFC700]' : 'bg-[#D32F2F] text-white hover:bg-[#B71C1C]';
  const cardBorder = isDark ? 'border-white/10' : 'border-gray-200';

  const inputClass = `w-full p-3.5 rounded-xl bg-transparent border focus:outline-none focus:ring-2 font-['Vazirmatn'] transition-all ${
    isDark ? 'border-white/20 text-white focus:border-[#FFD700] focus:ring-[#FFD700]/20 bg-white/5' : 'border-gray-300 text-[#1A1A1A] focus:border-[#D32F2F] focus:ring-[#D32F2F]/20 bg-white'
  }`;

  return (
    <div className={`min-h-screen pt-28 pb-20 overflow-hidden relative transition-colors duration-500 ${bgClass} ${textClass}`}>
      
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            className={`fixed top-24 left-1/2 z-50 px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-md border ${
              notification.type === 'success' ? 'bg-green-500/20 border-green-500/30 text-green-400' :
              notification.type === 'error' ? 'bg-red-500/20 border-red-500/30 text-red-400' :
              'bg-blue-500/20 border-blue-500/30 text-blue-400'
            }`}
          >
            {notification.type === 'success' ? <FiCheckCircle size={20} /> : <FiAlertCircle size={20} />}
            <span className="font-['Vazirmatn'] text-sm font-medium">{notification.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* افکت‌های نور پس‌زمینه */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#FFD700]/10 rounded-full blur-[150px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#D32F2F]/10 rounded-full blur-[150px] pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-16">
          <motion.span initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} className={`inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4 ${accentBg} ${accentText} border ${accentBorder}/30`}>
            {t('contact.badge', 'در خدمت شما هستیم')}
          </motion.span>
          <h1 className="font-['Vazirmatn'] text-4xl md:text-6xl lg:text-7xl font-black mb-4 tracking-tight">
            {t('contact.title', 'ارتباط با')} <span className={accentText}>{t('contact.titleHighlight', 'ما')}</span>
          </h1>
          <p className={`font-['Vazirmatn'] text-lg max-w-2xl mx-auto ${mutedClass}`}>
            {t('contact.subtitle', 'اطلاعات خود را ثبت کنید تا سریعاً با شما تماس بگیریم.')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-5 content-start">
            {contactCards.map((card, i) => {
              const CardWrapper = card.link ? 'a' : 'div';
              const wrapperProps = card.link ? { 
                href: card.link, 
                target: card.type === 'address' ? '_blank' : '_self', 
                rel: card.type === 'address' ? 'noopener noreferrer' : '' 
              } : {};
              
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: card.delay, duration: 0.6 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={card.link ? { scale: 0.98 } : {}}
                  className="cursor-pointer"
                >
                  <CardWrapper
                    {...wrapperProps}
                    className={`block p-6 rounded-3xl backdrop-blur-xl border transition-all duration-300 ${
                      card.link ? 'hover:shadow-2xl active:scale-95' : ''
                    } ${
                      isDark 
                        ? `bg-white/5 ${cardBorder} hover:bg-white/[0.07] hover:border-[#FFD700]/30` 
                        : `bg-white ${cardBorder} hover:shadow-2xl hover:border-[#D32F2F]/30`
                    } shadow-lg group`}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-colors duration-300 ${
                      isDark 
                        ? 'bg-[#FFD700]/10 group-hover:bg-[#FFD700]/20' 
                        : 'bg-[#D32F2F]/10 group-hover:bg-[#D32F2F]/20'
                    }`}>
                      <card.icon className={`text-2xl ${accentText}`} />
                    </div>
                    <h3 className="font-['Vazirmatn'] font-bold text-lg mb-2">
                      {card.title}
                    </h3>
                    
                    <div className={`font-['Vazirmatn'] text-sm ${card.isLtr ? 'text-left' : 'text-center'} ${mutedClass}`}>
                      {card.type === 'phone' && (<span className="flex items-center gap-1">📞 {card.value}</span>)}
                      {card.type === 'email' && (<span className="flex items-center gap-1 break-all">✉️ {card.value}</span>)}
                      {card.type === 'address' && (<span className="flex items-center gap-1">📍 {card.value}</span>)}
                      {card.type === 'hours' && (<span className="flex items-center gap-1">🕐 {card.value}</span>)}
                    </div>
                    
                    {card.link && (
                      <div className={`mt-3 text-xs font-medium opacity-50 flex items-center gap-1 ${accentText}`}>
                        <span>کلیک کنید</span>
                        <span>→</span>
                      </div>
                    )}
                  </CardWrapper>
                </motion.div>
              );
            })}
          </div>

          {/* فرم */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className={`lg:col-span-3 p-8 md:p-10 rounded-3xl backdrop-blur-xl border shadow-2xl relative overflow-hidden ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
            <div className={`absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl opacity-20 ${isDark ? 'bg-[#FFD700]' : 'bg-[#D32F2F]'}`}></div>
            
            <div className="relative z-10">
              <h2 className="font-['Vazirmatn'] text-3xl font-black mb-2 flex items-center gap-2">
                <FiUser /> {t('contact.formTitle', 'فرم اطلاعات کامل')}
              </h2>
              <p className={`font-['Vazirmatn'] text-sm mb-8 ${mutedClass}`}>
                {t('contact.formDesc', 'لطفاً اطلاعات زیر را با دقت تکمیل کنید تا سفارش یا پیام شما سریعاً بررسی شود.')}
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{t('contact.form.name', 'نام و نام خانوادگی')} *</label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} required />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{t('contact.form.phone', 'شماره تماس')} *</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputClass} required />
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{t('contact.form.email', 'ایمیل')} *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} required />
                  </div>
                </div>

                <div className={`border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}></div>

                <div className="space-y-5">
                  <h3 className="font-['Vazirmatn'] font-bold flex items-center gap-2">
                    <FiHome /> {t('contact.form.addressDetails', 'اطلاعات آدرس')}
                  </h3>
                  
                  <div className="mb-2">
                    <button type="button" onClick={handleGetLocation} disabled={isLocLoading} className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-['Vazirmatn'] font-bold transition-all border-2 border-dashed ${locationLink ? 'border-green-500 text-green-500' : `${accentBorder} ${accentText}`} hover:bg-opacity-10`}>
                      {locationLink ? <FiCheckCircle /> : <FiNavigation />}
                      {isLocLoading ? t('contact.form.gettingLocation', 'در حال دریافت موقعیت...') : 
                        (locationLink ? t('contact.form.locationReceived', 'موقعیت مکانی دریافت شد!') : 
                        t('contact.form.getLocation', 'دریافت موقعیت مکانی من (GPS)'))}
                    </button>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{t('contact.form.street', 'نام خیابان و محله')} *</label>
                    <input type="text" name="street" value={formData.street} onChange={handleChange} className={inputClass} required />
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{t('contact.form.building', 'پلاک ساختمان')} *</label>
                      <input type="text" name="building" value={formData.building} onChange={handleChange} className={inputClass} required />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{t('contact.form.unit', 'واحد')} *</label>
                      <input type="text" name="unit" value={formData.unit} onChange={handleChange} className={inputClass} required />
                    </div>
                  </div>
                </div>

                <div className={`border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}></div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{t('contact.form.message', 'توضیحات و متن پیام')} *</label>
                  <textarea name="description" rows="4" value={formData.description} onChange={handleChange} className={`${inputClass} resize-none`} required></textarea>
                </div>
                
                <motion.button whileTap={{ scale: 0.98 }} type="submit" disabled={isSending} className={`w-full flex items-center justify-center gap-2 font-['Vazirmatn'] font-bold py-4 rounded-xl transition-all duration-300 shadow-lg disabled:opacity-70 ${btnClass}`}>
                  <FiSend className="text-lg" />
                  {isSending ? 'در حال ارسال...' : t('contact.form.submit', 'ارسال سریع اطلاعات در واتساپ و ایمیل')}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }} className="rounded-3xl overflow-hidden border shadow-2xl h-[450px] relative group">
          <div className={`absolute inset-0 transition-opacity duration-300 ${accentBorder}/20`}>
            <iframe src={siteSettings.mapEmbedUrl} width="100%" height="100%" style={{ border: 0, filter: isDark ? 'invert(90%) hue-rotate(180deg) brightness(0.9) contrast(0.9)' : 'none' }} allowFullScreen="" loading="lazy" title="Google Map"></iframe>
          </div>
        </motion.div>
      </div>
    </div>
  );
}