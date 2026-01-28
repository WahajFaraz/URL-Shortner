import axios from 'axios';

// Backend API base URL
// - In production, set VITE_API_URL in Vercel to "https://url-shortner-back.vercel.app/api"
// - In local dev, this falls back to your local Express server
const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.MODE === 'production'
    ? 'https://url-shortner-back.vercel.app/api'
    : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
