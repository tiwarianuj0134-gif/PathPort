import axios from 'axios';

const apiClient = axios.create({
  // Vite proxy forwards /api → http://localhost:5000 — no CORS issues
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Surface error messages cleanly
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network error — backend not running
    if (!error.response) {
      return Promise.reject(
        new Error('Cannot connect to server. Make sure the backend is running on port 5000.')
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
