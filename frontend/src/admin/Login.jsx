import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', { username, password });
      localStorage.setItem('adminToken', res.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('نام کاربری یا رمز عبور اشتباه است');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4" dir="rtl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-black/50 backdrop-blur-xl border border-[#FFD700]/20 rounded-2xl p-8 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-[#FFD700]">پنل مدیریت</h1>
          <p className="text-gray-400 mt-2">کباب داغ نان داغ</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">نام کاربری</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-[#FFD700] focus:outline-none transition"
              placeholder="admin"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">رمز عبور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-[#FFD700] focus:outline-none transition"
              placeholder="••••••••"
            />
          </div>
          
          {error && <div className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded">{error}</div>}

          <button
            type="submit"
            className="w-full bg-[#FFD700] text-black font-bold p-3 rounded-lg hover:bg-[#FFC700] transition-colors"
          >
            ورود به پنل
          </button>
        </form>
      </motion.div>
    </div>
  );
}
