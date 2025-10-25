import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import TopNavbar from '../../../TopNavbar';
import AIAgent from '../../ai-agent/AIAgent';
import AIDataAnalysisChat from '../../ai-agent/AIDataAnalysisChat';
import EditAvatar from '../../ai-agent/EditAvatar';
import UserAIAgentDashboard from '../../ai-agent/UserAIAgentDashboard';
import WarningCardDetail from '../../ai-agent/WarningCardDetail';
import CommercialDashboard from '../../commercial/CommercialDashboard';
import ProjectDetail from '../../commercial/ProjectDetail';
import MarketingCampaign from '../../commercial/MarketingCampaign';
import ChatPage from '../../chat/ChatPage';
import { ContentOpsPage } from '../../content-ops';
import InspirationSnippetsPage from '../../content-ops/pages/InspirationSnippetsPage';
import { DataAnalyticsApp } from '../../data-analytics';
import PermissionManagementLanding from '../../permissions/PermissionManagementLanding';
import LandingPage from '../../landing/LandingPage';
import useAuth from '../hooks/useAuth';
import type { AuthRole } from '../types';

type TabKey = 'data' | 'content' | 'commercial' | 'ai';

const tabToPath: Record<TabKey, string> = {
  data: '/data',
  content: '/content-ops',
  commercial: '/commercial',
  ai: '/ai',
};

const contentOpsContainerStyle: React.CSSProperties = {
  height: 'calc(100vh - 80px)',
  maxHeight: 'calc(100vh - 80px)',
  overflow: 'hidden',
  backgroundColor: '#f5f7fa',
};

const AuthenticatedApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey | ''>('');
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const isOperationsMode = location.pathname.startsWith('/permission-management');

  const userInfo = useMemo(() => {
    if (!user) {
      return null;
    }
    return {
      name: user.name,
      email: user.phone,
      avatar: null,
      roles: user.roles,
    };
  }, [user]);

  useEffect(() => {
    const { pathname } = location;
    if (pathname.startsWith('/content-ops')) {
      setActiveTab('content');
    } else if (pathname.startsWith('/commercial')) {
      setActiveTab('commercial');
    } else if (pathname.startsWith('/ai')) {
      setActiveTab('ai');
    } else if (pathname.startsWith('/home')) {
      setActiveTab('');
    } else {
      setActiveTab('data');
    }
  }, [location]);

  const handleTabChange = (tabKey: string) => {
    if (!Object.prototype.hasOwnProperty.call(tabToPath, tabKey)) {
      return;
    }
    const key = tabKey as TabKey;
    setActiveTab(key);
    navigate(tabToPath[key]);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  const handleLogoClick = () => {
    navigate('/home');
  };

  const handlePermissionManage = (role: AuthRole) => {
    const query = new URLSearchParams({
      role: role.name ?? role.roleId ?? '',
      role_id: role.roleId ?? '',
    });
    navigate(`/permission-management?${query.toString()}`);
  };

  return (
    <div className="App">
      <TopNavbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        userInfo={userInfo}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onProfile={handleProfile}
        onPermissionManage={handlePermissionManage}
        onLogoClick={handleLogoClick}
        isOperationsMode={isOperationsMode}
      />

      <Routes>
        <Route index element={<LandingPage />} />
        <Route path="/ai" element={<AIAgent />} />
        <Route path="/ai-data-analysis-chat" element={<AIDataAnalysisChat />} />
        <Route path="/commercial" element={<CommercialDashboard />} />
        <Route path="/commercial/project/:projectId" element={<ProjectDetail />} />
        <Route path="/marketing-campaign" element={<MarketingCampaign />} />
        <Route path="/marketing-campaign/:projectId" element={<MarketingCampaign />} />
        <Route path="/chat/:conversationId" element={<ChatPage />} />
        <Route path="/edit-avatar/:userId" element={<EditAvatar />} />
        <Route path="/user-dashboard" element={<UserAIAgentDashboard />} />
        <Route path="/warnings/:type" element={<WarningCardDetail />} />
        <Route
          path="/permission-management"
          element={<PermissionManagementLanding />}
        />
        <Route
          path="/content-ops"
          element={(
            <div style={contentOpsContainerStyle}>
              <ContentOpsPage onNavigateToSnippets={() => navigate('/content-ops/snippets')} />
            </div>
          )}
        />
        <Route
          path="/content-ops/snippets"
          element={(
            <div style={contentOpsContainerStyle}>
              <InspirationSnippetsPage onBack={() => navigate('/content-ops')} />
            </div>
          )}
        />
        <Route path="/data" element={<DataAnalyticsApp />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </div>
  );
};

export default AuthenticatedApp;
