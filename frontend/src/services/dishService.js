import api from './api';

const CATEGORY_IMAGE_MAP = {
  breakfast: 'breakfast',
  main: 'main',
  combo: 'combo',
  appetizer: 'appetizer',
  drinks: 'drinks',
};

export function getDishImageUrl(dish) {
  // ✅ اول: اگه از پنل ادمین عکس واقعی آپلود شده (فیلد images تو دیتابیس)، همونو استفاده کن
  if (dish.images && dish.images.length > 0 && dish.images[0]) {
    return dish.images[0]; // مثلا "/uploads/1785055470784-0058.png"
  }

  // fallback: اگه عکس آپلودی نبود، مسیر استاتیک قدیمی رو امتحان کن
  const folder = CATEGORY_IMAGE_MAP[dish.category] || 'main';
  const key = dish.code || dish._id;
  return `/images/dishes/${folder}/${key}.png`;
}

export const PLACEHOLDER_IMAGE = '/images/dishes/placeholder.svg';

export async function fetchDishes(category) {
  const params = category && category !== 'all' ? { category } : {};
  const { data } = await api.get('/dishes', { params });
  return data;
}

export async function fetchDishById(id) {
  const { data } = await api.get(`/dishes/${id}`);
  return data;
}