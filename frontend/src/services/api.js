import axios from 'axios';
import { storage } from '../utils/storage';
import { Platform } from 'react-native';

const getBaseUrl = () => {
  return 'https://sistem-informasi-pengelolaan-stok-buah-production.up.railway.app';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.logoutCallback = null;

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
        if (api.logoutCallback) {
          api.logoutCallback();
        }
      } catch (storageError) {
        console.error('Failed to clear storage on 401 error:', storageError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
