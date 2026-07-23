import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  title: { type: String, required: true }, // مثلاً: خانه، محل کار
  address: { type: String, required: true },
  location: {
    lat: String,
    lng: String
  }
});

const paymentMethodSchema = new mongoose.Schema({
  token: { type: String, required: true }, // توکن امن کارت بانکی
  last4: { type: String, required: true }, // ۴ رقم آخر کارت
  brand: { type: String } // نوع کارت (Visa, Mastercard)
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  phone: { type: String, unique: true, sparse: true },
  password: { type: String }, // برای ورود با ایمیل
  googleId: { type: String, unique: true, sparse: true }, // برای ورود با گوگل
  role: { type: String, enum: ['admin', 'staff', 'customer'], default: 'customer' },
  isPhoneVerified: { type: Boolean, default: false },
  
  // بخش‌های جدید برای حساب کاربری
  addresses: [addressSchema],
  paymentMethods: [paymentMethodSchema],
  loginHistory: [{
    ip: String,
    device: String,
    date: { type: Date, default: Date.now }
  }],
  
  // برای بازیابی رمز و ورود با پیامک (OTP)
  otp: {
    code: String,
    expiresAt: Date
  }

}, { timestamps: true });

export default mongoose.model('User', userSchema);