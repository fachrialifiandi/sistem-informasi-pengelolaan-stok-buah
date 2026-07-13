import axios from 'axios';
import { storage } from '../utils/storage';
import { Platform } from 'react-native';

const USE_NGROK = false; // Set false to switch back to local emulator/localhost development

const getBaseUrl = () => {
  if (USE_NGROK) {
    return 'https://trial-rival-jellied.ngrok-free.dev';
  }
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000';
  }
  return 'http://localhost:8000';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to inject the JWT token automatically
api.interceptors.request.use(
  async (config) => {
    const token = await storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to automatically clear storage on 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        await storage.clearAuth();
      } catch (storageError) {
        console.error('Failed to clear storage on 401 error:', storageError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
