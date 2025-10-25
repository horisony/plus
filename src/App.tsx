import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import AuthenticatedApp from './features/auth/components/AuthenticatedApp';
import ProtectedRoute from './features/auth/components/ProtectedRoute';
import LoginPage from './features/auth/pages/LoginPage';
import RoleSelectionPage from './features/auth/pages/RoleSelectionPage';
import LandingPage from './features/landing/LandingPage';

const App: React.FC = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/select-role" element={<RoleSelectionPage />} />
    <Route path="/welcome" element={<RoleSelectionPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/home/*" element={<AuthenticatedApp />} />
      <Route path="/data/*" element={<AuthenticatedApp />} />
      <Route path="/content-ops/*" element={<AuthenticatedApp />} />
      <Route path="/commercial/*" element={<AuthenticatedApp />} />
      <Route path="/ai/*" element={<AuthenticatedApp />} />
      <Route path="/chat/*" element={<AuthenticatedApp />} />
      <Route path="/edit-avatar/*" element={<AuthenticatedApp />} />
      <Route path="/user-dashboard" element={<AuthenticatedApp />} />
      <Route path="/warnings/*" element={<AuthenticatedApp />} />
      <Route path="/permission-management" element={<AuthenticatedApp />} />
      <Route path="/marketing-campaign/*" element={<AuthenticatedApp />} />
      <Route path="/profile" element={<AuthenticatedApp />} />
      <Route path="/ai-data-analysis-chat" element={<AuthenticatedApp />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
