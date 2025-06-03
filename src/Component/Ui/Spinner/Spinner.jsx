import React from 'react';

const Spinner = ({ size = 'medium', color = 'primary' }) => {
  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-12 w-12',
    large: 'h-16 w-16',
  };

  const colorClasses = {
    primary: 'border-emerald-600 dark:border-emerald-400',
    white: 'border-white',
    gray: 'border-gray-600 dark:border-gray-400',
  };

  return (
    <div className="flex items-center justify-center">
      <div 
        className={`
          ${sizeClasses[size]} 
          ${colorClasses[color]} 
          animate-spin rounded-full border-2 border-t-transparent
        `}
      ></div>
    </div>
  );
};

export default Spinner;
