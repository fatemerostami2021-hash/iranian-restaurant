import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiTrash2, FiUserPlus, FiX } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', role: 'staff' });
  const token = localStorage.getItem('adminToken');

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/users`, { headers: { Authorization: `Bearer ${token}` } });
      setUsers(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('آیا از حذف این کاربر مطمئن هستید؟')) return;
    try {
      await axios.delete(`${API_URL}/api/admin/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchUsers();
    } catch (err) { alert('خطا در حذف کاربر'); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/admin/users`, formData, { headers: { Authorization: `Bearer ${token}` } });
      setShowForm(false);
      setFormData({ name: '', email: '', phone: '', password: '', role: 'staff' });
      fetchUsers();
    } catch (err) { alert('خطا در ایجاد کاربر'); }
  };

  return (
    <div className="text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">مدیریت کاربران پنل</h2>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-[#FFD700] text-black font-bold px-4 py-2 rounded-lg">
          <FiUserPlus /> افزودن کاربر جدید
        </button>
      </div>

      <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
        <table className="w-full text-right">
          <thead className="bg-gray-700/50 text-gray-400">
            <tr>
              <th className="p-3">نام</th>
              <th className="p-3">ایمیل</th>
              <th className="p-3">نقش</th>
              <th className="p-3 text-center">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} className="border-t border-gray-700 hover:bg-gray-700/30">
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${user.role === 'admin' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {user.role === 'admin' ? 'مدیر کل' : 'کارمند'}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <button onClick={() => handleDelete(user._id)} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30">
                    <FiTrash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">کاربر جدید</h3>
              <button onClick={() => setShowForm(false)}><FiX size={24} /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <input type="text" placeholder="نام" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 rounded bg-gray-900 border border-gray-600" required />
              <input type="email" placeholder="ایمیل" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-3 rounded bg-gray-900 border border-gray-600" required />
              <input type="text" placeholder="شماره تماس" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-3 rounded bg-gray-900 border border-gray-600" />
              <input type="password" placeholder="رمز عبور" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full p-3 rounded bg-gray-900 border border-gray-600" required />
              <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full p-3 rounded bg-gray-900 border border-gray-600">
                <option value="staff">کارمند (Staff)</option>
                <option value="admin">مدیر کل (Admin)</option>
              </select>
              <button type="submit" className="w-full bg-[#FFD700] text-black font-bold p-3 rounded-lg">ذخیره</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}