import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    // ✅ رمز عبور جدید شما
    const hash = await bcrypt.hash('12345', 10);
    
    // ✅ ایمیل جدید شما
    await User.findOneAndUpdate(
      { email: 'fatimarostami963369@gmail.com' },
      { name: 'Super Admin', email: 'fatimarostami963369@gmail.com', password: hash, role: 'admin', phone: '97433000157' },
      { upsert: true, new: true }
    );
    
    console.log('✅ Admin user created successfully! Email: fatimarostami963369@gmail.com | Pass: 12345');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();
