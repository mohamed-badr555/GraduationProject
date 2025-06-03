import React from 'react';

export default function EggArray() {  const generateEggData = () => {
    const statuses = ['success', 'failed', 'cracked'];
    return Array(6).fill().map(() => ({
      status: statuses[Math.floor(Math.random() * statuses.length)],
      id: Math.random().toString(36).substr(2, 9)
    }));
  };

  const eggs = generateEggData();

  const getStatusColor = (status) => {
    const colors = {
      success: 'bg-green-500',
      failed: 'bg-red-500',
      cracked: 'bg-gray-500'
    };
    return colors[status] || 'bg-gray-200';
  };
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Egg Array Status</h2>
        <div className="flex space-x-4">
          {['success', 'failed', 'cracked'].map(status => (
            <div key={status} className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(status)} mr-2`}></div>
              <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{status}</span>
            </div>
          ))}
        </div>
      </div>      <div className="grid grid-cols-6 gap-4">
        {eggs.map((egg, index) => (
          <div
            key={egg.id}
            className={`
              aspect-square rounded-full 
              ${getStatusColor(egg.status)} 
              cursor-pointer hover:opacity-75
              transition-opacity
            `}
            title={`Position: ${index + 1}\nStatus: ${egg.status}`}
          />
        ))}
      </div>
    </div>
  );
} 