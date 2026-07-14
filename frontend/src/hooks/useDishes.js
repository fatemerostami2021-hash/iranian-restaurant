import { useState, useEffect } from 'react';
import axios from 'axios';

export function useDishes(category = 'all') {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        setLoading(true);
        const url = category === 'all' 
          ? 'http://localhost:5000/api/dishes'
          : `http://localhost:5000/api/dishes/category/${category}`;
        const response = await axios.get(url);
        setDishes(response.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setDishes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDishes();
  }, [category]);

  return { dishes, loading, error };
}
