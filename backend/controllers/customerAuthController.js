import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendTelegramMessage } from '../utils/telegramNotifier.js';

// تولید توکن JWT
const signToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role }, 
    process.env.JWT_SECRET || 'your_super_secret_key', 
    { expiresIn: '30d' }
  );
};

// ۱. ثبت‌نام و ورود با ایمیل و رمز عبور
export const registerWithEmail = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) return res.status(400).json({ message: 'این ایمیل قبلاً ثبت شده است' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, email: email.toLowerCase().trim(), password: hashedPassword, phone
    });

    res.status(201).json({
      token: signToken(user),
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone }
    });
  } catch (error) {
    res.status(500).json({ message: 'خطای سرور' });
  }
};

export const loginWithEmail = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(401).json({ message: 'ایمیل یا رمز عبور اشتباه است' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'ایمیل یا رمز عبور اشتباه است' });

    res.status(200).json({
      token: signToken(user),
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone }
    });
  } catch (error) {
    res.status(500).json({ message: 'خطای سرور' });
  }
};

// ۲. ورود با گوگل (Google OAuth)
export const googleLogin = async (req, res) => {
  try {
    const { googleId, name, email } = req.body;
    
    let user = await User.findOne({ googleId });
    
    if (!user) {
      user = await User.findOne({ email });
      if (user) {
        user.googleId = googleId;
        await user.save();
      } else {
        user = await User.create({ googleId, name, email, isPhoneVerified: false });
      }
    }

    res.status(200).json({
      token: signToken(user),
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'خطای سرور در ورود با گوگل' });
  }
};

// ۳. درخواست کد تایید (OTP)
export const requestOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: 'شماره موبایل الزامی است' });

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // ۲ دقیقه اعتبار

    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({ phone, name: 'کاربر جدید' });
    }
    
    user.otp = { code: otpCode, expiresAt };
    await user.save();

    // ارسال به تلگرام (اگر فیلتر بود ارور ندهد)
    try {
      const teleText = `📱 کد تایید ورود به سایت کباب داغ:\n\n 🔢 <b>${otpCode}</b>\n\nاین کد ۲ دقیقه اعتبار دارد.`;
      await sendTelegramMessage(teleText);
    } catch (teleErr) {
      console.log('⚠️ Telegram is filtered, but OTP is generated.');
    }

    // چاپ کد در ترمینال بک‌اند برای تست راحت‌تر
    console.log(`[DEV OTP] Phone: ${phone} -> Code: ${otpCode}`);

    res.status(200).json({ message: 'کد تایید با موفقیت ارسال شد.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'خطا در ارسال کد' });
  }
};

// ۴. تایید کد (OTP) و ورود به سایت
export const verifyOTP = async (req, res) => {
  try {
    const { phone, code } = req.body;
    const user = await User.findOne({ phone });

    if (!user || !user.otp || !user.otp.code) {
      return res.status(400).json({ message: 'ابتدا کد را درخواست کنید' });
    }

    if (user.otp.expiresAt < new Date()) {
      return res.status(400).json({ message: 'کد تایید منقضی شده است' });
    }

    if (user.otp.code !== code) {
      return res.status(400).json({ message: 'کد تایید اشتباه است' });
    }

    user.isPhoneVerified = true;
    user.otp = undefined;
    await user.save();

    res.status(200).json({
      token: signToken(user),
      user: { id: user._id, name: user.name, phone: user.phone }
    });
  } catch (error) {
    res.status(500).json({ message: 'خطای سرور' });
  }
};