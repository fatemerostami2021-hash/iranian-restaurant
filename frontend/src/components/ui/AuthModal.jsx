import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMail, FiLock, FiPhone, FiUser } from 'react-icons/fi';
import { FaGoogle } from 'react-icons/fa';
import axios from 'axios';
import { useTheme } from '../../context/ThemeContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [mode, setMode] = useState('email');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', otp: '' });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await axios.post(`${API_URL}/api/customer/auth/login`, { email: formData.email, password: formData.password });
      onLoginSuccess(res.data.token, res.data.user);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || t('authModal.error', 'خطا در ورود'));
    } finally { setLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await axios.post(`${API_URL}/api/customer/auth/register`, { name: formData.name, email: formData.email, password: formData.password, phone: formData.phone });
      onLoginSuccess(res.data.token, res.data.user);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || t('authModal.error', 'خطا در ثبت‌نام'));
    } finally { setLoading(false); }
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await axios.post(`${API_URL}/api/customer/auth/request-otp`, { phone: formData.phone });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || t('authModal.error', 'خطا در ارسال کد'));
    } finally { setLoading(false); }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await axios.post(`${API_URL}/api/customer/auth/verify-otp`, { phone: formData.phone, code: formData.otp });
      onLoginSuccess(res.data.token, res.data.user);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || t('authModal.error', 'کد اشتباه است'));
    } finally { setLoading(false); }
  };

  const inputClass = `w-full p-3 rounded-xl bg-transparent border focus:outline-none focus:ring-2 transition-all ${
    isDark ? 'bg-white/5 border-white/20 text-white focus:border-[#FFD700]' : 'bg-gray-50 border-gray-300 text-black focus:border-[#D32F2F]'
  }`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-md rounded-3xl p-8 shadow-2xl border ${isDark ? 'bg-[#1C1C1C] border-white/10' : 'bg-white border-gray-200'}`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                {mode === 'register' ? t('authModal.register', 'ثبت‌نام') : t('authModal.login', 'ورود به حساب')}
              </h2>
              <button onClick={onClose} className={`p-2 rounded-full ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                <FiX className={isDark ? 'text-white' : 'text-black'} size={24} />
              </button>
            </div>

            {error && <div className="bg-red-500/10 text-red-500 p-3 rounded-lg mb-4 text-sm text-center">{error}</div>}

            <button className="w-full flex items-center justify-center gap-2 bg-white text-black border border-gray-300 font-bold p-3 rounded-xl mb-6 hover:bg-gray-50">
              <FaGoogle /> {t('authModal.google', 'ورود با گوگل')}
            </button>

            <div className="flex border-b border-gray-300 mb-6">
              <button onClick={() => { setMode('email'); setStep(1); }} className={`flex-1 pb-2 font-medium ${mode === 'email' ? 'border-b-2 border-[#FFD700] text-[#FFD700]' : isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('authModal.email', 'ایمیل')}</button>
              <button onClick={() => { setMode('phone'); setStep(1); }} className={`flex-1 pb-2 font-medium ${mode === 'phone' ? 'border-b-2 border-[#FFD700] text-[#FFD700]' : isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('authModal.phone', 'موبایل')}</button>
            </div>

            {mode === 'email' && (
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="relative">
                  <FiMail className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400" />
                  <input type="email" name="email" placeholder={t('authModal.emailPlaceholder', 'ایمیل')} value={formData.email} onChange={handleChange} className={`${inputClass} pr-10`} required />
                </div>
                <div className="relative">
                  <FiLock className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400" />
                  <input type="password" name="password" placeholder={t('authModal.passwordPlaceholder', 'رمز عبور')} value={formData.password} onChange={handleChange} className={`${inputClass} pr-10`} required />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-[#FFD700] text-black font-bold p-3 rounded-xl hover:bg-[#FFC700] disabled:opacity-50">
                  {loading ? t('authModal.loading', 'در حال ورود...') : t('authModal.loginBtn', 'ورود')}
                </button>
              </form>
            )}

            {mode === 'phone' && step === 1 && (
              <form onSubmit={handleRequestOTP} className="space-y-4">
                <div className="relative">
                  <FiPhone className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400" />
                  <input type="tel" name="phone" placeholder={t('authModal.phonePlaceholder', 'شماره موبایل')} value={formData.phone} onChange={handleChange} className={`${inputClass} pr-10`} required />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-[#FFD700] text-black font-bold p-3 rounded-xl hover:bg-[#FFC700] disabled:opacity-50">
                  {loading ? t('authModal.loading', 'در حال ارسال...') : t('authModal.requestOtp', 'دریافت کد تایید')}
                </button>
              </form>
            )}

            {mode === 'phone' && step === 2 && (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <p className="text-sm text-gray-400 text-center">{t('authModal.otpDesc', 'کد ۶ رقمی ارسال شده را وارد کنید:')}</p>
                <input type="text" name="otp" placeholder={t('authModal.otpPlaceholder', 'کد تایید')} value={formData.otp} onChange={handleChange} className={`${inputClass} text-center tracking-[0.5em] font-bold`} maxLength="6" required />
                <button type="submit" disabled={loading} className="w-full bg-[#FFD700] text-black font-bold p-3 rounded-xl hover:bg-[#FFC700] disabled:opacity-50">
                  {loading ? t('authModal.loading', 'در حال بررسی...') : t('authModal.verifyOtp', 'تایید و ورود')}
                </button>
              </form>
            )}

            {mode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="relative">
                  <FiUser className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400" />
                  <input type="text" name="name" placeholder={t('authModal.namePlaceholder', 'نام و نام خانوادگی')} value={formData.name} onChange={handleChange} className={`${inputClass} pr-10`} required />
                </div>
                <input type="email" name="email" placeholder={t('authModal.emailPlaceholder', 'ایمیل')} value={formData.email} onChange={handleChange} className={inputClass} required />
                <input type="tel" name="phone" placeholder={t('authModal.phonePlaceholder', 'شماره موبایل')} value={formData.phone} onChange={handleChange} className={inputClass} required />
                <input type="password" name="password" placeholder={t('authModal.passwordPlaceholder', 'رمز عبور')} value={formData.password} onChange={handleChange} className={inputClass} required />
                <button type="submit" disabled={loading} className="w-full bg-[#FFD700] text-black font-bold p-3 rounded-xl hover:bg-[#FFC700] disabled:opacity-50">
                  {loading ? t('authModal.loading', 'در حال ساخت حساب...') : t('authModal.registerBtn', 'ثبت‌نام')}
                </button>
              </form>
            )}

            <div className="text-center mt-6 text-sm">
              {mode === 'register' ? (
                <button onClick={() => setMode('email')} className="text-[#FFD700]">{t('authModal.hasAccount', 'حساب کاربری دارید؟ ورود')}</button>
              ) : (
                <button onClick={() => setMode('register')} className="text-[#FFD700]">{t('authModal.noAccount', 'حساب کاربری ندارید؟ ثبت‌نام')}</button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}