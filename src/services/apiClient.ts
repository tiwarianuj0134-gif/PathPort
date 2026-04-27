import axios from 'axios';

// In production (Vercel/Netlify), set VITE_API_BASE_URL to your Render backend URL.
// e.g. VITE_API_BASE_URL=https://pathport-backend.onrender.com/api
// In local dev, falls back to '/api' which Vite proxies to localhost:5000
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Surface error messages cleanly
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network error — backend unreachable
    if (!error.response) {
      return Promise.reject(
        new Error('Cannot connect to server. Please try again in a moment.')
      );
    }

    // 503 — MongoDB unavailable
    if (error.response.status === 503) {
      return Promise.reject(
        new Error(
          'Database unavailable. Please whitelist your IP in MongoDB Atlas: ' +
          'Atlas → Network Access → Add IP → Allow Access from Anywhere (0.0.0.0/0)'
        )
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
