import Order from '../models/Order.js';
import { sendTelegramMessage } from '../utils/telegramNotifier.js';

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('items.dish').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.dish');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    
    // ✅ ارسال پیام سفارش به تلگرام مدیر
    const telegramText = `🛎 <b>سفارش جدید!</b>\n\n👤 <b>مشتری:</b> ${order.customerName}\n📞 <b>تلفن:</b> ${order.phone}\n📍 <b>آدرس:</b> ${order.address || 'تحویل حضوری'}\n💰 <b>مبلغ کل:</b> ${order.totalPrice} QR\n\n📝 <b>توضیحات:</b> ${order.notes || 'ندارد'}`;
    sendTelegramMessage(telegramText);
    
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};