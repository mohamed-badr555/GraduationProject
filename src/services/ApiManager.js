import axios from "axios";

// API Manager for ovoVax - Automated In-Ovo Vaccination System
// Only includes endpoints that actually exist in the backend
// No authentication endpoints until backend implements them

// const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://ovovax.runasp.net/api";
const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://localhost:7268/api";

// Helper function to get headers (no token for now)
const getHeaders = () => {
  return {
    "Content-Type": "application/json",
  };
};


export default class ApiManager {
  // ==================== SCANNER APIS ====================

  /**
   * Start Scanner
   * @returns {Object} scan response with scanId
   * Response: { success: boolean, message: string, scanId: number, status: string|null, readings: number[]|null, readingCount: number }
   */
  static async startScan() {
    const axiosResult = await axios.get(
      baseUrl + "/Scanner/start",
      {
        headers: getHeaders(),
      }
    );
    return axiosResult;
  }

  /**
   * Stop Scanner
   * @param {Object} stopData - { scanId: number }
   * @returns {Object} scan response with readings array
   * Response: { success: boolean, message: string, scanId: number, status: string, readings: number[], readingCount: number }
   */
  static async stopScan(stopData) {
    const axiosResult = await axios.post(
      baseUrl + "/Scanner/stop",
      stopData,
      {
        headers: getHeaders(),
      }
    );
    return axiosResult;
  }

  /**
   * Get Scanner History
   * @returns {Object} scan history data
   * Response: Array of { id: number, scanTime: string, sensorReadings: number[], readingCount: number, status: string, errorMessage: string|null }
   */
  static async getScanHistory() {
    const axiosResult = await axios.get(baseUrl + "/Scanner/history", {
      headers: getHeaders(),
    });
    return axiosResult;
  }

  // ==================== INJECTION APIS ====================

  /**
   * Start Injection Operation
   * @param {Object} injectionData - { rangeOfInfraredFrom, rangeOfInfraredTo, stepOfInjection, volumeOfLiquid, numberOfElements }
   * @returns {Object} injection response with operationId
   */
  static async startInjection(injectionData) {
    const axiosResult = await axios.post(
      baseUrl + "/Injection/start",
      injectionData,
      {
        headers: getHeaders(),
      }
    );
    return axiosResult;
  }
  /**
   * Stop Injection Operation
   * @param {Object} stopData - { operationId }
   * @returns {Object} injection response
   */
  static async stopInjection(stopData) {
    const axiosResult = await axios.post(
      baseUrl + "/Injection/stop",
      stopData,
      {
        headers: getHeaders(),
      }
    );
    return axiosResult;
  }

  /**
   * Check if Injection Operation is Completed
   * @param {Object} statusData - { operationId }
   * @returns {boolean} true if completed, false if still in progress
   */
  static async checkInjectionStatus(statusData) {
    const axiosResult = await axios.post(
      baseUrl + "/Injection/status",
      statusData,
      {
        headers: getHeaders(),
      }
    );
    return axiosResult;
  }

  /**
   * Get Injection History
   * @returns {Object} injection operations history
   */
  static async getInjectionHistory() {
    const axiosResult = await axios.get(baseUrl + "/Injection/history", {
      headers: getHeaders(),
    });
    return axiosResult;
  }

  // ==================== MANUAL CONTROL APIS ====================
  /**
   * Move Axis
   * @param {Object} movementData - { axis, direction, speed } - step removed, hardware handles it internally
   * @returns {Object} movement response
   */
  static async moveAxis(movementData) {
    const axiosResult = await axios.post(
      baseUrl + "/Movement/move",
      movementData,
      {
        headers: getHeaders(),
      }
    );
    return axiosResult;
  }  /**
   * Home All Axes
   * @param {Object} homeData - { speed } - speed parameter added (1-100, default 50)
   * @returns {Object} movement response
   */
  static async homeAxes(homeData = {}) {
    const axiosResult = await axios.post(
      baseUrl + "/Movement/home",
      homeData,
      {
        headers: getHeaders(),
      }
    );
    return axiosResult;
  }

  /**
   * Get Movement History
   * @returns {Object} movement history data
   */
  static async getMovementHistory() {
    const axiosResult = await axios.get(baseUrl + "/Movement/history", {
      headers: getHeaders(),
    });
    return axiosResult;
  }

  /**
   * Get Movement Status
   * @returns {Object} movement status
   */
  static async getMovementStatus() {
    const axiosResult = await axios.get(baseUrl + "/Movement/status", {
      headers: getHeaders(),
    });
    return axiosResult;
  }
}
