import { useState, useEffect } from 'react';
import axios from 'axios';

export function useArticles(category = 'all', search = '', page = 1, limit = 6) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (category !== 'all') params.append('category', category);
        if (search) params.append('search', search);
        params.append('page', page);
        params.append('limit', limit);

        const response = await axios.get(
          `http://localhost:5000/api/articles?${params.toString()}`
        );
        setArticles(response.data.articles || response.data);
        setTotal(response.data.total || response.data.length || 0);
        setError(null);
      } catch (err) {
        setError(err.message);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [category, search, page, limit]);

  return { articles, loading, error, total };
}
