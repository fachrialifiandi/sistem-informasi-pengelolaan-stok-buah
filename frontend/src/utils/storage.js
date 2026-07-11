import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'fresh_vitality_token';
const USER_KEY = 'fresh_vitality_user';

export const storage = {
  async saveToken(token) {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch (error) {
      console.error('SecureStore Error saving token:', error);
    }
  },

  async getToken() {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('SecureStore Error getting token:', error);
      return null;
    }
  },

  async deleteToken() {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('SecureStore Error deleting token:', error);
    }
  },

  async saveUser(user) {
    try {
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('SecureStore Error saving user:', error);
    }
  },

  async getUser() {
    try {
      const userStr = await SecureStore.getItemAsync(USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('SecureStore Error getting user:', error);
      return null;
    }
  },

  async deleteUser() {
    try {
      await SecureStore.deleteItemAsync(USER_KEY);
    } catch (error) {
      console.error('SecureStore Error deleting user:', error);
    }
  },

  async clearAuth() {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
    } catch (error) {
      console.error('SecureStore Error clearing auth data:', error);
    }
  }
};
