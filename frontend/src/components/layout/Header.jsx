import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GiHamburgerMenu } from 'react-icons/gi';
import { 
  MdHomeFilled,
  MdMenuBook,
  MdArticle,
  MdInfo,
  MdPhoneInTalk,
  MdAdminPanelSettings,
  MdWorkOutline,
  MdAccountCircle,
  MdLogin
} from 'react-icons/md';
import { BiChevronDown } from 'react-icons/bi';

import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import MobileNav from './MobileNav';
import TabletNav from './TabletNav';
import MegaMenu from './MegaMenu';
import CartIcon from '../ui/CartIcon';
import AuthModal from '../ui/AuthModal';
import { useTheme } from '../../context/ThemeContext';

const navItems = [
  { key: 'home', icon: MdHomeFilled, href: '/' },
  { key: 'menu', icon: MdMenuBook, href: '/menu', hasMegaMenu: true },
  { key: 'articles', icon: MdArticle, href: '/articles' },
  { key: 'about', icon: MdInfo, href: '/about' },
  { key: 'contact', icon: MdPhoneInTalk, href: '/contact' },
];

export default function Header() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const timeoutRef = useState(null);

  const handleMenuEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setMegaMenuOpen(true);
  };

  const handleMenuLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setMegaMenuOpen(false);
    }, 200);
  };

  const isActive = (href) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  const logoSrc = '/images/logo/logo-header.png';

  const headerClasses = theme === 'dark' 
    ? 'bg-[#1C1C1C] border-[#F4B41A]/30' 
    : 'bg-[#FFF8F0] border-[#D32F2F]/20';

  const textClasses = theme === 'dark'
    ? 'text-white hover:text-[#F4B41A]'
    : 'text-[#1A1A1A] hover:text-[#D32F2F]';

  const iconClasses = theme === 'dark'
    ? 'text-gray-400 group-hover:text-[#F4B41A]'
    : 'text-[#666666] group-hover:text-[#D32F2F]';

  const activeClasses = theme === 'dark'
    ? 'text-[#F4B41A] bg-[#F4B41A]/10'
    : 'text-[#D32F2F] bg-[#D32F2F]/10';

  const brandColor = theme === 'dark'
    ? 'text-[#F4B41A]'
    : 'text-[#D32F2F]';

  const isAdmin = localStorage.getItem('adminToken') !== null;
  const isCustomer = localStorage.getItem('customerToken') !== null;

  return (
    <>
      <header className={`sticky top-0 z-30 ${headerClasses} border-b shadow-lg transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="flex items-center justify-between gap-4 flex-nowrap">
            
            {/* لوگو */}
            <Link to="/" className="flex items-center gap-2 shrink-0 group whitespace-nowrap">
              <img 
                src={logoSrc}
                alt={t('restaurant.name')}
                className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105 shrink-0"
                loading="lazy"
              />
              <span className={`text-lg md:text-xl font-bold ${brandColor} whitespace-nowrap transition-colors duration-300 hidden sm:block`}>
                {t('restaurant.name')}
              </span>
            </Link>

            {/* منوی اصلی */}
            <nav className="hidden lg:flex items-center gap-1 shrink-0">
              {navItems.map(({ key, icon: Icon, href, hasMegaMenu }) => {
                const active = isActive(href);
                return (
                  <div
                    key={key}
                    className="relative shrink-0"
                    onMouseEnter={hasMegaMenu ? handleMenuEnter : undefined}
                    onMouseLeave={hasMegaMenu ? handleMenuLeave : undefined}
                  >
                    <Link
                      to={href}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 relative whitespace-nowrap ${
                        active ? activeClasses : `${textClasses} hover:bg-white/5 dark:hover:bg-white/5`
                      }`}
                    >
                      <Icon size={20} className={`shrink-0 ${active ? (theme === 'dark' ? 'text-[#F4B41A]' : 'text-[#D32F2F]') : iconClasses}`} />
                      <span className="whitespace-nowrap">{t(`nav.${key}`)}</span>
                      {hasMegaMenu && (
                        <BiChevronDown size={16} className={`shrink-0 transition-transform duration-200 ${megaMenuOpen ? 'rotate-180' : ''}`} />
                      )}
                      {active && (
                        <span className={`absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-6 h-0.5 ${theme === 'dark' ? 'bg-[#F4B41A]' : 'bg-[#D32F2F]'} rounded-full`} />
                      )}
                    </Link>
                    
                    {hasMegaMenu && (
                      <div className="absolute top-full left-0 pt-1 z-50">
                        <MegaMenu isOpen={megaMenuOpen} onClose={() => setMegaMenuOpen(false)} />
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            <TabletNav />

            {/* دکمه‌های سمت چپ */}
            <div className="flex items-center gap-2 md:gap-3 shrink-0 flex-nowrap">
              
              {/* دکمه فرصت‌های شغلی (آیکون در موبایل، کامل در دسکتاپ) */}
              <Link 
                to="/careers" 
                className={`flex items-center gap-1.5 px-2 md:px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition-all duration-300 ${
                  theme === 'dark' 
                    ? 'bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/30 hover:bg-[#FFD700]/20' 
                    : 'bg-[#D32F2F]/10 text-[#D32F2F] border border-[#D32F2F]/30 hover:bg-[#D32F2F]/20'
                }`}
                title={t('nav.careers', 'فرصت‌های شغلی')}
              >
                <MdWorkOutline size={18} className="shrink-0" />
                {/* متن فقط در دسکتاپ نمایش داده می‌شود */}
                <span className="hidden lg:inline">{t('nav.careers', 'فرصت‌های شغلی')}</span>
              </Link>

              {/* دکمه ورود مشتری / پروفایل */}
              {isCustomer ? (
                <Link 
                  to="/profile" 
                  className={`p-2 rounded-full hover:bg-white/10 transition-colors duration-300 shrink-0 ${textClasses}`}
                  title={t('profilePage.logout', 'حساب کاربری من')}
                >
                  <MdAccountCircle size={24} className="shrink-0" />
                </Link>
              ) : (
                <button 
                  onClick={() => setIsAuthOpen(true)}
                  className="flex items-center gap-1.5 bg-[#FFD700] text-black px-3 md:px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0 hover:bg-[#FFC700] transition-colors"
                >
                  <MdLogin size={18} className="shrink-0" />
                  <span className="hidden sm:inline">{t('authModal.loginBtn', 'ورود')} / {t('authModal.register', 'ثبت‌نام')}</span>
                  <span className="sm:hidden">{t('authModal.loginBtn', 'ورود')}</span>
                </button>
              )}

              {/* دکمه ورود ادمین */}
              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  className={`p-2 rounded-full hover:bg-white/10 transition-colors duration-300 shrink-0 ${textClasses}`}
                  title="پنل مدیریت"
                >
                  <MdAdminPanelSettings size={24} className="shrink-0" />
                </Link>
              )}

              {/* گروه آیکون‌های سبد، زبان و تم */}
              <div className={`flex items-center gap-1 p-1 rounded-xl shrink-0 ${theme === 'dark' ? 'bg-white/5' : 'bg-black/5'}`}>
                <CartIcon />
                <LanguageSwitcher />
                <ThemeToggle />
              </div>

              {/* دکمه منوی موبایل */}
              <button
                onClick={() => setMobileOpen(true)}
                className={`lg:hidden p-2 ${textClasses} hover:bg-white/5 dark:hover:bg-white/5 rounded-xl transition-colors shrink-0`}
                aria-label="Open menu"
                type="button"
              >
                <GiHamburgerMenu size={24} className="shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onLoginSuccess={(token, user) => {
          localStorage.setItem('customerToken', token);
          setIsAuthOpen(false);
          navigate('/profile');
        }} 
      />
    </>
  );
}