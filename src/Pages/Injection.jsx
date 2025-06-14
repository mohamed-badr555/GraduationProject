import React, { useState, useEffect } from 'react';
import DashboardLayout from '../Component/Layout/DashboardLayout';
import ApiManager from '../services/ApiManager';
import { useAuth } from '../context/AuthContext';

const Injection = () => {
  const { token } = useAuth();
  // Injection system state
  const [isInjecting, setIsInjecting] = useState(false);
  const [currentOperationId, setCurrentOperationId] = useState(null);
  const [injectionHistory, setInjectionHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Injection parameters
  const [rangeOfInfraredFrom, setRangeOfInfraredFrom] = useState('');
  const [rangeOfInfraredTo, setRangeOfInfraredTo] = useState('');
  const [stepOfInjection, setStepOfInjection] = useState('');
  const [volumeOfLiquid, setVolumeOfLiquid] = useState(''); 
   const [numberOfElements, setNumberOfElements] = useState('');
  // Load injection history on component mount
  useEffect(() => {
    loadInjectionHistory();
  }, []);

  // Poll injection status when operation is active
  useEffect(() => {
    let statusInterval;
    
    if (isInjecting && currentOperationId) {
      // Poll every 3 seconds to check if injection is completed
      statusInterval = setInterval(async () => {
        try {
          console.log('Checking injection status for operation:', currentOperationId);
          const response = await ApiManager.checkInjectionStatus({
            operationId: currentOperationId
          });
          
          // Backend returns true if completed, false if still in progress
          if (response.data === true) {
            console.log('Injection completed by ESP32!');
            setIsInjecting(false);
            setCurrentOperationId(null);
            await loadInjectionHistory(); // Reload history to show completed operation
          }
        } catch (error) {
          console.error('Failed to check injection status:', error);
          // Don't show error to user for status polling
        }
      }, 3000); // Check every 3 seconds
    }

    return () => {
      if (statusInterval) {
        clearInterval(statusInterval);
      }
    };
  }, [isInjecting, currentOperationId]);

  // Helper function to parse backend validation errors
  const parseBackendError = (error) => {
    if (error.response?.data) {
      const errorData = error.response.data;
      
      // Handle validation errors (400 status with errors object)
      if (errorData.errors && typeof errorData.errors === 'object') {
        const errorMessages = [];        Object.keys(errorData.errors).forEach(field => {
          const fieldErrors = errorData.errors[field];
          if (Array.isArray(fieldErrors)) {
            fieldErrors.forEach(msg => {
              // Format field name for better readability
              const fieldName = field.replace(/([A-Z])/g, ' $1').trim();
              errorMessages.push(`${fieldName}: ${msg}`);
            });
          } else {
            const fieldName = field.replace(/([A-Z])/g, ' $1').trim();
            errorMessages.push(`${fieldName}: ${fieldErrors}`);
          }
        });
        return errorMessages.join('\n');
      }
      
      // Handle single error message
      if (errorData.message) {
        return errorData.message;
      }
      
      // Handle title from validation response
      if (errorData.title) {
        return errorData.title;
      }
    }
    
    // Fallback to generic error message
    return error.message || 'An unexpected error occurred';  };

  // Load injection history from API
  const loadInjectionHistory = async () => {
    try {
      setLoading(true);
      const response = await ApiManager.getInjectionHistory();
      setInjectionHistory(response.data || []);
    } catch (error) {
      console.error('Failed to load injection history:', error);
      console.error('Error response:', error.response?.data);
      
      const errorMessage = parseBackendError(error);
      setError(`Failed to load injection history: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };
   // Handle start injection - API call will be made here
  const handleStartInjection = async () => {
    // Validate all required parameters
    if (!rangeOfInfraredFrom || !rangeOfInfraredTo || !stepOfInjection || !volumeOfLiquid || !numberOfElements) {
      setError('Please fill in all injection parameters');
      return;
    }

    try {
      setIsInjecting(true);
      setError(null);
      
      const injectionData = {
        rangeOfInfraredFrom: parseFloat(rangeOfInfraredFrom),
        rangeOfInfraredTo: parseFloat(rangeOfInfraredTo),
        stepOfInjection: parseFloat(stepOfInjection),
        volumeOfLiquid: parseFloat(volumeOfLiquid),
        numberOfElements: parseInt(numberOfElements)
      };
      
      console.log('Starting injection operation with parameters:', injectionData);
      
      // Call real API endpoint
      const response = await ApiManager.startInjection(injectionData);
        if (response && response.data && response.data.success) {
        setCurrentOperationId(response.data.operationId);
        console.log('Injection operation started successfully:', response.data.message);
        console.log('Operation ID:', response.data.operationId);
        console.log('Status polling will begin to check completion...');
      } else {
        throw new Error(response?.data?.message || 'Failed to start injection');
      }
        } catch (error) {
      console.error('API call failed:', error);
      console.error('Error response:', error.response?.data);
      
      const errorMessage = parseBackendError(error);
      setError(errorMessage);
      setIsInjecting(false);
      setCurrentOperationId(null);
    }
  }; 
   // Handle stop injection - API call will be made here
  const handleStopInjection = async () => {
    if (!currentOperationId) {
      setError('No active injection operation to stop');
      return;
    }

    try {
      setError(null);
      
      console.log('Stopping injection operation:', currentOperationId);
      
      // Call real API endpoint
      const response = await ApiManager.stopInjection({
        operationId: currentOperationId
      });
      
      if (response && response.data && response.data.success) {
        console.log('Injection operation stopped successfully:', response.data.message);
        setIsInjecting(false);
        setCurrentOperationId(null);
        await loadInjectionHistory(); // Reload history
      } else {
        throw new Error(response?.data?.message || 'Failed to stop injection');
      }
        } catch (error) {
      console.error('API call failed:', error);
      console.error('Error response:', error.response?.data);
      
      const errorMessage = parseBackendError(error);
      setError(errorMessage);
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
        </div>        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <i className="fa-solid fa-exclamation-triangle text-red-500 mr-2 mt-0.5"></i>
              <div className="flex-1">
                <p className="text-red-800 dark:text-red-400 font-medium whitespace-pre-line">{error}</p>
              </div>
              <button 
                onClick={() => setError(null)}
                className="ml-auto text-red-500 hover:text-red-700 dark:hover:text-red-300 flex-shrink-0"
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
        )}       
         {/* Injection Parameters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
            <i className="fa-solid fa-cog mr-2 text-green-600"></i>
            Injection Parameters
          </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Range Of Infrared From */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Range From (mm)
              </label>
              <input
                type="number"
                step="0.1"
                value={rangeOfInfraredFrom}
                onChange={(e) => setRangeOfInfraredFrom(e.target.value)}
                className="w-full sm:w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="25.0"
              />
            </div>

            {/* Range Of Infrared To */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Range To (mm)
              </label>
              <input
                type="number"
                step="0.1"
                value={rangeOfInfraredTo}
                onChange={(e) => setRangeOfInfraredTo(e.target.value)}
                className="w-full sm:w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="30.0"
              />
            </div>{/* Step Of Injection */}
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
          
          <div className="flex justify-center space-x-4">            <button
              onClick={handleStartInjection}
              disabled={
                isInjecting || 
                !rangeOfInfraredFrom || 
                !rangeOfInfraredTo || 
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
            >              <i className="fa-solid fa-stop mr-2"></i>
              Stop Injection
            </button>
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
                  <th className="px-4 py-3">Operation ID</th>
                  <th className="px-4 py-3">Start Time</th>
                  <th className="px-4 py-3">End Time</th>
                  <th className="px-4 py-3">Volume (ml)</th>
                  <th className="px-4 py-3">Elements</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                      <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                      Loading injection history...
                    </td>
                  </tr>
                ) : injectionHistory.length > 0 ? (
                  injectionHistory.map((operation, index) => (
                    <tr key={operation.id || index} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                      <td className="px-4 py-4 font-medium text-gray-900 dark:text-white">
                        #{operation.id || operation.operationId || 'N/A'}
                      </td>
                      <td className="px-4 py-4 text-gray-700 dark:text-gray-300 text-xs sm:text-sm">
                        {operation.startTime ? new Date(operation.startTime).toLocaleString() : 'N/A'}
                      </td>
                      <td className="px-4 py-4 text-gray-700 dark:text-gray-300 text-xs sm:text-sm">
                        {operation.endTime ? new Date(operation.endTime).toLocaleString() : 'In Progress'}
                      </td>
                      <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                        {operation.volume || 'N/A'}
                      </td>
                      <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                        {operation.eggNumber || 'N/A'}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          operation.status === 'Completed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : operation.status === 'Stopped'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                            : operation.status === 'Active'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {operation.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                      No injection operations found
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
