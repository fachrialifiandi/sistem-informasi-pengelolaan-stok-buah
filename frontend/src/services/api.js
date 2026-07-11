import axios from 'axios';
import { storage } from '../utils/storage';
import { Platform } from 'react-native';

// In Expo development, localhost works for iOS simulators.
// Android emulator uses 10.0.2.2 to access the host machine's localhost.
// For physical devices, replace with your development machine's local IP address (e.g. 192.168.1.X)
const getBaseUrl = () => {
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

export default api;
