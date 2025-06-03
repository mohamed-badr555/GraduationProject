import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();  const menuItems = [
    { icon: "fa-solid fa-house", label: "Dashboard", path: "/" },

    { icon: "fa-solid fa-microscope", label: "Scanner", path: "/scanner" },
    { icon: "fa-solid fa-droplet", label: "Injection", path: "/injection" },
    { icon: "fa-solid fa-gamepad", label: "Manual Control", path: "/manual-control" },
    { icon: "fa-solid fa-bell", label: "Alerts", path: "/alerts" },
    { icon: "fa-solid fa-file-lines", label: "Reports", path: "/reports" },
    
  ];return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
            <i className="fa-solid fa-egg text-white text-lg"></i>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              <span className="text-emerald-600">ovo</span>
              <span className="text-teal-600">Vax</span>
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Control Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 mt-6 px-3">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 text-emerald-700 dark:text-emerald-400 border-r-2 border-emerald-500 dark:border-emerald-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <i className={`${item.icon} mr-3 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'}`}></i>
                <span>{item.label}</span>
                {isActive && (
                  <div className="ml-auto h-2 w-2 bg-emerald-500 dark:bg-emerald-400 rounded-full"></div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          <p>© {new Date().getUTCFullYear()} ovoVax System</p>
          <p className="mt-1">v1.0.0</p>
        </div>
      </div>
    </aside>
  );
}