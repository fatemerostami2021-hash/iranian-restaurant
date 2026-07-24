import User from '../models/User.js';
import Order from '../models/Order.js';

// دریافت اطلاعات پروفایل کاربر
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -otp');
    if (!user) return res.status(404).json({ message: 'کاربر یافت نشد' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'خطای سرور' });
  }
};

// اضافه کردن آدرس جدید
export const addAddress = async (req, res) => {
  try {
    const { title, address, lat, lng } = req.body;
    const user = await User.findById(req.user.id);
    
    user.addresses.push({ title, address, location: { lat, lng } });
    await user.save();
    
    res.status(200).json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: 'خطا در ذخیره آدرس' });
  }
};

// اضافه کردن کارت بانکی (فقط ۴ رقم آخر ذخیره می‌شود)
export const addCard = async (req, res) => {
  try {
    const { token, last4, brand } = req.body;
    const user = await User.findById(req.user.id);
    
    user.paymentMethods.push({ token, last4, brand });
    await user.save();
    
    res.status(200).json(user.paymentMethods);
  } catch (error) {
    res.status(500).json({ message: 'خطا در ذخیره کارت' });
  }
};

// دریافت سفارشات مشتری
export const getMyOrders = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'کاربر یافت نشد' });

    const orders = await Order.find({ phone: user.phone })
      .populate('items.dish', 'name price images')
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'خطا در دریافت سفارشات' });
  }
};