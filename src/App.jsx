import React from 'react';
import { createHashRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import FixedDarkModeToggle from './Component/Ui/FixedDarkModeToggle/FixedDarkModeToggle';
import ErrorBoundary from './Component/ErrorBoundary';

// Direct imports to avoid lazy loading issues
import ProtectedRoute from './Component/ProtectedRoute';
import Login from './Pages/Login';
import Register from './Pages/Register';
import ForgotPassword from './Pages/ForgotPassword';
import Dashboard from './Pages/Dashboard';
import Alerts from './Pages/Alerts';
import Reports from './Pages/Reports';
import Scanner from './Pages/Scanner';
import Injection from './Pages/Injection';
import ManualControl from './Pages/ManualControl';

// Create the router configuration
const router = createHashRouter([
  // Public Authentication Routes
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />
  },
  
  // Protected Dashboard Routes
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>    )
  },
  {
    path: "/alerts",
    element: (
      <ProtectedRoute>
        <Alerts />
      </ProtectedRoute>
    )
  },
  {
    path: "/reports",
    element: (
      <ProtectedRoute>
        <Reports />
      </ProtectedRoute>
    )
  },
 
  {
    path: "/scanner",
    element: (
      <ProtectedRoute>
        <Scanner />
      </ProtectedRoute>
    )
  },
  {
    path: "/injection",
    element: (
      <ProtectedRoute>
        <Injection />
      </ProtectedRoute>
    )
  },
  {
    path: "/manual-control",
    element: (
      <ProtectedRoute>
        <ManualControl />
      </ProtectedRoute>
    )
  },
  
  // Fallback route
  {
    path: "*",
    element: <Navigate to="/" replace />
  }
]);

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <RouterProvider router={router} />
          <FixedDarkModeToggle />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;