import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';

import dishRoutes from './routes/dishRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import authRoutes from './routes/authRoutes.js';
import articleRoutes from './routes/articleRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js'; // ✅ اضافه شد

// ===== پنل ادمین =====
import { login, getDashboardStats, getOrders, updateOrderStatus } from './controllers/adminController.js';
import { verifyAdminToken } from './middleware/authMiddleware.js';

// ===== کنترلرهای مدیریت =====
import { getDishes, createDish, updateDish, deleteDish } from './controllers/dishController.js';
import { getArticles, createArticle, updateArticle, deleteArticle } from './controllers/articleController.js';
import { uploadFile } from './controllers/uploadController.js';

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
app.get('/api/admin/articles', verifyAdminToken, getArticles);
app.post('/api/admin/articles', verifyAdminToken, createArticle);
app.put('/api/admin/articles/:id', verifyAdminToken, updateArticle);
app.delete('/api/admin/articles/:id', verifyAdminToken, deleteArticle);

// ===== Routes ادمین - مدیریت رزروها =====
app.use('/api/admin/reservations', reservationRoutes); // ✅ اضافه شد

// ===== Routes ادمین - آپلود فایل =====
app.post('/api/admin/upload/image', verifyAdminToken, upload.single('image'), uploadFile);
app.post('/api/admin/upload/video', verifyAdminToken, upload.single('video'), uploadFile);

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