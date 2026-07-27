import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMapPin, FiCreditCard, FiPlus, FiLogOut, FiClock,
  FiUser, FiGrid, FiShield, FiChevronLeft, FiShoppingBag,
  FiStar, FiPackage,
} from 'react-icons/fi';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function Profile() {
  // ✅ اضافه شدن i18n برای تشخیص زبان فعلی
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [bestDishes, setBestDishes] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ title: '', address: '' });
  const [newCard, setNewCard] = useState({ number: '', brand: 'Visa' });

  const token = localStorage.getItem('customerToken');

  const todaysQuoteKey = `profilePage.quote${(new Date().getDate() % 8) + 1}`;
  const todaysQuote = t(todaysQuoteKey, 'Enjoy your meal!');

  useEffect(() => {
    if (!token) { navigate('/'); return; }
    fetchProfile();
    fetchOrders();
    fetchBestOfWeek();
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

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/customer/orders`, { headers: { Authorization: `Bearer ${token}` } });
      setOrders(res.data.orders || []);
    } catch (err) { setOrders([]); }
  };

  const fetchBestOfWeek = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/dishes/best-of-week`);
      setBestDishes(res.data.dishes || []);
    } catch (err) { setBestDishes([]); }
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

  if (!user) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#0F0F0F] text-white' : 'bg-[#FFFBF5] text-black'}`}>
        <div className="w-10 h-10 border-2 border-[#FFD700] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const cardBg = isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200';
  const textClass = isDark ? 'text-white' : 'text-black';
  const mutedClass = isDark ? 'text-gray-400' : 'text-gray-500';
  const accentText = isDark ? 'text-[#FFD700]' : 'text-[#D32F2F]';
  const accentBg = isDark ? 'bg-[#FFD700]' : 'bg-[#D32F2F]';
  const softBg = isDark ? 'bg-black/20' : 'bg-gray-50';
  const inputBg = `${isDark ? 'bg-black/30 border-white/10' : 'bg-gray-100 border-gray-300'} border`;

  const tabs = [
    { key: 'overview', label: t('profilePage.overview', 'پیشخوان'), icon: FiGrid },
    { key: 'orders', label: t('profilePage.myOrders', 'سفارشات من'), icon: FiShoppingBag },
    { key: 'addresses', label: t('profilePage.myAddresses', 'آدرس‌های من'), icon: FiMapPin },
    { key: 'cards', label: t('profilePage.myCards', 'کارت‌های بانکی'), icon: FiCreditCard },
    { key: 'security', label: t('profilePage.security', 'امنیت و ورود'), icon: FiShield },
  ];

  const statCards = [
    { label: t('profilePage.myOrders', 'سفارشات من'), value: orders.length, icon: FiShoppingBag },
    { label: t('profilePage.myAddresses', 'آدرس‌های من'), value: user.addresses?.length || 0, icon: FiMapPin },
    { label: t('profilePage.myCards', 'کارت‌های بانکی'), value: user.paymentMethods?.length || 0, icon: FiCreditCard },
  ];

  const ORDER_STATUS_COLORS = {
    pending: 'text-yellow-500 bg-yellow-500/10',
    confirmed: 'text-blue-500 bg-blue-500/10',
    preparing: 'text-orange-500 bg-orange-500/10',
    ready: 'text-purple-500 bg-purple-500/10',
    delivered: 'text-green-500 bg-green-500/10',
    cancelled: 'text-red-500 bg-red-500/10',
  };

  const BestOfWeekSection = () => (
    bestDishes.length > 0 && (
      <div className={`p-6 rounded-3xl border mb-6 ${cardBg}`}>
        <div className="flex items-center gap-2 mb-5">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isDark ? 'bg-[#FFD700]/10' : 'bg-[#D32F2F]/10'}`}>
            <FiStar className={accentText} size={16} />
          </div>
          <h3 className="font-bold">{t('profilePage.bestOfWeek', 'پیشنهاد ویژه این هفته')}</h3>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {bestDishes.map((dish, i) => (
            <motion.div
              key={dish._id || i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-2xl overflow-hidden border ${isDark ? 'border-white/10' : 'border-gray-200'} ${softBg}`}
            >
              <div className="h-28 w-full overflow-hidden bg-black/10">
                {dish.images?.[0] ? (
                  // ✅ اصلاح آدرس عکس و alt
                  <img src={`${API_URL}${dish.images[0]}`} alt={dish.name?.[lang] || dish.name?.fa} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FiPackage className={mutedClass} size={26} />
                  </div>
                )}
              </div>
              <div className="p-3">
                {/* ✅ نمایش نام غذا به زبان فعلی سایت */}
                <p className="font-bold text-sm truncate">{dish.name?.[lang] || dish.name?.fa || dish.name?.en}</p>
                {dish.price && <p className={`text-xs mt-1 ${accentText} font-bold`}>{dish.price} QR</p>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    )
  );

  return (
    <div className={`min-h-screen pt-24 pb-20 ${isDark ? 'bg-[#0F0F0F]' : 'bg-[#FFFBF5]'} ${textClass}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">

          {/* سایدبار */}
          <motion.aside initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className={`rounded-3xl border p-6 h-fit lg:sticky lg:top-28 ${cardBg}`}>
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-dashed border-gray-500/20">
              <div className={`w-14 h-14 shrink-0 rounded-2xl ${accentBg} flex items-center justify-center text-xl font-black text-black`}>
                {user.name?.charAt(0) || 'U'}
              </div>
              <div className="min-w-0">
                <h1 className="font-bold truncate">{user.name}</h1>
                <p className={`text-xs truncate ${mutedClass}`}>{user.email || user.phone}</p>
              </div>
            </div>
            <nav className="space-y-1">
              {tabs.map(({ key, label, icon: Icon }) => (
                <button key={key} onClick={() => setActiveTab(key)} className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === key ? `${accentBg} text-black font-bold` : `${mutedClass} hover:${isDark ? 'bg-white/5' : 'bg-black/5'}`}`}>
                  <span className="flex items-center gap-2.5"><Icon size={17} /> {label}</span>
                  {activeTab === key && <FiChevronLeft size={15} />}
                </button>
              ))}
            </nav>
            <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-3 mt-4 rounded-xl text-sm font-medium text-red-500 bg-red-500/10 hover:bg-red-500/20 transition-colors">
              <FiLogOut size={17} /> {t('profilePage.logout', 'خروج از حساب')}
            </button>
          </motion.aside>

          {/* محتوای اصلی */}
          <div>
            <AnimatePresence mode="wait">

              {activeTab === 'overview' && (
                <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className={`p-5 rounded-2xl mb-6 flex items-center gap-3 border ${isDark ? 'border-[#FFD700]/30' : 'border-[#D32F2F]/30'}`} style={{ background: isDark ? 'rgba(255,215,0,0.08)' : 'rgba(211,47,47,0.06)' }}>
                    <span className="text-2xl">✨</span>
                    <div>
                      <p className="font-bold text-sm mb-0.5">{t('profilePage.welcomeBack', 'خوش اومدی')}، {user.name?.split(' ')[0]}</p>
                      <p className={`text-sm ${mutedClass}`}>{todaysQuote}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    {statCards.map((s, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={`p-5 rounded-2xl border ${cardBg} flex items-center justify-between`}>
                        <div>
                          <p className={`text-xs mb-1 ${mutedClass}`}>{s.label}</p>
                          <p className="text-2xl font-black">{s.value}</p>
                        </div>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-[#FFD700]/10' : 'bg-[#D32F2F]/10'}`}>
                          <s.icon className={accentText} size={18} />
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <BestOfWeekSection />

                  <div className={`p-6 rounded-3xl border ${cardBg}`}>
                    <h3 className="font-bold mb-4 flex items-center gap-2"><FiClock /> {t('profilePage.recentLogins', 'آخرین ورودها')}</h3>
                    <div className="space-y-2">
                      {user.loginHistory?.length > 0 ? user.loginHistory.slice(0, 3).map((log, i) => (
                        <div key={i} className={`flex justify-between items-center p-3 rounded-xl text-sm ${softBg}`}>
                          <span className="font-mono">{log.ip || 'Unknown'}</span>
                          <span className={mutedClass}>{new Date(log.date).toLocaleString('fa-IR')}</span>
                        </div>
                      )) : <p className={`text-sm ${mutedClass}`}>{t('profilePage.noHistory', 'تاریخچه‌ای ثبت نشده است.')}</p>}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'orders' && (
                <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <BestOfWeekSection />
                  <div className={`p-6 rounded-3xl border ${cardBg}`}>
                    <h2 className="text-lg font-bold flex items-center gap-2 mb-5"><FiShoppingBag /> {t('profilePage.myOrders', 'سفارشات من')}</h2>
                    {orders.length > 0 ? (
                      <div className="space-y-3">
                        {orders.map((order) => (
                          <div key={order._id} className={`p-4 rounded-2xl ${softBg}`}>
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${ORDER_STATUS_COLORS[order.status] || 'text-gray-400 bg-gray-500/10'}`}>
                                {t(`orderStatus.${order.status}`, order.status)}
                              </span>
                              <span className={`text-xs ${mutedClass}`}>{new Date(order.createdAt).toLocaleDateString('fa-IR')}</span>
                            </div>
                            <div className="space-y-1 mb-3">
                              {order.items?.map((item, idx) => (
                                <p key={idx} className="text-sm">
                                  {/* ✅ نمایش نام آیتم‌های سفارش به زبان فعلی سایت */}
                                  {item.dish?.name?.[lang] || item.dish?.name?.fa || item.dish?.name?.en || 'Item'} <span className={mutedClass}>× {item.quantity}</span>
                                </p>
                              ))}
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t border-dashed border-gray-500/20">
                              <span className={`text-xs ${mutedClass}`}>{t('profilePage.total', 'مبلغ کل')}</span>
                              <span className={`font-bold ${accentText}`}>{order.totalPrice?.toLocaleString('fa-IR')} QR</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-14">
                        <FiShoppingBag className={`mx-auto mb-3 ${mutedClass}`} size={32} />
                        <p className={`text-sm mb-4 ${mutedClass}`}>{t('profilePage.noOrders', 'هنوز سفارشی ثبت نکرده‌اید.')}</p>
                        <button onClick={() => navigate('/menu')} className={`${accentBg} text-black font-bold px-5 py-2.5 rounded-full text-sm`}>
                          {t('profilePage.orderNow', 'مشاهده منو و ثبت سفارش')}
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'addresses' && (
                <motion.div key="addresses" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className={`p-6 rounded-3xl border ${cardBg}`}>
                  <div className="flex justify-between items-center mb-5">
                    <h2 className="text-lg font-bold flex items-center gap-2"><FiMapPin /> {t('profilePage.myAddresses', 'آدرس‌های من')}</h2>
                    <button onClick={() => setShowAddressForm(!showAddressForm)} className={`flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-full ${accentBg} text-black`}>
                      <FiPlus size={15} /> {t('profilePage.add', 'افزودن')}
                    </button>
                  </div>
                  <AnimatePresence>
                    {showAddressForm && (
                      <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} onSubmit={handleAddAddress} className="mb-5 space-y-3 overflow-hidden">
                        <input type="text" placeholder={t('profilePage.titlePlaceholder', 'عنوان')} value={newAddress.title} onChange={e => setNewAddress({ ...newAddress, title: e.target.value })} className={`w-full p-3 rounded-xl ${inputBg}`} required />
                        <textarea placeholder={t('profilePage.addressPlaceholder', 'آدرس کامل')} value={newAddress.address} onChange={e => setNewAddress({ ...newAddress, address: e.target.value })} rows="2" className={`w-full p-3 rounded-xl ${inputBg}`} required />
                        <button type="submit" className={`w-full ${accentBg} text-black py-3 rounded-xl font-bold`}>{t('profilePage.saveAddress', 'ذخیره آدرس')}</button>
                      </motion.form>
                    )}
                  </AnimatePresence>
                  <div className="space-y-3">
                    {user.addresses?.length > 0 ? user.addresses.map((addr, i) => (
                      <div key={i} className={`p-4 rounded-2xl flex items-start justify-between gap-3 ${softBg}`}>
                        <div>
                          <p className="font-bold text-sm mb-1">{addr.title}</p>
                          <p className={`text-xs ${mutedClass}`}>{addr.address}</p>
                        </div>
                        <FiMapPin className={`shrink-0 ${mutedClass}`} />
                      </div>
                    )) : (
                      <div className="text-center py-10">
                        <FiMapPin className={`mx-auto mb-2 ${mutedClass}`} size={28} />
                        <p className={`text-sm ${mutedClass}`}>{t('profilePage.noAddresses', 'هنوز آدرسی ثبت نکرده‌اید.')}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'cards' && (
                <motion.div key="cards" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className={`p-6 rounded-3xl border ${cardBg}`}>
                  <div className="flex justify-between items-center mb-5">
                    <h2 className="text-lg font-bold flex items-center gap-2"><FiCreditCard /> {t('profilePage.myCards', 'کارت‌های بانکی')}</h2>
                    <button onClick={() => setShowCardForm(!showCardForm)} className={`flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-full ${accentBg} text-black`}>
                      <FiPlus size={15} /> {t('profilePage.add', 'افزودن')}
                    </button>
                  </div>
                  <AnimatePresence>
                    {showCardForm && (
                      <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} onSubmit={handleAddCard} className="mb-5 space-y-3 overflow-hidden">
                        <input type="text" placeholder={t('profilePage.cardPlaceholder', 'شماره کارت (۱۶ رقم)')} value={newCard.number} onChange={e => setNewCard({ ...newCard, number: e.target.value.replace(/\D/g, '') })} maxLength="16" className={`w-full p-3 rounded-xl ${inputBg}`} required />
                        <select value={newCard.brand} onChange={e => setNewCard({ ...newCard, brand: e.target.value })} className={`w-full p-3 rounded-xl ${inputBg}`}>
                          <option value="Visa">{t('profilePage.visa', 'ویزا')}</option>
                          <option value="Mastercard">{t('profilePage.mastercard', 'مسترکارت')}</option>
                        </select>
                        <button type="submit" className={`w-full ${accentBg} text-black py-3 rounded-xl font-bold`}>{t('profilePage.saveCard', 'ذخیره کارت')}</button>
                      </motion.form>
                    )}
                  </AnimatePresence>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {user.paymentMethods?.length > 0 ? user.paymentMethods.map((card, i) => (
                      <div key={i} className={`p-5 rounded-2xl relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-100 to-gray-200'} border ${isDark ? 'border-white/10' : 'border-gray-300'}`}>
                        <FiCreditCard className={`absolute -left-2 -bottom-2 opacity-10`} size={70} />
                        <p className={`text-xs mb-4 ${mutedClass}`}>{card.brand}</p>
                        <p className="font-mono text-lg tracking-widest">•••• •••• •••• {card.last4}</p>
                      </div>
                    )) : (
                      <div className="sm:col-span-2 text-center py-10">
                        <FiCreditCard className={`mx-auto mb-2 ${mutedClass}`} size={28} />
                        <p className={`text-sm ${mutedClass}`}>{t('profilePage.noCards', 'هنوز کارتی ثبت نکرده‌اید.')}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'security' && (
                <motion.div key="security" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className={`p-6 rounded-3xl border ${cardBg}`}>
                  <h2 className="text-lg font-bold flex items-center gap-2 mb-5"><FiShield /> {t('profilePage.security', 'امنیت و ورود')}</h2>
                  <div className={`p-4 rounded-2xl mb-5 flex items-center gap-3 ${softBg}`}>
                    <FiUser className={accentText} />
                    <div>
                      <p className="text-sm font-bold">{user.name}</p>
                      <p className={`text-xs ${mutedClass}`}>{user.email || user.phone}</p>
                    </div>
                  </div>
                  <h3 className="font-bold text-sm mb-3 flex items-center gap-2"><FiClock /> {t('profilePage.loginHistory', 'تاریخچه ورود')}</h3>
                  <div className="space-y-2">
                    {user.loginHistory?.length > 0 ? user.loginHistory.map((log, i) => (
                      <div key={i} className={`flex justify-between items-center p-3 rounded-xl text-sm ${softBg}`}>
                        <span className="font-mono">{log.ip || 'Unknown'}</span>
                        <span className={mutedClass}>{new Date(log.date).toLocaleString('fa-IR')}</span>
                      </div>
                    )) : <p className={`text-sm ${mutedClass}`}>{t('profilePage.noHistory', 'تاریخچه‌ای ثبت نشده است.')}</p>}
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}