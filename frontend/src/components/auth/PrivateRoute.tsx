import React from 'react';
import { Redirect } from 'react-router-dom';
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
    return <Redirect to="/login" />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    const dashboardRoute = `/${user.role}/dashboard`;
    return <Redirect to={dashboardRoute} />;
  }

  return children;
};

export default PrivateRoute;
