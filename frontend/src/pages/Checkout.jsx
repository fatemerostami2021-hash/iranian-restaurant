import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiUser, FiPhone, FiMapPin, FiCheckCircle, FiTruck, FiCreditCard, 
  FiShoppingBag, FiHome, FiLogIn, FiUserCheck
} from 'react-icons/fi';
import axios from 'axios';
import AuthModal from '../components/ui/AuthModal';

const API_URL = import.meta.env.VITE_API_URL || '';

// ===== کمک‌کننده: گرفتن عکس غذا (مشابه dishService.js) =====
const CATEGORY_IMAGE_MAP = {
  breakfast: 'breakfast',
  main: 'main',
  combo: 'combo',
  appetizer: 'appetizer',
  drinks: 'drinks',
};

function getDishImageUrl(item) {
  if (item.images && item.images.length > 0 && item.images[0]) {
    const img = item.images[0];
    if (img.startsWith('http')) return img;
    return img.startsWith('/') ? img : `/${img}`;
  }
  const folder = CATEGORY_IMAGE_MAP[item.category] || 'main';
  const key = item.code || item._id;
  return `/images/dishes/${folder}/${key}.png`;
}

export default function Checkout() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  const lang = i18n.language;

  const [step, setStep] = useState(1);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', building: '', street: '', zone: '',
    city: 'Doha', country: 'Qatar',
    deliveryMethod: 'delivery', deliveryTime: 'asap',
    tableNumber: '', notes: '', acceptTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const bgClass = isDark ? 'bg-[#1C1C1C]' : 'bg-[#FFF8F0]';
  const textColor = isDark ? 'text-[#F7F0E6]' : 'text-[#1A1A1A]';
  const mutedColor = isDark ? 'text-gray-400' : 'text-[#666666]';
  const borderClass = isDark ? 'border-[#3E2723]' : 'border-[#E8DDD0]';
  const inputBg = isDark ? 'bg-[#2D2D2D]' : 'bg-white';
  const accentBg = isDark ? 'bg-[#FFD700] text-black' : 'bg-[#D32F2F] text-white';

  const deliveryFee = totalPrice >= 50 ? 0 : 10;
  const grandTotal = totalPrice + deliveryFee;
  const isLoggedIn = !!localStorage.getItem('customerToken');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = t('checkout.required');
      if (!formData.lastName.trim()) newErrors.lastName = t('checkout.required');
      if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = t('checkout.invalidEmail');
      if (!formData.phone.trim() || formData.phone.length < 8) newErrors.phone = t('checkout.invalidPhone');
    }
    if (step === 2 && formData.deliveryMethod === 'delivery') {
      if (!formData.address.trim()) newErrors.address = t('checkout.required');
      if (!formData.zone.trim()) newErrors.zone = t('checkout.required');
    }
    if (step === 3 && !formData.acceptTerms) newErrors.acceptTerms = t('checkout.acceptTermsRequired');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => { if (validateStep()) { setStep(step + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); } };
  const prevStep = () => { setStep(step - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    const customerToken = localStorage.getItem('customerToken');
    setIsSubmitting(true);

    const orderPayload = {
      customerName: `${formData.firstName} ${formData.lastName}`,
      phone: formData.phone,
      address: formData.deliveryMethod === 'delivery' ? `${formData.address}, Zone ${formData.zone}, Building ${formData.building}` : '',
      tableNumber: formData.tableNumber,
      notes: formData.notes,
      items: cart.map((item) => ({ dish: item._id, quantity: item.quantity, priceAtOrder: item.price })),
      totalPrice: grandTotal,
      isGuest: !customerToken,
    };

    try {
      const headers = customerToken ? { Authorization: `Bearer ${customerToken}` } : {};
      await axios.post(`${API_URL}/api/orders`, orderPayload, { headers });

      const itemsList = cart.map((item) => {
        const name = item.name?.[lang] || item.name?.en || '';
        return `- ${name} x${item.quantity} = ${(item.price * item.quantity).toFixed(1)} QR`;
      }).join('\n');

      const message = `Order - Kabab Dagh Nan Dagh\n\nName: ${formData.firstName} ${formData.lastName}\nPhone: ${formData.phone}\n${formData.deliveryMethod === 'delivery' ? `Address: ${formData.address}, ${formData.zone}` : 'Pickup at restaurant'}\n\n${itemsList}\n\nTotal: ${grandTotal.toFixed(1)} QR\nNotes: ${formData.notes || 'None'}`;
      window.open(`https://wa.me/97433000157?text=${encodeURIComponent(message)}`, '_blank');

      setIsSuccess(true);
      clearCart();
    } catch (err) {
      setErrors({ submit: t('checkout.submitError') || 'Order failed, please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, label: t('checkout.step1'), icon: FiUser },
    { number: 2, label: t('checkout.step2'), icon: FiMapPin },
    { number: 3, label: t('checkout.step3'), icon: FiCheckCircle },
  ];

  if (cart.length === 0 && !isSuccess) {
    return (
      <section className={`min-h-screen pt-24 max-w-4xl mx-auto px-4 py-20 ${bgClass}`}>
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className={`text-2xl font-bold ${textColor}`}>{t('cart.empty')}</h2>
          <Link to="/menu" className="inline-block mt-4 px-6 py-3 bg-[#FFD700] text-black font-bold rounded-full hover:bg-[#FFC700] transition-colors text-lg shadow-lg">
            {t('menu.title')}
          </Link>
        </div>
      </section>
    );
  }

  if (isSuccess) {
    return (
      <section className={`min-h-screen pt-24 max-w-2xl mx-auto px-4 py-20 ${bgClass}`}>
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
            <FiCheckCircle className="text-green-500" size={48} />
          </div>
          <h2 className={`text-3xl font-bold ${textColor} mb-4`}>{t('checkout.success')}</h2>
          <p className={`${mutedColor} text-lg mb-8`}>{t('checkout.successMessage')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/menu" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#FFD700] text-black font-bold rounded-full hover:bg-[#FFC700] transition-colors text-lg shadow-lg">
              <FiShoppingBag size={20} /> {t('cart.backToMenu')}
            </Link>
            <Link to="/" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-200 dark:bg-gray-700 text-black dark:text-white font-bold rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-lg shadow-lg">
              <FiHome size={20} /> {t('checkout.backToHome')}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`min-h-screen pt-24 max-w-6xl mx-auto px-4 py-12 ${bgClass} transition-colors duration-300`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className={`text-3xl font-bold ${textColor} mb-2`}>{t('checkout.title')}</h1>
          <p className={`${mutedColor} text-sm mb-6`}>{t('checkout.subtitle')}</p>

          {/* ===== نوار پیشرفت ===== */}
          <div className="flex items-center gap-2 mb-8">
            {steps.map((s, i) => (
              <div key={s.number} className="flex items-center flex-1">
                <div className={`flex items-center gap-2 ${i > 0 ? 'flex-1' : ''}`}>
                  {i > 0 && <div className={`flex-1 h-0.5 ${step > s.number ? 'bg-[#FFD700]' : 'bg-gray-300 dark:bg-gray-700'}`} />}
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${step >= s.number ? 'bg-[#FFD700] text-black' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'} ${step === s.number ? 'ring-2 ring-[#FFD700]/50 ring-offset-2' : ''}`}>
                    <s.icon size={16} />
                    <span className="hidden sm:inline">{s.label}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                {/* ===== دو مسیر: مهمان / لاگین ===== */}
                {!isLoggedIn && (
                  <div className={`p-4 rounded-2xl border-2 border-dashed ${isDark ? 'border-[#FFD700]/30 bg-[#FFD700]/5' : 'border-[#D32F2F]/20 bg-[#D32F2F]/5'} space-y-3`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${isDark ? 'bg-[#FFD700]/20' : 'bg-[#D32F2F]/10'}`}>
                        <FiLogIn size={20} className={isDark ? 'text-[#FFD700]' : 'text-[#D32F2F]'} />
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-bold ${textColor}`}>
                          {t('checkout.guestTitle') || 'Order as Guest'}
                        </p>
                        <p className={`text-xs ${mutedColor}`}>
                          {t('checkout.guestDesc') || 'No account needed. Fill the form below.'}
                        </p>
                      </div>
                    </div>
                    <div className={`h-px ${isDark ? 'bg-white/10' : 'bg-black/5'}`} />
                    <button
                      type="button"
                      onClick={() => setIsAuthOpen(true)}
                      className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.01] ${isDark ? 'bg-white/10 hover:bg-white/20 text-[#FFD700] border border-[#FFD700]/30' : 'bg-white hover:bg-gray-50 text-[#D32F2F] border border-[#D32F2F]/30'}`}
                    >
                      <FiUserCheck size={16} />
                      {t('checkout.loginBtn') || 'Login for faster checkout'}
                    </button>
                  </div>
                )}

                {isLoggedIn && (
                  <div className={`p-4 rounded-2xl border ${isDark ? 'border-green-500/30 bg-green-500/10' : 'border-green-500/20 bg-green-50'} flex items-center gap-3`}>
                    <FiUserCheck size={20} className="text-green-500" />
                    <div>
                      <p className={`text-sm font-bold ${textColor}`}>
                        {t('checkout.loggedIn') || 'You are logged in'}
                      </p>
                      <p className={`text-xs ${mutedColor}`}>
                        {t('checkout.loggedInDesc') || 'Your information will be saved for future orders'}
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${textColor} mb-1`}>{t('checkout.firstName')} <span className="text-red-500">*</span></label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className={`w-full px-4 py-3 rounded-xl border ${borderClass} ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-[#FFD700]/30 ${errors.firstName ? 'border-red-500' : ''}`} placeholder={t('checkout.firstNamePlaceholder')} />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${textColor} mb-1`}>{t('checkout.lastName')} <span className="text-red-500">*</span></label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className={`w-full px-4 py-3 rounded-xl border ${borderClass} ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-[#FFD700]/30 ${errors.lastName ? 'border-red-500' : ''}`} placeholder={t('checkout.lastNamePlaceholder')} />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${textColor} mb-1`}>{t('checkout.email')} <span className="text-red-500">*</span></label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className={`w-full px-4 py-3 rounded-xl border ${borderClass} ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-[#FFD700]/30 ${errors.email ? 'border-red-500' : ''}`} placeholder={t('checkout.emailPlaceholder')} />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className={`block text-sm font-medium ${textColor} mb-1`}>{t('checkout.phone')} <span className="text-red-500">*</span></label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={`w-full px-4 py-3 rounded-xl border ${borderClass} ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-[#FFD700]/30 ${errors.phone ? 'border-red-500' : ''}`} placeholder={t('checkout.phonePlaceholder')} />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
                <button type="button" onClick={nextStep} className="w-full py-3.5 bg-[#FFD700] hover:bg-[#FFC700] text-black font-bold text-lg rounded-2xl transition-all duration-300 hover:scale-[1.01] shadow-lg shadow-[#FFD700]/30">
                  {t('checkout.continue')}
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${textColor} mb-1`}>{t('checkout.deliveryMethod')} <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => setFormData(prev => ({ ...prev, deliveryMethod: 'delivery' }))} className={`p-4 rounded-xl border-2 transition-all duration-300 ${formData.deliveryMethod === 'delivery' ? 'border-[#FFD700] bg-[#FFD700]/10' : 'border-gray-300 dark:border-gray-700'}`}>
                      <FiTruck size={24} className={`mx-auto mb-2 ${formData.deliveryMethod === 'delivery' ? 'text-[#FFD700]' : mutedColor}`} />
                      <span className={`text-sm font-medium ${textColor}`}>{t('checkout.delivery')}</span>
                    </button>
                    <button type="button" onClick={() => setFormData(prev => ({ ...prev, deliveryMethod: 'pickup' }))} className={`p-4 rounded-xl border-2 transition-all duration-300 ${formData.deliveryMethod === 'pickup' ? 'border-[#FFD700] bg-[#FFD700]/10' : 'border-gray-300 dark:border-gray-700'}`}>
                      <FiMapPin size={24} className={`mx-auto mb-2 ${formData.deliveryMethod === 'pickup' ? 'text-[#FFD700]' : mutedColor}`} />
                      <span className={`text-sm font-medium ${textColor}`}>{t('checkout.pickup')}</span>
                    </button>
                  </div>
                </div>

                {formData.deliveryMethod === 'delivery' && (
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium ${textColor} mb-1`}>{t('checkout.address')} <span className="text-red-500">*</span></label>
                      <textarea name="address" value={formData.address} onChange={handleChange} rows="2" className={`w-full px-4 py-3 rounded-xl border ${borderClass} ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-[#FFD700]/30 ${errors.address ? 'border-red-500' : ''}`} placeholder={t('checkout.addressPlaceholder')} />
                      {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium ${textColor} mb-1`}>{t('checkout.zone')}</label>
                        <input type="text" name="zone" value={formData.zone} onChange={handleChange} className={`w-full px-4 py-3 rounded-xl border ${borderClass} ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-[#FFD700]/30 ${errors.zone ? 'border-red-500' : ''}`} placeholder={t('checkout.zonePlaceholder')} />
                        {errors.zone && <p className="text-red-500 text-xs mt-1">{errors.zone}</p>}
                      </div>
                      <div>
                        <label className={`block text-sm font-medium ${textColor} mb-1`}>{t('checkout.building')}</label>
                        <input type="text" name="building" value={formData.building} onChange={handleChange} className={`w-full px-4 py-3 rounded-xl border ${borderClass} ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-[#FFD700]/30`} placeholder={t('checkout.buildingPlaceholder')} />
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${textColor} mb-1`}>{t('checkout.deliveryTime')}</label>
                    <select name="deliveryTime" value={formData.deliveryTime} onChange={handleChange} className={`w-full px-4 py-3 rounded-xl border ${borderClass} ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-[#FFD700]/30`}>
                      <option value="asap">{t('checkout.asap')}</option>
                      <option value="30">30 {t('checkout.minutes')}</option>
                      <option value="60">60 {t('checkout.minutes')}</option>
                      <option value="90">90 {t('checkout.minutes')}</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${textColor} mb-1`}>{t('checkout.tableNumber')}</label>
                    <input type="text" name="tableNumber" value={formData.tableNumber} onChange={handleChange} className={`w-full px-4 py-3 rounded-xl border ${borderClass} ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-[#FFD700]/30`} placeholder={t('checkout.tableNumberPlaceholder')} />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textColor} mb-1`}>{t('checkout.notes')}</label>
                  <textarea name="notes" value={formData.notes} onChange={handleChange} rows="2" className={`w-full px-4 py-3 rounded-xl border ${borderClass} ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-[#FFD700]/30`} placeholder={t('checkout.notesPlaceholder')} />
                </div>

                <div className="flex gap-4">
                  <button type="button" onClick={prevStep} className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300">{t('checkout.back')}</button>
                  <button type="button" onClick={nextStep} className="flex-1 py-3.5 bg-[#FFD700] hover:bg-[#FFC700] text-black font-bold text-lg rounded-2xl transition-all duration-300 hover:scale-[1.01] shadow-lg shadow-[#FFD700]/30">{t('checkout.continue')}</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className={`${inputBg} rounded-2xl p-4 border ${borderClass}`}>
                  <h3 className={`font-bold ${textColor} mb-3`}>{t('checkout.summary')}</h3>
                  {cart.map((item) => {
                    const itemName = item.name?.[lang] || item.name?.en || '';
                    const imageUrl = getDishImageUrl(item);
                    return (
                      <div key={item._id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                        <img
                          src={imageUrl}
                          alt={itemName}
                          className="w-14 h-14 rounded-xl object-cover border border-gray-600 shrink-0"
                          onError={(e) => { e.target.src = '/images/dishes/placeholder.svg'; }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${textColor}`}>{itemName}</p>
                          <p className={`text-xs ${mutedColor}`}>{item.price} QR × {item.quantity}</p>
                        </div>
                        <span className={`text-sm font-bold ${textColor} shrink-0`}>{(item.price * item.quantity).toFixed(1)} QR</span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center gap-3 p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                  <FiCreditCard className="text-green-500" size={24} />
                  <div>
                    <p className={`text-sm font-medium ${textColor}`}>{t('checkout.securePayment')}</p>
                    <p className={`text-xs ${mutedColor}`}>{t('checkout.securePaymentDesc')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <input type="checkbox" name="acceptTerms" checked={formData.acceptTerms} onChange={handleChange} className="mt-1 w-5 h-5 accent-[#FFD700]" />
                  <div>
                    <label className={`text-sm ${textColor}`}>{t('checkout.acceptTerms')} <span className="text-red-500">*</span></label>
                    <p className={`text-xs ${mutedColor}`}>{t('checkout.acceptTermsDesc')}</p>
                    {errors.acceptTerms && <p className="text-red-500 text-xs mt-1">{errors.acceptTerms}</p>}
                  </div>
                </div>

                {errors.submit && <p className="text-red-500 text-sm text-center">{errors.submit}</p>}

                <div className="flex gap-4">
                  <button type="button" onClick={prevStep} className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300">{t('checkout.back')}</button>
                  <button type="submit" disabled={isSubmitting} className={`flex-1 py-3.5 bg-[#FFD700] hover:bg-[#FFC700] text-black font-bold text-lg rounded-2xl transition-all duration-300 hover:scale-[1.01] shadow-lg shadow-[#FFD700]/30 flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}>
                    {isSubmitting ? t('checkout.submitting') : t('checkout.submit')}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* ===== سایدبار خلاصه سفارش ===== */}
        <div className="lg:col-span-1">
          <div className={`sticky top-24 ${inputBg} rounded-2xl p-6 border ${borderClass} shadow-lg`}>
            <h2 className={`text-xl font-bold ${textColor} mb-4`}>{t('cart.title')}</h2>
            <div className="space-y-3 max-h-72 overflow-y-auto mb-4 pr-1">
              {cart.map((item) => {
                const itemName = item.name?.[lang] || item.name?.en || '';
                const imageUrl = getDishImageUrl(item);
                return (
                  <div key={item._id} className="flex items-center gap-3">
                    <img
                      src={imageUrl}
                      alt={itemName}
                      className="w-12 h-12 rounded-lg object-cover border border-gray-600 shrink-0"
                      onError={(e) => { e.target.src = '/images/dishes/placeholder.svg'; }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm truncate ${textColor}`}>{itemName}</p>
                      <p className={`text-xs ${mutedColor}`}>x{item.quantity}</p>
                    </div>
                    <span className={`text-sm font-bold ${textColor} shrink-0`}>{(item.price * item.quantity).toFixed(1)} QR</span>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-white/10 pt-4 space-y-2">
              <div className="flex justify-between text-sm"><span className={mutedColor}>{t('cart.subtotal')}</span><span className={textColor}>{totalPrice.toFixed(1)} QR</span></div>
              <div className="flex justify-between text-sm"><span className={mutedColor}>{t('cart.delivery')}</span><span className={textColor}>{deliveryFee === 0 ? t('cart.freeDelivery') || 'Free' : `${deliveryFee} QR`}</span></div>
              <div className="flex justify-between pt-2 border-t border-white/10"><span className={`text-base font-bold ${textColor}`}>{t('cart.total')}</span><span className="text-lg font-black text-[#D32F2F] dark:text-[#FFD700]">{grandTotal.toFixed(1)} QR</span></div>
              <p className={`text-[10px] ${mutedColor} text-center opacity-50`}>{t('cart.noTax')}</p>
            </div>
            <Link to="/menu" className="block text-center mt-4 text-sm text-[#FFD700] hover:underline">{t('cart.backToMenu')}</Link>
          </div>
        </div>
      </div>

      {/* ✅ پنجره لاگین اختیاری */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onLoginSuccess={(token, user) => {
          localStorage.setItem('customerToken', token);
          setIsAuthOpen(false);
        }} 
      />
    </section>
  );
}