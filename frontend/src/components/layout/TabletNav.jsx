import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  MdHomeFilled,
  MdMenuBook,
  MdArticle,
  MdInfo,
  MdPhoneInTalk
} from 'react-icons/md';

const navItems = [
  { key: 'home', icon: MdHomeFilled, href: '/' },
  { key: 'menu', icon: MdMenuBook, href: '/menu' },
  { key: 'articles', icon: MdArticle, href: '/articles' },
  { key: 'about', icon: MdInfo, href: '/about' },
  { key: 'contact', icon: MdPhoneInTalk, href: '/contact' },
];

export default function TabletNav() {
  const { t } = useTranslation();
  const location = useLocation();

  const isActive = (href) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="hidden md:flex lg:hidden items-center gap-1">
      {navItems.map(({ key, icon: Icon, href }) => {
        const active = isActive(href);
        return (
          <Link
            key={key}
            to={href}
            className={`
              flex items-center gap-1.5 px-3 py-2 
              text-xs font-medium rounded-lg
              transition-all duration-200
              ${active 
                ? 'text-primary bg-primary/10 dark:bg-primary/20' 
                : 'text-gray-700 dark:text-gray-200 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800'
              }
            `}
          >
            <Icon size={16} className={active ? 'text-primary' : 'text-gray-500 dark:text-gray-400'} />
            <span>{t(`nav.${key}`)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
