import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, UtensilsCrossed, ShoppingBag, CalendarCheck, LogOut, Newspaper } from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const menuItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'داشبورد' },
    { to: '/admin/menu', icon: UtensilsCrossed, label: 'مدیریت منو' },
    { to: '/admin/orders', icon: ShoppingBag, label: 'سفارشات' },
    { to: '/admin/reservations', icon: CalendarCheck, label: 'رزروها' },
    { to: '/admin/articles', icon: Newspaper, label: 'مدیریت مقالات' },
  ];

  return (
    <div className="flex h-screen bg-gray-900 text-white" dir="rtl">
      <aside className="w-64 bg-black p-6 flex flex-col justify-between border-l border-gray-800">
        <div>
          <h1 className="text-2xl font-black text-[#FFD700] mb-10">کباب داغ</h1>
          <nav className="flex flex-col gap-4">
            {menuItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-lg transition-all ${
                    isActive ? 'bg-[#FFD700] text-black font-bold' : 'hover:bg-gray-800 text-gray-400'
                  }`
                }
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-3 p-3 rounded-lg text-red-500 hover:bg-red-500/10 transition-all">
          <LogOut size={20} />
          <span>خروج از پنل</span>
        </button>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
