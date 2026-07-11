import React, { createContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { authService } from '../services/auth.service';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Run on mount to check if token exists
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = await storage.getToken();
        const storedUser = await storage.getUser();
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(storedUser);
        }
      } catch (error) {
        console.error('Failed to load storage authentication data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Handle user login.
   * Runs login request, stores tokens securely, and sets context state.
   */
  const login = async (username, password) => {
    try {
      const data = await authService.login(username, password);
      
      // Save to secure device storage
      await storage.saveToken(data.access_token);
      await storage.saveUser(data.user);
      
      // Save to context state
      setToken(data.access_token);
      setUser(data.user);
      
      return data;
    } catch (error) {
      // Re-throw back to component to display in UI
      throw error;
    }
  };

  /**
   * Log user out, cleaning local storage and state.
   */
  const logout = async () => {
    try {
      await storage.clearAuth();
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Failed to clear session during logout:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
