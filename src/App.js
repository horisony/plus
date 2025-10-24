import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import AIAgent from './features/ai-agent/AIAgent';
import EditAvatar from './features/ai-agent/EditAvatar';
import UserAIAgentDashboard from './features/ai-agent/UserAIAgentDashboard';
import WarningCardDetail from './features/ai-agent/WarningCardDetail';
import CommercialDashboard from './features/commercial/CommercialDashboard';
import ProjectDetail from './features/commercial/ProjectDetail';
import MarketingCampaign from './features/commercial/MarketingCampaign';
import ChatPage from './features/chat/ChatPage';
import AIAnalysisChatPage from './features/chat/AIAnalysisChatPage';
import TopNavbar from './TopNavbar';
import { ContentOpsPage } from './features/content-ops';
import InspirationSnippetsPage from './features/content-ops/pages/InspirationSnippetsPage';
import { DataAnalyticsApp } from './features/data-analytics';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('data');
  const [userInfo, setUserInfo] = useState({
    name: '管理员',
    email: 'admin@plusco.com',
    avatar: null
  });
  const navigate = useNavigate();
  const location = useLocation();

  // 处理标签切换（使用路由）
  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    const pageMap = {
      data: '/data',
      content: '/content-ops',
      commercial: '/commercial',
      ai: '/ai',
    };
    const path = pageMap[tabKey] || '/';
    navigate(path);
  };

  // 首次加载与每次路由变更时，让顶部 tab 与 URL 同步
  useEffect(() => {
    const { pathname } = location;
    if (pathname.startsWith('/ai-analysis-chat')) {
      setActiveTab('data'); // 聊天页面显示为AI数据管家
    } else if (pathname.startsWith('/content-ops')) {
      setActiveTab('content');
    } else if (pathname.startsWith('/commercial')) {
      setActiveTab('commercial');
    } else if (pathname.startsWith('/ai')) {
      setActiveTab('ai');
    } else {
      setActiveTab('data');
    }
  }, [location]);

  // 用户操作函数
  const handleLogin = () => {
    console.log('跳转到登录页面');
  };

  const handleLogout = () => {
    setUserInfo(null);
    console.log('用户已退出登录');
  };

  const handleProfile = () => {
    console.log('跳转到个人资料页面');
  };

  return (
    <div className="App">
      {/* TopNavbar 放在 App.js 中，统一管理 */}
      <TopNavbar 
        activeTab={activeTab}
        onTabChange={handleTabChange}
        userInfo={userInfo}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onProfile={handleProfile}
      />
      
      {/* 页面内容区域 */}
      <Routes>
        <Route path="/" element={<Navigate to="/data" replace />} />
        <Route path="/ai" element={<AIAgent />} />
        <Route path="/commercial" element={<CommercialDashboard />} />
        <Route path="/commercial/project/:projectId" element={<ProjectDetail />} />
        <Route path="/marketing-campaign" element={<MarketingCampaign />} />
        <Route path="/marketing-campaign/:projectId" element={<MarketingCampaign />} />
        <Route path="/chat/:conversationId" element={<ChatPage />} />
        <Route path="/ai-analysis-chat" element={<AIAnalysisChatPage />} />
        <Route path="/edit-avatar/:userId" element={<EditAvatar />} />
        <Route path="/user-dashboard" element={<UserAIAgentDashboard />} />
        <Route path="/warnings/:type" element={<WarningCardDetail />} />
        <Route path="/content-ops" element={<div style={styles.contentOpsContainer}><ContentOpsPage onNavigateToSnippets={() => navigate('/content-ops/snippets')} /></div>} />
        <Route path="/content-ops/snippets" element={<div style={styles.contentOpsContainer}><InspirationSnippetsPage onBack={() => navigate('/content-ops')} /></div>} />
        <Route path="/data" element={<DataAnalyticsApp />} />
        <Route path="*" element={<Navigate to="/data" replace />} />
      </Routes>
    </div>
  );
}

const styles = {
  // 只对内容运营相关页面应用高度限制
  contentOpsContainer: {
    height: 'calc(100vh - 80px)', // 减去导航栏高度
    maxHeight: 'calc(100vh - 80px)', // 确保不超过计算高度
    overflow: 'hidden', // 防止内容溢出
    backgroundColor: '#f5f7fa',
  }
};

export default App;