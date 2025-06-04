import React from 'react';

export default function EnvironmentalParams() {
  const params = [
    {
      label: 'Temperature',
      value: '24.5°C',
      range: '23°C - 25°C',
      status: 'normal'
    },
    {
      label: 'Humidity',
      value: '65%',
      range: '60% - 70%',
      status: 'normal'
    },
    {
      label: 'Pressure',
      value: '1.2 bar',
      range: '1.0 - 1.4 bar',
      status: 'warning'
    }
  ];  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Environmental Parameters</h2>
      <div className="space-y-3 sm:space-y-4">
        {params.map((param) => (
          <div key={param.label} className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{param.label}</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                param.status === 'normal' 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                  : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
              }`}>
                {param.status}
              </span>
            </div>
            <div className="mt-2">
              <span className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">{param.value}</span>
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Range: {param.range}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 