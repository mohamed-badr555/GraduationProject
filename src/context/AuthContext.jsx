import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check if user is logged in on app start
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
        if (storedToken && userData) {
        try {
          // Validate the token with the real auth service
          const response = await authService.validateToken(storedToken);
          
          if (response && response.success && response.user) {
            setUser(response.user);
            setToken(storedToken);
            setIsAuthenticated(true);
          } else {
            // Token is invalid, clear storage
            console.log('Token validation failed, clearing auth data');
            clearAuthData();
          }
        } catch (error) {
          console.error('Error validating token:', error);
          clearAuthData();
        }
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Helper function to clear auth data
  const clearAuthData = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };
  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);

      if (response && response.success && response.token) {
        setUser(response.user);
        setToken(response.token);
        setIsAuthenticated(true);
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userData', JSON.stringify(response.user));
        return { success: true, user: response.user };
      } else {
        return { success: false, error: response.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Network error. Please try again.' };
    }
  };  const register = async (userData) => {
    try {
      const response = await authService.register(userData);

      if (response && response.success && response.user) {
        // Auto-login after successful registration if token is provided
        if (response.token) {
          setUser(response.user);
          setToken(response.token);
          setIsAuthenticated(true);
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('userData', JSON.stringify(response.user));
        }
        return { success: true, user: response.user };
      } else {
        return { success: false, error: response.error || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message || 'Network error. Please try again.' };
    }
  };  const logout = async () => {
    try {
      // Call the real logout service to invalidate token on server
      if (token) {
        await authService.logout(token);
      }
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with local cleanup even if server logout fails
    } finally {
      clearAuthData();
    }
  };
  const forgotPassword = async (email) => {
    try {
      const response = await authService.forgotPassword(email);

      if (response && response.success) {
        return { success: true, message: 'Password reset email sent successfully' };
      } else {
        return { success: false, error: response.error || 'Failed to send reset email' };
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      return { success: false, error: error.message || 'Network error. Please try again.' };
    }
  };
  const checkAuthStatus = async () => {
    const storedToken = localStorage.getItem('authToken');
    if (!storedToken) {
      return false;
    }

    try {
      const response = await authService.validateToken(storedToken);
      if (!response || !response.success || !response.user) {
        clearAuthData(); // Clear invalid session
        return false;
      }
      return true;
    } catch (error) {
      console.error('Auth check error:', error);
      clearAuthData(); // Clear invalid session
      return false;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    token,
    login,
    register,
    logout,
    forgotPassword,
    checkAuthStatus,
    clearAuthData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
