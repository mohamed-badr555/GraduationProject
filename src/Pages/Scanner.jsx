import React, { useState, useEffect } from 'react';
import DashboardLayout from '../Component/Layout/DashboardLayout';
import ApiManager from '../services/ApiManager';
import { useAuth } from '../context/AuthContext';

export default function Scanner() {
  const { token } = useAuth();
  const [isScanning, setIsScanning] = useState(false);const [scanData, setScanData] = useState({});
  const [scanHistory, setScanHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load scan history on component mount
  useEffect(() => {
    loadScanHistory();
  }, []);  // Load scan history from API
  const loadScanHistory = async () => {
    try {
      setLoading(true);
      const response = await ApiManager.getScanHistory(token);
      setScanHistory(response.data || []);
    } catch (error) {
      console.error('Failed to load scan history:', error);
      setError('Failed to load scan history');
    } finally {
      setLoading(false);
    }
  };  // Start scan handler - calls actual API endpoint
  const handleStartScan = async () => {
    try {
      setIsScanning(true);
      setError(null);
      setScanData({});
      console.log('Starting infrared scan');
      
      // Call real API endpoint
      const response = await ApiManager.startScan(token);
      if (response && response.data && response.data.success) {
        setScanData({
          scanId: response.data.scanId,
          status: response.data.status,
          readings: response.data.readings,
          readingCount: response.data.readingCount
        });
        console.log('Scan started successfully:', response.data.message);
      } else {
        throw new Error(response?.data?.message || 'Failed to start scan');
      }
      
    } catch (error) {
      console.error('API call failed:', error);
      setError(error.message || 'Failed to start scan');
      setIsScanning(false);
    }
  };  const handleStopScan = async () => {
    try {
      setError(null);
      
      console.log('Stopping scan with ID:', scanData.scanId);
      
      // Call stop endpoint with scanId only
      const stopData = { scanId: scanData.scanId };
      console.log('Stop scan data:', stopData);
      
      const response = await ApiManager.stopScan(stopData, token);
      
      if (response && response.data && response.data.success) {
        // Update with final data from backend
        setScanData({
          scanId: response.data.scanId, 
          status: response.data.status,
          readings: response.data.readings,
          readingCount: response.data.readingCount
        });
        console.log('Scan stopped successfully:', response.data.message);
        console.log('Readings received:', response.data.readings);
        setIsScanning(false);
        await loadScanHistory(); // Reload history
      } else {
        throw new Error(response?.data?.message || 'Failed to stop scan');
      }
      
    } catch (error) {
      console.error('API call failed:', error);
      setError(error.message || 'Failed to stop scan');
      // Don't reset scanning state on error - let user try again
    }
  };
  
  // Clear readings data
  const handleClearReadings = () => {
    setScanData({});
    setError(null);
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Scanner Control</h1>
            <p className="text-gray-600 dark:text-gray-400">Infrared depth scanning system</p>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <i className="fa-solid fa-exclamation-triangle text-red-500 mr-2"></i>
              <p className="text-red-800 dark:text-red-400 font-medium">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="ml-auto text-red-500 hover:text-red-700 dark:hover:text-red-300"
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
          </div>        )}

        {/* Loading Display */}
        {loading && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <i className="fa-solid fa-spinner fa-spin text-blue-500 mr-2"></i>
              <p className="text-blue-800 dark:text-blue-400 font-medium">Loading...</p>
            </div>
          </div>
        )}

        {/* Main Scanner Interface */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
          {/* Scanner Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
              <i className="fa-solid fa-microscope mr-2 text-blue-600"></i>
              Scanner Controls
            </h2>            {/* Scan Controls */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <button
                  onClick={handleStartScan}
                  disabled={isScanning}
                  className="flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                >
                  <i className="fa-solid fa-play mr-2"></i>
                  Start Scan
                </button>
                <button
                  onClick={handleStopScan}
                  disabled={!isScanning}
                  className="flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                >
                  <i className="fa-solid fa-stop mr-2"></i>
                  Stop Scan
                </button>
              </div>
              <button
                onClick={handleClearReadings}
                disabled={isScanning}
                className="w-full flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
              >
                <i className="fa-solid fa-trash mr-2"></i>
                Clear Readings
              </button>
            </div>
          </div>  
                  {/* Infrared Value Display */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
              <i className="fa-solid fa-eye mr-2 text-purple-600"></i>
              Sensor Readings
            </h2>

            <div className="text-center">
              <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center">
                {scanData.readingCount > 0 ? (
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400">
                      {scanData.readingCount}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">readings</div>
                  </div>
                ) : (
                  <div className="text-gray-400 dark:text-gray-500">
                    <i className="fa-solid fa-question text-2xl sm:text-4xl"></i>
                  </div>
                )}
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {isScanning ? 'Scanning in Progress' : 'Sensor Data'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {scanData.readingCount > 0 
                  ? `${scanData.readingCount} readings collected`
                  : isScanning 
                    ? 'Collecting sensor data...'
                    : 'No readings available'
                }
              </p>              { scanData.readings && scanData.readings.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    All Readings ({scanData.readings.length} total):
                  </h4>                  <div className="max-h-32 overflow-y-auto bg-gray-50 dark:bg-gray-700 rounded-lg p-3 border">
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                      {scanData.readings.map((reading, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <span className="text-xs text-gray-500 dark:text-gray-400">#{index + 1}</span>
                          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded text-xs font-medium">
                            {reading.toFixed(1)} mm
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scan History */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">     
               <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            <i className="fa-solid fa-history mr-2 text-green-600"></i>
            Recent Scans
          </h2>          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-3 sm:px-6 py-3">Date</th>
                  <th className="px-3 sm:px-6 py-3">Time</th>
                  <th className="px-3 sm:px-6 py-3">Readings</th>
                  <th className="px-3 sm:px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-3 sm:px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                      Loading scan history...
                    </td>
                  </tr>
                ) : scanHistory.length > 0 ? (
                  scanHistory.map((scan, index) => (
                    <tr key={scan.id || index} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                      <td className="px-3 sm:px-6 py-4 font-medium text-gray-900 dark:text-white text-xs sm:text-sm">
                        {new Date(scan.scanTime).toLocaleDateString()}
                      </td>
                      <td className="px-3 sm:px-6 py-4 font-medium text-gray-900 dark:text-white text-xs sm:text-sm">
                        {new Date(scan.scanTime).toLocaleTimeString()}
                      </td>                      <td className="px-3 sm:px-6 py-4 text-gray-700 dark:text-gray-300 text-xs sm:text-sm">
                        <div className="flex flex-col">
                          <span className="font-medium mb-2">{scan.readingCount} readings</span>
                          {scan.readings && scan.readings.length > 0 && (
                            <select className="px-2 py-1 text-xs bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 dark:text-gray-300">
                              <option value="">View all readings...</option>
                              {scan.readings.map((reading, index) => (
                                <option key={index} value={reading}>
                                  #{index + 1}: {reading.toFixed(1)} mm
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      </td>                      <td className="px-3 sm:px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          scan.status === 'Success' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : scan.status === 'Failed'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {scan.status}
                        </span>
                        {scan.errorMessage && (
                          <div className="text-xs text-red-500 dark:text-red-400 mt-1" title={scan.errorMessage}>
                            Error occurred
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-3 sm:px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      No scan history available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
