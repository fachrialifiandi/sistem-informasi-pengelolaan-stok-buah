import api from './api';

export const authService = {
  /**
   * Send login credentials to the backend.
   * @param {string} username - Email address of the user
   * @param {string} password - User password
   */
  async login(username, password) {
    try {
      const response = await api.post('/api/v1/auth/login', {
        username,
        password,
      });
      return response.data;
    } catch (error) {
      // Return structured API error details or fallback message
      if (error.response && error.response.data) {
        throw error.response.data;
      }
      throw { detail: 'Tidak dapat terhubung ke server. Silakan periksa koneksi internet Anda.' };
    }
  }
};
