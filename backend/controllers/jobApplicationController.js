import JobApplication from '../models/JobApplication.js';

export const getJobApplications = async (req, res) => {
  try {
    const applications = await JobApplication.find().sort({ createdAt: -1 });
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: 'خطا در دریافت درخواست‌ها', error });
  }
};

export const createJobApplication = async (req, res) => {
  try {
    const newApplication = await JobApplication.create(req.body);
    res.status(201).json(newApplication);
  } catch (error) {
    res.status(400).json({ message: 'خطا در ثبت درخواست', error });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const updated = await JobApplication.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status }, 
      { new: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: 'خطا در تغییر وضعیت', error });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    await JobApplication.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'درخواست حذف شد' });
  } catch (error) {
    res.status(500).json({ message: 'خطا در حذف', error });
  }
};