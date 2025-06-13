import React, { useState, useEffect } from 'react';
import DashboardLayout from '../Component/Layout/DashboardLayout';
import ApiManager from '../services/ApiManager';
import { useAuth } from '../context/AuthContext';

export default function Scanner() {
  const { token } = useAuth();
    const [isScanning, setIsScanning] = useState(false);

  const [ScanData, setScanData] = useState({});
  const [scanHistory, setScanHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);  // Load scan history on component mount
  useEffect(() => {
    loadScanHistory();
  }, []);

  // TODO: Enable real-time updates when backend implements /current-depth ebndpoint
  // Real-time depth measurement updates while scanning
  // useEffect(() => {
  //   let intervalId;
  //   
  //   if (isScanning && ScanData.scanId) {
  //     // Poll for current depth measurement every 2 seconds while scanning
  //     intervalId = setInterval(async () => {
  //       try {
  //         const response = await ApiManager.getCurrentDepthMeasurement();
  //         if (response?.data?.depthMeasurement !== undefined) {
  //           setScanData(prev => ({
  //             ...prev,
  //             depthMeasurement: response.data.depthMeasurement
  //           }));
  //         }
  //       } catch (error) {
  //         console.error('Failed to get current depth measurement:', error);
  //       }
  //     }, 2000);
  //   }
  //
  //   return () => {
  //     if (intervalId) {
  //       clearInterval(intervalId);
  //     }
  //   };
  // }, [isScanning, ScanData.scanId]);

  // Load scan history from API
  const loadScanHistory = async () => {
    try {
      setLoading(true);
      const response = await ApiManager.getScanHistory();
      setScanHistory(response.data || []);
    } catch (error) {
      console.error('Failed to load scan history:', error);
      setError('Failed to load scan history');
    } finally {
      setLoading(false);
    }  };

  // Start scan handler - calls actual API endpoint
  const handleStartScan = async () => {
    try {
      setIsScanning(true);
   
      setError(null);
      setScanData({});
      console.log('Starting infrared scan');
      
      // Call real API endpoint
      const response = await ApiManager.startScan();
      if (response && response.data && response.data.success) {
        setScanData({scanId: response.data.scanId, depthMeasurement: response.data.depthMeasurement});
        console.log('Scan started successfully:', response.data.message);

      } else {
        throw new Error(response?.data?.message || 'Failed to start scan');
      }
      
    } catch (error) {
      console.error('API call failed:', error);
      setError(error.message || 'Failed to start scan');
      setIsScanning(false);
    }
  };   const handleStopScan = async () => {
    try {
      setIsScanning(false);
      setError(null);
      
      console.log('Stopping scan with ID:', ScanData.scanId);
      
      // Prepare data for stop scan - use default depth if null
      const stopScanData = {
        scanId: ScanData.scanId,
        depthMeasurement: ScanData.depthMeasurement ?? 10 // Default to 10 if null/undefined
      };
      
      console.log('Stop scan data:', stopScanData);
      
      // Call stop endpoint - backend/hardware will handle sending final depth measurement
      const response = await ApiManager.stopScan(stopScanData);
      
      if (response && response.data && response.data.success) {
        // Update with final data from hardware
        setScanData({
          scanId: response.data.scanId, 
          depthMeasurement: response.data.depthMeasurement,
          status: response.data.status
        });
        console.log('Scan stopped successfully:', response.data.message);
        await loadScanHistory(); // Reload history
      } else {
        throw new Error(response?.data?.message || 'Failed to stop scan');
      }
      
    } catch (error) {
      console.error('API call failed:', error);
      setError(error.message || 'Failed to stop scan');
      setIsScanning(true); // Reset scanning state on error
    }
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
            </h2>

            {/* Scan Controls */}
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
                </button>              </div>
            </div>
          </div>

          {/* Infrared Value Display */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
              <i className="fa-solid fa-eye mr-2 text-purple-600"></i>
              Infrared Reading
            </h2>

            <div className="text-center">
              <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center">
                {ScanData.depthMeasurement !== null ? (
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400">
                      {ScanData.depthMeasurement}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">mm</div>
                  </div>
                ) : (
                  <div className="text-gray-400 dark:text-gray-500">
                    <i className="fa-solid fa-question text-2xl sm:text-4xl"></i>
                  </div>
                )}
              </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Depth Measurement
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {ScanData.depthMeasurement !== null 
                  ? `Detected depth: ${ScanData.depthMeasurement}mm`
                  : 'No reading available'
                }
              </p>            </div>
          </div>
        </div>

        {/* Scan History */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">     
               <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            <i className="fa-solid fa-history mr-2 text-green-600"></i>
            Recent Scans
          </h2>

          <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-3 sm:px-6 py-3">Date</th>
                    <th className="px-3 sm:px-6 py-3">Time</th>
                    <th className="px-3 sm:px-6 py-3">Depth (mm)</th>
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
                        </td>
                        <td className="px-3 sm:px-6 py-4 text-gray-700 dark:text-gray-300 text-xs sm:text-sm">
                          {scan.depthMeasurement.toFixed(3)} mm
                        </td>
                        <td className="px-3 sm:px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            scan.status === 'Success' || scan.status === 'Completed'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : scan.status === 'Failed' || scan.status === 'Error'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }`}>
                            {scan.status}
                          </span>
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
