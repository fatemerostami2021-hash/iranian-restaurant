import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  items: [{
    dish: { type: mongoose.Schema.Types.ObjectId, ref: 'Dish', required: true },
    quantity: { type: Number, required: true, min: 1 },
    priceAtOrder: Number,
  }],
  customerName: String,
  phone: { type: String, required: true },
  address: String,
  tableNumber: String,
  totalPrice: Number,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'],
    default: 'pending',
  },
  notes: String,
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
