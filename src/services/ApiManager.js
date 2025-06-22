import axios from "axios";

// API Manager for ovoVax - Automated In-Ovo Vaccination System
// Complete API integration with backend authentication endpoints

// const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://ovovax.runasp.net/api";
const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://localhost:7268/api";

// Helper function to get headers with optional token
const getHeaders = (token = null) => {
  const headers = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
};

export default class ApiManager {
  // ==================== AUTHENTICATION APIS ====================
  /**
   * Register new user
   * @param {Object} userData - { firstName, lastName, email, password, confirmPassword }
   * @returns {Object} registration response
   * Response: { success: boolean, user?: object, token?: string, message?: string, errors?: object }
   */
  static async register(userData) {
    try {
      const response = await axios.post(
        baseUrl + "/Auth/register",
        userData,
        {
          headers: getHeaders(),
        }
      );
      
      // Return the response data directly from backend
      return response.data;
    } catch (error) {
      console.error("Registration API error:", error);
      
      // Handle API error responses
      if (error.response?.data) {
        return {
          success: false,
          error: error.response.data.message || 'Registration failed',
          errors: error.response.data.errors || null,
          status: error.response.status
        };
      }
      
      // Handle network/connection errors
      return {
        success: false,
        error: 'Network error. Please check your connection and try again.',
        status: error.code || 'NETWORK_ERROR'
      };
    }
  }
  /**
   * Login user
   * @param {Object} loginData - { email, password }
   * @returns {Object} login response
   * Response: { success: boolean, user?: object, token?: string, message?: string }
   */
  static async login(loginData) {
    try {
      const response = await axios.post(
        baseUrl + "/Auth/login",
        loginData,
        {
          headers: getHeaders(),
        }
      );
      
      // Return the response data directly from backend
      return response.data;
    } catch (error) {
      console.error("Login API error:", error);
      
      // Handle API error responses
      if (error.response?.data) {
        return {
          success: false,
          error: error.response.data.message || 'Login failed',
          status: error.response.status
        };
      }
      
      // Handle network/connection errors
      return {
        success: false,
        error: 'Network error. Please check your connection and try again.',
        status: error.code || 'NETWORK_ERROR'
      };
    }
  }
  /**
   * Initiate password reset
   * @param {Object} resetData - { email }
   * @returns {Object} password reset response
   * Response: { success: boolean, message?: string }
   */
  static async forgotPassword(resetData) {
    try {
      const response = await axios.post(
        baseUrl + "/Auth/forgot-password",
        resetData,
        {
          headers: getHeaders(),
        }
      );
      
      // Return the response data directly from backend
      return response.data;
    } catch (error) {
      console.error("Forgot password API error:", error);
      
      // Handle API error responses
      if (error.response?.data) {
        return {
          success: false,
          error: error.response.data.message || 'Password reset failed',
          status: error.response.status
        };
      }
      
      // Handle network/connection errors
      return {
        success: false,
        error: 'Network error. Please check your connection and try again.',
        status: error.code || 'NETWORK_ERROR'
      };
    }
  }
  /**
   * Validate JWT token
   * @param {string} token - JWT token to validate
   * @returns {Object} token validation response
   * Response: { success: boolean, user?: object, message?: string }
   */
  static async validateToken(token) {
    try {
      const response = await axios.get(
        baseUrl + "/Auth/validate-token",
        {
          headers: getHeaders(token),
        }
      );
      
      // Return the response data directly from backend
      return response.data;
    } catch (error) {
      console.error("Token validation API error:", error);
      
      // Handle API error responses
      if (error.response?.data) {
        return {
          success: false,
          error: error.response.data.message || 'Token validation failed',
          status: error.response.status
        };
      }
      
      // Handle network/connection errors
      return {
        success: false,
        error: 'Token validation failed - network error',
        status: error.code || 'NETWORK_ERROR'
      };
    }
  }
  /**
   * Check if email exists in system
   * @param {Object} emailData - { email }
   * @returns {Object} email check response
   * Response: { exists: boolean, message?: string }
   */
  static async checkEmailExists(emailData) {
    try {
      const response = await axios.post(
        baseUrl + "/Auth/check-email",
        emailData,
        {
          headers: getHeaders(),
        }
      );
      
      // Return the response data directly from backend
      return response.data;
    } catch (error) {
      console.error("Check email exists API error:", error);
      
      // Handle API error responses
      if (error.response?.data) {
        return {
          exists: false,
          error: error.response.data.message || 'Email check failed',
          status: error.response.status
        };
      }
      
      // Handle network/connection errors
      return {
        exists: false,
        error: 'Network error. Please check your connection and try again.',
        status: error.code || 'NETWORK_ERROR'
      };
    }
  }
  /**
   * Validate password strength
   * @param {Object} passwordData - { password }
   * @returns {Object} password validation response
   * Response: { isValid: boolean, message?: string, errors?: string[] }
   */
  static async validatePassword(passwordData) {
    try {
      const response = await axios.post(
        baseUrl + "/Auth/validate-password",
        passwordData,
        {
          headers: getHeaders(),
        }
      );
      
      // Return the response data directly from backend
      return response.data;
    } catch (error) {
      console.error("Password validation API error:", error);
      
      // Handle API error responses
      if (error.response?.data) {
        return {
          isValid: false,
          error: error.response.data.message || 'Password validation failed',
          errors: error.response.data.errors || null,
          status: error.response.status
        };
      }
      
      // Handle network/connection errors
      return {
        isValid: false,
        error: 'Network error. Please check your connection and try again.',
        status: error.code || 'NETWORK_ERROR'
      };
    }
  }
  /**
   * Get current user profile
   * @param {string} token - JWT token
   * @returns {Object} user profile response
   * Response: { success: boolean, user?: object, message?: string }
   */
  static async getCurrentUser(token) {
    try {
      const response = await axios.get(
        baseUrl + "/Auth/me",
        {
          headers: getHeaders(token),
        }
      );
      
      // Return the response data directly from backend
      return response.data;
    } catch (error) {
      console.error("Get current user API error:", error);
      
      // Handle API error responses
      if (error.response?.data) {
        return {
          success: false,
          error: error.response.data.message || 'Failed to get user profile',
          status: error.response.status
        };
      }
      
      // Handle network/connection errors
      return {
        success: false,
        error: 'Network error. Please check your connection and try again.',
        status: error.code || 'NETWORK_ERROR'
      };
    }
  }
  /**
   * Logout user (invalidate token on server)
   * @param {string} token - JWT token
   * @returns {Object} logout response
   * Response: { success: boolean, message?: string }
   */
  static async logout(token) {
    try {
      const response = await axios.post(
        baseUrl + "/Auth/logout",
        {},
        {
          headers: getHeaders(token),
        }
      );
      
      // Return the response data directly from backend
      return response.data;
    } catch (error) {
      console.error("Logout API error:", error);
      
      // Handle API error responses - even if logout fails on server, allow local cleanup
      if (error.response?.data) {
        return {
          success: false,
          error: error.response.data.message || 'Logout failed on server',
          status: error.response.status
        };
      }
      
      // Handle network/connection errors
      return {
        success: false,
        error: 'Network error during logout',
        status: error.code || 'NETWORK_ERROR'
      };
    }
  }
  // ==================== SCANNER APIS ====================

