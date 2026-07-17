import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiUser, FiPhone, FiMapPin, FiMail, FiClock, 
  FiCalendar, FiMessageSquare, FiCheckCircle,
  FiTruck, FiCreditCard
} from 'react-icons/fi';

export default function Checkout() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  const lang = i18n.language;

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    building: '',
    street: '',
    zone: '',
    city: 'Doha',
    country: 'Qatar',
    deliveryMethod: 'delivery',
    deliveryTime: 'asap',
    tableNumber: '',
    notes: '',
    acceptTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const bgClass = isDark ? 'bg-[#1C1C1C]' : 'bg-[#FFF8F0]';
  const textColor = isDark ? 'text-[#F7F0E6]' : 'text-[#1A1A1A]';
  const mutedColor = isDark ? 'text-gray-400' : 'text-[#666666]';
  const borderClass = isDark ? 'border-[#3E2723]' : 'border-[#E8DDD0]';
  const inputBg = isDark ? 'bg-[#2D2D2D]' : 'bg-white';
  const primaryColor = isDark ? '#FFD700' : '#D32F2F';

  const deliveryFee = totalPrice >= 50 ? 0 : 10;
  const grandTotal = totalPrice + deliveryFee;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = t('checkout.required');
      if (!formData.lastName.trim()) newErrors.lastName = t('checkout.required');
      if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = t('checkout.invalidEmail');
      }
      if (!formData.phone.trim() || formData.phone.length < 8) {
        newErrors.phone = t('checkout.invalidPhone');
      }
    }
    if (step === 2) {
      if (formData.deliveryMethod === 'delivery') {
        if (!formData.address.trim()) newErrors.address = t('checkout.required');
        if (!formData.zone.trim()) newErrors.zone = t('checkout.required');
      }
    }
    if (step === 3) {
      if (!formData.acceptTerms) newErrors.acceptTerms = t('checkout.acceptTermsRequired');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      clearCart();
      setTimeout(() => navigate('/'), 3000);
    }, 2000);
  };

  const steps = [
    { number: 1, label: t('checkout.step1') || 'اطلاعات شخصی', icon: FiUser },
    { number: 2, label: t('checkout.step2') || 'آدرس و تحویل', icon: FiMapPin },
    { number: 3, label: t('checkout.step3') || 'تأیید و پرداخت', icon: FiCheckCircle },
  ];

  if (cart.length === 0 && !isSuccess) {
    return (
      <section className={`max-w-4xl mx-auto px-4 py-20 ${bgClass}`}>
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className={`text-2xl font-bold ${textColor}`}>{t('cart.empty')}</h2>
          <Link to="/menu" className="inline-block mt-4 px-6 py-2 bg-[#FFD700] text-[#1A1A1A] font-bold rounded-full hover:bg-[#F9A825] transition-colors duration-300">
            {t('menu.title')}
          </Link>
        </div>
      </section>
    );
  }

  if (isSuccess) {
    return (
      <section className={`max-w-2xl mx-auto px-4 py-20 ${bgClass}`}>
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
            <FiCheckCircle className="text-green-500" size={48} />
          </div>
          <h2 className={`text-3xl font-bold ${textColor} mb-4`}>
            {t('checkout.success') || '✅ سفارش با موفقیت ثبت شد!'}
          </h2>
          <p className={`${mutedColor} text-lg mb-6`}>
            {t('checkout.successMessage') || 'از اعتماد شما سپاسگزاریم. سفارش شما در اسرع وقت آماده و ارسال خواهد شد.'}
          </p>
          <Link to="/" className="inline-block px-8 py-3 bg-[#FFD700] text-[#1A1A1A] font-bold rounded-full hover:bg-[#F9A825] transition-colors duration-300">
            {t('checkout.backToHome') || 'بازگشت به صفحه اصلی'}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className={`max-w-6xl mx-auto px-4 py-12 ${bgClass} transition-colors duration-300`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className={`text-3xl font-bold ${textColor} mb-2`}>
            {t('checkout.title') || 'تکمیل سفارش'}
          </h1>
          <p className={`${mutedColor} text-sm mb-6`}>
            {t('checkout.subtitle') || 'لطفاً اطلاعات زیر را تکمیل کنید'}
          </p>

          <div className="flex items-center gap-2 mb-8">
            {steps.map((s, i) => (
              <div key={s.number} className="flex items-center flex-1">
                <div className={`flex items-center gap-2 ${i > 0 ? 'flex-1' : ''}`}>
                  {i > 0 && (
                    <div className={`flex-1 h-0.5 ${step > s.number ? 'bg-[#FFD700]' : 'bg-gray-300 dark:bg-gray-700'}`} />
                  )}
                  <div className={`
                    flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                    ${step >= s.number 
                      ? 'bg-[#FFD700] text-[#1A1A1A]' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }
                    ${step === s.number ? 'ring-2 ring-[#FFD700]/50 ring-offset-2' : ''}
                  `}>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${textColor} mb-1`}>
                      {t('checkout.firstName') || 'نام'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${borderClass} ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-[${primaryColor}]/30 transition-all duration-300 ${errors.firstName ? 'border-red-500' : ''}`}
                      placeholder={t('checkout.firstNamePlaceholder') || 'نام خود را وارد کنید'}
                    />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${textColor} mb-1`}>
                      {t('checkout.lastName') || 'نام خانوادگی'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${borderClass} ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-[${primaryColor}]/30 transition-all duration-300 ${errors.lastName ? 'border-red-500' : ''}`}
                      placeholder={t('checkout.lastNamePlaceholder') || 'نام خانوادگی خود را وارد کنید'}
                    />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${textColor} mb-1`}>
                    {t('checkout.email') || 'ایمیل'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border ${borderClass} ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-[${primaryColor}]/30 transition-all duration-300 ${errors.email ? 'border-red-500' : ''}`}
                    placeholder={t('checkout.emailPlaceholder') || 'example@email.com'}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className={`block text-sm font-medium ${textColor} mb-1`}>
                    {t('checkout.phone') || 'شماره تماس'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border ${borderClass} ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-[${primaryColor}]/30 transition-all duration-300 ${errors.phone ? 'border-red-500' : ''}`}
                    placeholder={t('checkout.phonePlaceholder') || '+974 3300 0157'}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
                <button type="button" onClick={nextStep} className="w-full py-3.5 bg-[#FFD700] hover:bg-[#F9A825] text-[#1A1A1A] font-bold text-lg rounded-2xl transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-[#FFD700]/30">
                  {t('checkout.continue') || 'ادامه →'}
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${textColor} mb-1`}>
                    {t('checkout.deliveryMethod') || 'روش دریافت سفارش'} <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, deliveryMethod: 'delivery' }))}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${formData.deliveryMethod === 'delivery' ? `border-[${primaryColor}] bg-[${primaryColor}]/10` : `border-${borderClass} hover:border-[${primaryColor}]/50`}`}
                    >
                      <FiTruck size={24} className={`mx-auto mb-2 ${formData.deliveryMethod === 'delivery' ? `text-[${primaryColor}]` : mutedColor}`} />
                      <span className={`text-sm font-medium ${textColor}`}>{t('checkout.delivery') || 'تحویل در محل'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, deliveryMethod: 'pickup' }))}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${formData.deliveryMethod === 'pickup' ? `border-[${primaryColor}] bg-[${primaryColor}]/10` : `border-${borderClass} hover:border-[${primaryColor}]/50`}`}
                    >
                      <FiMapPin size={24} className={`mx-auto mb-2 ${formData.deliveryMethod === 'pickup' ? `text-[${primaryColor}]` : mutedColor}`} />
                      <span className={`text-sm font-medium ${textColor}`}>{t('checkout.pickup') || 'تحویل حضوری'}</span>
                    </button>
                  </div>
                </div>

                {formData.deliveryMethod === 'delivery' && (
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium ${textColor} mb-1`}>
                        {t('checkout.address') || 'آدرس'} <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="2"
                        className={`w-full px-4 py-3 rounded-xl border ${borderClass} ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-[${primaryColor}]/30 transition-all duration-300 ${errors.address ? 'border-red-500' : ''}`}
                        placeholder={t('checkout.addressPlaceholder') || 'خیابان، ساختمان، پلاک'}
                      />
                      {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium ${textColor} mb-1`}>{t('checkout.zone') || 'منطقه'}</label>
                        <input
                          type="text"
                          name="zone"
                          value={formData.zone}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-xl border ${borderClass} ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-[${primaryColor}]/30 transition-all duration-300 ${errors.zone ? 'border-red-500' : ''}`}
                          placeholder={t('checkout.zonePlaceholder') || 'منطقه ۵۵'}
                        />
                        {errors.zone && <p className="text-red-500 text-xs mt-1">{errors.zone}</p>}
                      </div>
                      <div>
                        <label className={`block text-sm font-medium ${textColor} mb-1`}>{t('checkout.building') || 'ساختمان'}</label>
                        <input
                          type="text"
                          name="building"
                          value={formData.building}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-xl border ${borderClass} ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-[${primaryColor}]/30 transition-all duration-300`}
                          placeholder={t('checkout.buildingPlaceholder') || 'ساختمان ۳۵۰'}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${textColor} mb-1`}>
                      {t('checkout.deliveryTime') || 'زمان تحویل'}
                    </label>
                    <select
                      name="deliveryTime"
                      value={formData.deliveryTime}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${borderClass} ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-[${primaryColor}]/30 transition-all duration-300`}
                    >
                      <option value="asap">{t('checkout.asap') || 'در اسرع وقت'}</option>
                      <option value="30">۳۰ {t('checkout.minutes') || 'دقیقه'}</option>
                      <option value="60">۶۰ {t('checkout.minutes') || 'دقیقه'}</option>
                      <option value="90">۹۰ {t('checkout.minutes') || 'دقیقه'}</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${textColor} mb-1`}>
                      {t('checkout.tableNumber') || 'شماره میز'}
                    </label>
                    <input
                      type="text"
                      name="tableNumber"
                      value={formData.tableNumber}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${borderClass} ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-[${primaryColor}]/30 transition-all duration-300`}
                      placeholder={t('checkout.tableNumberPlaceholder') || 'مثلاً: ۵'}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textColor} mb-1`}>
                    {t('checkout.notes') || 'توضیحات'}
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="2"
                    className={`w-full px-4 py-3 rounded-xl border ${borderClass} ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-[${primaryColor}]/30 transition-all duration-300`}
                    placeholder={t('checkout.notesPlaceholder') || 'هر گونه توضیح خاص...'}
                  />
                </div>

                <div className="flex gap-4">
                  <button type="button" onClick={prevStep} className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300">
                    ← {t('checkout.back') || 'بازگشت'}
                  </button>
                  <button type="button" onClick={nextStep} className="flex-1 py-3.5 bg-[#FFD700] hover:bg-[#F9A825] text-[#1A1A1A] font-bold text-lg rounded-2xl transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-[#FFD700]/30">
                    {t('checkout.continue') || 'ادامه →'}
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className={`${inputBg} rounded-2xl p-4 border ${borderClass}`}>
                  <h3 className={`font-bold ${textColor} mb-2`}>{t('checkout.summary') || 'خلاصه سفارش'}</h3>
                  {cart.map((item) => {
                    const itemName = item.name?.[lang] || item.name?.en || '';
                    return (
                      <div key={item._id} className="flex justify-between text-sm py-1 border-b border-white/5 last:border-0">
                        <span className={textColor}>{itemName} ×{item.quantity}</span>
                        <span className={mutedColor}>{(item.price * item.quantity).toFixed(1)} QR</span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center gap-3 p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                  <FiCreditCard className="text-green-500" size={24} />
                  <div>
                    <p className={`text-sm font-medium ${textColor}`}>{t('checkout.securePayment') || 'پرداخت امن'}</p>
                    <p className={`text-xs ${mutedColor}`}>{t('checkout.securePaymentDesc') || 'اطلاعات شما با رمزنگاری کامل محافظت می‌شود'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    className="mt-1 w-5 h-5 accent-[#FFD700]"
                  />
                  <div>
                    <label className={`text-sm ${textColor}`}>
                      {t('checkout.acceptTerms') || 'شرایط و قوانین را می‌پذیرم'} <span className="text-red-500">*</span>
                    </label>
                    <p className={`text-xs ${mutedColor}`}>
                      {t('checkout.acceptTermsDesc') || 'با ثبت سفارش، با شرایط و قوانین رستوران موافقت می‌کنید.'}
                    </p>
                    {errors.acceptTerms && <p className="text-red-500 text-xs mt-1">{errors.acceptTerms}</p>}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button type="button" onClick={prevStep} className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300">
                    ← {t('checkout.back') || 'بازگشت'}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex-1 py-3.5 bg-[#FFD700] hover:bg-[#F9A825] text-[#1A1A1A] font-bold text-lg rounded-2xl transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-[#FFD700]/30 flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        {t('checkout.submitting') || 'در حال ثبت...'}
                      </>
                    ) : (
                      <>
                        {t('checkout.submit') || 'ثبت نهایی سفارش'}
                        <span className="text-sm opacity-70">→</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className={`sticky top-24 ${inputBg} rounded-2xl p-6 border ${borderClass} shadow-lg`}>
            <h2 className={`text-xl font-bold ${textColor} mb-4`}>{t('cart.title')}</h2>
            <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
              {cart.map((item) => {
                const itemName = item.name?.[lang] || item.name?.en || '';
                return (
                  <div key={item._id} className="flex justify-between items-center text-sm">
                    <span className={textColor}>
                      {itemName} <span className={mutedColor}>×{item.quantity}</span>
                    </span>
                    <span className={`font-bold ${textColor}`}>{(item.price * item.quantity).toFixed(1)} QR</span>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-white/10 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className={mutedColor}>{t('cart.subtotal')}</span>
                <span className={textColor}>{totalPrice.toFixed(1)} QR</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className={mutedColor}>{t('cart.delivery')}</span>
                <span className={textColor}>{deliveryFee === 0 ? 'رایگان' : `${deliveryFee} QR`}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/10">
                <span className={`text-base font-bold ${textColor}`}>{t('cart.total')}</span>
                <span className={`text-lg font-black text-[${primaryColor}]`}>
                  {grandTotal.toFixed(1)} QR
                </span>
              </div>
              <p className={`text-[10px] ${mutedColor} text-center opacity-50`}>
                {t('cart.noTax') || 'بدون مالیات - مطابق قوانین قطر'}
              </p>
            </div>
            <Link to="/menu" className="block text-center mt-4 text-sm text-[#FFD700] hover:underline">
              ← {t('cart.backToMenu') || 'بازگشت به منو'}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
