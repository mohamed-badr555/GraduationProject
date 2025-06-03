import React, { useState, useCallback } from 'react';
import DashboardLayout from '../Component/Layout/DashboardLayout';

const ManualControl = () => {
  const [speed, setSpeed] = useState(50);
  const [isMoving, setIsMoving] = useState(false);
  const [isHoming, setIsHoming] = useState(false);
  const [movementHistory, setMovementHistory] = useState([
    {
      id: 1,
      timestamp: '2024-12-19 10:30:25',
      action: 'Move Z+',
      speed: 50,
      status: 'Completed'
    },
    {
      id: 2,
      timestamp: '2024-12-19 10:28:15',
      action: 'Home All',
      speed: 30,
      status: 'Completed'
    }
  ]);
  const moveAxis = useCallback(async (axis, direction, step = 1) => {
    if (isMoving || isHoming) return;
    
    setIsMoving(true);
    
    try {
      // TODO: Replace with actual API call to hardware system
      console.log(`Moving ${axis.toUpperCase()}${direction > 0 ? '+' : '-'} at ${speed}% speed`);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      /*
      // Future API integration for hardware engineering team:
      const response = await fetch('/api/movement/move', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          axis: axis,
          direction: direction,
          step: step,
          speed: speed
        }),
      });
      
      if (!response.ok) {
        throw new Error('Movement failed');
      }
      */
      
      // Add to movement history
      const newMovement = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        action: `Move ${axis.toUpperCase()}${direction > 0 ? '+' : '-'}`,
        speed: speed,
        status: 'Completed'
      };
      
      setMovementHistory(prev => [newMovement, ...prev.slice(0, 9)]);
    } catch (error) {
      console.error('Movement failed:', error);
    } finally {
      setIsMoving(false);
    }
  }, [speed, isMoving, isHoming]);
  const homeAllAxes = useCallback(async () => {
    if (isMoving || isHoming) return;
    
    setIsHoming(true);
    
    try {
      // TODO: Replace with actual API call to hardware system
      console.log('Homing all axes...');
      
      // Simulate homing sequence
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      /*
      // Future API integration for hardware engineering team:
      const response = await fetch('/api/movement/home', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Homing failed');
      }
      */
      
      // Add to movement history
      const newMovement = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        action: 'Home All',
        speed: 30,
        status: 'Completed'
      };
      
      setMovementHistory(prev => [newMovement, ...prev.slice(0, 9)]);
    } catch (error) {
      console.error('Homing failed:', error);
    } finally {
      setIsHoming(false);
    }
  }, [isMoving, isHoming]);

  const DirectionalButton = ({ direction, axis, icon, disabled }) => (
    <button
      onClick={() => moveAxis(axis, direction)}
      disabled={disabled || isMoving || isHoming}
      className={`
        p-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg
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
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              <i className="fas fa-gamepad text-green-500 mr-3"></i>
              Manual Control
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Control Z and Y axis movement with precision
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">            {/* Control Panel */}
            <div className="space-y-6">
              {/* Speed Control */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
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
              </div>

              {/* Home Button */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
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
            </div>

            {/* Movement Controls */}
            <div className="space-y-6">
              {/* Z Axis Control */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  <i className="fas fa-arrows-alt-v text-blue-500 mr-2"></i>
                  Z Axis Control
                </h3>
                <div className="flex flex-col items-center space-y-4">
                  <DirectionalButton
                    direction={1}
                    axis="z"
                    icon="fa-arrow-up"
                  />
                  <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
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
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  <i className="fas fa-arrows-alt-h text-green-500 mr-2"></i>
                  Y Axis Control
                </h3>
                <div className="flex items-center justify-center space-x-4">
                  <DirectionalButton
                    direction={-1}
                    axis="y"
                    icon="fa-arrow-left"
                  />
                  <div className="text-sm text-gray-600 dark:text-gray-300 font-medium px-4">
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
                </thead>
                <tbody>
                  {movementHistory.map((movement) => (
                    <tr 
                      key={movement.id} 
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                        {movement.timestamp}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                          {movement.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                        {movement.speed}%
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                          <i className="fas fa-check mr-1"></i>
                          {movement.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManualControl;