  /**
   * Start Scanner
   * @param {string} token - JWT authentication token
   * @returns {Object} scan response with scanId
   * Response: { success: boolean, message: string, scanId: number, status: string|null, readings: number[]|null, readingCount: number }
   */
  static async startScan(token) {
    const axiosResult = await axios.get(
      baseUrl + "/Scanner/start",
      {
        headers: getHeaders(token),
      }
    );
    return axiosResult;
  }
  /**
   * Stop Scanner
   * @param {Object} stopData - { scanId: number }
   * @param {string} token - JWT authentication token
   * @returns {Object} scan response with readings array
   * Response: { success: boolean, message: string, scanId: number, status: string, readings: number[], readingCount: number }
   */
  static async stopScan(stopData, token) {
    const axiosResult = await axios.post(
      baseUrl + "/Scanner/stop",
      stopData,
      {
        headers: getHeaders(token),
      }
    );
    return axiosResult;
  }
  /**
   * Get Scanner History
   * @param {string} token - JWT authentication token
   * @returns {Object} scan history data
   * Response: Array of { id: number, scanTime: string, sensorReadings: number[], readingCount: number, status: string, errorMessage: string|null }
   */
  static async getScanHistory(token) {
    const axiosResult = await axios.get(baseUrl + "/Scanner/history", {
      headers: getHeaders(token),
    });
    return axiosResult;
  }
  // ==================== INJECTION APIS ====================

