import { useState, useEffect } from 'react';
import { fetchDishes } from '../services/dishService';

const categoryOrder = {
  'main': 0,
  'combo': 1,
  'breakfast': 2,
  'appetizer': 3,
  'drinks': 4,
};

const sortDishes = (dishes) => {
  return [...dishes].sort((a, b) => {
    const orderA = categoryOrder[a.category] ?? 99;
    const orderB = categoryOrder[b.category] ?? 99;
    return orderA - orderB;
  });
};

export function useDishes(category = 'all') {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    console.log('📡 Fetching dishes for category:', category);

    fetchDishes(category)
      .then((data) => {
        console.log('✅ Dishes received:', data?.length || 0, 'items');
        if (!cancelled) {
          const sortedData = sortDishes(data);
          setDishes(sortedData);
        }
      })
      .catch((err) => {
        console.error('❌ Error fetching dishes:', err);
        if (!cancelled) setError(err.message || 'Failed to load dishes');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [category]);

  return { dishes, loading, error };
}