import { useState, useEffect, useRef } from 'react';
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
  MdAccountCircle,
  MdLogin,
  MdSearch,
  MdClose
} from 'react-icons/md';
import { BiChevronDown } from 'react-icons/bi';

import MobileNav from './MobileNav';
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
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const isRTL = i18n.language === 'fa' || i18n.language === 'ar';

  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const timeoutRef = useRef(null); // ✅ باگ قبلی: useState بود به‌جای useRef، پس timeoutRef.current همیشه undefined بود
  const searchDebounceRef = useRef(null);

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    if (searchQuery.trim()) {
      navigate(`/menu?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  // ✅ سرچ داینامیک: همون‌طور که تایپ می‌کنی، بعد از یه مکث کوتاه خودش صفحه‌ی منو رو
  // با نتیجه‌ی فیلترشده آپدیت می‌کنه — نیازی به زدن Enter/دکمه‌ی سرچ نیست.
  // اگه از قبل توی صفحه‌ی منو باشی، فقط URL عوض می‌شه و نتایج زنده فیلتر می‌شن.
  useEffect(() => {
    if (!searchOpen) return;
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);

    searchDebounceRef.current = setTimeout(() => {
      const trimmed = searchQuery.trim();
      if (trimmed) {
        navigate(`/menu?search=${encodeURIComponent(trimmed)}`, { replace: true });
      } else if (location.pathname === '/menu') {
        // اگه سرچ خالی شد و همین الان توی صفحه‌ی منوییم، پارامتر search رو پاک کن
        navigate('/menu', { replace: true });
      }
    }, 350);

    return () => clearTimeout(searchDebounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, searchOpen]);

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

  /* ---------------------------------------------------
     گروه ۱: لوگو + منوی دسکتاپ/تبلت (بدون همبرگری)
  --------------------------------------------------- */
  const LogoGroup = (
    <div className="flex items-center gap-2 md:gap-4 min-w-0 shrink">
      <Link to="/" className="flex items-center gap-2 min-w-0 shrink group">
        <img 
          src={logoSrc}
          alt={t('restaurant.name')}
          className="h-9 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105 shrink-0"
          loading="lazy"
        />
        <span className={`text-sm md:text-xl font-bold ${brandColor} truncate hidden sm:inline transition-colors duration-300`}>
          {t('restaurant.name')}
        </span>
      </Link>

      {/* منوی دسکتاپ */}
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
    </div>
  );

  /* ---------------------------------------------------
     گروه ۲: سرچ + سبد خرید + ورود/پروفایل/ادمین
  --------------------------------------------------- */
  const ActionsGroup = (
    <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
      <button
        onClick={() => setSearchOpen((v) => !v)}
        className={`p-2 rounded-xl shrink-0 transition-colors duration-200 ${textClasses} hover:bg-white/5 dark:hover:bg-white/5`}
        aria-label="Search"
        type="button"
      >
        {searchOpen ? <MdClose size={22} className="shrink-0" /> : <MdSearch size={22} className="shrink-0" />}
      </button>

      <CartIcon />

      {isAdmin && (
        <Link
          to="/admin/dashboard"
          className={`p-2 rounded-full hover:bg-white/10 transition-colors duration-300 shrink-0 ${textClasses}`}
          title="پنل مدیریت"
        >
          <MdAdminPanelSettings size={22} className="shrink-0" />
        </Link>
      )}

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
          className="flex items-center gap-1.5 bg-[#FFD700] text-black px-2.5 md:px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0 hover:bg-[#FFC700] transition-colors"
          type="button"
        >
          <MdLogin size={18} className="shrink-0" />
          <span className="hidden sm:inline">{t('authModal.loginBtn', 'ورود')} / {t('authModal.register', 'ثبت‌نام')}</span>
          <span className="sm:hidden">{t('authModal.loginBtn', 'ورود')}</span>
        </button>
      )}
    </div>
  );

  /* ---------------------------------------------------
     همبرگری: عنصر مستقل، همیشه لبه‌ی راست واقعی صفحه
     (چه فارسی/عربی چه انگلیسی) — دیگه بخشی از گروه لوگو
     نیست تا با زبان جابه‌جا نشه.
  --------------------------------------------------- */
  const HamburgerButton = (
    <button
      onClick={() => setMobileOpen(true)}
      className={`lg:hidden p-2 shrink-0 ${textClasses} hover:bg-white/5 dark:hover:bg-white/5 rounded-xl transition-colors`}
      aria-label="Open menu"
      type="button"
    >
      <GiHamburgerMenu size={22} className="shrink-0" />
    </button>
  );

  return (
    <>
      <header className={`sticky top-0 z-30 ${headerClasses} border-b shadow-lg transition-colors duration-300 overflow-x-hidden`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 w-full">
          {/* ✅ همبرگر همیشه آخرین فرزند این ردیفه، پس صرف‌نظر از زبان روی لبه‌ی راست واقعی می‌شینه.
              فقط لوگو و اکشن‌ها بین خودشون جابه‌جا می‌شن (که با isRTL کنترل می‌شه). */}
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-between gap-2 flex-1 min-w-0">
              {isRTL ? (
                <>
                  {ActionsGroup}
                  {LogoGroup}
                </>
              ) : (
                <>
                  {LogoGroup}
                  {ActionsGroup}
                </>
              )}
            </div>
            {HamburgerButton}
          </div>

          {/* نوار جستجوی بازشو */}
          {searchOpen && (
            <form
              onSubmit={handleSearchSubmit}
              dir={isRTL ? 'rtl' : 'ltr'}
              className="mt-2 flex items-center gap-2 animate-fadeIn"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search.placeholder', 'جستجوی غذا، شماره یا دسته‌بندی...')}
                autoFocus
                className={`flex-1 min-w-0 px-3 py-2 rounded-xl text-sm outline-none border ${
                  theme === 'dark'
                    ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500'
                    : 'bg-black/5 border-black/10 text-gray-900 placeholder:text-gray-400'
                }`}
              />
              <button
                type="submit"
                className="shrink-0 bg-[#FFD700] text-black px-3 py-2 rounded-xl text-sm font-bold hover:bg-[#FFC700] transition-colors"
              >
                {t('search.submit', 'جستجو')}
              </button>
            </form>
          )}
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