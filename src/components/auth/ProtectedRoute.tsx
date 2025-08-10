// src/components/auth/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { accessToken } = useAuth();

  if (!accessToken) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute;
