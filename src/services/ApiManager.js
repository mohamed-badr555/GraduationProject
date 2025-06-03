// API Manager for ovoVax - Automated In-Ovo Vaccination System
// Similar structure to Hoson Platform ApiManager

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

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
  
  // ==================== AUTHENTICATION APIS ====================
  
  /**
   * User Login
   * @param {Object} credentials - { email, password }
   * @returns {Promise<Object>} response with token and user data
   */
  static async login(credentials) {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  /**
   * User Registration
   * @param {Object} userData - { email, password, firstName, lastName, role }
   * @returns {Promise<Object>} response with user data
   */
  static async register(userData) {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  /**
   * Validate Token
   * @param {string} token 
   * @returns {Promise<Object>} user data if token is valid
   */
  static async validateToken(token) {
    return apiRequest('/auth/validate', {
      method: 'GET',
      token,
    });
  }

  /**
   * Forgot Password - Send OTP to Email
   * @param {string} email 
   * @returns {Promise<Object>} response
   */
  static async forgotPassword(email) {
    return apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  /**
   * Reset Password
   * @param {Object} resetData - { email, otp, newPassword }
   * @returns {Promise<Object>} response
   */
  static async resetPassword(resetData) {
    return apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(resetData),
    });
  }

  /**
   * Logout
   * @param {string} token 
   * @returns {Promise<Object>} response
   */
  static async logout(token) {
    return apiRequest('/auth/logout', {
      method: 'POST',
      token,
    });
  }

  // ==================== DASHBOARD APIS ====================

  /**
   * Get Dashboard Statistics
   * @param {string} token 
   * @returns {Promise<Object>} dashboard data
   */
  static async getDashboardStats(token) {
    return apiRequest('/dashboard/stats', {
      method: 'GET',
      token,
    });
  }

  /**
   * Get System Status
   * @param {string} token 
   * @returns {Promise<Object>} system status data
   */
  static async getSystemStatus(token) {
    return apiRequest('/dashboard/system-status', {
      method: 'GET',
      token,
    });
  }

  // ==================== VACCINATION APIS ====================

  /**
   * Get Vaccination Sessions
   * @param {string} token 
   * @param {Object} params - query parameters
   * @returns {Promise<Object>} vaccination sessions
   */
  static async getVaccinationSessions(token, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/vaccination/sessions${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest(endpoint, {
      method: 'GET',
      token,
    });
  }

  /**
   * Create Vaccination Session
   * @param {string} token 
   * @param {Object} sessionData 
   * @returns {Promise<Object>} created session
   */
  static async createVaccinationSession(token, sessionData) {
    return apiRequest('/vaccination/sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
      token,
    });
  }

  /**
   * Update Vaccination Session
   * @param {string} token 
   * @param {string} sessionId 
   * @param {Object} updateData 
   * @returns {Promise<Object>} updated session
   */
  static async updateVaccinationSession(token, sessionId, updateData) {
    return apiRequest(`/vaccination/sessions/${sessionId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
      token,
    });
  }

  /**
   * Delete Vaccination Session
   * @param {string} token 
   * @param {string} sessionId 
   * @returns {Promise<Object>} response
   */
  static async deleteVaccinationSession(token, sessionId) {
    return apiRequest(`/vaccination/sessions/${sessionId}`, {
      method: 'DELETE',
      token,
    });
  }

  // ==================== ENVIRONMENTAL MONITORING APIS ====================

  /**
   * Get Environmental Data
   * @param {string} token 
   * @param {Object} params - { startDate, endDate, type }
   * @returns {Promise<Object>} environmental data
   */
  static async getEnvironmentalData(token, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/environmental/data${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest(endpoint, {
      method: 'GET',
      token,
    });
  }

  /**
   * Get Real-time Environmental Status
   * @param {string} token 
   * @returns {Promise<Object>} current environmental status
   */
  static async getRealTimeEnvironmentalStatus(token) {
    return apiRequest('/environmental/realtime', {
      method: 'GET',
      token,
    });
  }

  // ==================== EGG MONITORING APIS ====================

  /**
   * Get Egg Array Status
   * @param {string} token 
   * @returns {Promise<Object>} egg array data
   */
  static async getEggArrayStatus(token) {
    return apiRequest('/eggs/array-status', {
      method: 'GET',
      token,
    });
  }

  /**
   * Update Egg Status
   * @param {string} token 
   * @param {string} eggId 
   * @param {Object} statusData 
   * @returns {Promise<Object>} updated egg status
   */
  static async updateEggStatus(token, eggId, statusData) {
    return apiRequest(`/eggs/${eggId}/status`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
      token,
    });
  }

  // ==================== REPORTS APIS ====================

  /**
   * Generate Report
   * @param {string} token 
   * @param {Object} reportParams - { type, startDate, endDate, format }
   * @returns {Promise<Object>} report data or download link
   */
  static async generateReport(token, reportParams) {
    return apiRequest('/reports/generate', {
      method: 'POST',
      body: JSON.stringify(reportParams),
      token,
    });
  }

  /**
   * Get Available Reports
   * @param {string} token 
   * @returns {Promise<Object>} list of available reports
   */
  static async getAvailableReports(token) {
    return apiRequest('/reports', {
      method: 'GET',
      token,
    });
  }

  // ==================== ANALYTICS APIS ====================

  /**
   * Get Analytics Data
   * @param {string} token 
   * @param {Object} params - { period, metric, filters }
   * @returns {Promise<Object>} analytics data
   */
  static async getAnalyticsData(token, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/analytics${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest(endpoint, {
      method: 'GET',
      token,
    });
  }

  // ==================== ALERTS APIS ====================

  /**
   * Get Alerts
   * @param {string} token 
   * @param {Object} params - { status, type, page, limit }
   * @returns {Promise<Object>} alerts data
   */
  static async getAlerts(token, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/alerts${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest(endpoint, {
      method: 'GET',
      token,
    });
  }

  /**
   * Mark Alert as Read
   * @param {string} token 
   * @param {string} alertId 
   * @returns {Promise<Object>} response
   */
  static async markAlertAsRead(token, alertId) {
    return apiRequest(`/alerts/${alertId}/read`, {
      method: 'PUT',
      token,
    });
  }

  /**
   * Dismiss Alert
   * @param {string} token 
   * @param {string} alertId 
   * @returns {Promise<Object>} response
   */
  static async dismissAlert(token, alertId) {
    return apiRequest(`/alerts/${alertId}/dismiss`, {
      method: 'PUT',
      token,
    });
  }

  // ==================== SETTINGS APIS ====================

  /**
   * Get User Settings
   * @param {string} token 
   * @returns {Promise<Object>} user settings
   */
  static async getUserSettings(token) {
    return apiRequest('/settings', {
      method: 'GET',
      token,
    });
  }

  /**
   * Update User Settings
   * @param {string} token 
   * @param {Object} settings 
   * @returns {Promise<Object>} updated settings
   */
  static async updateUserSettings(token, settings) {
    return apiRequest('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
      token,
    });
  }

  /**
   * Get System Settings
   * @param {string} token 
   * @returns {Promise<Object>} system settings
   */
  static async getSystemSettings(token) {
    return apiRequest('/settings/system', {
      method: 'GET',
      token,
    });
  }

  /**
   * Update System Settings
   * @param {string} token 
   * @param {Object} settings 
   * @returns {Promise<Object>} updated settings
   */
  static async updateSystemSettings(token, settings) {
    return apiRequest('/settings/system', {
      method: 'PUT',
      body: JSON.stringify(settings),
      token,
    });
  }
}

// Export for easy importing
export { ApiManager };
