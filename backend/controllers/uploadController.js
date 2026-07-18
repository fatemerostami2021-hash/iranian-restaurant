import path from 'path';
import fs from 'fs';

export const uploadFile = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'هیچ فایلی ارسال نشده است' });
    }
    // آدرس فایل آپلود شده برای ذخیره در دیتابیس
    const fileUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({ url: fileUrl });
  } catch (error) {
    res.status(500).json({ message: 'خطا در آپلود فایل', error });
  }
};
