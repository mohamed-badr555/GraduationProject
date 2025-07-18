import React, { useState, useEffect } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useSidebar } from '../../context/SidebarContext';
import { useNavigate } from 'react-router-dom';
import ApiManager from '../../services/ApiManager';

export default function Header() {
  const { user, logout, token } = useAuth();
  const { theme } = useTheme();
  const { toggleSidebar, isMobile } = useSidebar();
  const navigate = useNavigate();  const [esp32Status, setEsp32Status] = useState(null);

  // Check ESP32 status on component mount and set up interval
  useEffect(() => {
    checkEsp32Status();
      // Check ESP32 status every 10 seconds
    const statusInterval = setInterval(() => {
      checkEsp32Status();
    }, 10000);

    return () => clearInterval(statusInterval);
  }, []);  // Function to check ESP32 status
  const checkEsp32Status = async () => {
    try {
      const response = await ApiManager.getEsp32Status(token);
      if (response && response.data) {
        setEsp32Status(response.data);
      }
    } catch (error) {
      console.error('Failed to check ESP32 status:', error);
      setEsp32Status({ connected: false, error: 'Connection failed' });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        {/* Left Side - Mobile Menu + Logo */}
        <div className="flex items-center space-x-3">
          {/* Mobile Menu Button */}
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 lg:hidden"
              aria-label="Toggle sidebar"
            >
              <i className="fa-solid fa-bars text-gray-600 dark:text-gray-300 text-lg"></i>
            </button>
          )}

          {/* Logo and Title */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
              <i className="fa-solid fa-egg text-white text-sm sm:text-lg"></i>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                <span className="text-emerald-600">ovo</span>
                <span className="text-teal-600">Vax</span>
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Automated In-Ovo Vaccination</p>
            </div>
          </div>
        </div>        {/* Right Side - ESP32 Status and User Menu */}
        <div className="flex items-center space-x-2 sm:space-x-4">          {/* ESP32 System Status */}
          <div className="hidden sm:flex items-center">
            {esp32Status ? (
              <div 
                className={`flex items-center px-2 sm:px-3 py-1 sm:py-2 border rounded-lg ${
                  esp32Status.connected 
                    ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700'
                    : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700'
                }`}
                title={`ESP32 Status: ${esp32Status.connected ? 'Connected' : 'Disconnected'}`}
              >
                <div className={`h-2 w-2 rounded-full mr-2 ${
                  esp32Status.connected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
                }`}></div>
                <span className={`text-xs sm:text-sm font-medium ${
                  esp32Status.connected 
                    ? 'text-emerald-700 dark:text-emerald-300' 
                    : 'text-red-700 dark:text-red-300'
                }`}>
                  Connection {esp32Status.connected ? 'Online' : 'Offline'}
                </span>
              </div>
            ) : (
              <div className="flex items-center px-2 sm:px-3 py-1 sm:py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                <i className="fas fa-spinner fa-spin text-gray-500 mr-2 text-xs"></i>
                <span className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-medium">Checking...</span>
              </div>
            )}
          </div>
            {/* Mobile ESP32 Status (Icon Only) */}
          <div 
            className={`sm:hidden flex items-center justify-center h-8 w-8 border rounded-lg ${
              esp32Status?.connected 
                ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700'
                : esp32Status?.connected === false
                ? 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700'
                : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
            }`}
            title={esp32Status ? `ESP32 ${esp32Status.connected ? 'Online' : 'Offline'}` : 'Checking ESP32...'}
          >
            {esp32Status ? (
              <div className={`h-2 w-2 rounded-full ${
                esp32Status.connected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
              }`}></div>
            ) : (
              <i className="fas fa-spinner fa-spin text-gray-500 text-xs"></i>
            )}
          </div>
          
          {/* Notifications */}
          <button className="relative p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
            <i className="fa-solid fa-bell text-gray-600 dark:text-gray-300 text-base sm:text-lg"></i>
            <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Dropdown */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center space-x-1 sm:space-x-2 p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
              <i className="fa-solid fa-circle-user text-gray-600 dark:text-gray-300 text-xl sm:text-2xl"></i>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
              </div>
              <i className="fa-solid fa-chevron-down text-gray-400 dark:text-gray-500 text-xs sm:text-sm"></i>
            </Menu.Button>            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-gray-600 focus:outline-none z-50">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="/settings"
                        className={`${
                          active ? 'bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'
                        } group flex items-center px-4 py-2 text-sm`}
                      >
                        <i className="fa-solid fa-gear mr-3 text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400"></i>
                        Account Settings
                      </a>
                    )}
                  </Menu.Item>
                  <div className="border-t border-gray-100 dark:border-gray-600"></div>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`${
                          active ? 'bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'
                        } group flex w-full items-center px-4 py-2 text-sm`}
                      >
                        <i className="fa-solid fa-arrow-right-from-bracket mr-3 text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400"></i>
                        Sign out
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </header>
  );
}