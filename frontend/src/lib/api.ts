// api.ts - Corrected version
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const authExcludedPaths = ['/login', '/register'];
  const isAuthExcluded = authExcludedPaths.some(path => config.url?.includes(path));
  
  if (!isAuthExcluded) {
    const token = localStorage.getItem('auth_token');
    const tokenType = localStorage.getItem('token_type');
    
    if (token) {
      config.headers.Authorization = `${tokenType} ${token}`;
    }
  }
  
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isLoginAttempt = error.config?.url?.includes('login');
      
      if (!isLoginAttempt) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('token_type');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;