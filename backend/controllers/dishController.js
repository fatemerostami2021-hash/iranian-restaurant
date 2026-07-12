import Dish from '../models/Dish.js';

export const getDishes = async (req, res) => {
  const { category } = req.query;
  const filter = category ? { category } : {};
  const dishes = await Dish.find(filter).sort({ createdAt: -1 });
  res.json(dishes);
};

export const getDishById = async (req, res) => {
  const dish = await Dish.findById(req.params.id);
  if (!dish) return res.status(404).json({ error: 'Dish not found' });
  res.json(dish);
};

export const createDish = async (req, res) => {
  const dish = await Dish.create(req.body);
  res.status(201).json(dish);
};

export const updateDish = async (req, res) => {
  const dish = await Dish.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!dish) return res.status(404).json({ error: 'Dish not found' });
  res.json(dish);
};

export const deleteDish = async (req, res) => {
  const dish = await Dish.findByIdAndDelete(req.params.id);
  if (!dish) return res.status(404).json({ error: 'Dish not found' });
  res.json({ message: 'Dish deleted' });
};
