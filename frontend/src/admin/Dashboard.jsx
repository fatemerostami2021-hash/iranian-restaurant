import { useEffect, useState } from 'react';
import { ShoppingBag, CalendarCheck, DollarSign, UtensilsCrossed } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    setStats({
      totalOrders: 152,
      pendingReservations: 12,
      totalRevenue: 48500000,
      totalMenuItems: 78
    });
  }, []);

  if (!stats) return <div className="text-white">در حال بارگذاری...</div>;

  const cards = [
    { title: 'سفارشات کل', value: stats.totalOrders, icon: ShoppingBag, color: 'bg-blue-500' },
    { title: 'رزروهای در انتظار', value: stats.pendingReservations, icon: CalendarCheck, color: 'bg-orange-500' },
    { title: 'درآمد کل (تومان)', value: stats.totalRevenue.toLocaleString('fa-IR'), icon: DollarSign, color: 'bg-green-500' },
    { title: 'آیتم‌های منو', value: stats.totalMenuItems, icon: UtensilsCrossed, color: 'bg-[#FFD700]' },
  ];

  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-8">نمای کلی</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, i) => (
          <div key={i} className="bg-gray-800 p-6 rounded-2xl border border-gray-700 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">{card.title}</p>
              <h3 className="text-2xl font-bold">{card.value}</h3>
            </div>
            <div className={`${card.color} p-4 rounded-xl text-black`}>
              <card.icon size={24} />
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 h-96">
        <h3 className="text-lg font-bold mb-4">آمار فروش هفتگی</h3>
        <div className="h-full flex items-center justify-center text-gray-500">
          نمودار فروش در اینجا نمایش داده می‌شود
        </div>
      </div>
    </div>
  );
}
