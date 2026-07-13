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
      if (error.response && error.response.data) {
        throw error.response.data;
      }
      throw { detail: 'Tidak dapat terhubung ke server. Silakan periksa koneksi internet Anda.' };
    }
  },

  /**
   * Send registration details to backend.
   * @param {string} fullName - Full name
   * @param {string} email - Email address
   * @param {string} password - Secure password
   */
  async register(fullName, email, password) {
    try {
      const response = await api.post('/api/v1/auth/register', {
        fullName,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw error.response.data;
      }
      throw { detail: 'Pendaftaran gagal. Periksa koneksi internet Anda.' };
    }
  },

  /**
   * Reset user password using recovery key.
   * @param {string} email - Email address
   * @param {string} recoveryKey - 8-character recovery key
   * @param {string} newPassword - New password
   */
  async forgotPassword(email, recoveryKey, newPassword) {
    try {
      const response = await api.post('/api/v1/auth/forgot-password', {
        email,
        recoveryKey,
        newPassword,
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw error.response.data;
      }
      throw { detail: 'Gagal mengatur ulang kata sandi. Periksa koneksi internet Anda.' };
    }
  }
};
