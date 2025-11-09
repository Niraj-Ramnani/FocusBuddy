// frontend/src/api/auth.js
import axios from 'axios';

// Configuration (Ensure this matches your backend PORT 5000)
const API_BASE_URL = 'http://localhost:5000/api';

// --- Auth Utilities (using localStorage) ---
export const setToken = (token) => localStorage.setItem('userToken', token);
export const getToken = () => localStorage.getItem('userToken');
export const removeToken = () => localStorage.removeItem('userToken');

// --- Global Axios Interceptor for Authorization ---
// This automatically attaches the JWT token to every request header if it exists.
axios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Core API Calls ---

export const handleAuth = async (endpoint, email, password) => {
  const response = await axios.post(`${API_BASE_URL}/auth/${endpoint}`, { email, password });
  return response.data;
};

export const handleLogoutApi = async () => {
  // Call the backend logout route (optional, but good practice)
  try {
    await axios.post(`${API_BASE_URL}/auth/logout`);
  } catch (e) {
    console.warn("Logout endpoint failed, proceeding with client-side cleanup.");
  }
  removeToken();
};

export const fetchUserActivityApi = async () => {
  // Now returns { activities, metrics }
  const response = await axios.get(`${API_BASE_URL}/activity/mine`);
  return response.data;
};

export const recordSampleActivityApi = async () => {
  const sampleActivity = {
    timeSpent: Math.floor(Math.random() * 300) + 60, // 1 to 6 min in seconds
    activityType: 'focus_session',
    attributes: {
      url: 'https://work.projectsite.com',
      score: (Math.random() * 10).toFixed(2),
    },
  };
  const response = await axios.post(`${API_BASE_URL}/activity/record`, sampleActivity);
  return response.data;
};

// --- NEW ML/Optimization API Call ---
export const fetchOptimizationFeedbackApi = async () => {
  const response = await axios.get(`${API_BASE_URL}/activity/optimization`);
  return response.data;
};