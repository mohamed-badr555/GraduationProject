import React, { createContext, useContext, useState, useEffect } from 'react';

const SidebarContext = createContext();

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

export function SidebarProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
      // Auto-close sidebar on mobile when screen is resized
      if (window.innerWidth < 1024) {
        setIsOpen(false);
      } else {
        setIsOpen(true); // Keep open on desktop
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const openSidebar = () => {
    setIsOpen(true);
  };

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        isMobile,
        toggleSidebar,
        closeSidebar,
        openSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
