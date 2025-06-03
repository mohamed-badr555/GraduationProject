import React from 'react';

export default function SystemStatus() {
  const stats = [
    { 
      label: 'Total Eggs', 
      value: '144',
      color: 'text-blue-600' 
    },
    { 
      label: 'Success Rate', 
      value: '98.2%',
      color: 'text-green-600' 
    },
    { 
      label: 'Failed Injections', 
      value: '3',
      color: 'text-red-600' 
    },
    { 
      label: 'Liquid Level', 
      value: '85%',
      color: 'text-yellow-600' 
    },
  ];
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">System Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
            <div className="flex items-center mt-1">
              <h3 className={`text-2xl font-bold ${stat.color}`}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 