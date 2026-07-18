import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiRefreshCw, FiTruck, FiClock, FiCheckCircle, FiXCircle, FiPackage } from 'react-icons/fi';

export default function OrdersManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const token = localStorage.getItem('adminToken');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      // دیتای فیک در صورت خطا
      setOrders([
        { id: 1, customer: 'محمد رضایی', items: 3, total: 450000, status: 'در حال آماده‌سازی', date: '۱۴۰۴/۰۴/۲۸' },
        { id: 2, customer: 'سارا حسینی', items: 2, total: 320000, status: 'ارسال شده', date: '۱۴۰۴/۰۴/۲۸' },
        { id: 3, customer: 'علی کریمی', items: 4, total: 280000, status: 'در انتظار', date: '۱۴۰۴/۰۴/۲۷' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/orders/${id}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // به‌روزرسانی لیست
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    } catch (error) {
      alert('خطا در تغییر وضعیت سفارش');
    }
  };

  const statusConfig = {
    'در انتظار': { icon: FiClock, color: 'text-yellow-400 bg-yellow-400/10' },
    'در حال آماده‌سازی': { icon: FiPackage, color: 'text-blue-400 bg-blue-400/10' },
    'ارسال شده': { icon: FiTruck, color: 'text-purple-400 bg-purple-400/10' },
    'تحویل شده': { icon: FiCheckCircle, color: 'text-green-400 bg-green-400/10' },
    'لغو شده': { icon: FiXCircle, color: 'text-red-400 bg-red-400/10' },
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFD700]"></div>
    </div>
  );

  return (
    <div className="text-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">📦 مدیریت سفارشات</h2>
          <p className="text-gray-400 text-sm">مشاهده و مدیریت سفارشات مشتریان</p>
        </div>
        <button onClick={fetchOrders} className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
          <FiRefreshCw size={18} /> بروزرسانی
        </button>
      </div>

      {/* فیلترها */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg whitespace-nowrap ${filter === 'all' ? 'bg-[#FFD700] text-black' : 'bg-gray-800 text-gray-400'}`}>همه</button>
        <button onClick={() => setFilter('در انتظار')} className={`px-4 py-2 rounded-lg whitespace-nowrap ${filter === 'در انتظار' ? 'bg-[#FFD700] text-black' : 'bg-gray-800 text-gray-400'}`}>در انتظار</button>
        <button onClick={() => setFilter('در حال آماده‌سازی')} className={`px-4 py-2 rounded-lg whitespace-nowrap ${filter === 'در حال آماده‌سازی' ? 'bg-[#FFD700] text-black' : 'bg-gray-800 text-gray-400'}`}>در حال آماده‌سازی</button>
        <button onClick={() => setFilter('ارسال شده')} className={`px-4 py-2 rounded-lg whitespace-nowrap ${filter === 'ارسال شده' ? 'bg-[#FFD700] text-black' : 'bg-gray-800 text-gray-400'}`}>ارسال شده</button>
        <button onClick={() => setFilter('تحویل شده')} className={`px-4 py-2 rounded-lg whitespace-nowrap ${filter === 'تحویل شده' ? 'bg-[#FFD700] text-black' : 'bg-gray-800 text-gray-400'}`}>تحویل شده</button>
      </div>

      {/* جدول سفارشات */}
      <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-700/50">
              <tr className="text-right text-gray-400 text-sm">
                <th className="p-3">شناسه</th>
                <th className="p-3">مشتری</th>
                <th className="p-3">تعداد اقلام</th>
                <th className="p-3">مبلغ کل</th>
                <th className="p-3">تاریخ</th>
                <th className="p-3">وضعیت فعلی</th>
                <th className="p-3">تغییر وضعیت</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr><td colSpan="7" className="text-center text-gray-400 p-8">📭 سفارشی یافت نشد</td></tr>
              ) : (
                filteredOrders.map((order) => {
                  const StatusIcon = statusConfig[order.status]?.icon || FiClock;
                  return (
                    <tr key={order.id} className="border-t border-gray-700 hover:bg-gray-700/30">
                      <td className="p-3 font-mono text-[#FFD700]">#{order.id}</td>
                      <td className="p-3 font-medium">{order.customer}</td>
                      <td className="p-3">{order.items} عدد</td>
                      <td className="p-3 font-bold">{order.total.toLocaleString()} تومان</td>
                      <td className="p-3 text-sm text-gray-400">{order.date}</td>
                      <td className="p-3">
                        <span className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 w-fit ${statusConfig[order.status]?.color}`}>
                          <StatusIcon size={12} /> {order.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <select 
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="bg-gray-700 border border-gray-600 rounded-lg p-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                        >
                          <option value="در انتظار">در انتظار</option>
                          <option value="در حال آماده‌سازی">در حال آماده‌سازی</option>
                          <option value="ارسال شده">ارسال شده</option>
                          <option value="تحویل شده">تحویل شده</option>
                          <option value="لغو شده">لغو شده</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}