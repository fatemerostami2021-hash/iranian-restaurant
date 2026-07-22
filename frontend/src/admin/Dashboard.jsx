import { useEffect, useState } from 'react';
import axios from 'axios';
import { ShoppingBag, CalendarCheck, DollarSign, UtensilsCrossed, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/admin/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error('Dashboard fetch error', err);
        // در صورت ارور، حداقل ساختار خالی نمایش داده شود
        setStats({ totalOrders: 0, pendingReservations: 0, totalRevenue: 0, totalMenuItems: 0, recentOrders: [] });
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <div className="text-white p-8 text-center">در حال بارگذاری آمار...</div>;

  const cards = [
    { title: 'سفارشات کل', value: stats.totalOrders, icon: ShoppingBag, color: 'bg-blue-500' },
    { title: 'رزروهای در انتظار', value: stats.pendingReservations, icon: CalendarCheck, color: 'bg-orange-500' },
    { title: 'درآمد کل (ریال قطر)', value: stats.totalRevenue.toLocaleString(), icon: DollarSign, color: 'bg-green-500' },
    { title: 'آیتم‌های منو', value: stats.totalMenuItems, icon: UtensilsCrossed, color: 'bg-[#FFD700]' },
  ];

  // دیتای نمودارها (در آینده می‌توان این را هم از دیتابیس آورد)
  const salesData = [
    { name: 'شنبه', sales: 4000 },
    { name: 'یکشنبه', sales: 3000 },
    { name: 'دوشنبه', sales: 5000 },
    { name: 'سه‌شنبه', sales: 2780 },
    { name: 'چهارشنبه', sales: 8900 },
    { name: 'پنجشنبه', sales: 5390 },
    { name: 'جمعه', sales: 6490 },
  ];
  
  const pieData = [
    { name: 'کباب', value: 400 },
    { name: 'برنج', value: 300 },
    { name: 'نوشیدنی', value: 200 },
    { name: 'پیش‌غذا', value: 100 },
  ];
  const COLORS = ['#FFD700', '#D32F2F', '#00C49F', '#FFBB28'];

  return (
    <div className="text-white p-6 bg-gray-900 min-h-full">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><TrendingUp /> پنل تحلیلی کسب‌وکار</h2>
      
      {/* کارت‌های آماری */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, i) => (
          <div key={i} className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">{card.title}</p>
              <h3 className="text-2xl font-bold">{card.value}</h3>
            </div>
            <div className={`${card.color} p-4 rounded-xl`}>
              <card.icon size={24} className="text-white" />
            </div>
          </div>
        ))}
      </div>

      {/* نمودارها */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* نمودار خطی فروش */}
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
          <h3 className="text-lg font-bold mb-4">روند فروش هفتگی</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip wrapperStyle={{ backgroundColor: '#333', border: 'none' }} />
              <Line type="monotone" dataKey="sales" stroke="#FFD700" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* نمودار دونات دسته‌بندی فروش */}
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
          <h3 className="text-lg font-bold mb-4">توزیع فروش بر اساس دسته</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip wrapperStyle={{ backgroundColor: '#333', border: 'none' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* لیست آخرین سفارشات */}
      <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
        <h3 className="text-lg font-bold mb-4">آخرین سفارشات</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="border-b border-gray-700 text-gray-400">
              <tr>
                <th className="p-3">مشتری</th>
                <th className="p-3">مبلغ</th>
                <th className="p-3">وضعیت</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders?.length > 0 ? stats.recentOrders.map((order, i) => (
                <tr key={i} className="border-b border-gray-800 hover:bg-gray-700/30">
                  <td className="p-3">{order.customerName || 'نامشخص'}</td>
                  <td className="p-3">{order.totalPrice ? `${order.totalPrice} QR` : '-'}</td>
                  <td className="p-3 text-yellow-500">{order.status || 'در انتظار'}</td>
                </tr>
              )) : (
                <tr><td colSpan="3" className="p-4 text-center text-gray-500">هنوز سفارشی ثبت نشده است.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}