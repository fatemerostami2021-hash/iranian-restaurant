import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  customer: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  guests: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'canceled'], 
    default: 'pending' 
  }
}, { timestamps: true });

export default mongoose.model('Reservation', reservationSchema);
