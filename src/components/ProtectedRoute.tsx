import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import useAuth from '../hooks/useAuth';

interface Props {
  children: React.ReactNode;
  roles?: string[];
}

const ProtectedRoute: React.FC<Props> = ({ children, roles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
