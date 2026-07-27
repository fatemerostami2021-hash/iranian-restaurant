// controllers/reservationController.js — نسخه متناسب با مدل موجود

import Reservation from '../models/Reservation.js';

export const getReservations = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status && status !== 'all') query.status = status;
    if (search) {
      query.$or = [
        { customer: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [reservations, total] = await Promise.all([
      Reservation.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
      Reservation.countDocuments(query),
    ]);

    res.json({
      reservations,
      pagination: {
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        total,
        limit: Number(limit),
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getReservationStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0]; // "2026-07-27"

    const [total, pending, confirmed, canceled, todayCount] = await Promise.all([
      Reservation.countDocuments(),
      Reservation.countDocuments({ status: 'pending' }),
      Reservation.countDocuments({ status: 'confirmed' }),
      Reservation.countDocuments({ status: 'canceled' }),
      Reservation.countDocuments({ date: { $gte: todayStr } }),
    ]);

    res.json({ total, pending, confirmed, canceled, today: todayCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateReservationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'canceled'].includes(status)) {
      return res.status(400).json({ message: 'وضعیت نامعتبر' });
    }

    const updated = await Reservation.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'رزرو یافت نشد' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Reservation.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'رزرو یافت نشد' });
    res.json({ message: 'رزرو حذف شد' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};