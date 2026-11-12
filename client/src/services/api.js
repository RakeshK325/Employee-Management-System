import axios from 'axios';

/**
 * Standardized Axios HTTP client instance for PeopleDesk API communication.
 * Ready for backend integration in the subsequent phase.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor for logging or future auth token attachment
api.interceptors.request.use(
  (config) => {
    // Ready for future bearer auth token injection:
    // const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for unified error formatting
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      status: error.response?.status,
      details: error.response?.data,
    };
    return Promise.reject(customError);
  }
);

export default api;

