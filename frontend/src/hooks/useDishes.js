import { useState, useEffect } from 'react';
import { fetchDishes } from '../services/dishService';

export function useDishes(category = 'all') {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchDishes(category)
      .then((data) => {
        if (!cancelled) setDishes(data);
      })
      .catch((err) => {
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
