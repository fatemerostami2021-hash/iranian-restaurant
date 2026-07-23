import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';
import nodemailer from 'nodemailer';

import dishRoutes from './routes/dishRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import authRoutes from './routes/authRoutes.js';
import articleRoutes from './routes/articleRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';

// ✅ روت‌های جدید اضافه شد
import userRoutes from './routes/userRoutes.js';
import jobApplicationRoutes from './routes/jobApplicationRoutes.js';
import customerAuthRoutes from './routes/customerAuthRoutes.js';
import userProfileRoutes from './routes/userProfileRoutes.js';

// ===== پنل ادمین =====
import { login, getDashboardStats, getOrders, updateOrderStatus } from './controllers/adminController.js';
import { verifyAdminToken } from './middleware/authMiddleware.js';

// ===== کنترلرهای مدیریت =====
import { getDishes, createDish, updateDish, deleteDish } from './controllers/dishController.js';
import { getAllAdminArticles, createArticle, updateArticle, deleteArticle } from './controllers/articleController.js';
import { uploadFile } from './controllers/uploadController.js';

// ✅ ایمپورت تابع تلگرام
import { sendTelegramMessage } from './utils/telegramNotifier.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ===== Middleware =====
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== تنظیمات آپلود فایل (Multer) =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'public/uploads/';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`);
  }
});
const upload = multer({ storage });

// دسترسی عمومی به فایل‌های آپلود شده
app.use('/uploads', express.static('public/uploads'));

// ===== Routes عمومی =====
app.use('/api/dishes', dishRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);

// ===== Routes احراز هویت مشتریان =====
app.use('/api/customer/auth', customerAuthRoutes);


// ===== Routes حساب کاربری مشتریان =====
app.use('/api/customer/profile', userProfileRoutes);

// ===== Routes ادمین - هسته =====
app.post('/api/admin/login', login);
app.get('/api/admin/dashboard', verifyAdminToken, getDashboardStats);
app.get('/api/admin/orders', verifyAdminToken, getOrders);
app.put('/api/admin/orders/:id', verifyAdminToken, updateOrderStatus);

// ===== Routes ادمین - مدیریت منو =====
app.get('/api/admin/dishes', verifyAdminToken, getDishes);
app.post('/api/admin/dishes', verifyAdminToken, createDish);
app.put('/api/admin/dishes/:id', verifyAdminToken, updateDish);
app.delete('/api/admin/dishes/:id', verifyAdminToken, deleteDish);

// ===== Routes ادمین - مدیریت مقالات =====
app.get('/api/admin/articles', verifyAdminToken, getAllAdminArticles);
app.post('/api/admin/articles', verifyAdminToken, createArticle);
app.put('/api/admin/articles/:id', verifyAdminToken, updateArticle);
app.delete('/api/admin/articles/:id', verifyAdminToken, deleteArticle);

// ===== Routes ادمین - مدیریت رزروها =====
app.use('/api/admin/reservations', reservationRoutes);

// ✅ ===== Routes ادمین - مدیریت کاربران و درخواست‌های کاری =====
app.use('/api/admin/users', verifyAdminToken, userRoutes);
// مسیر /api/admin/jobs در خود فایل روت، محافظت شده است (چون مسیر عمومی برای ثبت هم دارد)
app.use('/api/admin/jobs', jobApplicationRoutes); 

// ===== Routes ادمین - آپلود فایل =====
app.post('/api/admin/upload/image', verifyAdminToken, upload.single('image'), uploadFile);
app.post('/api/admin/upload/video', verifyAdminToken, upload.single('video'), uploadFile);

// ===== Route ارسال ایمیل تماس (عمومی) =====
app.post('/api/contact/send-email', async (req, res) => {
  const { name, phone, email, message, locationLink } = req.body;
  
  // ۱. اول پیام تلگرام را می‌فرستیم
  const telegramText = `🔔 <b>پیام جدید از وب‌سایت</b>\n\n👤 <b>نام:</b> ${name}\n📞 <b>تلفن:</b> ${phone}\n✉️ <b>ایمیل:</b> ${email}\n🌍 <b>لوکیشن:</b> ${locationLink || 'ثبت نشده'}\n\n📝 <b>پیام:</b>\n${message}`;
  sendTelegramMessage(telegramText);

  // ۲. سپس سعی می‌کنیم ایمیل را بفرستیم
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'rostamy141@gmail.com',
        pass: process.env.EMAIL_PASS || 'your_app_password_here',
      },
    });

    await transporter.sendMail({
      from: `"Website Contact" <${process.env.EMAIL_USER || 'rostamy141@gmail.com'}>`,
      to: 'rostamy141@gmail.com',
      subject: `پیام جدید از ${name}`,
      text: `نام: ${name}\nتلفن: ${phone}\nایمیل: ${email}\nلوکیشن: ${locationLink || 'ثبت نشده'}\n\nپیام:\n${message}`,
    });

    res.status(200).json({ message: 'ایمیل و تلگرام با موفقیت ارسال شد' });
  } catch (error) {
    console.error('Email error (ولی تلگرام فرستاده شده است):', error);
    res.status(200).json({ message: 'تلگرام ارسال شد، ایمیل خطا داشت' }); 
  }
});

// ===== Health Check =====
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Iranian Restaurant API running' });
});

// ===== Error Handler =====
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal Server Error' 
  });
});

// ===== اتصال به دیتابیس =====
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/iranian-restaurant')
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

export default app;