import path from 'path';
import fs from 'fs';
import multer from 'multer';
import sharp from 'sharp';

// ===== تنظیمات عکس =====
const UPLOAD_DIR = 'public/uploads/';
const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // ۱۰ مگابایت
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_WIDTH = 1280; // بزرگ‌تر از این کوچک می‌شود، کوچک‌تر بزرگ نمی‌شود
const WEBP_QUALITY = 80;

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`);
  },
});

const imageUpload = multer({
  storage: imageStorage,
  limits: { fileSize: MAX_IMAGE_BYTES },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) return cb(null, true);
    cb(new Error('INVALID_IMAGE_TYPE'));
  },
});

// میدل‌ور آپلود عکس با پیام خطای مناسب
export const imageUploadMiddleware = (req, res, next) => {
  imageUpload.single('image')(req, res, (err) => {
    if (!err) return next();
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'حجم عکس بیشتر از ۱۰ مگابایت است' });
    }
    if (err.message === 'INVALID_IMAGE_TYPE') {
      return res.status(400).json({ message: 'فقط عکس JPG، PNG یا WebP مجاز است' });
    }
    return res.status(500).json({ message: 'خطا در آپلود فایل' });
  });
};

// آپلود عکس: کوچک‌سازی + تبدیل به WebP
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'هیچ فایلی ارسال نشده است' });
    }

    const inputPath = req.file.path;
    const baseName = path.parse(req.file.filename).name;
    const outName = `${baseName}.webp`;
    const outPath = path.join(UPLOAD_DIR, outName);
    const tmpPath = `${outPath}.tmp`;

    try {
      await sharp(inputPath)
        .rotate() // اصلاح جهت عکس بر اساس EXIF
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .toFile(tmpPath);

      await fs.promises.rename(tmpPath, outPath);

      // فایل اصلی حذف می‌شود (مگر اینکه همان فایل خروجی باشد)
      if (path.resolve(inputPath) !== path.resolve(outPath)) {
        await fs.promises.unlink(inputPath).catch(() => {});
      }

      return res.status(200).json({ url: `/uploads/${outName}` });
    } catch (convertError) {
      // اگر تبدیل خطا داد، فایل اصلی نگه داشته می‌شود تا آپلود ادمین خراب نشود
      console.error('Image conversion failed, keeping original:', convertError.message);
      await fs.promises.unlink(tmpPath).catch(() => {});
      return res.status(200).json({ url: `/uploads/${req.file.filename}` });
    }
  } catch (error) {
    res.status(500).json({ message: 'خطا در آپلود فایل', error });
  }
};

// آپلود عمومی (ویدیو): بدون تغییر نسبت به قبل
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
