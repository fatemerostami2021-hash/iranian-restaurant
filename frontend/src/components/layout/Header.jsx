import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { GiHamburgerMenu } from 'react-icons/gi';
import { 
  MdHomeFilled,
  MdMenuBook,
  MdArticle,
  MdInfo,
  MdPhoneInTalk,
  MdAdminPanelSettings
} from 'react-icons/md';
import { BiChevronDown } from 'react-icons/bi';

import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import MobileNav from './MobileNav';
import TabletNav from './TabletNav';
import MegaMenu from './MegaMenu';
import CartIcon from '../ui/CartIcon';
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
  const { theme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
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

  const isLoggedIn = localStorage.getItem('adminToken') !== null;

  return (
    <>
      <header className={`sticky top-0 z-30 ${headerClasses} border-b shadow-lg transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-3 shrink-0 group">
              <img 
                src={logoSrc}
                alt={t('restaurant.name')}
                className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <span className={`text-xl font-bold ${brandColor} whitespace-nowrap transition-colors duration-300`}>
                {t('restaurant.name')}
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map(({ key, icon: Icon, href, hasMegaMenu }) => {
                const active = isActive(href);
                return (
                  <div
                    key={key}
                    className="relative"
                    onMouseEnter={hasMegaMenu ? handleMenuEnter : undefined}
                    onMouseLeave={hasMegaMenu ? handleMenuLeave : undefined}
                  >
                    <Link
                      to={href}
                      className={`
                        flex items-center gap-2 px-4 py-2.5 
                        text-sm font-medium rounded-xl
                        transition-all duration-200 relative
                        ${active 
                          ? activeClasses
                          : `${textClasses} hover:bg-white/5 dark:hover:bg-white/5`
                        }
                      `}
                    >
                      <Icon 
                        size={20} 
                        className={active ? (theme === 'dark' ? 'text-[#F4B41A]' : 'text-[#D32F2F]') : iconClasses} 
                      />
                      <span>{t(`nav.${key}`)}</span>
                      {hasMegaMenu && (
                        <BiChevronDown 
                          size={16} 
                          className={`transition-transform duration-200 ${megaMenuOpen ? 'rotate-180' : ''}`}
                        />
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

            <div className="flex items-center gap-2 shrink-0">
              <Link
                to={isLoggedIn ? '/admin/dashboard' : '/admin/login'}
                className={`p-2 rounded-full hover:bg-white/10 transition-colors duration-300 group ${textClasses}`}
                title={isLoggedIn ? 'پنل مدیریت' : 'ورود به پنل مدیریت'}
              >
                <MdAdminPanelSettings size={22} />
              </Link>

              <CartIcon />
              <LanguageSwitcher />
              <ThemeToggle />

              <button
                onClick={() => setMobileOpen(true)}
                className={`lg:hidden p-2 ${textClasses} hover:bg-white/5 dark:hover:bg-white/5 rounded-xl transition-colors`}
                aria-label="Open menu"
                type="button"
              >
                <GiHamburgerMenu size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
