import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import AuthenticatedApp from './features/auth/components/AuthenticatedApp';
import ProtectedRoute from './features/auth/components/ProtectedRoute';
import LoginPage from './features/auth/pages/LoginPage';
import RoleSelectionPage from './features/auth/pages/RoleSelectionPage';

const App: React.FC = () => (
  <Routes>
    <Route path="/welcome" element={<RoleSelectionPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/*" element={<AuthenticatedApp />} />
    </Route>
    <Route path="*" element={<Navigate to="/welcome" replace />} />
  </Routes>
);

export default App;
