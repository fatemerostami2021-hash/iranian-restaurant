import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiMapPin, FiCreditCard, FiPlus, FiLogOut, FiClock } from 'react-icons/fi';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Profile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [user, setUser] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ title: '', address: '' });
  const [newCard, setNewCard] = useState({ number: '', brand: 'Visa' });

  const token = localStorage.getItem('customerToken');

  useEffect(() => {
    if (!token) { navigate('/'); return; }
    fetchProfile();
  }, [token, navigate]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/customer/profile`, { headers: { Authorization: `Bearer ${token}` } });
      setUser(res.data);
    } catch (err) {
      localStorage.removeItem('customerToken');
      navigate('/');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('customerToken');
    navigate('/');
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/customer/profile/addresses`, newAddress, { headers: { Authorization: `Bearer ${token}` } });
      setUser({ ...user, addresses: res.data });
      setNewAddress({ title: '', address: '' });
      setShowAddressForm(false);
    } catch (err) {}
  };

  const handleAddCard = async (e) => {
    e.preventDefault();
    try {
      const last4 = newCard.number.slice(-4);
      const res = await axios.post(`${API_URL}/api/customer/profile/cards`, { token: 'mock_token', last4, brand: newCard.brand }, { headers: { Authorization: `Bearer ${token}` } });
      setUser({ ...user, paymentMethods: res.data });
      setNewCard({ number: '', brand: 'Visa' });
      setShowCardForm(false);
    } catch (err) {}
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;

  const cardBg = isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200';
  const textClass = isDark ? 'text-white' : 'text-black';
  const mutedClass = isDark ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className={`min-h-screen pt-24 pb-20 ${isDark ? 'bg-[#0F0F0F]' : 'bg-[#FFFBF5]'} ${textClass}`}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-10">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="w-16 h-16 rounded-full bg-[#FFD700] flex items-center justify-center text-2xl font-black text-black">
              {user.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className={mutedClass}>{user.email || user.phone}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 bg-red-500/10 text-red-500 px-4 py-2 rounded-xl font-medium hover:bg-red-500/20">
            <FiLogOut /> {t('profilePage.logout', 'خروج از حساب')}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* آدرس‌ها */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`p-6 rounded-3xl border ${cardBg}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2"><FiMapPin /> {t('profilePage.myAddresses', 'آدرس‌های من')}</h2>
              <button onClick={() => setShowAddressForm(!showAddressForm)} className="text-[#FFD700] flex items-center gap-1 text-sm">
                <FiPlus /> {t('profilePage.add', 'افزودن')}
              </button>
            </div>
            {showAddressForm && (
              <form onSubmit={handleAddAddress} className="mb-4 space-y-2">
                <input type="text" placeholder={t('profilePage.titlePlaceholder', 'عنوان (خانه، محل کار)')} value={newAddress.title} onChange={e => setNewAddress({...newAddress, title: e.target.value})} className={`w-full p-2 rounded-lg ${isDark ? 'bg-black/30' : 'bg-gray-100'} border ${isDark ? 'border-white/10' : 'border-gray-300'}`} required />
                <textarea placeholder={t('profilePage.addressPlaceholder', 'آدرس کامل')} value={newAddress.address} onChange={e => setNewAddress({...newAddress, address: e.target.value})} rows="2" className={`w-full p-2 rounded-lg ${isDark ? 'bg-black/30' : 'bg-gray-100'} border ${isDark ? 'border-white/10' : 'border-gray-300'}`} required />
                <button type="submit" className="w-full bg-[#FFD700] text-black py-2 rounded-lg font-bold">{t('profilePage.saveAddress', 'ذخیره آدرس')}</button>
              </form>
            )}
            <div className="space-y-3">
              {user.addresses?.length > 0 ? user.addresses.map((addr, i) => (
                <div key={i} className={`p-3 rounded-xl ${isDark ? 'bg-black/20' : 'bg-gray-50'}`}>
                  <p className="font-bold text-sm">{addr.title}</p>
                  <p className={`text-xs ${mutedClass}`}>{addr.address}</p>
                </div>
              )) : <p className={`text-sm ${mutedClass}`}>{t('profilePage.noAddresses', 'هنوز آدرسی ثبت نکرده‌اید.')}</p>}
            </div>
          </motion.div>

          {/* کارت‌ها */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{delay: 0.1}} className={`p-6 rounded-3xl border ${cardBg}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2"><FiCreditCard /> {t('profilePage.myCards', 'کارت‌های بانکی')}</h2>
              <button onClick={() => setShowCardForm(!showCardForm)} className="text-[#FFD700] flex items-center gap-1 text-sm">
                <FiPlus /> {t('profilePage.add', 'افزودن')}
              </button>
            </div>
            {showCardForm && (
              <form onSubmit={handleAddCard} className="mb-4 space-y-2">
                <input type="text" placeholder={t('profilePage.cardPlaceholder', 'شماره کارت (۱۶ رقم)')} value={newCard.number} onChange={e => setNewCard({...newCard, number: e.target.value.replace(/\D/g, '')})} maxLength="16" className={`w-full p-2 rounded-lg ${isDark ? 'bg-black/30' : 'bg-gray-100'} border ${isDark ? 'border-white/10' : 'border-gray-300'}`} required />
                <select value={newCard.brand} onChange={e => setNewCard({...newCard, brand: e.target.value})} className={`w-full p-2 rounded-lg ${isDark ? 'bg-black/30' : 'bg-gray-100'} border ${isDark ? 'border-white/10' : 'border-gray-300'}`}>
                  <option value="Visa">{t('profilePage.visa', 'ویزا (Visa)')}</option>
                  <option value="Mastercard">{t('profilePage.mastercard', 'مسترکارت (Mastercard)')}</option>
                </select>
                <button type="submit" className="w-full bg-[#FFD700] text-black py-2 rounded-lg font-bold">{t('profilePage.saveCard', 'ذخیره کارت')}</button>
              </form>
            )}
            <div className="space-y-3">
              {user.paymentMethods?.length > 0 ? user.paymentMethods.map((card, i) => (
                <div key={i} className={`p-3 rounded-xl flex justify-between items-center ${isDark ? 'bg-black/20' : 'bg-gray-50'}`}>
                  <div>
                    <p className="font-bold text-sm">{card.brand}</p>
                    <p className={`text-xs ${mutedClass}`}>**** **** **** {card.last4}</p>
                  </div>
                  <FiCreditCard className="text-2xl text-gray-500" />
                </div>
              )) : <p className={`text-sm ${mutedClass}`}>{t('profilePage.noCards', 'هنوز کارتی ثبت نکرده‌اید.')}</p>}
            </div>
          </motion.div>

          {/* تاریخچه ورود */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{delay: 0.2}} className={`p-6 rounded-3xl border ${cardBg} md:col-span-2`}>
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4"><FiClock /> {t('profilePage.loginHistory', 'تاریخچه ورود')}</h2>
            <div className="space-y-2">
              {user.loginHistory?.length > 0 ? user.loginHistory.map((log, i) => (
                <div key={i} className={`flex justify-between items-center p-2 rounded-lg text-sm ${isDark ? 'bg-black/20' : 'bg-gray-50'}`}>
                  <span>{log.ip || 'Unknown'}</span>
                  <span className={mutedClass}>{new Date(log.date).toLocaleString()}</span>
                </div>
              )) : <p className={`text-sm ${mutedClass}`}>{t('profilePage.noHistory', 'تاریخچه‌ای ثبت نشده است.')}</p>}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}