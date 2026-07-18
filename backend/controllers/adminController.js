import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// ===== اطلاعات ادمین (در دیتابیس ذخیره خواهد شد) =====
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD_HASH = bcrypt.hashSync('admin123', 8);

// ===== لاگین ادمین =====
export const login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'نام کاربری و رمز عبور الزامی است' });
  }

  if (username !== ADMIN_USERNAME || !bcrypt.compareSync(password, ADMIN_PASSWORD_HASH)) {
    return res.status(401).json({ message: 'نام کاربری یا رمز عبور اشتباه است' });
  }

  const token = jwt.sign(
    { role: 'admin', username: ADMIN_USERNAME },
    process.env.JWT_SECRET || 'your_super_secret_key',
    { expiresIn: '8h' }
  );

  res.status(200).json({ 
    token, 
    message: 'ورود موفقیت‌آمیز بود',
    user: { username: ADMIN_USERNAME, role: 'admin' }
  });
};

// ===== دریافت آمار داشبورد =====
export const getDashboardStats = (req, res) => {
  res.status(200).json({
    totalOrders: 152,
    pendingReservations: 12,
    totalRevenue: 48500000,
    totalMenuItems: 78,
    recentOrders: [
      { id: 1, customer: 'محمد رضایی', total: 450000, status: 'در حال آماده‌سازی' },
      { id: 2, customer: 'سارا حسینی', total: 320000, status: 'ارسال شده' },
      { id: 3, customer: 'علی کریمی', total: 280000, status: 'در انتظار' },
    ]
  });
};

// ===== دریافت لیست سفارشات =====
export const getOrders = (req, res) => {
  res.status(200).json({
    orders: [
      { id: 1, customer: 'محمد رضایی', items: 3, total: 450000, status: 'در حال آماده‌سازی', date: '۱۴۰۴/۰۴/۲۸' },
      { id: 2, customer: 'سارا حسینی', items: 2, total: 320000, status: 'ارسال شده', date: '۱۴۰۴/۰۴/۲۸' },
      { id: 3, customer: 'علی کریمی', items: 4, total: 280000, status: 'در انتظار', date: '۱۴۰۴/۰۴/۲۷' },
    ]
  });
};

// ===== به‌روزرسانی وضعیت سفارش =====
export const updateOrderStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  res.status(200).json({ 
    message: `وضعیت سفارش ${id} به ${status} تغییر کرد`,
    order: { id, status }
  });
};
