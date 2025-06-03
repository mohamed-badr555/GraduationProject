import React, { useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-6 py-4">      {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
            <i className="fa-solid fa-egg text-white text-lg"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              <span className="text-emerald-600">ovo</span>
              <span className="text-teal-600">Vax</span>
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Automated In-Ovo Vaccination</p>
          </div>
        </div>        {/* Right Side - Status and User Menu */}
        <div className="flex items-center space-x-4">
          {/* System Status */}
          <div className="flex items-center px-3 py-2 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 rounded-lg">
            <div className="h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></div>
            <span className="text-emerald-700 dark:text-emerald-300 text-sm font-medium">System Active</span>
          </div>
          
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
            <i className="fa-solid fa-bell text-gray-600 dark:text-gray-300 text-lg"></i>
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>{/* User Dropdown */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
              <i className="fa-solid fa-circle-user text-gray-600 dark:text-gray-300 text-2xl"></i>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
              </div>
              <i className="fa-solid fa-chevron-down text-gray-400 dark:text-gray-500 text-sm"></i>
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-gray-600 focus:outline-none z-50">
                <div className="py-1">                  <Menu.Item>
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