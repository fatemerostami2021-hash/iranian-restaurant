import jwt from 'jsonwebtoken';

export const verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  
  if (!token) {
    return res.status(403).json({ message: 'توکنی ارسال نشده است' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_key');
    
    if (decoded.role !== 'admin') {
      return res.status(401).json({ message: 'دسترسی غیرمجاز' });
    }
    
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'توکن نامعتبر یا منقضی شده است' });
  }
};
