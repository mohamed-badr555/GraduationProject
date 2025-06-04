import React from 'react';
import PropTypes from 'prop-types';
import Sidebar from './Sidebar';
import Header from './Header';
import { SidebarProvider, useSidebar } from '../../context/SidebarContext';

function DashboardContent({ children }) {
  const { isOpen, isMobile, closeSidebar } = useSidebar();

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Mobile Overlay */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}
      
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node
};