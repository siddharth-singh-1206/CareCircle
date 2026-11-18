import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Interceptor to automatically add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('carecircle_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle session expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized, remove token if it was a protected request
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && !window.location.pathname.startsWith('/emergency') && !window.location.pathname.startsWith('/doctor-access')) {
        localStorage.removeItem('carecircle_token');
        localStorage.removeItem('carecircle_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
