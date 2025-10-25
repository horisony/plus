import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Spin } from 'antd';
import useAuth from '../hooks/useAuth';

const fullScreenSpinnerStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const ProtectedRoute: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={fullScreenSpinnerStyle}>
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/select-role" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
