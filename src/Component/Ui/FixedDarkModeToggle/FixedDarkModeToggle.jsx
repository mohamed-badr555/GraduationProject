import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { motion } from 'framer-motion';

const FixedDarkModeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.div
      className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.button
        onClick={toggleTheme}
        className="
          relative flex items-center justify-center
          w-14 h-14 rounded-full shadow-xl
          bg-white dark:bg-gray-800
          border-2 border-gray-200 dark:border-gray-600
          transition-all duration-300 ease-in-out
          hover:shadow-2xl hover:border-emerald-500 dark:hover:border-emerald-400
          group
        "
        role="switch"
        aria-checked={theme === 'dark'}
        aria-label="Toggle dark mode"
        whileHover={{ rotate: 180 }}
        transition={{ duration: 0.3 }}
      >
        {/* Background gradient effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        
        {/* Sun Icon */}
        <motion.div
          className={`absolute transition-all duration-300 ${
            theme === 'dark' ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
          }`}
          animate={{
            rotate: theme === 'dark' ? -180 : 0,
            scale: theme === 'dark' ? 0 : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          <i className="fa-solid fa-sun text-xl text-yellow-500"></i>
        </motion.div>

        {/* Moon Icon */}
        <motion.div
          className={`absolute transition-all duration-300 ${
            theme === 'dark' ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
          }`}
          animate={{
            rotate: theme === 'dark' ? 0 : 180,
            scale: theme === 'dark' ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <i className="fa-solid fa-moon text-xl text-blue-400"></i>
        </motion.div>

        {/* Ripple effect */}
        <div className="absolute inset-0 rounded-full border-2 border-emerald-400 opacity-0 group-hover:opacity-30 group-hover:scale-125 transition-all duration-300"></div>
      </motion.button>

      {/* Tooltip */}
      <motion.div
        className="absolute right-16 top-1/2 transform -translate-y-1/2 
                   bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 
                   px-3 py-1 rounded-lg text-sm font-medium
                   opacity-0 group-hover:opacity-100 transition-opacity duration-200
                   pointer-events-none whitespace-nowrap"
        initial={{ opacity: 0, x: 10 }}
        whileHover={{ opacity: 1, x: 0 }}
      >
        {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        <div className="absolute left-full top-1/2 transform -translate-y-1/2 
                        border-l-4 border-l-gray-900 dark:border-l-gray-100 
                        border-y-4 border-y-transparent"></div>
      </motion.div>
    </motion.div>
  );
};

export default FixedDarkModeToggle;
