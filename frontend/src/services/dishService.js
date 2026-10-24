import api from './api';

const CATEGORY_IMAGE_MAP = {
  breakfast: 'breakfast',
  main: 'main',
  combo: 'combo',
  appetizer: 'appetizer',
  drinks: 'drinks',
};

export function getDishImageUrl(dish) {
  if (dish.images && dish.images.length > 0 && dish.images[0]) {
    return dish.images[0];
  }
  const folder = CATEGORY_IMAGE_MAP[dish.category] || 'main';
  const key = dish.code || dish._id;
  return `/images/dishes/${folder}/${key}.webp`;
}

export const PLACEHOLDER_IMAGE = '/images/dishes/placeholder.svg';

// Cloudflare Image Transformations: resize + WebP/AVIF at the edge. Only /uploads/ paths, production build only.
const CF_IMG_QUALITY = 80;
export function cfImage(url, width = 640) {
  if (!import.meta.env.PROD || typeof url !== 'string' || !url.startsWith('/uploads/')) return url;
  return `/cdn-cgi/image/width=${width},quality=${CF_IMG_QUALITY},format=auto${url}`;
}

export async function fetchDishes(category) {
  const params = category && category !== 'all' ? { category } : {};
  const { data } = await api.get('/api/dishes', { params });  // ← /api اضافه شد
  return data;
}

export async function fetchDishById(id) {
  const { data } = await api.get(`/api/dishes/${id}`);  // ← /api اضافه شد
  return data;
}