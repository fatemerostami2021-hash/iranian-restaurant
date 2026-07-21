import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FiMapPin, FiClock, FiInstagram, FiPhone } from 'react-icons/fi';
import { FaWhatsapp, FaTelegramPlane } from 'react-icons/fa';
import { siteSettings } from '../../config/siteSettings';
import { useTheme } from '../../context/ThemeContext';

export default function Footer() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const lang = i18n.language;
  const [currentTime, setCurrentTime] = useState(new Date());

  // آپدیت ساعت هر ثانیه
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // تنظیمات منطقه زمانی و زبان
  const locale = lang === 'fa' ? 'fa-IR' : lang === 'ar' ? 'ar-EG' : 'en-US';
  const timeStr = currentTime.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = currentTime.toLocaleDateString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // متغیرهای رنگی هماهنگ با هدر
  const bgClass = isDark ? 'bg-[#1C1C1C] border-[#FFD700]/20' : 'bg-[#FFF8F0] border-[#D32F2F]/10';
  const textClass = isDark ? 'text-white' : 'text-[#1A1A1A]';
  const mutedClass = isDark ? 'text-gray-400' : 'text-gray-600';
  const accentText = isDark ? 'text-[#FFD700]' : 'text-[#D32F2F]';
  const hoverClass = isDark ? 'hover:text-[#FFD700]' : 'hover:text-[#D32F2F]';

  const socialLinks = [
    { icon: FaWhatsapp, href: `https://wa.me/${siteSettings.whatsappNumber}`, color: 'hover:bg-[#25D366]' },
    { icon: FiInstagram, href: siteSettings.instagram, color: 'hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF]' },
    { icon: FaTelegramPlane, href: siteSettings.telegram, color: 'hover:bg-[#229ED9]' },
    { icon: FiPhone, href: `tel:${siteSettings.phoneNumber.replace(/\s/g, '')}`, color: 'hover:bg-[#007EE5]' },
  ];

  const quickLinks = [
    { key: 'home', href: '/' },
    { key: 'menu', href: '/menu' },
    { key: 'articles', href: '/articles' },
    { key: 'about', href: '/about' },
    { key: 'contact', href: '/contact' },
  ];

  return (
    <footer className={`${bgClass} border-t mt-16 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* بخش برندینگ و لوگو */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <img src="/images/logo/logo-header.png" alt="Logo" className="h-10 w-auto object-contain" />
              <span className={`text-lg font-bold ${accentText}`}>{t('restaurant.name')}</span>
            </Link>
            <p className={`text-sm leading-relaxed ${mutedClass}`}>
              {t('aboutPage.heroSubtitle', 'از دل ایران تا قلب دوحه، طعمی که نسل‌ها به ارث برده‌اند. ما سنت و اصالت را با آتش زغال واقعی به سفره شما می‌آوریم.')}
            </p>
          </div>

          {/* بخش لینک‌های سریع */}
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

          {/* بخش اطلاعات تماس و لوکیشن */}
          <div>
            <h4 className={`font-bold text-lg mb-4 ${textClass}`}>{t('contact.info.addressTitle', 'اطلاعات تماس')}</h4>
            <ul className="space-y-3">
              <li className={`flex items-start gap-2 text-sm ${mutedClass}`}>
                <FiMapPin className={`mt-1 shrink-0 ${accentText}`} />
                <span>{siteSettings.address}</span>
              </li>
              <li className={`flex items-center gap-2 text-sm ${mutedClass}`}>
                <FiPhone className={`shrink-0 ${accentText}`} />
                <a href={`tel:${siteSettings.phoneNumber.replace(/\s/g, '')}`} dir="ltr" className={`${hoverClass} transition-colors`}>
                  {siteSettings.phoneNumber}
                </a>
              </li>
            </ul>
          </div>

          {/* بخش ساعت و لوکیشن و شبکه‌های اجتماعی */}
          <div>
            <h4 className={`font-bold text-lg mb-4 ${textClass}`}>{t('contact.info.hoursTitle', 'ساعات کاری')}</h4>
            
            {/* کادرهای ساعت و لوکیشن کنار هم */}
            <div className="flex gap-3 mb-4">
              {/* کادر ساعت */}
              <div className={`flex-1 p-3 rounded-xl border ${isDark ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
                <div className={`flex items-center justify-center gap-1 text-xl font-mono font-bold ${accentText}`}>
                  <FiClock size={16} />
                  <span dir="ltr">{timeStr}</span>
                </div>
                <p className={`text-center text-[10px] mt-1 ${mutedClass}`}>{dateStr}</p>
              </div>

                          {/* کادر لوکیشن */}
              <a 
                href={siteSettings.mapLink || 'https://maps.google.com/?q=Salwa+Road+Doha+Qatar'} 
                target="_blank" 
                rel="noreferrer"
                className={`w-16 p-3 rounded-xl border ${isDark ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'} flex flex-col items-center justify-center hover:border-[#FFD700] transition-colors group`}
              >
                <FiMapPin className={`text-xl mb-1 ${accentText} group-hover:scale-110 transition-transform`} />
                {/* خط زیر تغییر کرد */}
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
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${mutedClass} ${social.color} hover:text-white border ${isDark ? 'border-white/10' : 'border-gray-200'} transition-all duration-300`}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>

          {/* کپی‌رایت وسط‌چین و نام طراح زیر آن */}
      <div className={`border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col items-center justify-center gap-1 text-center">
          <p className={`text-xs ${mutedClass}`}>
            &copy; {new Date().getFullYear()} {t('restaurant.name')} - {t('footer.rights')}
          </p>
          <span className={`text-[10px] ${mutedClass} opacity-70`}>
            {t('footer.designedBy', 'طراحی و توسعه توسط: فاطمه رستمی')}
          </span>
        </div>
      </div>
    </footer>
  );
}