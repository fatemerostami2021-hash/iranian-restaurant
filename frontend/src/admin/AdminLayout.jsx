import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  CalendarCheck,
  LogOut,
  Newspaper,
  Users,
  Briefcase,
  Menu,
  X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function AdminLayout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const menuItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: t('admin.dashboard', 'داشبورد') },
    { to: '/admin/menu', icon: UtensilsCrossed, label: t('admin.menu', 'مدیریت منو') },
    { to: '/admin/orders', icon: ShoppingBag, label: t('admin.orders', 'سفارشات') },
    { to: '/admin/reservations', icon: CalendarCheck, label: t('admin.reservations', 'رزروها') },
    { to: '/admin/articles', icon: Newspaper, label: t('admin.articles', 'مدیریت مقالات') },
    { to: '/admin/users', icon: Users, label: t('admin.users', 'مدیریت کاربران') },
    { to: '/admin/jobs', icon: Briefcase, label: t('admin.jobs', 'درخواست‌های کاری') },
  ];

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden" dir="rtl">
      {/* ══ Mobile Overlay ══ */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* ══ Hamburger (Mobile) ══ */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl shadow-lg border border-gray-700 transition-colors"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      {/* ══ Sidebar ══ */}
      <aside
        className={`fixed lg:static inset-y-0 right-0 w-64 sm:w-72 bg-[#0F0F0F] border-l border-gray-800 flex flex-col justify-between z-50 transition-transform duration-300 ease-out shadow-2xl ${
          isMobileOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFD700] flex items-center justify-center">
                <span className="text-black font-black text-lg">K</span>
              </div>
              <div>
                <h1 className="text-lg font-black text-[#FFD700] leading-tight">
                  {t('restaurant.name', 'کباب داغ')}
                </h1>
                <p className="text-[10px] text-gray-500 font-medium">{t('admin.panel', 'پنل مدیریت')}</p>
              </div>
            </div>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-1.5">
            {menuItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-bold ${
                    isActive
                      ? 'bg-[#FFD700] text-black shadow-lg shadow-[#FFD700]/15'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                <item.icon size={20} className="shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Logout */}
        <div className="p-5 sm:p-6 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all text-sm font-bold"
          >
            <LogOut size={20} className="shrink-0" />
            <span>{t('admin.logout', 'خروج از پنل')}</span>
          </button>
        </div>
      </aside>

      {/* ══ Main Content ══ */}
      <main className="flex-1 overflow-y-auto bg-gray-900 w-full">
        <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}