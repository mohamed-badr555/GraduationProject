// Real authentication service using backend API
// Integrates with the backend AuthController endpoints via ApiManager

import ApiManager from './ApiManager.js';

// Development flag - set to false to use real backend API
const USE_MOCK_SERVICE = false;

export const authService = {  /**
   * Login user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Object} Login response with user data and token
   */  async login(email, password) {
    try {
      const response = await ApiManager.login({ email, password });
      
      if (response.success && response.token && response.user) {
        return {
          success: true,
          user: response.user,
          token: response.token
        };
      }
      
      return {
        success: false,
        error: response.error || response.message || 'Login failed'
      };
    } catch (error) {
      console.error('Login service error:', error);
      return {
        success: false,
        error: error.message || 'Network error. Please check your connection and try again.'
      };
    }
  },
  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Object} Registration response with user data and token
   */  async register(userData) {
    try {
      // Validate required fields on frontend
      if (!userData.email || !userData.password || !userData.firstName || !userData.lastName) {
        return {
          success: false,
          error: 'Please fill in all required fields'
        };
      }

      // Add confirmPassword field if not present
      if (!userData.confirmPassword) {
        userData.confirmPassword = userData.password;
      }

      const response = await ApiManager.register(userData);
      
      if (response.success && response.user) {
        return {
          success: true,
          user: response.user,
          token: response.token || null
        };
      }
      
      return {
        success: false,
        error: response.error || response.errors || response.message || 'Registration failed'
      };
    } catch (error) {
      console.error('Registration service error:', error);
      return {
        success: false,
        error: error.message || 'Network error. Please check your connection and try again.'
      };
    }
  },
  /**
   * Initiate password reset process
   * @param {string} email - User email for password reset
   * @returns {Object} Password reset response
   */  async forgotPassword(email) {
    try {
      if (!email || !email.trim()) {
        return {
          success: false,
          error: 'Please enter a valid email address'
        };
      }

      const response = await ApiManager.forgotPassword({ email: email.trim() });
      
      if (response.success) {
        return {
          success: true,
          message: response.message || 'Password reset instructions sent to your email'
        };
      }
      
      return {
        success: false,
        error: response.error || response.message || 'Failed to send password reset email'
      };
    } catch (error) {
      console.error('Forgot password service error:', error);
      return {
        success: false,
        error: error.message || 'Network error. Please check your connection and try again.'
      };
    }
  },

  /**
   * Validate JWT token and get user data
   * @param {string} token - JWT token to validate
   * @returns {Object} Token validation response with user data
   */
  async validateToken(token) {
    try {
      if (!token) {
        return {
          success: false,
          error: 'No token provided'
        };
      }

      const response = await ApiManager.validateToken(token);
      
      if (response.success && response.user) {
        return {
          success: true,
          user: response.user
        };
      }
      
      return {
        success: false,
        error: response.error || response.message || 'Invalid or expired token'
      };
    } catch (error) {
      console.error('Token validation service error:', error);
      return {
        success: false,
        error: error.message || 'Token validation failed'
      };
    }
  },

  /**
   * Get current user profile
   * @param {string} token - JWT token
   * @returns {Object} User profile response
   */
  async getCurrentUser(token) {
    try {
      if (!token) {
        return {
          success: false,
          error: 'No token provided'
        };
      }

      const response = await ApiManager.getCurrentUser(token);
      
      if (response.success && response.user) {
        return {
          success: true,
          user: response.user
        };
      }
      
      return {
        success: false,
        error: response.error || response.message || 'Failed to get user profile'
      };
    } catch (error) {
      console.error('Get current user service error:', error);
      return {
        success: false,
        error: error.message || 'Failed to get user profile'
      };
    }
  },

  /**
   * Logout user and invalidate token
   * @param {string} token - JWT token
   * @returns {Object} Logout response
   */
  async logout(token) {
    try {
      if (token) {
        // Try to logout on server, but don't fail if it doesn't work
        await ApiManager.logout(token);
      }
      
      // Always return success for logout to ensure local cleanup
      return {
        success: true,
        message: 'Logged out successfully'
      };
    } catch (error) {
      console.error('Logout service error:', error);
      // Still return success to ensure local cleanup happens
      return {
        success: true,
        message: 'Logged out locally'
      };
    }
  },

  /**
   * Check if email exists in the system
   * @param {string} email - Email to check
   * @returns {Object} Email existence check response
   */
  async checkEmailExists(email) {
    try {
      if (!email || !email.trim()) {
        return {
          exists: false,
          error: 'Please enter a valid email address'
        };
      }

      const response = await ApiManager.checkEmailExists({ email: email.trim() });
      
      return {
        exists: response.exists || false,
        message: response.message
      };
    } catch (error) {
      console.error('Check email exists service error:', error);
      return {
        exists: false,
        error: error.message || 'Failed to check email'
      };
    }
  },

  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @returns {Object} Password validation response
   */
  async validatePassword(password) {
    try {
      if (!password) {
        return {
          isValid: false,
          error: 'Password is required'
        };
      }

      const response = await ApiManager.validatePassword({ password });
      
      return {
        isValid: response.isValid || false,
        message: response.message,
        errors: response.errors
      };
    } catch (error) {
      console.error('Password validation service error:', error);
      return {
        isValid: false,
        error: error.message || 'Failed to validate password'
      };
    }
  }
};