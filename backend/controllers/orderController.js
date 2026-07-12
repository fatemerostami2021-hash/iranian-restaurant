import Order from '../models/Order.js';

export const getOrders = async (req, res) => {
  const orders = await Order.find().populate('items.dish').sort({ createdAt: -1 });
  res.json(orders);
};

export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('items.dish');
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
};

export const createOrder = async (req, res) => {
  const order = await Order.create(req.body);
  res.status(201).json(order);
};

export const updateOrderStatus = async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
};
