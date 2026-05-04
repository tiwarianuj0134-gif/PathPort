import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// On every request, attach token from localStorage as Bearer header
// This is the cross-origin fallback when cookies don't work (Vercel → Render)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('pp_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject(
        new Error('Cannot connect to server. Please try again in a moment.')
      );
    }
    if (error.response.status === 503) {
      return Promise.reject(
        new Error('Database unavailable. Please whitelist your IP in MongoDB Atlas.')
      );
    }
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.msg ||
      error.message ||
      'Something went wrong.';
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
