import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // جلوگیری از دوبار کلیک سریع
    setError('');
    setIsSubmitting(true);

    try {
      const res = await axios.post(`${API_URL}/api/admin/login`, { email, password });
      localStorage.setItem('adminToken', res.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      if (!err.response) {
        // درخواست اصلاً به سرور نرسیده (قطعی شبکه، سرور در حال ری‌استارت، و...)
        setError('ارتباط با سرور برقرار نشد. چند لحظه صبر کن و دوباره امتحان کن.');
      } else if (err.response.status === 429) {
        // rate limit خورده
        setError(err.response.data?.message || 'تعداد تلاش‌ها زیاد بود. کمی صبر کن.');
      } else {
        // خطای واقعی از سرور (مثلا واقعاً ایمیل/رمز اشتباهه)
        setError(err.response.data?.message || 'ایمیل یا رمز عبور اشتباه است');
      }
    } finally {
      setIsSubmitting(false);
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
            <label className="block text-sm font-medium text-gray-300 mb-2">ایمیل</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-[#FFD700] focus:outline-none transition"
              placeholder="admin@kabab.com"
              dir="ltr"
              required
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
              dir="ltr"
              required
            />
          </div>
          
          {error && <div className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded">{error}</div>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#FFD700] text-black font-bold p-3 rounded-lg hover:bg-[#FFC700] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'در حال ورود...' : 'ورود به پنل'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}