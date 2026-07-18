import Reservation from '../models/Reservation.js';

export const getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'خطا در دریافت رزروها', error });
  }
};

export const updateReservationStatus = async (req, res) => {
  try {
    const updatedReservation = await Reservation.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status }, 
      { new: true }
    );
    res.status(200).json(updatedReservation);
  } catch (error) {
    res.status(400).json({ message: 'خطا در تغییر وضعیت رزرو', error });
  }
};
