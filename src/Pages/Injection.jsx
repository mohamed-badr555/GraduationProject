import React, { useState, useEffect } from 'react';
import DashboardLayout from '../Component/Layout/DashboardLayout';
import ApiManager from '../services/ApiManager';
import { useAuth } from '../context/AuthContext';

const Injection = () => {
  const { token } = useAuth();
  // Injection system state
  const [isInjecting, setIsInjecting] = useState(false);
  const [injectionHistory, setInjectionHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Injection parameters
  const [rangeOfInfrared, setRangeOfInfrared] = useState('');
  const [stepOfInjection, setStepOfInjection] = useState('');
  const [volumeOfLiquid, setVolumeOfLiquid] = useState('');
  const [numberOfElements, setNumberOfElements] = useState('');  // Load injection history on component mount
  useEffect(() => {
    loadInjectionHistory();
  }, []);

  // Load injection history from API
  const loadInjectionHistory = async () => {
    try {
      setLoading(true);
      const response = await ApiManager.getInjectionHistory(token);
      setInjectionHistory(response.data || []);
    } catch (error) {
      console.error('Failed to load injection history:', error);
      setError('Failed to load injection history');
    } finally {
      setLoading(false);
    }
  };

  // Handle start injection - API call will be made here
  const handleStartInjection = async () => {
    if (rangeOfInfrared && stepOfInjection && volumeOfLiquid && numberOfElements) {
      try {
        setIsInjecting(true);
        setError(null);
        
        const injectionData = {
          rangeOfInfrared: parseFloat(rangeOfInfrared),
          stepOfInjection: parseFloat(stepOfInjection),
          volumeOfLiquid: parseFloat(volumeOfLiquid),
          numberOfElements: parseInt(numberOfElements)
        };
        
        console.log('Starting injection with parameters:', injectionData);
        
        // Call real API endpoint
        const response = await ApiManager.startInjection(token, injectionData);
        
        if (response.success) {
          console.log('Injection started successfully:', response.message);
          await loadInjectionHistory(); // Reload history
        } else {
          throw new Error(response.message || 'Failed to start injection');
        }
        
      } catch (error) {
        console.error('API call failed:', error);
        setError(error.message || 'Failed to start injection');
        setIsInjecting(false);
      }
    } else {
      setError('Please fill in all injection parameters');
    }
  };
  // Handle stop injection - API call will be made here
  const handleStopInjection = async () => {
    try {
      setIsInjecting(false);
      setError(null);
      
      console.log('Stopping injection');
      
      // Call real API endpoint
      const response = await ApiManager.stopInjection(token);
      
      if (response.success) {
        console.log('Injection stopped successfully:', response.message);
        await loadInjectionHistory(); // Reload history
      } else {
        throw new Error(response.message || 'Failed to stop injection');
      }
      
    } catch (error) {
      console.error('API call failed:', error);
      setError(error.message || 'Failed to stop injection');
    }
  };
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AVO VAX Injection System</h1>
            <p className="text-gray-600 dark:text-gray-400">Automated egg injection control panel</p>
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
          </div>
        )}

        {/* Loading Display */}
        {loading && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <i className="fa-solid fa-spinner fa-spin text-blue-500 mr-2"></i>
              <p className="text-blue-800 dark:text-blue-400 font-medium">Loading...</p>
            </div>
          </div>
        )}        {/* Injection Parameters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
            <i className="fa-solid fa-cog mr-2 text-green-600"></i>
            Injection Parameters
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Range Of Infrared */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Range Of Infrared (mm)
              </label>
              <input
                type="number"
                value={rangeOfInfrared}
                onChange={(e) => setRangeOfInfrared(e.target.value)}
                className="w-full sm:w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>            {/* Step Of Injection */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Step Of Injection (mm)
              </label>
              <input
                type="number"
                value={stepOfInjection}
                onChange={(e) => setStepOfInjection(e.target.value)}
                className="w-full sm:w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>

            {/* Volume Of Liquid */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Volume Of Liquid (ml)
              </label>
              <input
                type="number"
                step="0.1"
                value={volumeOfLiquid}
                onChange={(e) => setVolumeOfLiquid(e.target.value)}
                className="w-full sm:w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.0"
              />
            </div>

            {/* Number Of Elements */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Number Of Elements
              </label>
              <input
                type="number"
                value={numberOfElements}
                onChange={(e) => setNumberOfElements(e.target.value)}
                className="w-full sm:w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Injection Control */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
            <i className="fa-solid fa-syringe mr-2 text-purple-600"></i>
            Injection Control
          </h2>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleStartInjection}
              disabled={
                isInjecting || 
                !rangeOfInfrared || 
                !stepOfInjection || 
                !volumeOfLiquid || 
                !numberOfElements
              }
              className="flex items-center justify-center px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold text-lg"
            >
              <i className="fa-solid fa-play mr-2"></i>
              Start Injection
            </button>
            
            <button
              onClick={handleStopInjection}
              disabled={!isInjecting}
              className="flex items-center justify-center px-8 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold text-lg"
            >
              <i className="fa-solid fa-stop mr-2"></i>
              Stop Injection
            </button>
          </div>

          {/* Status Display */}
          {isInjecting && (
            <div className="mt-6 text-center">
              <div className="flex items-center justify-center text-orange-600 dark:text-orange-400 font-semibold">
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Injection in progress...
              </div>
              <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-orange-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
            </div>
          )}
        </div>

        {/* System Status */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            <i className="fa-solid fa-chart-line mr-2 text-blue-600"></i>
            System Status
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                Ready
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">System Status</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {isInjecting ? 'Active' : 'Idle'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Injection Status</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {volumeOfLiquid || '0'}ml
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Volume Set</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {numberOfElements || '0'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Elements Count</div>
            </div>
          </div>
        </div>

        {/* Injection History */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            <i className="fa-solid fa-history mr-2 text-purple-600"></i>
            Injection History
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3">Time</th>
                  <th className="px-6 py-3">Egg #</th>
                  <th className="px-6 py-3">Volume (ml)</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                      Loading injection history...
                    </td>
                  </tr>
                ) : injectionHistory.length > 0 ? (
                  injectionHistory.map((injection, index) => (
                    <tr key={injection.id || index} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {new Date(injection.timestamp || injection.time).toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                        {injection.eggNumber || injection.egg || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                        {injection.volume || injection.volumeOfLiquid || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          injection.status === 'Success' || injection.status === 'Completed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : injection.status === 'Failed' || injection.status === 'Error'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {injection.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      No injection history available
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
};

export default Injection;
