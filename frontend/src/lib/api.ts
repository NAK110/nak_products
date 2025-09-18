import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
  withXSRFToken: true,
});

export const getCsrfCookie = async () => {
  try {
    await axios.get(`${import.meta.env.VITE_API_URL}/sanctum/csrf-cookie`, {
      withCredentials: true,
    });
  } catch (error) {
    console.error('Failed to get CSRF cookie:', error);
  }
};

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    const authRequiredPaths = ['/login', '/register'];
    const isAuthRequired = authRequiredPaths.some(path => config.url?.includes(path));

    if (isAuthRequired) {
      await getCsrfCookie();
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const isLoginAttempt = error.config?.url?.includes('login');

      if (!isLoginAttempt) {
        localStorage.removeItem('user');
        console.log('Authentication failed - user will be redirected to login');
      }
    }
    if (error.response?.status === 419) {
      await getCsrfCookie();
      return api.request(error.config);
    }

    return Promise.reject(error);
  }
);

export default api;
