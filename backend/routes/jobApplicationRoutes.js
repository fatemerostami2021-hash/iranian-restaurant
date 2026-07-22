import express from 'express';
import { getJobApplications, createJobApplication, updateApplicationStatus, deleteApplication } from '../controllers/jobApplicationController.js';
import { verifyAdminToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// مسیر عمومی برای ثبت درخواست کار از طریق سایت
router.post('/', createJobApplication);

// مسیرهای مدیریت (فقط ادمین)
router.get('/', verifyAdminToken, getJobApplications);
router.put('/:id', verifyAdminToken, updateApplicationStatus);
router.delete('/:id', verifyAdminToken, deleteApplication);

export default router;