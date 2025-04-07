import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ requiredRole = null }) => {
  const { isAuthenticated, hasRole, loading } = useAuth();

  // Show loading state if auth is still being determined
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // If a role is required, check if the user has the required role
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/" replace />;
  }

  // If user is authenticated and has the required role (if any), render the outlet
  return <Outlet />;
};

export default ProtectedRoute; 