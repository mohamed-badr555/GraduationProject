// API Manager for ovoVax - Automated In-Ovo Vaccination System
// Contains only the essential API methods that are actively used by React components
// Cleaned up version with unused methods removed for better maintainability

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7268/api';

// Helper function to get headers
const getHeaders = (token = null, contentType = 'application/json') => {
  const headers = {
    'Content-Type': contentType,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Helper function for API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getHeaders(options.token, options.contentType),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

export default class ApiManager {
  
  // ==================== SCANNER APIS ====================

  /**
   * Start Scanner
   * @param {string} token 
   * @returns {Promise<Object>} scan response
   */
  static async startScan(token) {
    return apiRequest('/scanner/start', {
      method: 'POST',
      token,
    });
  }

  /**
   * Stop Scanner
   * @param {string} token 
   * @returns {Promise<Object>} scan response
   */
  static async stopScan(token) {
    return apiRequest('/scanner/stop', {
      method: 'POST',
      token,
    });
  }
  /**
   * Get Scanner History
   * @param {string} token 
   * @returns {Promise<Object>} scan history data
   */
  static async getScanHistory(token) {
    return apiRequest('/scanner/history', {
      method: 'GET',
      token,
    });
  }

  // ==================== INJECTION APIS ====================

  /**
   * Start Injection
   * @param {string} token 
   * @param {Object} injectionData - { rangeOfInfrared, stepOfInjection, volumeOfLiquid, numberOfElements }
   * @returns {Promise<Object>} injection response
   */
  static async startInjection(token, injectionData) {
    return apiRequest('/injection/start', {
      method: 'POST',
      body: JSON.stringify(injectionData),
      token,
    });
  }

  /**
   * Stop Injection
   * @param {string} token 
   * @returns {Promise<Object>} injection response
   */
  static async stopInjection(token) {
    return apiRequest('/injection/stop', {
      method: 'POST',
      token,
    });
  }
  /**
   * Get Injection History
   * @param {string} token 
   * @returns {Promise<Object>} injection history data
   */
  static async getInjectionHistory(token) {
    return apiRequest('/injection/history', {
      method: 'GET',
      token,
    });
  }

  // ==================== MANUAL CONTROL APIS ====================

  /**
   * Move Axis
   * @param {string} token 
   * @param {Object} movementData - { axis, direction, step, speed }
   * @returns {Promise<Object>} movement response
   */
  static async moveAxis(token, movementData) {
    return apiRequest('/movement/move', {
      method: 'POST',
      body: JSON.stringify(movementData),
      token,
    });
  }

  /**
   * Home All Axes
   * @param {string} token 
   * @returns {Promise<Object>} movement response
   */
  static async homeAxes(token) {
    return apiRequest('/movement/home', {
      method: 'POST',
      token,
    });
  }
  /**
   * Get Movement History
   * @param {string} token 
   * @returns {Promise<Object>} movement history data
   */
  static async getMovementHistory(token) {
    return apiRequest('/movement/history', {
      method: 'GET',
      token,
    });
  }
}

// Export for easy importing
export { ApiManager };
