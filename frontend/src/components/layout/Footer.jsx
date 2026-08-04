import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FiMapPin, FiClock, FiInstagram, FiPhone } from 'react-icons/fi';
import { FaWhatsapp, FaTelegramPlane } from 'react-icons/fa';
import { MdWorkOutline } from 'react-icons/md';
import { siteSettings } from '../../config/siteSettings';
import { useTheme } from '../../context/ThemeContext';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';

export default function Footer() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const lang = i18n.language;
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const locale = lang === 'fa' ? 'fa-IR' : lang === 'ar' ? 'ar-QA' : 'en-US';
  const timeStr = currentTime.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  const dateStr = currentTime.toLocaleDateString(locale, { weekday: 'short', month: 'short', day: 'numeric' });

  const bgClass = isDark 
    ? 'bg-[#141414] border-[#FFD700]/10' 
    : 'bg-[#F5E6D3] border-[#D32F2F]/10';
  const textClass = isDark ? 'text-white' : 'text-[#1A1A1A]';
  const mutedClass = isDark ? 'text-gray-400' : 'text-[#5C4A3A]';
  const accentText = isDark ? 'text-[#FFD700]' : 'text-[#D32F2F]';
  const hoverClass = isDark ? 'hover:text-[#FFD700]' : 'hover:text-[#D32F2F]';

  const socialLinks = [
    { icon: FaWhatsapp, href: `https://wa.me/${siteSettings.whatsappNumber}`, color: isDark ? 'hover:bg-[#25D366]' : 'hover:bg-[#25D366] hover:text-white' },
    { icon: FiInstagram, href: siteSettings.instagram, color: isDark ? 'hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF]' : 'hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] hover:text-white' },
    { icon: FaTelegramPlane, href: siteSettings.telegram, color: isDark ? 'hover:bg-[#229ED9]' : 'hover:bg-[#229ED9] hover:text-white' },
    { icon: FiPhone, href: `tel:${siteSettings.phoneNumber.replace(/\s/g, '')}`, color: isDark ? 'hover:bg-[#007EE5]' : 'hover:bg-[#007EE5] hover:text-white' },
  ];

  const quickLinks = [
    { key: 'home', href: '/' },
    { key: 'menu', href: '/menu' },
    { key: 'articles', href: '/articles' },
    { key: 'about', href: '/about' },
    { key: 'contact', href: '/contact' },
  ];

  return (
    <footer className={`${bgClass} border-t mt-6 md:mt-16 transition-colors duration-300 overflow-x-hidden`}>

      {/* ===== نوار تنظیمات (همیشه) ===== */}
      <div className={`border-b ${isDark ? 'border-white/10' : 'border-[#D32F2F]/10'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-3">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className={`flex items-center gap-1 p-1 rounded-xl ${isDark ? 'bg-white/5' : 'bg-white/40'}`}>
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
            <Link
              to="/careers"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                isDark
                  ? 'bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/30 hover:bg-[#FFD700]/20'
                  : 'bg-[#D32F2F]/10 text-[#D32F2F] border border-[#D32F2F]/30 hover:bg-[#D32F2F]/20'
              }`}
            >
              <MdWorkOutline size={14} className="shrink-0" />
              <span>{t('nav.careers', 'فرصت‌های شغلی')}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ===== موبایل: چیدمان افقی فشرده ===== */}
      <div className="md:hidden max-w-7xl mx-auto px-4 py-4">
        {/* ردیف ۱: لوگو + ساعت + آیکون‌ها */}
        <div className="flex items-center justify-between mb-3">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src="/images/logo/logo-header.png" alt="Logo" className="h-6 w-auto object-contain" />
            <span className={`text-sm font-bold ${accentText}`}>{t('restaurant.name')}</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1 text-xs font-mono font-bold ${accentText}`}>
              <FiClock size={12} />
              <span dir="ltr">{timeStr}</span>
            </div>
            <div className="flex gap-1.5">
              {socialLinks.map((social, i) => (
                <a 
                  key={i} 
                  href={social.href} 
                  target="_blank" 
                  rel="noreferrer"
                  className={`w-7 h-7 rounded-full flex items-center justify-center ${mutedClass} ${social.color} border ${isDark ? 'border-white/10' : 'border-[#D32F2F]/10'} transition-all duration-300`}
                >
                  <social.icon size={13} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ردیف ۲: لینک‌های سریع افقی */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3">
          {quickLinks.map(link => (
            <Link key={link.key} to={link.href} className={`text-xs font-medium ${mutedClass} ${hoverClass} transition-colors`}>
              {t(`nav.${link.key}`)}
            </Link>
          ))}
        </div>

        {/* ردیف ۳: آدرس + تلفن + نقشه — همه در یک خط */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#5C4A3A] min-w-0">
            <FiMapPin size={12} className={`shrink-0 ${accentText}`} />
            <span className="truncate">{siteSettings.address}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a href={`tel:${siteSettings.phoneNumber.replace(/\s/g, '')}`} dir="ltr" className={`text-xs font-bold ${accentText} ${hoverClass}`}>
              {siteSettings.phoneNumber}
            </a>
            <a 
              href={siteSettings.mapLink || 'https://maps.google.com/?q=Salwa+Road+Doha+Qatar'} 
              target="_blank" 
              rel="noreferrer"
              className={`w-7 h-7 rounded-lg flex items-center justify-center border ${isDark ? 'border-white/10 bg-white/5' : 'border-[#D32F2F]/10 bg-white/60'}`}
            >
              <FiMapPin size={12} className={accentText} />
            </a>
          </div>
        </div>
      </div>

      {/* ===== دسکتاپ: چیدمان اصلی ===== */}
      <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-4 gap-8">

          {/* برندینگ */}
          <div className="space-y-3">
            <Link to="/" className="flex items-center gap-2">
              <img src="/images/logo/logo-header.png" alt="Logo" className="h-10 w-auto object-contain" />
              <span className={`text-lg font-bold ${accentText}`}>{t('restaurant.name')}</span>
            </Link>
            <p className={`text-sm leading-relaxed ${mutedClass}`}>
              {t('aboutPage.heroSubtitle', 'از دل ایران تا قلب دوحه، طعمی که نسل‌ها به ارث برده‌اند.')}
            </p>
          </div>

          {/* لینک‌های سریع */}
          <div>
            <h4 className={`font-bold text-lg mb-4 ${textClass}`}>{t('nav.home', 'دسترسی سریع')}</h4>
            <ul className="space-y-2">
              {quickLinks.map(link => (
                <li key={link.key}>
                  <Link to={link.href} className={`text-sm ${mutedClass} ${hoverClass} transition-colors`}>
                    {t(`nav.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* تماس */}
          <div>
            <h4 className={`font-bold text-lg mb-4 ${textClass}`}>{t('contact.info.addressTitle', 'اطلاعات تماس')}</h4>
            <ul className="space-y-3">
              <li className={`flex items-start gap-2 text-sm ${mutedClass}`}>
                <FiMapPin className={`mt-0.5 shrink-0 ${accentText}`} size={16} />
                <span>{siteSettings.address}</span>
              </li>
              <li className={`flex items-center gap-2 text-sm ${mutedClass}`}>
                <FiPhone className={`shrink-0 ${accentText}`} size={16} />
                <a href={`tel:${siteSettings.phoneNumber.replace(/\s/g, '')}`} dir="ltr" className={`${hoverClass} transition-colors`}>
                  {siteSettings.phoneNumber}
                </a>
              </li>
            </ul>
          </div>

          {/* ساعت و شبکه‌های اجتماعی */}
          <div>
            <h4 className={`font-bold text-lg mb-4 ${textClass}`}>{t('contact.info.hoursTitle', 'ساعات کاری')}</h4>

            <div className="flex gap-3 mb-4">
              <div className={`flex-1 p-3 rounded-xl border ${isDark ? 'border-white/10 bg-white/5' : 'border-[#D32F2F]/10 bg-white/60'}`}>
                <div className={`flex items-center justify-center gap-1 text-xl font-mono font-bold ${accentText}`}>
                  <FiClock size={16} />
                  <span dir="ltr">{timeStr}</span>
                </div>
                <p className={`text-center text-[10px] mt-1 ${mutedClass}`}>{dateStr}</p>
              </div>

              <a 
                href={siteSettings.mapLink || 'https://maps.google.com/?q=Salwa+Road+Doha+Qatar'} 
                target="_blank" 
                rel="noreferrer"
                className={`w-16 p-3 rounded-xl border ${isDark ? 'border-white/10 bg-white/5' : 'border-[#D32F2F]/10 bg-white/60'} flex flex-col items-center justify-center hover:border-[#FFD700] transition-colors group shrink-0`}
              >
                <FiMapPin className={`text-xl mb-1 ${accentText} group-hover:scale-110 transition-transform`} />
                <span className={`text-[10px] ${mutedClass} group-hover:text-current transition-colors`}>
                  {t('footer.map', 'نقشه')}
                </span>
              </a>
            </div>

            <div className="flex gap-3">
              {socialLinks.map((social, i) => (
                <a 
                  key={i} 
                  href={social.href} 
                  target="_blank" 
                  rel="noreferrer"
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${mutedClass} ${social.color} border ${isDark ? 'border-white/10' : 'border-[#D32F2F]/10'} transition-all duration-300 shrink-0`}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ===== کپی‌رایت ===== */}
      <div className={`border-t ${isDark ? 'border-white/10' : 'border-[#D32F2F]/10'}`}>
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-6 flex flex-col items-center justify-center gap-0.5 md:gap-1 text-center">
          <p className={`text-[10px] md:text-xs ${mutedClass}`}>
            &copy; {new Date().getFullYear()} {t('restaurant.name')} - {t('footer.rights')}
          </p>
          <span className={`text-[9px] md:text-[10px] ${mutedClass} opacity-70`}>
            {t('footer.designedBy', 'طراحی و توسعه توسط: فاطمه رستمی')}
          </span>
        </div>
      </div>
    </footer>
  );
}