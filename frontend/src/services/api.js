import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

/* ══ Request Interceptor: attach token ══ */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ══ Response Interceptor: handle 401 ══ */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

/* ══ Reservations API ══ */
export const reservationApi = {
  getAll: (params) => api.get('/admin/reservations', { params }),
  getById: (id) => api.get(`/admin/reservations/${id}`),
  create: (data) => api.post('/admin/reservations', data),
  updateStatus: (id, status) => api.patch(`/admin/reservations/${id}/status`, { status }),
  delete: (id) => api.delete(`/admin/reservations/${id}`),
  getStats: () => api.get('/admin/reservations/stats'),
};

/* ══ Dashboard / Stats ══ */
export const dashboardApi = {
  getStats: () => api.get('/admin/dashboard'),
};

export default api;