  /**
   * Start Injection Operation
   * @param {Object} injectionData - { stepOfInjection, volumeOfLiquid, numberOfElements }
   * @param {string} token - JWT authentication token
   * @returns {Object} injection response with operationId
   */
  static async startInjection(injectionData, token) {
    const axiosResult = await axios.post(
      baseUrl + "/Injection/start",
      injectionData,
      {
        headers: getHeaders(token),
      }
    );
    return axiosResult;
  }  /**
   * Stop Injection Operation
   * @param {Object} stopData - { operationId }
   * @param {string} token - JWT authentication token
   * @returns {Object} injection response
   */
  static async stopInjection(stopData, token) {
    const axiosResult = await axios.post(
      baseUrl + "/Injection/stop",
      stopData,
      {
        headers: getHeaders(token),
      }
    );
    return axiosResult;
  }  /**
   * Check if Injection Operation is Completed
   * @param {Object} statusData - { operationId }
   * @param {string} token - JWT authentication token
   * @returns {boolean} true if completed, false if still in progress
   */
  static async checkInjectionStatus(statusData, token) {
    const axiosResult = await axios.post(
      baseUrl + "/Injection/status",
      statusData,
      {
        headers: getHeaders(token),
      }
    );
    return axiosResult;
  }
  /**
   * Complete Injection Operation
   * @param {Object} completeData - { operationId }
   * @param {string} token - JWT authentication token
   * @returns {Object} injection response
   */
  static async completeInjection(completeData, token) {
    const axiosResult = await axios.post(
      baseUrl + "/Injection/complete",
      completeData,
      {
        headers: getHeaders(token),
      }
    );
    return axiosResult;
  }
  /**
   * Get Injection History
   * @param {string} token - JWT authentication token
   * @returns {Object} injection operations history
   */
  static async getInjectionHistory(token) {
    const axiosResult = await axios.get(baseUrl + "/Injection/history", {
      headers: getHeaders(token),
    });
    return axiosResult;
  }

  // ==================== MOVEMENT APIS ====================
  /**
   * Move Axis
   * @param {Object} movementData - { axis, direction, speed, steps }
   * @param {string} token - JWT authentication token
   * @returns {Object} movement response
   */
  static async moveAxis(movementData, token) {
    const axiosResult = await axios.post(
      baseUrl + "/Movement/move",
      movementData,
      {
        headers: getHeaders(token),
      }
    );
    return axiosResult;
  }
  /**
   * Home All Axes
   * @param {Object} homeData - { speed }
   * @param {string} token - JWT authentication token
   * @returns {Object} movement response
   */
  static async homeAxes(homeData = {}, token) {
    const axiosResult = await axios.post(
      baseUrl + "/Movement/home",
      homeData,
      {
        headers: getHeaders(token),
      }
    );
    return axiosResult;
  }  /**
   * Get Movement History
   * @param {string} token - JWT authentication token
   * @returns {Object} movement history data
   */
  static async getMovementHistory(token) {
    const axiosResult = await axios.get(baseUrl + "/Movement/history", {
      headers: getHeaders(token),
    });
    return axiosResult;
  }// ==================== ESP32 APIS ====================
  /**
   * Get ESP32 Connection Status
   * @param {string} token - JWT authentication token
   * @returns {Object} ESP32 connection status
   * Response: { connected: boolean, timestamp: string, message?: string, error?: string }
   */
  static async getEsp32Status(token) {
    const axiosResult = await axios.get(baseUrl + "/Esp32/status", {
      headers: getHeaders(token),
    });
    return axiosResult;
  }

}
