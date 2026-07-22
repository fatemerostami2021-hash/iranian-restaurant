import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'خطا در دریافت کاربران' });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) return res.status(400).json({ message: 'این ایمیل قبلاً ثبت شده است' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, email: email.toLowerCase().trim(), phone, password: hashedPassword, role
    });
    res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    res.status(400).json({ message: 'خطا در ایجاد کاربر' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'کاربر حذف شد' });
  } catch (error) {
    res.status(500).json({ message: 'خطا در حذف کاربر' });
  }
};