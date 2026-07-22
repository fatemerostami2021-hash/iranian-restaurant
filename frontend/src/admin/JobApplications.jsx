import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiTrash2, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function JobApplications() {
  const [apps, setApps] = useState([]);
  const token = localStorage.getItem('adminToken');

  const fetchApps = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/jobs`, { headers: { Authorization: `Bearer ${token}` } });
      setApps(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchApps(); }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/api/admin/jobs/${id}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      fetchApps();
    } catch (err) { alert('خطا در تغییر وضعیت'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('حذف این درخواست؟')) return;
    try {
      await axios.delete(`${API_URL}/api/admin/jobs/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchApps();
    } catch (err) { alert('خطا در حذف'); }
  };

  return (
    <div className="text-white p-6">
      <h2 className="text-2xl font-bold mb-6">درخواست‌های همکاری (آشپزخانه)</h2>
      <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
        <table className="w-full text-right">
          <thead className="bg-gray-700/50 text-gray-400">
            <tr>
              <th className="p-3">نام</th>
              <th className="p-3">تلفن</th>
              <th className="p-3">سمت</th>
              <th className="p-3">سابقه کار</th>
              <th className="p-3">وضعیت</th>
              <th className="p-3 text-center">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {apps.map(app => (
              <tr key={app._id} className="border-t border-gray-700 hover:bg-gray-700/30">
                <td className="p-3">{app.name}</td>
                <td className="p-3" dir="ltr">{app.phone}</td>
                <td className="p-3">{app.position}</td>
                <td className="p-3 text-sm text-gray-400">{app.experience || '-'}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    app.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    app.status === 'reviewed' ? 'bg-blue-500/20 text-blue-400' :
                    app.status === 'hired' ? 'bg-green-500/20 text-green-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {app.status === 'pending' ? 'در انتظار' : app.status === 'reviewed' ? 'بررسی شده' : app.status === 'hired' ? 'استخدام شد' : 'رد شد'}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => handleUpdateStatus(app._id, 'hired')} className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30" title="استخدام">
                      <FiCheckCircle size={16} />
                    </button>
                    <button onClick={() => handleUpdateStatus(app._id, 'rejected')} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30" title="رد کردن">
                      <FiXCircle size={16} />
                    </button>
                    <button onClick={() => handleDelete(app._id)} className="p-2 bg-gray-500/20 text-gray-400 rounded-lg hover:bg-gray-500/30" title="حذف">
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}