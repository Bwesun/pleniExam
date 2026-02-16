import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loading from '../common/Loading';

interface PrivateRouteProps {
  children: React.ReactElement;
  allowedRoles?: ('candidate' | 'instructor' | 'admin')[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    const dashboardRoute = `/${user.role}/dashboard`;
    return <Navigate to={dashboardRoute} replace />;
  }

  return children;
};

export default PrivateRoute;
