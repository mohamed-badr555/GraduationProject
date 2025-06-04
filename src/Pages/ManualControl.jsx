import React, { useState, useCallback, useEffect } from 'react';
import DashboardLayout from '../Component/Layout/DashboardLayout';
import ApiManager from '../services/ApiManager';
import { useAuth } from '../context/AuthContext';

const ManualControl = () => {
  const { token } = useAuth();
  const [speed, setSpeed] = useState(50);
  const [isMoving, setIsMoving] = useState(false);
  const [isHoming, setIsHoming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [movementHistory, setMovementHistory] = useState([]);  // Load movement history on component mount
  useEffect(() => {
    loadMovementHistory();
  }, []);

  // Load movement history from API
  const loadMovementHistory = async () => {
    try {
      setLoading(true);
      const response = await ApiManager.getMovementHistory(token);
      setMovementHistory(response.data || []);
    } catch (error) {
      console.error('Failed to load movement history:', error);
      setError('Failed to load movement history');
    } finally {
      setLoading(false);
    }
  };
  const moveAxis = useCallback(async (axis, direction, step = 1) => {
    if (isMoving || isHoming) return;
    
    setIsMoving(true);
    setError(null);
    
    try {
      console.log(`Moving ${axis.toUpperCase()}${direction > 0 ? '+' : '-'} at ${speed}% speed`);
      
      const movementData = {
        axis: axis,
        direction: direction > 0 ? 'positive' : 'negative',
        step: step,
        speed: speed
      };
      
      // Call real API endpoint
      const response = await ApiManager.moveAxis(token, movementData);
      
      if (response.success) {
        console.log('Movement completed successfully:', response.message);
        await loadMovementHistory(); // Reload history
      } else {
        throw new Error(response.message || 'Failed to move axis');
      }
      
    } catch (error) {
      console.error('API call failed:', error);
      setError(error.message || 'Failed to move axis');
    } finally {
      setIsMoving(false);
    }
  }, [speed, isMoving, isHoming, token, loadMovementHistory]);  const homeAllAxes = useCallback(async () => {
    if (isMoving || isHoming) return;
    
    setIsHoming(true);
    setError(null);
    
    try {
      console.log('Homing all axes...');
      
      // Call real API endpoint
      const response = await ApiManager.homeAxes(token);
      
      if (response.success) {
        console.log('Homing completed successfully:', response.message);
        await loadMovementHistory(); // Reload history
      } else {
        throw new Error(response.message || 'Failed to home axes');
      }
      
    } catch (error) {
      console.error('API call failed:', error);
      setError(error.message || 'Failed to home axes');
    } finally {
      setIsHoming(false);
    }
  }, [isMoving, isHoming, token, loadMovementHistory]);
  const DirectionalButton = ({ direction, axis, icon, disabled }) => (
    <button
      onClick={() => moveAxis(axis, direction)}
      disabled={disabled || isMoving || isHoming}
      className={`
        p-3 sm:p-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-200 shadow-lg min-w-[3rem] sm:min-w-[4rem]
        ${disabled || isMoving || isHoming
          ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          : 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white hover:shadow-xl transform hover:scale-105 active:scale-95'
        }
      `}
    >
      <i className={`fas ${icon} text-2xl`}></i>
    </button>
  );
  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-full">
        <div className="max-w-6xl mx-auto">          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              <i className="fas fa-gamepad text-green-500 mr-3"></i>
              Manual Control
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Control Z and Y axis movement with precision
            </p>
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
          )}          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-8">
            {/* Control Panel */}
            <div className="space-y-4 lg:space-y-6">
              {/* Speed Control */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  <i className="fas fa-tachometer-alt text-orange-500 mr-2"></i>
                  Movement Speed
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Speed</span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {speed}%
                    </span>
                  </div>                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={speed}
                    onChange={(e) => setSpeed(parseInt(e.target.value))}
                    disabled={isMoving || isHoming}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer 
                      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                      [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:cursor-pointer
                      [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:hover:bg-blue-600
                      [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full 
                      [&::-moz-range-thumb]:bg-blue-500 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none"
                  />
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>Slow</span>
                    <span>Fast</span>
                  </div>
                </div>
              </div>              {/* Home Button */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  <i className="fas fa-home text-purple-500 mr-2"></i>
                  Homing
                </h3>
                <button
                  onClick={homeAllAxes}
                  disabled={isMoving || isHoming}
                  className={`
                    w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg
                    ${isMoving || isHoming
                      ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      : 'bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white hover:shadow-xl transform hover:scale-105'
                    }
                  `}
                >
                  {isHoming ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Homing...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-home mr-2"></i>
                      Home All Axes
                    </>
                  )}
                </button>
              </div>
            </div>            {/* Movement Controls */}
            <div className="space-y-4 lg:space-y-6">
              {/* Z Axis Control */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
                  <i className="fas fa-arrows-alt-v text-blue-500 mr-2"></i>
                  Z Axis Control
                </h3>
                <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                  <DirectionalButton
                    direction={1}
                    axis="z"
                    icon="fa-arrow-up"
                  />
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium">
                    Z Axis
                  </div>
                  <DirectionalButton
                    direction={-1}
                    axis="z"
                    icon="fa-arrow-down"
                  />
                </div>
              </div>

              {/* Y Axis Control */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
                  <i className="fas fa-arrows-alt-h text-green-500 mr-2"></i>
                  Y Axis Control
                </h3>
                <div className="flex items-center justify-center space-x-3 sm:space-x-4">
                  <DirectionalButton
                    direction={-1}
                    axis="y"
                    icon="fa-arrow-left"
                  />
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium px-2 sm:px-4">
                    Y Axis
                  </div>
                  <DirectionalButton
                    direction={1}
                    axis="y"
                    icon="fa-arrow-right"
                  />
                </div>
              </div>

              {/* Status */}
              {(isMoving || isHoming) && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                  <div className="flex items-center">
                    <i className="fas fa-spinner fa-spin text-yellow-500 mr-3"></i>
                    <span className="text-yellow-800 dark:text-yellow-200 font-medium">
                      {isHoming ? 'Homing in progress...' : 'Movement in progress...'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Movement History */}
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              <i className="fas fa-history text-indigo-500 mr-2"></i>
              Movement History
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      Timestamp
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      Action
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      Speed
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      Status
                    </th>
                  </tr>
                </thead>                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="py-4 px-4 text-center text-gray-500 dark:text-gray-400">
                        <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                        Loading movement history...
                      </td>
                    </tr>
                  ) : movementHistory.length > 0 ? (
                    movementHistory.map((movement) => (
                      <tr 
                        key={movement.id} 
                        className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                          {new Date(movement.timestamp).toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                            {movement.action || movement.command}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                          {movement.speed}%
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            movement.status === 'Completed' || movement.status === 'Success'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                              : movement.status === 'Failed' || movement.status === 'Error'
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                              : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
                          }`}>
                            <i className={`fas ${
                              movement.status === 'Completed' || movement.status === 'Success' 
                                ? 'fa-check' 
                                : movement.status === 'Failed' || movement.status === 'Error'
                                ? 'fa-times'
                                : 'fa-clock'
                            } mr-1`}></i>
                            {movement.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-4 px-4 text-center text-gray-500 dark:text-gray-400">
                        No movement history available
                      </td>
                    </tr>
                  )}
                </tbody></table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManualControl;
