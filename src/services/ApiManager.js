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
   * @returns {Object} scan response
   */
  static async startScan() {
    const axiosResult = await axios.get(
      baseUrl + "/Scanner/start",
      {
        headers: getHeaders(),
      }
    );
    return axiosResult;
  }  /**
   * Stop Scanner
   * @param {Object} scanData - { scanId, depthMeasurement } - depthMeasurement defaults to 10 if null
   * @returns {Object} scan response
   */
  static async stopScan(scanData) {
    const axiosResult = await axios.post(
      baseUrl + "/Scanner/stop",
      scanData,
      {
        headers: getHeaders(),
      }
    );
    return axiosResult;
  }
  /**
   * Get Scanner History
   * @returns {Object} scan history data
   */
  static async getScanHistory() {
    const axiosResult = await axios.get(baseUrl + "/Scanner/history", {
      headers: getHeaders(),
    });
    return axiosResult;
  }

  // TODO: Add getCurrentDepthMeasurement when hardware integration is ready
  // /**
  //  * Get Current Depth Measurement (for real-time updates)
  //  * @returns {Object} current depth measurement
  //  */
  // static async getCurrentDepthMeasurement() {
  //   const axiosResult = await axios.get(baseUrl + "/Scanner/current-depth", {
  //     headers: getHeaders(),
  //   });
  //   return axiosResult;
  // }
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
   * @param {Object} movementData - { axis, direction, step, speed }
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
  }

  /**
   * Home All Axes
   * @returns {Object} movement response
   */
  static async homeAxes() {
    const axiosResult = await axios.post(
      baseUrl + "/Movement/home",
      {},
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
