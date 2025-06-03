import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const DarkModeToggle = ({ className = '' }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative inline-flex items-center justify-center w-12 h-6 
        rounded-full transition-colors duration-200 ease-in-out
        ${isDarkMode 
          ? 'bg-blue-600 hover:bg-blue-700' 
          : 'bg-gray-300 hover:bg-gray-400'
        }
        ${className}
      `}
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      {/* Toggle Circle */}
      <span
        className={`
          absolute inline-block w-5 h-5 rounded-full bg-white
          transform transition-transform duration-200 ease-in-out
          ${isDarkMode ? 'translate-x-6' : 'translate-x-0.5'}
          shadow-lg
        `}
      />
      
      {/* Icons */}
      <span className={`
        absolute left-1 text-xs transition-opacity duration-200
        ${isDarkMode ? 'opacity-0' : 'opacity-100'}
      `}>
        ☀️
      </span>
      <span className={`
        absolute right-1 text-xs transition-opacity duration-200
        ${isDarkMode ? 'opacity-100' : 'opacity-0'}
      `}>
        🌙
      </span>
    </button>
  );
};

export default DarkModeToggle;
