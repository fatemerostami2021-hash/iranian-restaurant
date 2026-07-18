import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FiCalendar, FiCheck, FiX, FiUsers, FiPhone, 
  FiRefreshCw, FiClock, FiCheckCircle, FiXCircle 
} from 'react-icons/fi';

export default function ReservationsManagement() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const token = localStorage.getItem('adminToken');

  const fetchReservations = async () => {
    try {
      setLoading(true);
      // در اینجا از دیتای فیک استفاده می‌کنیم چون هنوز مدل رزرو در بک‌اند نساخته‌ایم
      // const res = await axios.get('http://localhost:5000/api/admin/reservations', { headers: { Authorization: `Bearer ${token}` } });
      // setReservations(res.data);
      
      // دیتای تستی:
      setReservations([
        { id: 'R101', customer: 'حسین رضایی', phone: '09123456789', date: '۱۴۰۴/۰۵/۰۲', time: '۲۰:۳۰', guests: 4, status: 'pending' },
        { id: 'R102', customer: 'مریم احمدی', phone: '09876543210', date: '۱۴۰۴/۰۵/۰۲', time: '۲۱:۰۰', guests: 2, status: 'confirmed' },
        { id: 'R103', customer: 'علی کریمی', phone: '09111111111', date: '۱۴۰۴/۰۵/۰۳', time: '۱۹:۰۰', guests: 6, status: 'pending' },
        { id: 'R104', customer: 'سارا محمدی', phone: '09222222222', date: '۱۴۰۴/۰۵/۰۱', time: '۱۳:۰۰', guests: 3, status: 'canceled' },
      ]);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleStatusChange = (id, status) => {
    // در نسخه نهایی این بخش به بک‌اند درخواست می‌فرستد
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const statusConfig = {
    pending: { label: 'در انتظار', icon: FiClock, color: 'text-yellow-400 bg-yellow-400/10' },
    confirmed: { label: 'تایید شده', icon: FiCheckCircle, color: 'text-green-400 bg-green-400/10' },
    canceled: { label: 'لغو شده', icon: FiXCircle, color: 'text-red-400 bg-red-400/10' },
  };

  const filteredReservations = filter === 'all' ? reservations : reservations.filter(r => r.status === filter);

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFD700]"></div>
    </div>
  );

  return (
    <div className="text-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">📅 مدیریت رزروها</h2>
          <p className="text-gray-400 text-sm">مشاهده و مدیریت رزروهای میز و سالن</p>
        </div>
        <button onClick={fetchReservations} className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
          <FiRefreshCw size={18} /> بروزرسانی
        </button>
      </div>

      {/* فیلترها */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-[#FFD700] text-black' : 'bg-gray-800 text-gray-400'}`}>همه</button>
        <button onClick={() => setFilter('pending')} className={`px-4 py-2 rounded-lg ${filter === 'pending' ? 'bg-[#FFD700] text-black' : 'bg-gray-800 text-gray-400'}`}>در انتظار</button>
        <button onClick={() => setFilter('confirmed')} className={`px-4 py-2 rounded-lg ${filter === 'confirmed' ? 'bg-[#FFD700] text-black' : 'bg-gray-800 text-gray-400'}`}>تایید شده</button>
        <button onClick={() => setFilter('canceled')} className={`px-4 py-2 rounded-lg ${filter === 'canceled' ? 'bg-[#FFD700] text-black' : 'bg-gray-800 text-gray-400'}`}>لغو شده</button>
      </div>

      {/* جدول رزروها */}
      <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-700/50">
              <tr className="text-right text-gray-400 text-sm">
                <th className="p-3">کد رزرو</th>
                <th className="p-3">مشتری</th>
                <th className="p-3">تاریخ و ساعت</th>
                <th className="p-3">تعداد نفرات</th>
                <th className="p-3">وضعیت</th>
                <th className="p-3 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.length === 0 ? (
                <tr><td colSpan="6" className="text-center text-gray-400 p-8">📭 رزروی یافت نشد</td></tr>
              ) : (
                filteredReservations.map((res) => {
                  const StatusIcon = statusConfig[res.status]?.icon || FiClock;
                  return (
                    <tr key={res.id} className="border-t border-gray-700 hover:bg-gray-700/30">
                      <td className="p-3 font-mono text-[#FFD700]">#{res.id}</td>
                      <td className="p-3">
                        <div className="font-medium">{res.customer}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <FiPhone size={10} /> {res.phone}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-col text-sm">
                          <span className="flex items-center gap-1"><FiCalendar size={12} className="text-gray-400" /> {res.date}</span>
                          <span className="text-gray-400 text-xs mt-1">{res.time}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="flex items-center gap-1 text-sm">
                          <FiUsers size={14} className="text-gray-400" /> {res.guests} نفر
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 w-fit ${statusConfig[res.status]?.color}`}>
                          <StatusIcon size={12} /> {statusConfig[res.status]?.label}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-2">
                          {res.status !== 'confirmed' && (
                            <button 
                              onClick={() => handleStatusChange(res.id, 'confirmed')}
                              className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30"
                              title="تایید رزرو"
                            >
                              <FiCheck size={16} />
                            </button>
                          )}
                          {res.status !== 'canceled' && (
                            <button 
                              onClick={() => handleStatusChange(res.id, 'canceled')}
                              className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                              title="لغو رزرو"
                            >
                              <FiX size={16} />
                            </button>
                          )}
                        </div>
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