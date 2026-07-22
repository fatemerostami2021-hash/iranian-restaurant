import User from '../models/User.js';
import Order from '../models/Order.js';
import Dish from '../models/Dish.js';
import Reservation from '../models/Reservation.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// ===== لاگین ادمین (متصل به مدل User) =====
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase().trim() });
    
    // فقط ادمین یا کارمندان (staff) اجازه ورود دارند
    if (!user || !['admin', 'staff'].includes(user.role)) {
      return res.status(401).json({ message: 'دسترسی به پنل مدیریت ندارید' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'رمز عبور اشتباه است' });

    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET || 'your_super_secret_key', 
      { expiresIn: '8h' }
    );
    
    res.status(200).json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email, role: user.role } 
    });
  } catch (error) {
    res.status(500).json({ message: 'خطای سرور در زمان لاگین' });
  }
};

// ===== دریافت آمار داشبورد (متصل به دیتابیس واقعی) =====
export const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingReservations = await Reservation.countDocuments({ status: 'pending' });
    const totalMenuItems = await Dish.countDocuments();
    
    // محاسبه درآمد کل (فقط سفارشات تحویل شده)
    const revenueData = await Order.aggregate([
      { $match: { status: 'delivered' } }, 
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('items.dish', 'name.fa');

    res.status(200).json({
      totalOrders,
      pendingReservations,
      totalRevenue: revenueData[0]?.total || 0,
      totalMenuItems,
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ message: 'خطا در دریافت آمار' });
  }
};

// ===== دریافت لیست سفارشات (از دیتابیس واقعی) =====
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('items.dish')
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'خطا در دریافت سفارشات' });
  }
};

// ===== به‌روزرسانی وضعیت سفارش (در دیتابیس واقعی) =====
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status }, 
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'سفارش یافت نشد' });
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ message: 'خطا در تغییر وضعیت سفارش' });
  }
};