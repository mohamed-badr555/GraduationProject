import React, { useState, useEffect } from 'react';
import DashboardLayout from '../Component/Layout/DashboardLayout';

export default function Scanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [infraredValue, setInfraredValue] = useState(null);
  const [scanProgress, setScanProgress] = useState(0);

  // Simulate scanning process
  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            setIsScanning(false);
            setInfraredValue(Math.floor(Math.random() * 100) + 50); // Random infrared value
            return 100;
          }
          return prev + 2;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isScanning]);
  const handleStartScan = async () => {
    setIsScanning(true);
    setScanProgress(0);
    setInfraredValue(null);
    
    // TODO: Replace with actual API call to hardware system
    console.log('Starting infrared scan');
    
    /*
    // Future API integration for hardware engineering team:
    try {
      const response = await fetch('/api/scanner/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        console.log('Scan started successfully');
      } else {
        console.error('Failed to start scan');
        setIsScanning(false);
      }
    } catch (error) {
      console.error('API call failed:', error);
      setIsScanning(false);
    }
    */
  };

  const handleStopScan = async () => {
    setIsScanning(false);
    setScanProgress(0);
    
    console.log('Stopping scan');
    
    /*
    // Future API integration for hardware engineering team:
    try {
      const response = await fetch('/api/scanner/stop', {
        method: 'POST'
      });
      
      if (response.ok) {
        console.log('Scan stopped successfully');
      } else {
        console.error('Failed to stop scan');
      }
    } catch (error) {
      console.error('API call failed:', error);
    }
    */
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">        {/* Header */}        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Scanner Control</h1>
            <p className="text-gray-600 dark:text-gray-400">Infrared depth scanning system</p>
          </div>
        </div>

        {/* Main Scanner Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">          {/* Scanner Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              <i className="fa-solid fa-microscope mr-2 text-blue-600"></i>
              Scanner Controls
            </h2>

            {/* Scan Controls */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">                <button
                  onClick={handleStartScan}
                  disabled={isScanning}
                  className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  <i className="fa-solid fa-play mr-2"></i>
                  Start Scan
                </button>
                
                <button
                  onClick={handleStopScan}
                  disabled={!isScanning}
                  className="flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  <i className="fa-solid fa-stop mr-2"></i>
                  Stop Scan
                </button>
              </div>

              {/* Progress Bar */}
              {isScanning && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Scanning Progress</span>
                    <span>{scanProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-200"
                      style={{ width: `${scanProgress}%` }}
                    ></div>
                  </div>                </div>
              )}
            </div>
          </div>          {/* Infrared Value Display */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              <i className="fa-solid fa-eye mr-2 text-purple-600"></i>
              Infrared Reading
            </h2>

            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center">
                {infraredValue !== null ? (
                  <div>
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                      {infraredValue}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">mm</div>
                  </div>
                ) : (
                  <div className="text-gray-400 dark:text-gray-500">
                    <i className="fa-solid fa-question text-4xl"></i>
                  </div>
                )}
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Depth Measurement
              </h3>              <p className="text-gray-600 dark:text-gray-400">
                {infraredValue !== null 
                  ? `Detected depth: ${infraredValue}mm`
                  : 'No reading available'
                }
              </p>
            </div>
          </div>
        </div>        {/* Scan History */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            <i className="fa-solid fa-history mr-2 text-green-600"></i>
            Recent Scans
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">              <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3">Time</th>
                  <th className="px-6 py-3">Depth (mm)</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>                {[
                  { time: '14:30:25', depth: 75, status: 'Success' },
                  { time: '14:29:45', depth: 68, status: 'Success' },
                  { time: '14:29:12', depth: 72, status: 'Success' },
                ].map((scan, index) => (
                  <tr key={index} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {scan.time}
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      {scan.depth}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                        {scan.status}
                      </span>
                    </td>
                  </tr>
                ))}</tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
