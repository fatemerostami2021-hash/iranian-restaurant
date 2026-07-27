import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  ShoppingBag,
  CalendarCheck,
  DollarSign,
  UtensilsCrossed,
  TrendingUp,
  Clock,
  Package,
  CheckCircle,
  Truck,
  ChefHat,
  AlertCircle,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useTranslation } from 'react-i18next';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function Dashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/admin/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error('Dashboard fetch error', err);
        setStats({
          totalOrders: 0,
          pendingReservations: 0,
          totalRevenue: 0,
          totalMenuItems: 0,
          recentOrders: [],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-[3px] border-[#FFD700] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm font-medium">{t('admin.loading', 'در حال بارگذاری...')}</p>
        </div>
      </div>
    );
  }

  const orderStatusCards = [
    { title: t('orderStatus.pending', 'در انتظار'), value: stats.pendingOrders || 0, icon: Clock, color: 'bg-yellow-500', text: 'text-yellow-500', bgSoft: 'bg-yellow-500/10' },
    { title: t('orderStatus.preparing', 'در حال آماده‌سازی'), value: stats.preparingOrders || 0, icon: ChefHat, color: 'bg-blue-500', text: 'text-blue-500', bgSoft: 'bg-blue-500/10' },
    { title: t('orderStatus.ready', 'آماده تحویل'), value: stats.readyOrders || 0, icon: Package, color: 'bg-purple-500', text: 'text-purple-500', bgSoft: 'bg-purple-500/10' },
    { title: t('orderStatus.delivered', 'تحویل شده'), value: stats.deliveredOrders || stats.totalOrders || 0, icon: CheckCircle, color: 'bg-green-500', text: 'text-green-500', bgSoft: 'bg-green-500/10' },
  ];

  const mainCards = [
    { title: t('admin.totalRevenue', 'درآمد کل'), value: `${stats.totalRevenue.toLocaleString()} QR`, icon: DollarSign, color: 'bg-emerald-500', bgSoft: 'bg-emerald-500/10', text: 'text-emerald-400' },
    { title: t('admin.totalMenuItems', 'آیتم‌های منو'), value: stats.totalMenuItems, icon: UtensilsCrossed, color: 'bg-[#FFD700]', bgSoft: 'bg-[#FFD700]/10', text: 'text-[#FFD700]' },
    { title: t('admin.pendingReservations', 'رزروهای در انتظار'), value: stats.pendingReservations, icon: CalendarCheck, color: 'bg-orange-500', bgSoft: 'bg-orange-500/10', text: 'text-orange-400' },
  ];

  const salesData = [
    { name: t('days.sat', 'شنبه'), sales: 4000 },
    { name: t('days.sun', 'یکشنبه'), sales: 3000 },
    { name: t('days.mon', 'دوشنبه'), sales: 5000 },
    { name: t('days.tue', 'سه‌شنبه'), sales: 2780 },
    { name: t('days.wed', 'چهارشنبه'), sales: 8900 },
    { name: t('days.thu', 'پنجشنبه'), sales: 5390 },
    { name: t('days.fri', 'جمعه'), sales: 6490 },
  ];

  const pieData = [
    { name: t('menu.categories.main', 'کباب'), value: 400 },
    { name: t('menu.categories.combo', 'سینی‌ها'), value: 300 },
    { name: t('menu.categories.drinks', 'نوشیدنی'), value: 200 },
    { name: t('menu.categories.appetizer', 'پیش‌غذا'), value: 100 },
  ];
  const COLORS = ['#FFD700', '#D32F2F', '#00C49F', '#FFBB28'];

  return (
    <div className="text-white min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2">
          <TrendingUp className="text-[#FFD700]" size={28} />
          {t('admin.businessPanel', 'پنل تحلیلی کسب‌وکار')}
        </h2>
        <span className="text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-lg border border-gray-700">
          {new Date().toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>

      {/* ══ Order Status Cards (Mobile: 2 cols) ══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {orderStatusCards.map((card, i) => (
          <div
            key={i}
            className={`${card.bgSoft} border border-gray-800 rounded-2xl p-3 sm:p-5 flex items-center gap-3 sm:gap-4 transition-all hover:border-gray-700`}
          >
            <div className={`${card.color} p-2.5 sm:p-3 rounded-xl shrink-0 shadow-lg`}>
              <card.icon size={20} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-gray-400 text-[10px] sm:text-xs font-medium mb-0.5 truncate">{card.title}</p>
              <h3 className={`text-xl sm:text-2xl font-black ${card.text}`}>{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* ══ Main Stats Cards ══ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
        {mainCards.map((card, i) => (
          <div
            key={i}
            className={`${card.bgSoft} border border-gray-800 rounded-2xl p-4 sm:p-6 flex items-center justify-between transition-all hover:border-gray-700`}
          >
            <div>
              <p className="text-gray-400 text-xs sm:text-sm font-medium mb-1">{card.title}</p>
              <h3 className={`text-lg sm:text-2xl font-black ${card.text}`}>{card.value}</h3>
            </div>
            <div className={`${card.color} p-3 sm:p-4 rounded-xl shadow-lg`}>
              <card.icon size={24} className="text-white" />
            </div>
          </div>
        ))}
      </div>

      {/* ══ Charts ══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-6">
        <div className="bg-gray-800/50 border border-gray-800 rounded-2xl p-4 sm:p-6">
          <h3 className="text-sm sm:text-base font-bold mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-[#FFD700]" />
            {t('admin.weeklySales', 'روند فروش هفتگی')}
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#666" fontSize={11} />
              <YAxis stroke="#666" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1C1C1C',
                  border: '1px solid #333',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#FFD700"
                strokeWidth={3}
                dot={{ fill: '#FFD700', r: 4 }}
                activeDot={{ r: 6, fill: '#FFD700' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-800/50 border border-gray-800 rounded-2xl p-4 sm:p-6">
          <h3 className="text-sm sm:text-base font-bold mb-4 flex items-center gap-2">
            <UtensilsCrossed size={18} className="text-[#FFD700]" />
            {t('admin.categoryDistribution', 'توزیع فروش بر اساس دسته')}
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={85}
                innerRadius={50}
                paddingAngle={4}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1C1C1C',
                  border: '1px solid #333',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {pieData.map((entry, index) => (
              <div key={index} className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                <span className="text-xs text-gray-400">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ Recent Orders (Mobile: Card View | Desktop: Table) ══ */}
      <div className="bg-gray-800/50 border border-gray-800 rounded-2xl p-4 sm:p-6">
        <h3 className="text-sm sm:text-base font-bold mb-4 flex items-center gap-2">
          <ShoppingBag size={18} className="text-[#FFD700]" />
          {t('admin.recentOrders', 'آخرین سفارشات')}
        </h3>

        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-right">
            <thead className="border-b border-gray-700 text-gray-400 text-xs">
              <tr>
                <th className="p-3 font-bold">{t('checkout.firstName', 'مشتری')}</th>
                <th className="p-3 font-bold">{t('cart.total', 'مبلغ')}</th>
                <th className="p-3 font-bold">{t('admin.status', 'وضعیت')}</th>
                <th className="p-3 font-bold">{t('admin.date', 'تاریخ')}</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders?.length > 0 ? (
                stats.recentOrders.map((order, i) => (
                  <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-700/20 transition-colors text-sm">
                    <td className="p-3 font-medium">{order.customerName || t('admin.unknown', 'نامشخص')}</td>
                    <td className="p-3 font-bold text-[#FFD700]">{order.totalPrice ? `${order.totalPrice} QR` : '-'}</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-yellow-500/10 text-yellow-500">
                        <Clock size={12} />
                        {t(`orderStatus.${order.status}`, 'در انتظار')}
                      </span>
                    </td>
                    <td className="p-3 text-gray-400 text-xs">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString('fa-IR') : '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">
                    <AlertCircle className="mx-auto mb-2 text-gray-600" size={32} />
                    <p className="text-sm">{t('admin.noOrders', 'هنوز سفارشی ثبت نشده است.')}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="sm:hidden space-y-3">
          {stats.recentOrders?.length > 0 ? (
            stats.recentOrders.map((order, i) => (
              <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">{order.customerName || t('admin.unknown', 'نامشخص')}</span>
                  <span className="text-xs px-2 py-1 rounded-lg bg-yellow-500/10 text-yellow-500 font-bold">
                    {t(`orderStatus.${order.status}`, 'در انتظار')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{t('cart.total', 'مبلغ')}: <strong className="text-[#FFD700]">{order.totalPrice} QR</strong></span>
                  <span>{order.createdAt ? new Date(order.createdAt).toLocaleDateString('fa-IR') : '-'}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="mx-auto mb-2 text-gray-600" size={32} />
              <p className="text-sm">{t('admin.noOrders', 'هنوز سفارشی ثبت نشده است.')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}